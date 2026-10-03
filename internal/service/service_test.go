package service

import (
	"context"
	"testing"
	"github.com/KODEGAS/Aadhya/internal/domain/clinical"
	"github.com/KODEGAS/Aadhya/internal/repository"
)

func TestEndToEndMaternalLifecycle(t *testing.T) {
	ctx := context.Background()
	store := repository.NewMemoryStore()
	svc := NewClinicalService(store)

	// 1. Register Mother
	mother, err := svc.RegisterMother(ctx, "Anula", "Jayasinghe", "1993-08-20", "0779876543")
	if err != nil {
		t.Fatalf("failed to register mother: %v", err)
	}
	if mother.ID == "" || mother.OPDNumber == "" {
		t.Fatal("expected mother ID and OPD number to be populated")
	}

	// 2. Register Pregnancy
	lmp := "2026-02-01"
	preg, err := svc.RegisterPregnancy(ctx, mother.ID, lmp)
	if err != nil {
		t.Fatalf("failed to register pregnancy: %v", err)
	}
	if preg.MotherID != mother.ID {
		t.Errorf("expected mother ID %s, got %s", mother.ID, preg.MotherID)
	}
	if preg.EDD != "2026-11-08" {
		t.Errorf("expected EDD 2026-11-08, got %s", preg.EDD)
	}

	// 3. Record Normal and Abnormal Observations
	// Normal observation
	_, alert1, err := svc.RecordObservation(ctx, mother.ID, preg.ID, clinical.CodeHemoglobin, 11.2, "g/dL")
	if err != nil || alert1 != nil {
		t.Fatalf("expected normal observation without alert, got alert=%v, err=%v", alert1, err)
	}

	// Severe Anemia observation (< 7.0 g/dL)
	_, alert2, err := svc.RecordObservation(ctx, mother.ID, preg.ID, clinical.CodeHemoglobin, 6.4, "g/dL")
	if err != nil || alert2 == nil {
		t.Fatalf("expected severe anemia alert, got alert=%v, err=%v", alert2, err)
	}
	if alert2.Type != "SEVERE_MATERNAL_ANEMIA" {
		t.Errorf("expected SEVERE_MATERNAL_ANEMIA, got %s", alert2.Type)
	}

	// 4. Record Delivery
	child, err := svc.RecordDelivery(ctx, preg.ID, "Kavindu", "Jayasinghe", "2026-11-05")
	if err != nil {
		t.Fatalf("failed to record delivery: %v", err)
	}
	if child.MotherID != mother.ID {
		t.Errorf("expected child linked to mother %s, got %s", mother.ID, child.MotherID)
	}

	// 5. Get Mother Profile
	profile, err := svc.GetMotherProfile(ctx, mother.ID)
	if err != nil {
		t.Fatalf("failed to get mother profile: %v", err)
	}
	if len(profile.Pregnancies) != 1 {
		t.Errorf("expected 1 pregnancy, got %d", len(profile.Pregnancies))
	}
	if len(profile.Observations) != 2 {
		t.Errorf("expected 2 observations, got %d", len(profile.Observations))
	}
}
