package patient

import (
	"crypto/rand"
	"errors"
	"fmt"
	"strings"
	"time"
)

// PatientType identifies whether the record belongs to a mother or child.
type PatientType string

const (
	TypeMother PatientType = "MOTHER"
	TypeChild  PatientType = "CHILD"
)

// Patient represents the immutable clinical patient entity in Adhya.
type Patient struct {
	ID         string      `json:"id"`
	OPDNumber  string      `json:"opd_number"`
	Type       PatientType `json:"type"`
	GivenName  string      `json:"given_name"`
	FamilyName string      `json:"family_name"`
	BirthDate  string      `json:"birth_date"` // YYYY-MM-DD
	Phone      string      `json:"phone,omitempty"`
	MotherID   string      `json:"mother_id,omitempty"` // Immutable maternal link for child
	CreatedAt  time.Time   `json:"created_at"`
}

// NewMother creates and validates a new mother patient aggregate.
func NewMother(givenName, familyName, birthDate, phone string, opdSeq int) (*Patient, error) {
	if strings.TrimSpace(givenName) == "" {
		return nil, errors.New("given_name is required")
	}
	if strings.TrimSpace(familyName) == "" {
		return nil, errors.New("family_name is required")
	}
	if strings.TrimSpace(birthDate) == "" {
		return nil, errors.New("birth_date is required")
	}

	return &Patient{
		ID:         newUUID(),
		OPDNumber:  fmt.Sprintf("OPD-%d-%06d", time.Now().Year(), opdSeq),
		Type:       TypeMother,
		GivenName:  strings.TrimSpace(givenName),
		FamilyName: strings.TrimSpace(familyName),
		BirthDate:  birthDate,
		Phone:      strings.TrimSpace(phone),
		CreatedAt:  time.Now().UTC(),
	}, nil
}

// NewChild creates and validates a newborn patient linked immutably to a mother.
func NewChild(motherID, givenName, familyName, birthDate string, opdSeq int) (*Patient, error) {
	if strings.TrimSpace(motherID) == "" {
		return nil, errors.New("mother_id is required for child patient")
	}
	if strings.TrimSpace(givenName) == "" {
		return nil, errors.New("given_name is required")
	}
	if strings.TrimSpace(familyName) == "" {
		return nil, errors.New("family_name is required")
	}

	return &Patient{
		ID:         newUUID(),
		OPDNumber:  fmt.Sprintf("OPD-%d-%06d", time.Now().Year(), opdSeq),
		Type:       TypeChild,
		GivenName:  strings.TrimSpace(givenName),
		FamilyName: strings.TrimSpace(familyName),
		BirthDate:  birthDate,
		MotherID:   motherID,
		CreatedAt:  time.Now().UTC(),
	}, nil
}

// newUUID generates a cryptographically random RFC 4122 v4 UUID.
func newUUID() string {
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	b[6] = (b[6] & 0x0f) | 0x40 // Version 4
	b[8] = (b[8] & 0x3f) | 0x80 // Variant 10
	return fmt.Sprintf("%08x-%04x-%04x-%04x-%012x",
		b[0:4], b[4:6], b[6:8], b[8:10], b[10:16])
}
