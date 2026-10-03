package fhir

import (
	"fmt"
	"github.com/KODEGAS/Aadhya/internal/domain/patient"
)

// FHIRPatient represents an HL7 FHIR R4 Patient resource.
type FHIRPatient struct {
	ResourceType string             `json:"resourceType"`
	ID           string             `json:"id"`
	Identifier   []FHIRIdentifier   `json:"identifier"`
	Name         []FHIRHumanName    `json:"name"`
	Telecom      []FHIRContactPoint `json:"telecom,omitempty"`
	BirthDate    string             `json:"birthDate,omitempty"`
	Link         []FHIRPatientLink  `json:"link,omitempty"`
}

type FHIRIdentifier struct {
	Use    string `json:"use"`
	System string `json:"system"`
	Value  string `json:"value"`
}

type FHIRHumanName struct {
	Use    string   `json:"use"`
	Family string   `json:"family"`
	Given  []string `json:"given"`
}

type FHIRContactPoint struct {
	System string `json:"system"`
	Value  string `json:"value"`
	Use    string `json:"use"`
}

type FHIRPatientLink struct {
	Other FHIRReference `json:"other"`
	Type  string        `json:"type"` // e.g. "seealso"
}

type FHIRReference struct {
	Reference string `json:"reference"`
	Display   string `json:"display,omitempty"`
}

// ToFHIRPatient converts an internal Adhya patient aggregate into an HL7 FHIR R4 Patient.
func ToFHIRPatient(p *patient.Patient) *FHIRPatient {
	fhirPat := &FHIRPatient{
		ResourceType: "Patient",
		ID:           p.ID,
		Identifier: []FHIRIdentifier{
			{
				Use:    "official",
				System: "http://adhya.health.lk/identifiers/opd",
				Value:  p.OPDNumber,
			},
		},
		Name: []FHIRHumanName{
			{
				Use:    "official",
				Family: p.FamilyName,
				Given:  []string{p.GivenName},
			},
		},
		BirthDate: p.BirthDate,
	}

	if p.Phone != "" {
		fhirPat.Telecom = []FHIRContactPoint{
			{
				System: "phone",
				Value:  p.Phone,
				Use:    "mobile",
			},
		}
	}

	// Longitudinal maternal link representation
	if p.MotherID != "" {
		fhirPat.Link = []FHIRPatientLink{
			{
				Other: FHIRReference{
					Reference: fmt.Sprintf("Patient/%s", p.MotherID),
					Display:   "Biological Mother",
				},
				Type: "seealso",
			},
		}
	}

	return fhirPat
}
