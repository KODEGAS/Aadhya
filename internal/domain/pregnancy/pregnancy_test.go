package pregnancy

import (
	"testing"
	"time"
)

func TestCalculateEDD(t *testing.T) {
	// LMP: 2026-01-01 -> EDD: 2026-01-01 + 280 days = 2026-10-08
	lmp, _ := time.Parse("2006-01-02", "2026-01-01")
	edd := CalculateEDD(lmp)
	expected := "2026-10-08"
	if edd.Format("2006-01-02") != expected {
		t.Errorf("expected EDD %s, got %s", expected, edd.Format("2006-01-02"))
	}
}

func TestCalculateGestationalAge(t *testing.T) {
	lmp, _ := time.Parse("2006-01-02", "2026-01-01")
	asOf, _ := time.Parse("2006-01-02", "2026-01-22") // 21 days = 3 weeks 0 days
	w, d := CalculateGestationalAge(lmp, asOf)
	if w != 3 || d != 0 {
		t.Errorf("expected 3w 0d, got %dw %dd", w, d)
	}
}

func TestCompleteDelivery(t *testing.T) {
	asOf := time.Now()
	p, err := NewPregnancy("mother-123", "2026-01-01", asOf)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if p.Status != StatusActive {
		t.Errorf("expected ACTIVE, got %s", p.Status)
	}

	err = p.CompleteDelivery(asOf)
	if err != nil {
		t.Fatalf("unexpected error completing delivery: %v", err)
	}

	if p.Status != StatusCompleted {
		t.Errorf("expected COMPLETED, got %s", p.Status)
	}
	if p.DeliveredAt == nil {
		t.Error("expected non-nil DeliveredAt")
	}
}
