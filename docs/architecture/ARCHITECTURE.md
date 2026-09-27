# Adhya Architecture Diagrams

Architecture documentation and Mermaid diagrams for the Adhya maternal and child longitudinal healthcare platform.

## Diagram Set

- System Context
- Logical Architecture
- Service Architecture
- Mother → Pregnancy → Delivery → Child data model
- FHIR mapping
- Clinical data flow
- Event processing and alerts
- Security and PQC
- Secure LLM architecture
- Kubernetes deployment
- End-to-end demonstration flow

## Architecture Principles

1. FHIR-first interoperability.
2. Security by design.
3. Least privilege and object-level authorization.
4. Mother → Pregnancy → Delivery → Child longitudinal modeling.
5. Event-driven monitoring.
6. Data minimization for AI.
7. PQC as a research/security layer.
8. Kubernetes-based cloud-native deployment.
9. Synthetic data for development and evaluation.
10. Observable and reproducible experiments.

## System Context

```mermaid
flowchart LR
    Mother["Mother / Caregiver"]
    Doctor["Doctor / Healthcare Provider"]
    Staff["Clinic Staff"]
    Admin["System Administrator"]
    Identity["OAuth2 / OIDC Identity Provider"]
    LLM["External / Isolated LLM API"]
    subgraph A["ADHYA"]
        Web["Next.js Web Application"]
        Gateway["WSO2 API Manager"]
        Core["Clinical & Domain Services"]
        Events["Event Processing & Alerts"]
        AI["Secure LLM Gateway"]
        Data["FHIR + PostgreSQL"]
        Audit["Audit & Security"]
    end
    Mother -->|HTTPS| Web
    Doctor -->|HTTPS| Web
    Staff -->|HTTPS| Web
    Admin -->|HTTPS| Web
    Web --> Gateway
    Gateway --> Core
    Core --> Data
    Core --> Events
    Events --> Audit
    Core --> Audit
    Gateway -. Authentication .-> Identity
    Core --> AI
    AI -->|Filtered context| LLM
    AI --> Audit
```

## Logical Architecture

```mermaid
flowchart TB
    UI["Next.js / TypeScript"] --> APIM["WSO2 API Manager"]
    APIM --> OIDC["OAuth2 / OIDC"]
    APIM --> RBAC["RBAC + Object Authorization"]
    APIM --> Registration["Registration & OPD"]
    APIM --> Maternal["Maternal Care"]
    APIM --> Child["Child Health"]
    APIM --> Clinical["Clinical Data / FHIR"]
    APIM --> Appointment["Appointments & Medicine Slots"]
    Registration --> FHIR["FHIR Layer"]
    Maternal --> FHIR
    Child --> FHIR
    Clinical --> FHIR
    Appointment --> FHIR
    FHIR --> PG[("PostgreSQL")]
    Clinical --> EventBus["Domain Events"]
    Appointment --> EventBus
    EventBus --> Siddhi["Siddhi"]
    Siddhi --> Rules["Pattern Rules"]
    Rules --> Alert["Alert Service"]
    Alert --> Audit["Audit Service"]
    Maternal --> Context["AI Context Builder"]
    Child --> Context
    Clinical --> Context
    Context --> Filter["Authorization + Data Minimization"]
    Filter --> LLMGW["Secure LLM Gateway"]
    LLMGW --> Audit
    Crypto["Classical / ML-KEM / ML-DSA / Hybrid"] -. security research .-> Clinical
```

## Mother → Pregnancy → Child

```mermaid
flowchart TD
    Mother["Mother / Patient"] --> Pregnancy["Pregnancy"]
    Pregnancy --> VisitM["Pregnancy Visit / Encounter"]
    VisitM --> ObsM["Maternal Observation"]
    VisitM --> MedicationM["Medication"]
    Mother --> AppointmentM["Appointment"]
    Pregnancy --> Delivery["Delivery / Birth"]
    Delivery --> Child["Child / Patient"]
    Child --> VisitC["Child Clinic Visit / Encounter"]
    Child --> Vaccine["Immunization"]
    Child --> Growth["Growth Record / Observation"]
    Child --> MedicationC["Child Medication"]
    Child --> AppointmentC["Appointment"]
```

## FHIR Mapping

```mermaid
flowchart LR
    Mother["Mother"] --> PatientM["FHIR Patient"]
    Child["Child"] --> PatientC["FHIR Patient"]
    Doctor["Doctor"] --> Practitioner["FHIR Practitioner"]
    Pregnancy["Pregnancy"] --> PregnancyFHIR["Condition / EpisodeOfCare"]
    Visit["Clinic Visit"] --> Encounter["FHIR Encounter"]
    Observation["Clinical Observation"] --> Obs["FHIR Observation"]
    Medication["Medication / Prescription"] --> Med["FHIR MedicationRequest"]
    Vaccination["Vaccination"] --> Immun["FHIR Immunization"]
    Appointment["Appointment"] --> Appt["FHIR Appointment"]
    Notes["Clinical Notes"] --> Document["DocumentReference / Clinical Resource"]
    Relationship["Provider Relationship"] --> Care["CareTeam / PractitionerRole"]
    Alert["Alert"] --> AlertFHIR["Communication / DetectedIssue"]
```

Exact pregnancy, provider-relationship, clinical-note and alert mappings are finalized during FHIR profile design.

## Clinical Data Flow

```mermaid
sequenceDiagram
    actor Doctor as Healthcare Provider
    participant UI as Next.js
    participant API as WSO2
    participant SVC as Clinical Service
    participant FHIR as FHIR Layer
    participant DB as PostgreSQL
    participant EVT as Event Processing
    participant AUDIT as Audit
    Doctor->>UI: Record observation
    UI->>API: Authenticated request
    API->>SVC: Authorized request
    SVC->>SVC: Object-level authorization
    SVC->>FHIR: Build / validate Observation
    FHIR->>DB: Persist record
    SVC->>EVT: ObservationCreated
    SVC->>AUDIT: Audit CREATE
    SVC-->>UI: FHIR-compatible response
    UI-->>Doctor: Updated timeline
```

## Event Processing

```mermaid
flowchart LR
    Observation["Clinical Observation"] --> Event["Domain Event"]
    Appointment["Appointment"] --> Event
    Vaccination["Vaccination Schedule"] --> Event
    Medicine["Medicine Slot"] --> Event
    Event --> Siddhi["Siddhi"]
    Siddhi --> Rule["Configured Pattern Rule"]
    Rule --> Alert["Alert Service"]
    Rule --> Reminder["Reminder"]
    Alert --> Dashboard["Authorized Dashboard"]
    Reminder --> Dashboard
    Alert --> Audit["Audit"]
```

The baseline demonstration may use repeated abnormal blood-pressure observations within a configured time window. This is a monitoring signal, not an autonomous diagnosis.

## Security & PQC

```mermaid
flowchart TB
    Client["Browser / Client"] --> TLS["HTTPS / TLS"] --> APIM["WSO2 API Manager"]
    APIM --> Auth["OAuth2 / OIDC"] --> RBAC["RBAC"] --> Object["Object-Level Authorization"] --> Services["Domain Services"] --> Data["Clinical Data"]
    Services --> Audit["Audit"]
    Secrets["Kubernetes Secrets"] -. credentials .-> Services
    Network["Network Policies"] -. restrict .-> Services
```

```mermaid
flowchart LR
    API["Cryptographic Abstraction"] --> Classical["Classical Baseline"]
    API --> KEM["ML-KEM"]
    API --> DSA["ML-DSA"]
    API --> Hybrid["Hybrid Configuration"]
    Classical --> Bench["Benchmark Harness"]
    KEM --> Bench
    DSA --> Bench
    Hybrid --> Bench
    Bench --> Metrics["Latency / CPU / Memory / Size / Network"]
```

The research compares classical, PQC and hybrid approaches under controlled conditions. PQC is not presented as a guarantee of complete quantum security.

## Secure LLM Architecture

```mermaid
flowchart LR
    Doctor["Authorized Provider"] --> UI["Doctor Dashboard"] --> API["WSO2"] --> Auth["Authentication + RBAC"]
    Auth --> PatientAuth["Patient Authorization"] --> Retrieve["Clinical Data Retrieval"]
    Retrieve --> Min["Data Minimization"] --> DeID["Filtering / De-identification"] --> Context["Context Builder"]
    Context --> Guard["Prompt Injection / Context Isolation"] --> Gateway["Secure LLM Gateway"] --> LLM["LLM API"] --> Validate["Response Validation"] --> Result["Provider Summary"]
    PatientAuth --> Audit["AI Audit"]
    Gateway --> Audit
    Validate --> Audit
```

Rules: no unrestricted database access; patient authorization before retrieval; minimum necessary context; clinical text treated as untrusted prompt content; cross-patient isolation; auditable AI requests; no autonomous diagnosis, prescription or treatment decisions.

## Kubernetes Deployment

```mermaid
flowchart TB
    Client["Browser"] --> Ingress["Ingress / API Gateway"]
    subgraph K8S["Kubernetes Cluster"]
        Web["Next.js"]
        Registration["Registration"]
        Maternal["Maternal"]
        Child["Child"]
        Clinical["Clinical / FHIR"]
        Appointment["Appointment"]
        Alert["Alert"]
        AI["LLM Gateway"]
        Siddhi["Siddhi"]
        PG[("PostgreSQL")]
        Secrets["Secrets"]
        Config["ConfigMaps"]
        HPA["HPA"]
        Network["Network Policies"]
        OTel["OpenTelemetry"]
        Prom["Prometheus"]
        Grafana["Grafana"]
    end
    Ingress --> Web
    Ingress --> Registration
    Ingress --> Maternal
    Ingress --> Child
    Ingress --> Clinical
    Ingress --> Appointment
    Ingress --> AI
    Registration --> PG
    Maternal --> PG
    Child --> PG
    Clinical --> PG
    Appointment --> PG
    Alert --> PG
    Clinical --> Siddhi
    Appointment --> Siddhi
    Siddhi --> Alert
    Secrets -.-> Registration
    Secrets -.-> Clinical
    Secrets -.-> AI
    Config -.-> Web
    Config -.-> Clinical
    Web -. telemetry .-> OTel
    Clinical -. telemetry .-> OTel
    AI -. telemetry .-> OTel
    Siddhi -. telemetry .-> OTel
    OTel --> Prom --> Grafana
    HPA -. scales .-> Registration
    HPA -. scales .-> Clinical
    Network -. restricts .-> K8S
```

## End-to-End Demonstration

```mermaid
flowchart TD
    A["Register Mother"] --> B["Assign OPD"] --> C["Mother Profile"] --> D["Register Pregnancy"] --> E["Clinic Appointment"] --> F["Provider Observation"] --> G["FHIR Observation"] --> H["ObservationCreated"] --> I["Siddhi"] --> J["Alert"] --> K["Doctor Dashboard"]
    D --> L["Delivery"] --> M["Linked Child"] --> N["Vaccination"]
    M --> O["Growth / Weight"]
    M --> P["Child Clinic Visit"]
    K --> Q["Longitudinal Mother + Child View"] --> R["Secure LLM Summary"] --> S["Authorization + Minimization"] --> T["LLM Gateway"] --> U["Validated Summary"] --> V["Audit"]
    G --> W["PQC / Classical Benchmark"] --> X["Performance Results"]
```

## Ownership

| Area | Primary owner |
|---|---|
| Backend / FHIR | Member 1 |
| Frontend / UX | Member 2 |
| Security / AI | Member 3 |
| Platform / PQC / Observability | Member 4 |

These diagrams are the architectural baseline for the three-month implementation. Exact FHIR profiles, service decomposition and infrastructure sizing can evolve through architecture decision records (ADRs).
