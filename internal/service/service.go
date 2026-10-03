package service

import (
	"context"
	"fmt"
	"time"
	"github.com/KODEGAS/Aadhya/internal/domain/clinical"
	"github.com/KODEGAS/Aadhya/internal/domain/event"
	"github.com/KODEGAS/Aadhya/internal/domain/patient"
	"github.com/KODEGAS/Aadhya/internal/domain/pregnancy"
	"github.com/KODEGAS/Aadhya/internal/repository"
)

type MotherProfile struct {
	Patient      *patient.Patient        `json:"patient"`
	Pregnancies  []*pregnancy.Pregnancy  `json:"pregnancies"`
	Observations []*clinical.Observation `json:"observations"`
}

type ClinicalService struct {
	store *repository.MemoryStore
}

func NewClinicalService(store *repository.MemoryStore) *ClinicalService {
	return &ClinicalService{store: store}
}

// RegisterMother implements F02/F03 mother registration with OPD number generation.
func (s *ClinicalService) RegisterMother(ctx context.Context, givenName, familyName, birthDate, phone string) (*patient.Patient, error) {
	seq, err := s.store.NextOPDSequence(ctx)
	if err != nil {
		return nil, err
	}

	p, err := patient.NewMother(givenName, familyName, birthDate, phone, seq)
	if err != nil {
		return nil, err
	}

	if err := s.store.Save(ctx, p); err != nil {
		return nil, err
	}

	// Emit registration event
	evt := event.NewEvent("maternal.patient.registered.v1", "1.0", "adhya.clinical-service", map[string]interface{}{
		"patient_id": p.ID,
		"opd_number": p.OPDNumber,
		"type":       p.Type,
	})
	_ = s.store.SaveEvent(ctx, evt)

	return p, nil
}

// RegisterPregnancy implements F04 pregnancy lifecycle initiation and EDD calculation.
func (s *ClinicalService) RegisterPregnancy(ctx context.Context, motherID, lmp string) (*pregnancy.Pregnancy, error) {
	// Verify mother exists
	if _, err := s.store.FindByID(ctx, motherID); err != nil {
		return nil, fmt.Errorf("mother not found: %w", err)
	}

	p, err := pregnancy.NewPregnancy(motherID, lmp, time.Now())
	if err != nil {
		return nil, err
	}

	if err := s.store.SavePregnancy(ctx, p); err != nil {
		return nil, err
	}

	evt := event.NewEvent("pregnancy.registered.v1", "1.0", "adhya.clinical-service", map[string]interface{}{
		"pregnancy_id": p.ID,
		"mother_id":    p.MotherID,
		"edd":          p.EDD,
		"lmp":          p.LMP,
	})
	_ = s.store.SaveEvent(ctx, evt)

	return p, nil
}

// RecordObservation implements F05 & F13 vitals observation with automated clinical alert generation.
func (s *ClinicalService) RecordObservation(ctx context.Context, patientID, pregnancyID, code string, value float64, unit string) (*clinical.Observation, *clinical.Alert, error) {
	// Verify patient exists
	if _, err := s.store.FindByID(ctx, patientID); err != nil {
		return nil, nil, fmt.Errorf("patient not found: %w", err)
	}

	obs, alert := clinical.NewObservation(patientID, pregnancyID, code, value, unit)
	if err := s.store.SaveObservation(ctx, obs); err != nil {
		return nil, nil, err
	}

	if alert != nil {
		if err := s.store.SaveAlert(ctx, alert); err != nil {
			return nil, nil, err
		}
		// Emit clinical alert event for Siddhi/Notification service
		evt := event.NewEvent(fmt.Sprintf("clinical.alert.%s.v1", alert.Type), "1.0", "adhya.clinical-service", alert)
		_ = s.store.SaveEvent(ctx, evt)
	}

	return obs, alert, nil
}

// RecordDelivery implements F04/F07 delivery completion, child creation and immutable linkage.
func (s *ClinicalService) RecordDelivery(ctx context.Context, pregnancyID, childGivenName, childFamilyName, birthDate string) (*patient.Patient, error) {
	preg, err := s.store.FindPregnancyByID(ctx, pregnancyID)
	if err != nil {
		return nil, fmt.Errorf("pregnancy not found: %w", err)
	}

	if err := preg.CompleteDelivery(time.Now()); err != nil {
		return nil, err
	}
	if err := s.store.SavePregnancy(ctx, preg); err != nil {
		return nil, err
	}

	seq, err := s.store.NextOPDSequence(ctx)
	if err != nil {
		return nil, err
	}

	child, err := patient.NewChild(preg.MotherID, childGivenName, childFamilyName, birthDate, seq)
	if err != nil {
		return nil, err
	}

	if err := s.store.Save(ctx, child); err != nil {
		return nil, err
	}

	// Emit delivery and child registered event
	evt := event.NewEvent("delivery.completed.v1", "1.0", "adhya.clinical-service", map[string]interface{}{
		"pregnancy_id": preg.ID,
		"mother_id":    preg.MotherID,
		"child_id":     child.ID,
		"child_opd":    child.OPDNumber,
	})
	_ = s.store.SaveEvent(ctx, evt)

	return child, nil
}

// GetMotherProfile returns the complete longitudinal profile for a mother.
func (s *ClinicalService) GetMotherProfile(ctx context.Context, motherID string) (*MotherProfile, error) {
	p, err := s.store.FindByID(ctx, motherID)
	if err != nil {
		return nil, err
	}

	pregnancies, err := s.store.ListByMotherID(ctx, motherID)
	if err != nil {
		return nil, err
	}

	observations, err := s.store.ListObservationsByPatientID(ctx, motherID)
	if err != nil {
		return nil, err
	}

	return &MotherProfile{
		Patient:      p,
		Pregnancies:  pregnancies,
		Observations: observations,
	}, nil
}
