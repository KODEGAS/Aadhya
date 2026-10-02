package clinical

import (
	"testing"
)

func TestHbSevereAnemiaAlert(t *testing.T) {
	// Normal Hb: 11.5 -> no alert
	_, alert := NewObservation("pat-1", "preg-1", CodeHemoglobin, 11.5, "g/dL")
	if alert != nil {
		t.Errorf("expected no alert for normal Hb, got %v", alert)
	}

	// Severe Anemia: 6.8 (< 7.0) -> Critical alert
	_, alert = NewObservation("pat-1", "preg-1", CodeHemoglobin, 6.8, "g/dL")
	if alert == nil {
		t.Fatal("expected severe anemia alert for Hb 6.8")
	}
	if alert.Type != "SEVERE_MATERNAL_ANEMIA" {
		t.Errorf("expected SEVERE_MATERNAL_ANEMIA, got %s", alert.Type)
	}
	if alert.Severity != "CRITICAL" {
		t.Errorf("expected CRITICAL, got %s", alert.Severity)
	}
}

func TestFetalHeartRateAlerts(t *testing.T) {
	// Normal FHR: 140 bpm -> no alert
	_, alert := NewObservation("pat-1", "preg-1", CodeFetalHeartRate, 140, "bpm")
	if alert != nil {
		t.Errorf("expected no alert for normal FHR, got %v", alert)
	}

	// Bradycardia: 105 bpm (< 110)
	_, alert = NewObservation("pat-1", "preg-1", CodeFetalHeartRate, 105, "bpm")
	if alert == nil || alert.Type != "FETAL_BRADYCARDIA" {
		t.Fatalf("expected FETAL_BRADYCARDIA, got %v", alert)
	}

	// Tachycardia: 168 bpm (> 160)
	_, alert = NewObservation("pat-1", "preg-1", CodeFetalHeartRate, 168, "bpm")
	if alert == nil || alert.Type != "FETAL_TACHYCARDIA" {
		t.Fatalf("expected FETAL_TACHYCARDIA, got %v", alert)
	}
}
