package event

import (
	"crypto/rand"
	"fmt"
	"time"
)

// Event follows the CloudEvents v1.0 specification for Adhya domain events.
type Event struct {
	ID          string      `json:"event_id"`
	Type        string      `json:"event_type"`
	Version     string      `json:"event_version"`
	Source      string      `json:"source"`
	Time        time.Time   `json:"time"`
	DataContentType string  `json:"datacontenttype"`
	Data        interface{} `json:"data"`
}

// NewEvent creates a standard versioned CloudEvent.
func NewEvent(eventType, version, source string, data interface{}) *Event {
	return &Event{
		ID:              newUUID(),
		Type:            eventType,
		Version:         version,
		Source:          source,
		Time:            time.Now().UTC(),
		DataContentType: "application/json",
		Data:            data,
	}
}

func newUUID() string {
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	b[6] = (b[6] & 0x0f) | 0x40
	b[8] = (b[8] & 0x3f) | 0x80
	return fmt.Sprintf("%08x-%04x-%04x-%04x-%012x",
		b[0:4], b[4:6], b[6:8], b[8:10], b[10:16])
}
