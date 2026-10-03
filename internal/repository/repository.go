package repository

import (
	"context"
	"errors"
	"github.com/KODEGAS/Aadhya/internal/domain/clinical"
	"github.com/KODEGAS/Aadhya/internal/domain/event"
	"github.com/KODEGAS/Aadhya/internal/domain/patient"
	"github.com/KODEGAS/Aadhya/internal/domain/pregnancy"
)

var (
	ErrNotFound = errors.New("resource not found")
	ErrConflict = errors.New("resource already exists")
)

type PatientRepository interface {
	Save(ctx context.Context, p *patient.Patient) error
	FindByID(ctx context.Context, id string) (*patient.Patient, error)
	FindByOPD(ctx context.Context, opd string) (*patient.Patient, error)
	ListMothers(ctx context.Context) ([]*patient.Patient, error)
	NextOPDSequence(ctx context.Context) (int, error)
}

type PregnancyRepository interface {
	Save(ctx context.Context, p *pregnancy.Pregnancy) error
	FindByID(ctx context.Context, id string) (*pregnancy.Pregnancy, error)
	ListByMotherID(ctx context.Context, motherID string) ([]*pregnancy.Pregnancy, error)
}

type ObservationRepository interface {
	Save(ctx context.Context, obs *clinical.Observation) error
	SaveAlert(ctx context.Context, alert *clinical.Alert) error
	ListByPatientID(ctx context.Context, patientID string) ([]*clinical.Observation, error)
	ListAlerts(ctx context.Context) ([]*clinical.Alert, error)
}

type EventRepository interface {
	Save(ctx context.Context, evt *event.Event) error
	List(ctx context.Context) ([]*event.Event, error)
}
