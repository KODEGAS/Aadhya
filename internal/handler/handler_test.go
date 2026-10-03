package handler

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"github.com/KODEGAS/Aadhya/internal/domain/clinical"
	"github.com/KODEGAS/Aadhya/internal/domain/patient"
	"github.com/KODEGAS/Aadhya/internal/repository"
	"github.com/KODEGAS/Aadhya/internal/service"
)

func setupTestServer() http.Handler {
	store := repository.NewMemoryStore()
	svc := service.NewClinicalService(store)
	api := NewAPIHandler(svc, store)
	return api.Routes()
}

func TestHealthCheck(t *testing.T) {
	ts := setupTestServer()
	req := httptest.NewRequest("GET", "/healthz", nil)
	rec := httptest.NewRecorder()

	ts.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
}

func TestRegisterMotherAndFHIR(t *testing.T) {
	ts := setupTestServer()

	// 1. Register Mother
	body := []byte(`{"given_name":"Kanthi","family_name":"Perera","birth_date":"1995-10-10","phone":"0771122334"}`)
	req := httptest.NewRequest("POST", "/api/v1/patients/mothers", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()

	ts.ServeHTTP(rec, req)

	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d (body: %s)", rec.Code, rec.Body.String())
	}

	var mother patient.Patient
	if err := json.NewDecoder(rec.Body).Decode(&mother); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}
	if mother.ID == "" {
		t.Fatal("expected mother ID")
	}

	// 2. Fetch FHIR Patient Resource
	reqFHIR := httptest.NewRequest("GET", "/api/v1/fhir/Patient/"+mother.ID, nil)
	recFHIR := httptest.NewRecorder()

	ts.ServeHTTP(recFHIR, reqFHIR)

	if recFHIR.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d (body: %s)", recFHIR.Code, recFHIR.Body.String())
	}

	var fhirPat map[string]interface{}
	if err := json.NewDecoder(recFHIR.Body).Decode(&fhirPat); err != nil {
		t.Fatalf("failed to decode FHIR response: %v", err)
	}
	if fhirPat["resourceType"] != "Patient" {
		t.Errorf("expected resourceType Patient, got %v", fhirPat["resourceType"])
	}
}

func TestObservationWithAlert(t *testing.T) {
	ts := setupTestServer()

	// Register Mother
	body := []byte(`{"given_name":"Nayani","family_name":"Dias","birth_date":"1994-01-01"}`)
	req := httptest.NewRequest("POST", "/api/v1/patients/mothers", bytes.NewBuffer(body))
	rec := httptest.NewRecorder()
	ts.ServeHTTP(rec, req)
	var mother patient.Patient
	_ = json.NewDecoder(rec.Body).Decode(&mother)

	// Register Pregnancy
	pregBody := []byte(`{"lmp":"2026-03-01"}`)
	reqPreg := httptest.NewRequest("POST", "/api/v1/patients/mothers/"+mother.ID+"/pregnancies", bytes.NewBuffer(pregBody))
	recPreg := httptest.NewRecorder()
	ts.ServeHTTP(recPreg, reqPreg)
	var preg map[string]interface{}
	_ = json.NewDecoder(recPreg.Body).Decode(&preg)
	pregID := preg["id"].(string)

	// Record Severe Anemia Observation (< 7.0 g/dL)
	obsBody := []byte(`{"patient_id":"` + mother.ID + `","code":"` + clinical.CodeHemoglobin + `","value":6.5,"unit":"g/dL"}`)
	reqObs := httptest.NewRequest("POST", "/api/v1/pregnancies/"+pregID+"/observations", bytes.NewBuffer(obsBody))
	recObs := httptest.NewRecorder()
	ts.ServeHTTP(recObs, reqObs)

	if recObs.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d (body: %s)", recObs.Code, recObs.Body.String())
	}

	var res map[string]interface{}
	_ = json.NewDecoder(recObs.Body).Decode(&res)
	if res["alert"] == nil {
		t.Fatal("expected alert in response for Hb 6.5")
	}
}
