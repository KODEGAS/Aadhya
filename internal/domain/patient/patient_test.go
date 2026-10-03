package patient

import (
	"strings"
	"testing"
)

func TestNewMother(t *testing.T) {
	mother, err := NewMother("Kamala", "Perera", "1994-05-12", "0771234567", 1)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if mother.ID == "" {
		t.Errorf("expected non-empty ID")
	}
	if !strings.HasPrefix(mother.OPDNumber, "OPD-") {
		t.Errorf("expected OPDNumber format, got %s", mother.OPDNumber)
	}
	if mother.Type != TypeMother {
		t.Errorf("expected TypeMother, got %s", mother.Type)
	}
	if mother.GivenName != "Kamala" {
		t.Errorf("expected Kamala, got %s", mother.GivenName)
	}
}

func TestNewChildRequiresMotherID(t *testing.T) {
	_, err := NewChild("", "Baby", "Perera", "2026-10-01", 2)
	if err == nil {
		t.Fatal("expected error when mother_id is missing")
	}
}

func TestNewChildLinked(t *testing.T) {
	motherID := "mother-uuid-123"
	child, err := NewChild(motherID, "Nimal", "Perera", "2026-10-01", 2)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if child.MotherID != motherID {
		t.Errorf("expected MotherID %s, got %s", motherID, child.MotherID)
	}
	if child.Type != TypeChild {
		t.Errorf("expected TypeChild, got %s", child.Type)
	}
}
