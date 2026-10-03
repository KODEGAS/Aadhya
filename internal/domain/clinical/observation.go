package clinical

import (
	"crypto/rand"
	"fmt"
	"time"
)

// Standard observation codes
const (
	CodeHemoglobin     = "HEMOGLOBIN"      // LOINC 718-7, unit: g/dL
	CodeFetalHeartRate = "FETAL_HEART_RATE" // LOINC 8867-4, unit: bpm
	CodeSystolicBP     = "SYSTOLIC_BP"      // LOINC 8480-6, unit: mmHg
	CodeDiastolicBP    = "DIASTOLIC_BP"     // LOINC 8462-4, unit: mmHg
)

// Observation represents a vital sign or clinical measurement.
type Observation struct {
	ID          string    `json:"id"`
	PatientID   string    `json:"patient_id"`
	PregnancyID string    `json:"pregnancy_id,omitempty"`
	Code        string    `json:"code"`
	Value       float64   `json:"value"`
	Unit        string    `json:"unit"`
	MeasuredAt  time.Time `json:"measured_at"`
}

// Alert represents an automatically detected clinical anomaly.
type Alert struct {
	ID          string    `json:"id"`
	PatientID   string    `json:"patient_id"`
	PregnancyID string    `json:"pregnancy_id,omitempty"`
	Type        string    `json:"type"`
	Severity    string    `json:"severity"` // HIGH, CRITICAL, WARNING
	Value       float64   `json:"value"`
	Message     string    `json:"message"`
	TriggeredAt time.Time `json:"triggered_at"`
}

// NewObservation creates an observation and evaluates clinical rule triggers.
func NewObservation(patientID, pregnancyID, code string, value float64, unit string) (*Observation, *Alert) {
	obs := &Observation{
		ID:          newUUID(),
		PatientID:   patientID,
		PregnancyID: pregnancyID,
		Code:        code,
		Value:       value,
		Unit:        unit,
		MeasuredAt:  time.Now().UTC(),
	}

	var alert *Alert

	switch code {
	case CodeHemoglobin:
		// Rule from Issue #28: Hb < 7.0 g/dL -> Severe Maternal Anemia
		if value < 7.0 {
			alert = &Alert{
				ID:          newUUID(),
				PatientID:   patientID,
				PregnancyID: pregnancyID,
				Type:        "SEVERE_MATERNAL_ANEMIA",
				Severity:    "CRITICAL",
				Value:       value,
				Message:     fmt.Sprintf("Severe anemia detected (Hb %.1f g/dL < 7.0). Immediate clinical review required.", value),
				TriggeredAt: time.Now().UTC(),
			}
		}
	case CodeFetalHeartRate:
		// Rule from Issue #29: Normal 110-160 bpm. Below 110 or above 160 -> Anomaly alert
		if value < 110.0 {
			alert = &Alert{
				ID:          newUUID(),
				PatientID:   patientID,
				PregnancyID: pregnancyID,
				Type:        "FETAL_BRADYCARDIA",
				Severity:    "HIGH",
				Value:       value,
				Message:     fmt.Sprintf("Fetal bradycardia detected (FHR %.0f bpm < 110). Immediate attention required.", value),
				TriggeredAt: time.Now().UTC(),
			}
		} else if value > 160.0 {
			alert = &Alert{
				ID:          newUUID(),
				PatientID:   patientID,
				PregnancyID: pregnancyID,
				Type:        "FETAL_TACHYCARDIA",
				Severity:    "HIGH",
				Value:       value,
				Message:     fmt.Sprintf("Fetal tachycardia detected (FHR %.0f bpm > 160). Review required.", value),
				TriggeredAt: time.Now().UTC(),
			}
		}
	}

	return obs, alert
}

func newUUID() string {
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	b[6] = (b[6] & 0x0f) | 0x40
	b[8] = (b[8] & 0x3f) | 0x80
	return fmt.Sprintf("%08x-%04x-%04x-%04x-%012x",
		b[0:4], b[4:6], b[6:8], b[8:10], b[10:16])
}
