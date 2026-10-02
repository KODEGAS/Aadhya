package handler

import (
	"encoding/json"
	"net/http"
	"github.com/KODEGAS/Aadhya/internal/fhir"
	"github.com/KODEGAS/Aadhya/internal/repository"
	"github.com/KODEGAS/Aadhya/internal/service"
)

type APIHandler struct {
	svc   *service.ClinicalService
	store *repository.MemoryStore
}

func NewAPIHandler(svc *service.ClinicalService, store *repository.MemoryStore) *APIHandler {
	return &APIHandler{svc: svc, store: store}
}

func (h *APIHandler) Routes() http.Handler {
	mux := http.NewServeMux()

	// Health check probe
	mux.HandleFunc("GET /healthz", h.handleHealth)

	// Clinical & Patient API routes
	mux.HandleFunc("POST /api/v1/patients/mothers", h.handleRegisterMother)
	mux.HandleFunc("GET /api/v1/patients/mothers/{id}", h.handleGetMotherProfile)
	mux.HandleFunc("POST /api/v1/patients/mothers/{id}/pregnancies", h.handleRegisterPregnancy)
	mux.HandleFunc("POST /api/v1/pregnancies/{id}/observations", h.handleRecordObservation)
	mux.HandleFunc("POST /api/v1/pregnancies/{id}/delivery", h.handleRecordDelivery)

	// HL7 FHIR R4 interoperability endpoint
	mux.HandleFunc("GET /api/v1/fhir/Patient/{id}", h.handleFHIRPatient)

	// Audit & Event streaming endpoint
	mux.HandleFunc("GET /api/v1/events", h.handleListEvents)

	return mux
}

func (h *APIHandler) handleHealth(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{
		"status":  "healthy",
		"service": "adhya-clinical-service",
	})
}

type registerMotherRequest struct {
	GivenName  string `json:"given_name"`
	FamilyName string `json:"family_name"`
	BirthDate  string `json:"birth_date"`
	Phone      string `json:"phone"`
}

func (h *APIHandler) handleRegisterMother(w http.ResponseWriter, r *http.Request) {
	var req registerMotherRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	p, err := h.svc.RegisterMother(r.Context(), req.GivenName, req.FamilyName, req.BirthDate, req.Phone)
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, err.Error())
		return
	}

	writeJSON(w, http.StatusCreated, p)
}

func (h *APIHandler) handleGetMotherProfile(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	profile, err := h.svc.GetMotherProfile(r.Context(), id)
	if err != nil {
		writeError(w, http.StatusNotFound, "mother not found")
		return
	}

	writeJSON(w, http.StatusOK, profile)
}

type registerPregnancyRequest struct {
	LMP string `json:"lmp"`
}

func (h *APIHandler) handleRegisterPregnancy(w http.ResponseWriter, r *http.Request) {
	motherID := r.PathValue("id")
	var req registerPregnancyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	preg, err := h.svc.RegisterPregnancy(r.Context(), motherID, req.LMP)
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, err.Error())
		return
	}

	writeJSON(w, http.StatusCreated, preg)
}

type recordObservationRequest struct {
	PatientID string  `json:"patient_id"`
	Code      string  `json:"code"`
	Value     float64 `json:"value"`
	Unit      string  `json:"unit"`
}

func (h *APIHandler) handleRecordObservation(w http.ResponseWriter, r *http.Request) {
	pregnancyID := r.PathValue("id")
	var req recordObservationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	obs, alert, err := h.svc.RecordObservation(r.Context(), req.PatientID, pregnancyID, req.Code, req.Value, req.Unit)
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, err.Error())
		return
	}

	res := map[string]interface{}{
		"observation": obs,
	}
	if alert != nil {
		res["alert"] = alert
	}

	writeJSON(w, http.StatusCreated, res)
}

type recordDeliveryRequest struct {
	ChildGivenName  string `json:"child_given_name"`
	ChildFamilyName string `json:"child_family_name"`
	BirthDate       string `json:"birth_date"`
}

func (h *APIHandler) handleRecordDelivery(w http.ResponseWriter, r *http.Request) {
	pregnancyID := r.PathValue("id")
	var req recordDeliveryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	child, err := h.svc.RecordDelivery(r.Context(), pregnancyID, req.ChildGivenName, req.ChildFamilyName, req.BirthDate)
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, err.Error())
		return
	}

	writeJSON(w, http.StatusCreated, child)
}

func (h *APIHandler) handleFHIRPatient(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	pat, err := h.store.FindByID(r.Context(), id)
	if err != nil {
		writeError(w, http.StatusNotFound, "patient not found")
		return
	}

	fhirPat := fhir.ToFHIRPatient(pat)
	writeJSON(w, http.StatusOK, fhirPat)
}

func (h *APIHandler) handleListEvents(w http.ResponseWriter, r *http.Request) {
	events, err := h.store.ListEvents(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list events")
		return
	}
	writeJSON(w, http.StatusOK, events)
}

func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(data)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}
