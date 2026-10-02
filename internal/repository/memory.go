package repository

import (
	"context"
	"sync"
	"github.com/KODEGAS/Aadhya/internal/domain/clinical"
	"github.com/KODEGAS/Aadhya/internal/domain/event"
	"github.com/KODEGAS/Aadhya/internal/domain/patient"
	"github.com/KODEGAS/Aadhya/internal/domain/pregnancy"
)

type MemoryStore struct {
	mu           sync.RWMutex
	patients     map[string]*patient.Patient
	patientsOPD  map[string]*patient.Patient
	pregnancies  map[string]*pregnancy.Pregnancy
	observations []*clinical.Observation
	alerts       []*clinical.Alert
	events       []*event.Event
	opdCounter   int
}

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		patients:     make(map[string]*patient.Patient),
		patientsOPD:  make(map[string]*patient.Patient),
		pregnancies:  make(map[string]*pregnancy.Pregnancy),
		observations: make([]*clinical.Observation, 0),
		alerts:       make([]*clinical.Alert, 0),
		events:       make([]*event.Event, 0),
		opdCounter:   1000,
	}
}

// PatientRepository implementation
func (m *MemoryStore) Save(ctx context.Context, p *patient.Patient) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.patients[p.ID] = p
	m.patientsOPD[p.OPDNumber] = p
	return nil
}

func (m *MemoryStore) FindByID(ctx context.Context, id string) (*patient.Patient, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	p, ok := m.patients[id]
	if !ok {
		return nil, ErrNotFound
	}
	return p, nil
}

func (m *MemoryStore) FindByOPD(ctx context.Context, opd string) (*patient.Patient, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	p, ok := m.patientsOPD[opd]
	if !ok {
		return nil, ErrNotFound
	}
	return p, nil
}

func (m *MemoryStore) ListMothers(ctx context.Context) ([]*patient.Patient, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	mothers := make([]*patient.Patient, 0)
	for _, p := range m.patients {
		if p.Type == patient.TypeMother {
			mothers = append(mothers, p)
		}
	}
	return mothers, nil
}

func (m *MemoryStore) NextOPDSequence(ctx context.Context) (int, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.opdCounter++
	return m.opdCounter, nil
}

// PregnancyRepository implementation
func (m *MemoryStore) SavePregnancy(ctx context.Context, p *pregnancy.Pregnancy) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.pregnancies[p.ID] = p
	return nil
}

func (m *MemoryStore) FindPregnancyByID(ctx context.Context, id string) (*pregnancy.Pregnancy, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	p, ok := m.pregnancies[id]
	if !ok {
		return nil, ErrNotFound
	}
	return p, nil
}

func (m *MemoryStore) ListByMotherID(ctx context.Context, motherID string) ([]*pregnancy.Pregnancy, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	res := make([]*pregnancy.Pregnancy, 0)
	for _, p := range m.pregnancies {
		if p.MotherID == motherID {
			res = append(res, p)
		}
	}
	return res, nil
}

// ObservationRepository implementation
func (m *MemoryStore) SaveObservation(ctx context.Context, obs *clinical.Observation) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.observations = append(m.observations, obs)
	return nil
}

func (m *MemoryStore) SaveAlert(ctx context.Context, alert *clinical.Alert) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.alerts = append(m.alerts, alert)
	return nil
}

func (m *MemoryStore) ListObservationsByPatientID(ctx context.Context, patientID string) ([]*clinical.Observation, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	res := make([]*clinical.Observation, 0)
	for _, obs := range m.observations {
		if obs.PatientID == patientID {
			res = append(res, obs)
		}
	}
	return res, nil
}

func (m *MemoryStore) ListAlerts(ctx context.Context) ([]*clinical.Alert, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	res := make([]*clinical.Alert, len(m.alerts))
	copy(res, m.alerts)
	return res, nil
}

// EventRepository implementation
func (m *MemoryStore) SaveEvent(ctx context.Context, evt *event.Event) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.events = append(m.events, evt)
	return nil
}

func (m *MemoryStore) ListEvents(ctx context.Context) ([]*event.Event, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	res := make([]*event.Event, len(m.events))
	copy(res, m.events)
	return res, nil
}
