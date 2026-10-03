package fhir

import (
	"testing"
	"github.com/KODEGAS/Aadhya/internal/domain/patient"
)

func TestToFHIRPatientMother(t *testing.T) {
	mother, err := patient.NewMother("Sita", "Silva", "1995-02-14", "0711122334", 10)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	fhirPat := ToFHIRPatient(mother)
	if fhirPat.ResourceType != "Patient" {
		t.Errorf("expected resourceType Patient, got %s", fhirPat.ResourceType)
	}
	if fhirPat.ID != mother.ID {
		t.Errorf("expected ID %s, got %s", mother.ID, fhirPat.ID)
	}
	if len(fhirPat.Identifier) == 0 || fhirPat.Identifier[0].Value != mother.OPDNumber {
		t.Errorf("expected OPD identifier %s", mother.OPDNumber)
	}
	if len(fhirPat.Name) == 0 || fhirPat.Name[0].Family != "Silva" {
		t.Errorf("expected family name Silva")
	}
	if len(fhirPat.Link) != 0 {
		t.Errorf("expected no links for mother, got %d", len(fhirPat.Link))
	}
}

func TestToFHIRPatientChildHasMotherLink(t *testing.T) {
	motherID := "mother-uuid-999"
	child, err := patient.NewChild(motherID, "Baby", "Silva", "2026-10-01", 11)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	fhirPat := ToFHIRPatient(child)
	if len(fhirPat.Link) != 1 {
		t.Fatalf("expected 1 link for child, got %d", len(fhirPat.Link))
	}
	expectedRef := "Patient/" + motherID
	if fhirPat.Link[0].Other.Reference != expectedRef {
		t.Errorf("expected link reference %s, got %s", expectedRef, fhirPat.Link[0].Other.Reference)
	}
}
