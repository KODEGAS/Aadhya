package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
	"github.com/KODEGAS/Aadhya/internal/domain/clinical"
	"github.com/KODEGAS/Aadhya/internal/handler"
	"github.com/KODEGAS/Aadhya/internal/repository"
	"github.com/KODEGAS/Aadhya/internal/service"
)

func main() {
	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting Adhya Clinical Service on port %s...", port)

	// Initialize repository store and domain service
	store := repository.NewMemoryStore()
	svc := service.NewClinicalService(store)

	// Seed synthetic healthcare data for local development
	seedSyntheticData(svc)

	// Initialize API handlers
	api := handler.NewAPIHandler(svc, store)

	server := &http.Server{
		Addr:         ":" + port,
		Handler:      api.Routes(),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 15 * time.Second,
	}

	// Graceful shutdown handling
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server listen failed: %v", err)
		}
	}()

	log.Printf("Adhya service running at http://localhost:%s", port)
	log.Printf("Endpoints:")
	log.Printf("  GET  /healthz")
	log.Printf("  POST /api/v1/patients/mothers")
	log.Printf("  GET  /api/v1/patients/mothers/{id}")
	log.Printf("  POST /api/v1/patients/mothers/{id}/pregnancies")
	log.Printf("  POST /api/v1/pregnancies/{id}/observations")
	log.Printf("  POST /api/v1/pregnancies/{id}/delivery")
	log.Printf("  GET  /api/v1/fhir/Patient/{id}")
	log.Printf("  GET  /api/v1/events")

	<-stop
	log.Println("Shutting down gracefully...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Printf("Server forced shutdown: %v", err)
	}

	log.Println("Adhya service stopped.")
}

func seedSyntheticData(svc *service.ClinicalService) {
	ctx := context.Background()

	// Seed Synthetic Mother (Kamala Perera)
	mother, err := svc.RegisterMother(ctx, "Kamala", "Perera", "1994-06-15", "0771234567")
	if err != nil {
		log.Printf("Warning: failed to seed mother: %v", err)
		return
	}

	// Seed Active Pregnancy (LMP: 2026-03-01)
	preg, err := svc.RegisterPregnancy(ctx, mother.ID, "2026-03-01")
	if err != nil {
		log.Printf("Warning: failed to seed pregnancy: %v", err)
		return
	}

	// Seed Observations: normal BP, normal FHR, and severe anemia observation
	_, _, _ = svc.RecordObservation(ctx, mother.ID, preg.ID, clinical.CodeSystolicBP, 118, "mmHg")
	_, _, _ = svc.RecordObservation(ctx, mother.ID, preg.ID, clinical.CodeFetalHeartRate, 142, "bpm")
	_, alert, _ := svc.RecordObservation(ctx, mother.ID, preg.ID, clinical.CodeHemoglobin, 6.8, "g/dL")

	log.Printf("Seeded synthetic patient %s (OPD: %s) with pregnancy %s (EDD: %s)",
		mother.GivenName+" "+mother.FamilyName, mother.OPDNumber, preg.ID, preg.EDD)
	if alert != nil {
		log.Printf("Synthetic alert triggered: %s [%s]: %s", alert.Type, alert.Severity, alert.Message)
	}
}
