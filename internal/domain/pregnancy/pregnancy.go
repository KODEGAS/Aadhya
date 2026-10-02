package pregnancy

import (
	"crypto/rand"
	"errors"
	"fmt"
	"strings"
	"time"
)

type Status string

const (
	StatusPlanned   Status = "PLANNED"
	StatusActive    Status = "ACTIVE"
	StatusCompleted Status = "COMPLETED"
)

// Pregnancy represents an obstetric episode of care for a mother.
type Pregnancy struct {
	ID             string    `json:"id"`
	MotherID       string    `json:"mother_id"`
	Status         Status    `json:"status"`
	LMP            string    `json:"lmp"`             // YYYY-MM-DD
	EDD            string    `json:"edd"`             // Estimated Date of Delivery
	GestationalAge string    `json:"gestational_age"` // e.g. "12 weeks 3 days"
	RegisteredAt   time.Time `json:"registered_at"`
	DeliveredAt    *time.Time `json:"delivered_at,omitempty"`
}

// CalculateEDD applies Naegele's rule: LMP + 280 days (40 weeks).
func CalculateEDD(lmpDate time.Time) time.Time {
	return lmpDate.AddDate(0, 0, 280)
}

// CalculateGestationalAge calculates gestational age from LMP as of asOf date.
func CalculateGestationalAge(lmpDate, asOf time.Time) (weeks int, days int) {
	diff := asOf.Sub(lmpDate)
	totalDays := int(diff.Hours() / 24)
	if totalDays < 0 {
		return 0, 0
	}
	return totalDays / 7, totalDays % 7
}

// NewPregnancy validates and initializes a pregnancy episode.
func NewPregnancy(motherID string, lmpStr string, asOf time.Time) (*Pregnancy, error) {
	if strings.TrimSpace(motherID) == "" {
		return nil, errors.New("mother_id is required")
	}

	lmpDate, err := time.Parse("2006-01-02", lmpStr)
	if err != nil {
		return nil, fmt.Errorf("invalid LMP date format (expected YYYY-MM-DD): %w", err)
	}

	eddDate := CalculateEDD(lmpDate)
	w, d := CalculateGestationalAge(lmpDate, asOf)

	return &Pregnancy{
		ID:             newUUID(),
		MotherID:       motherID,
		Status:         StatusActive,
		LMP:            lmpStr,
		EDD:            eddDate.Format("2006-01-02"),
		GestationalAge: fmt.Sprintf("%d weeks %d days", w, d),
		RegisteredAt:   asOf.UTC(),
	}, nil
}

// CompleteDelivery transitions the pregnancy to COMPLETED upon delivery.
func (p *Pregnancy) CompleteDelivery(deliveredAt time.Time) error {
	if p.Status != StatusActive {
		return errors.New("can only complete an active pregnancy")
	}
	p.Status = StatusCompleted
	t := deliveredAt.UTC()
	p.DeliveredAt = &t
	return nil
}

func newUUID() string {
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	b[6] = (b[6] & 0x0f) | 0x40
	b[8] = (b[8] & 0x3f) | 0x80
	return fmt.Sprintf("%08x-%04x-%04x-%04x-%012x",
		b[0:4], b[4:6], b[6:8], b[8:10], b[10:16])
}
