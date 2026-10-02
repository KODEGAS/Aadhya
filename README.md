# Adhya

### Maternal & Child Longitudinal Healthcare Platform

> A secure, FHIR-based, cloud-native healthcare platform for managing maternal health from pre-pregnancy through pregnancy and postpartum, and child health from birth up to five years.

---

## 📌 Overview

**Adhya** is a cloud-native maternal and child healthcare platform designed around a **longitudinal health record**.

Instead of treating every clinic visit as an isolated medical interaction, Adhya connects a mother's healthcare journey with her pregnancy and subsequently connects the pregnancy with the child's health record.

```text
                     ADHYA
                       │
             Maternal & Child Health
                       │
          ┌────────────┴────────────┐
          │                         │
     Mother Profile            Child Profile
          │                         │
    Pre-Pregnancy                Birth
          │                         │
      Pregnancy                 0–5 Years
          │                         │
     Clinic Visits          Vaccinations
     Observations           Growth Monitoring
     Medication             Clinic Visits
     Appointments            Observations
          │                   Medication
          │                         │
          └────────────┬────────────┘
                       │
              Longitudinal Record
                       │
                Doctor Dashboard
```

The platform is designed around:

* Maternal healthcare
* Pregnancy tracking
* Mother-child relationships
* Child healthcare from birth to five years
* Clinic and appointment management
* Vaccination tracking
* Growth and weight monitoring
* Medication and collection-slot management
* Doctor-patient connectivity
* Clinical data management
* Event-driven health alerts
* FHIR interoperability
* Secure API management
* Post-quantum cryptography research
* Cloud-native Kubernetes deployment
* Controlled healthcare-data access for LLM-based services

The original project specification established the technical foundation around **FHIR, WSO2 API Manager, Siddhi, Kubernetes, OpenChoreo, ML-KEM, ML-DSA, PostgreSQL, and observability**. Adhya refines the healthcare domain around maternal and early-childhood care while preserving those technical research goals.

---

## ⚡ Quick Navigation & Engineering Guides

* 🚀 **[Execution & Run Guide](docs/development/run-guide.md)** — Step-by-step developer guide for running locally (Docker Compose), deploying to Kubernetes, running validation, and setting up environments.
* 🩺 **[Mother & Child Lifecycle Domain Specification](docs/domain/mother-child-lifecycle.md)** — Comprehensive clinical domain model synthesized from Issues #4, #5, #8, #9, #10, #22, #25, #26, #27, #28, #29, #30, #31, and #32.
* ☸️ **[Kubernetes Configuration](k8s/)** — Hardened K8s manifests (`k8s/base`) and dev overlay (`k8s/overlays/dev`) with NetworkPolicies, health probes, and non-root security.
* 🏛️ **[System Architecture](docs/architecture/ARCHITECTURE.md)** — Overall system topology, FHIR mapping, and sequence diagrams.
* 🌿 **[Git & Branching Workflow](docs/development/git-workflow.md)** — Branch naming, commit conventions, and PR checklist.

---

Maternal and child healthcare requires information to remain available across multiple stages of a patient's healthcare journey.

A mother's information may span:

```text
Pre-Pregnancy
      ↓
Pregnancy
      ↓
Antenatal Clinics
      ↓
Delivery
      ↓
Postpartum Care
      ↓
Child Birth
      ↓
Child 0–5 Years
```

Important information can therefore be distributed across:

* Patient registration
* OPD records
* Pregnancy records
* Clinic visits
* Clinical observations
* Medication
* Vaccinations
* Weight measurements
* Appointments
* Follow-ups
* Doctor notes
* Alerts

Adhya aims to provide a connected digital representation of this journey.

At the same time, the platform introduces modern distributed-system requirements:

* secure healthcare APIs
* authentication and authorization
* role-based access control
* event-driven processing
* scalable microservices
* healthcare interoperability
* auditability
* observability
* cloud-native deployment
* future-resistant cryptographic research

The technical research question is therefore:

> **How can a longitudinal maternal and child healthcare platform be implemented using FHIR, event-driven architecture, Kubernetes, and post-quantum cryptography while maintaining interoperability, security, scalability, and acceptable performance?**

---

# 🎯 Aim

The main aim of Adhya is to design and implement a **secure, cloud-native, FHIR-based maternal and child healthcare platform** that maintains longitudinal health records from pre-pregnancy through pregnancy and postpartum, and from child birth through five years of age.

The platform will additionally investigate:

* event-driven healthcare monitoring
* API security
* post-quantum cryptography
* hybrid cryptographic migration
* Kubernetes scalability
* observability
* controlled use of healthcare data with LLM-based services

---

# 🧩 Core Concept

The central design principle of Adhya is:

> **Mother → Pregnancy → Delivery → Child → Longitudinal Healthcare**

A mother and child should not be represented as unrelated records.

Instead:

```text
Mother
  │
  ├── Pregnancy #1
  │      │
  │      └── Delivery
  │             │
  │             └── Child
  │
  ├── Pregnancy #2
  │      │
  │      └── Delivery
  │             │
  │             └── Child
  │
  └── Long-Term Medical History
```

This structure allows the platform to preserve healthcare history across time.

---

# 👩 Maternal Healthcare

## Pre-Pregnancy

The mother profile can contain:

* Patient information
* OPD number
* Contact information
* Medical history
* Previous pregnancies
* Previous clinic visits
* Weight history
* Clinical observations
* Medication history
* Vaccination history
* Healthcare provider information
* Relevant follow-up records

---

## Pregnancy Management

Each pregnancy should be represented as an independent longitudinal episode.

Example:

```text
Mother
 │
 └── Pregnancy
       ├── Pregnancy ID
       ├── Pregnancy Number
       ├── Estimated Due Date
       ├── Status
       ├── Clinic Visits
       ├── Observations
       ├── Weight Records
       ├── Medication
       ├── Appointments
       ├── Alerts
       └── Doctor Notes
```

Possible pregnancy states:

```text
PLANNED
   ↓
ACTIVE
   ↓
COMPLETED
   ↓
POSTPARTUM
```

---

# 🏥 Clinic Management

Adhya will support clinic-related workflows.

### Core capabilities

* Register clinic appointments
* Display upcoming clinic dates
* Track completed visits
* Track missed visits
* Provide reminders
* Associate visits with healthcare providers
* Record clinical observations
* Record follow-up requirements

Example:

```text
Pregnancy
    │
    ▼
Clinic Appointment
    │
    ├── Date
    ├── Time
    ├── Clinic
    ├── Doctor
    ├── Status
    └── Follow-up
```

---

# 💊 Medication Management

The platform can manage medication-related information throughout the maternal and child healthcare journey.

Example:

```text
Prescription
     │
     ▼
Medication
     │
     ▼
Collection / Booking Slot
     │
     ▼
Reminder
     │
     ▼
Collection Status
```

Possible collection states:

```text
AVAILABLE
BOOKED
COLLECTED
MISSED
CANCELLED
```

The system can notify users about specific medicine collection slots.

---

# 👶 Child Healthcare

The child becomes a separate patient record while maintaining a relationship with the mother and pregnancy from which the child originated.

```text
Mother
   │
   ▼
Pregnancy
   │
   ▼
Delivery
   │
   ▼
Child
   │
   ├── Birth Information
   ├── Vaccinations
   ├── Growth Records
   ├── Clinic Visits
   ├── Observations
   ├── Medication
   ├── Developmental Records
   ├── Alerts
   └── Clinical Notes
```

The initial scope covers children from:

> **Birth → 5 years**

---

# 💉 Vaccination Management

Adhya will provide vaccination tracking for children.

Each vaccination record may contain:

* Vaccine
* Dose
* Recommended date
* Actual administration date
* Status
* Healthcare provider
* Clinic
* Notes

Possible statuses:

```text
SCHEDULED
COMPLETED
MISSED
RESCHEDULED
```

Example:

```text
Child
 │
 ├── Vaccine A
 │     ├── Dose 1 ✓
 │     ├── Dose 2 ✓
 │     └── Dose 3 ○
 │
 ├── Vaccine B
 │     └── Dose 1 ✓
 │
 └── Upcoming Vaccination
       └── Reminder
```

---

# ⚖️ Growth & Weight Monitoring

Weight monitoring is one of the initial functional requirements.

The platform will maintain a chronological history:

```text
Child
 │
 └── Growth Records
       │
       ├── Date
       ├── Weight
       ├── Height
       ├── Age
       └── Notes
```

Example:

```text
Weight
 │
 ├── 3 months → 5.2 kg
 ├── 6 months → 6.7 kg
 ├── 9 months → 7.5 kg
 ├── 12 months → 8.4 kg
 └── 18 months → 9.8 kg
```

The platform can visualize historical measurements for healthcare-provider review.

> Growth visualization is intended as a monitoring and record-keeping feature, not an autonomous diagnostic system.

---

# 👨‍⚕️ Doctor & Patient Connection

Adhya will provide a healthcare-provider dashboard.

Doctors or authorized healthcare workers can:

* Search patients
* View maternal profiles
* View pregnancy records
* View child profiles
* Review longitudinal health history
* Review observations
* Review weight/growth records
* Review vaccination status
* Review appointments
* Review medication
* Create clinical notes
* Review alerts
* Schedule follow-ups

The initial implementation focuses on a **clinical dashboard and secure record access**, rather than full telemedicine functionality.

---

# 🪪 OPD Number

Each registered patient will receive an OPD number.

Example:

```text
OPD-2026-000123
```

However, the OPD number should not be the only identifier used internally.

The system should maintain:

```text
Internal Patient ID
        +
OPD Number
```

The internal identifier should remain immutable while the OPD number is treated as a healthcare-facing identifier.

---

# 🗂️ Longitudinal Patient Profile

A major feature of Adhya is the long-term patient profile.

### Mother

```text
Mother Profile
│
├── Registration
├── OPD Information
├── Personal Information
├── Pregnancy History
├── Current Pregnancy
├── Clinic Visits
├── Observations
├── Weight History
├── Medication
├── Appointments
├── Alerts
├── Doctor Notes
└── Audit History
```

### Child

```text
Child Profile
│
├── Birth Information
├── Parent Relationship
├── Vaccinations
├── Growth Records
├── Clinic Visits
├── Observations
├── Medication
├── Developmental Records
├── Appointments
├── Alerts
└── Clinical Notes
```

---

# 🧬 FHIR Architecture

Healthcare data will be represented using **HL7 FHIR** rather than a completely proprietary healthcare schema.

The original project specification identifies FHIR as a core interoperability requirement and includes resources such as Patient, Practitioner, Observation, and Appointment.

Adhya extends this model around maternal and child healthcare.

### Proposed mapping

| Adhya Domain           | FHIR Resource                                                 |
| ---------------------- | ------------------------------------------------------------- |
| Mother                 | `Patient`                                                     |
| Child                  | `Patient`                                                     |
| Doctor                 | `Practitioner`                                                |
| Doctor relationship    | `CareTeam` / `PractitionerRole`                               |
| Pregnancy              | `Condition` / `EpisodeOfCare`                                 |
| Clinic Visit           | `Encounter`                                                   |
| Clinical Measurement   | `Observation`                                                 |
| Medication             | `MedicationRequest`                                           |
| Vaccination            | `Immunization`                                                |
| Appointment            | `Appointment`                                                 |
| Clinical Documentation | `DocumentReference` / appropriate clinical resource           |
| Alert                  | `Communication` / `DetectedIssue` depending on implementation |

> Exact FHIR mappings will be finalized during the FHIR domain-model design stage.

---

# 🏗️ System Architecture

```text
┌───────────────────────────────────────────────────────────────┐
│                         Client Layer                          │
│                                                               │
│              Next.js Web Application                         │
│                                                               │
│     Parent / Patient Portal     Doctor Dashboard              │
└───────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────┐
│                       API Gateway                              │
│                                                               │
│                    WSO2 API Manager                            │
│                                                               │
│ OAuth2/OIDC │ RBAC │ Rate Limiting │ Policies │ Monitoring    │
└───────────────────────────────┬───────────────────────────────┘
                                │
             ┌──────────────────┼──────────────────┐
             ▼                  ▼                  ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Registration     │  │ Maternal Care    │  │ Child Health     │
│ Service          │  │ Service          │  │ Service          │
└──────────────────┘  └──────────────────┘  └──────────────────┘
             │                  │                  │
             └──────────────────┼──────────────────┘
                                ▼
                    ┌──────────────────────┐
                    │ FHIR Clinical Data   │
                    │ Service              │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     PostgreSQL       │
                    └──────────┬───────────┘
                               │
                               │ Healthcare Events
                               ▼
                    ┌──────────────────────┐
                    │       Siddhi         │
                    │ Event Processing      │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴───────────┐
                    ▼                      ▼
             ┌──────────────┐       ┌──────────────┐
             │ Alert Service│       │ Notification │
             └──────────────┘       │ Service      │
                                    └──────────────┘

              ┌──────────────────────────────────┐
              │       AI / LLM Gateway           │
              │                                  │
              │ Authorization                    │
              │ Data Filtering                   │
              │ De-identification                │
              │ Context Construction             │
              │ Prompt Security                  │
              │ Audit                            │
              └──────────────────────────────────┘

              ┌──────────────────────────────────┐
              │       Security Layer             │
              │                                  │
              │ OAuth2 / OIDC                    │
              │ RBAC                             │
              │ TLS                              │
              │ ML-KEM                           │
              │ ML-DSA                           │
              │ Hybrid Cryptography              │
              └──────────────────────────────────┘

              ┌──────────────────────────────────┐
              │       Platform Layer             │
              │                                  │
              │ Kubernetes                       │
              │ OpenChoreo                       │
              │ OpenTelemetry                    │
              │ Prometheus                       │
              │ Grafana                          │
              └──────────────────────────────────┘
```

---

# 🔄 Longitudinal Healthcare Flow

A central workflow is:

```text
Patient Registration
        ↓
OPD Number Assignment
        ↓
Mother Profile
        ↓
Pregnancy Registration
        ↓
Pregnancy Timeline
        ↓
Clinic Visits
        ↓
Observations
        ↓
Medication
        ↓
Appointments / Reminders
        ↓
Delivery
        ↓
Child Registration
        ↓
Child Health Record
        ↓
Vaccinations
        ↓
Growth Monitoring
        ↓
Clinic Visits
        ↓
Observations
        ↓
Medication
        ↓
Child Age 5
```

---

# ⚡ Event-Driven Healthcare Monitoring

Healthcare observations can generate events.

Example:

```text
Clinical Observation
        ↓
Healthcare Event
        ↓
Siddhi
        ↓
Pattern Detection
        ↓
Alert
        ↓
Doctor Dashboard / Notification
```

For example, a predefined rule could detect repeated abnormal observations within a configured time window.

```text
Observation 1
      ↓
Observation 2
      ↓
Observation 3
      ↓
   Siddhi
      ↓
Pattern Detected
      ↓
Alert Created
```

The original project specification proposed Siddhi specifically for detecting patterns such as repeated abnormal observations within a time window.

---

# 🚨 Alert System

The alert service consumes detected healthcare events.

Example:

```json
{
  "patientId": "patient-123",
  "type": "ObservationPattern",
  "title": "Repeated Observation Pattern Detected",
  "severity": "HIGH",
  "detectedAt": "2026-09-24T12:30:00Z",
  "status": "OPEN"
}
```

Alerts may be associated with:

* Mother
* Pregnancy
* Child
* Observation
* Appointment
* Vaccination
* Medication
* Follow-up

The system should distinguish between:

```text
System Alert
Clinical Review Required
Reminder
Appointment Notification
Vaccination Reminder
Medication Notification
```

---

# 🤖 Health Data & LLM API

Adhya may include an **LLM gateway** for controlled interaction with healthcare information.

The LLM should not directly access the entire healthcare database.

Instead:

```text
FHIR / Clinical Records
          ↓
Authorization
          ↓
Data Filtering
          ↓
De-identification / Minimization
          ↓
Context Builder
          ↓
LLM Gateway
          ↓
LLM API
          ↓
Controlled Response
```

Possible use cases include:

* Doctor-facing patient summaries
* Summarizing longitudinal records
* Explaining non-diagnostic healthcare information
* Summarizing appointment history
* Preparing structured information for healthcare workers

### Important Principle

> **The LLM is an information-support component, not an autonomous clinical decision-maker.**

The system should not allow an LLM to independently:

* diagnose patients
* prescribe medication
* modify medical records
* determine treatment
* override healthcare professionals

---

# 🔐 LLM Security

Because healthcare data is highly sensitive, the LLM gateway will be treated as a security boundary.

Potential security concerns include:

* Excessive data exposure
* Unauthorized patient-context access
* Prompt injection
* Sensitive information leakage
* Cross-patient context contamination
* Insecure tool access
* Insufficient audit logging
* Unauthorized model access
* Improper data retention

A secure architecture should therefore enforce:

```text
User
 ↓
Authentication
 ↓
Authorization
 ↓
Patient Context Validation
 ↓
Minimum Required Data
 ↓
LLM Gateway
 ↓
Prompt Security
 ↓
LLM API
 ↓
Response Validation
 ↓
Audit
```

---

# 🔐 Security Architecture

Security will be implemented as a multi-layer architecture.

```text
                    Security
                       │
       ┌───────────────┼────────────────┐
       │               │                │
       ▼               ▼                ▼
   Identity        API Security       Data
       │               │                │
 OAuth2/OIDC       WSO2 APIM       PostgreSQL
 RBAC              Rate Limits      Encryption
       │            Policies
       │
       ▼
   PQC Security
       │
   ┌───┴────┐
   │        │
 ML-KEM   ML-DSA
```

Security requirements include:

* Authentication
* Authorization
* RBAC
* API gateway policies
* Rate limiting
* TLS
* Secure secrets
* Audit logging
* Network isolation
* Secure service communication
* Cryptographic experimentation

---

# 🧬 Post-Quantum Cryptography

PQC remains one of the major research components of Adhya.

The project will investigate:

### ML-KEM

Used for key establishment.

```text
Client
   │
   │ ML-KEM
   ▼
Server
   │
   ▼
Shared Secret
```

### ML-DSA

Used for digital signatures.

```text
Healthcare Event
       ↓
   ML-DSA Sign
       ↓
 Signed Event
       ↓
Verification
```

The purpose is not simply to add a cryptographic library.

The project will investigate the architectural and performance implications of integrating PQC into a distributed healthcare platform.

---

# 🔀 Hybrid Cryptography

Adhya will investigate three configurations:

```text
┌─────────────────────┐
│ Classical            │
│ Cryptography         │
└─────────────────────┘

          VS

┌─────────────────────┐
│ Post-Quantum         │
│ Cryptography         │
└─────────────────────┘

          VS

┌─────────────────────┐
│ Hybrid               │
│ Classical + PQC     │
└─────────────────────┘
```

The project will measure the trade-offs rather than assuming that one configuration is universally optimal.

---

# 📊 PQC Performance Benchmarking

The platform will provide controlled experiments comparing cryptographic approaches.

| Metric           | Classical |     PQC |  Hybrid |
| ---------------- | --------: | ------: | ------: |
| Key Generation   |   Measure | Measure | Measure |
| Signing          |   Measure | Measure | Measure |
| Verification     |   Measure | Measure | Measure |
| Key Size         |   Measure | Measure | Measure |
| Signature Size   |   Measure | Measure | Measure |
| Ciphertext Size  |   Measure | Measure | Measure |
| Request Latency  |   Measure | Measure | Measure |
| CPU Usage        |   Measure | Measure | Measure |
| Memory Usage     |   Measure | Measure | Measure |
| Network Overhead |   Measure | Measure | Measure |

Experiments should be conducted under controlled conditions.

Kubernetes resource limits can additionally be used to investigate cryptographic overhead under constrained CPU and memory conditions.

---

# 🧾 Audit Logging

Healthcare systems require traceability of sensitive operations.

Adhya will maintain audit events such as:

```text
Doctor01
   │
   ├── READ Patient/123
   │
   ├── CREATE Observation/456
   │
   ├── UPDATE Observation/456
   │
   └── READ Vaccination/789
```

Example audit record:

```json
{
  "actor": "doctor-001",
  "action": "READ",
  "resourceType": "Patient",
  "resourceId": "patient-123",
  "timestamp": "2026-09-25T10:30:00Z",
  "ip": "internal",
  "result": "SUCCESS"
}
```

Audit records should be treated as security-sensitive information.

---

# ☸️ Kubernetes Architecture

Adhya will be containerized and deployed using Kubernetes.

Possible workloads include:

```text
adhya-frontend
adhya-registration
adhya-maternal
adhya-child
adhya-fhir
adhya-appointment
adhya-medication
adhya-vaccination
adhya-observation
adhya-alert
adhya-notification
adhya-llm-gateway
adhya-siddhi
adhya-postgres
```

Kubernetes will provide:

* Service discovery
* Workload scheduling
* Self-healing
* Rolling deployments
* Horizontal scaling
* Configuration management
* Secret management
* Network isolation
* Health checks
* Resource limits

---

# ☁️ OpenChoreo

OpenChoreo will be investigated as the cloud-native developer platform.

Proposed workflow:

```text
Developer
    ↓
Git Repository
    ↓
OpenChoreo
    ↓
Build
    ↓
Container Image
    ↓
Deployment
    ↓
Kubernetes
    ↓
Running Service
```

This provides an opportunity to investigate:

* Platform engineering
* Developer workflows
* Service deployment
* Environment management
* Kubernetes abstraction
* Cloud-native application lifecycle

---

# 📡 Observability

The platform will expose:

### Metrics

* Request latency
* Request count
* Error rate
* CPU usage
* Memory usage
* Pod health
* Event-processing latency
* Cryptographic operation time

### Logs

* Application logs
* Security events
* Audit events
* Event-processing logs
* API gateway logs

### Traces

Distributed traces can follow requests through:

```text
Frontend
   ↓
WSO2
   ↓
Maternal Service
   ↓
FHIR Service
   ↓
PostgreSQL
```

Technology candidates:

* OpenTelemetry
* Prometheus
* Grafana

---

# 🧱 Microservice Boundaries

The initial service structure can be:

```text
                    API Gateway
                        │
       ┌────────────────┼────────────────┐
       │                │                │
       ▼                ▼                ▼
 Registration      Maternal Care     Child Health
 Service            Service           Service
       │                │                │
       └────────────────┼────────────────┘
                        ▼
                 FHIR Data Service
                        │
                        ▼
                   PostgreSQL
```

Supporting services:

```text
Appointment Service
Medication Service
Vaccination Service
Observation Service
Alert Service
Notification Service
Audit Service
LLM Gateway
```

Service boundaries may be adjusted during implementation based on complexity and deployment requirements.

---

# 🗃️ Domain Model

The initial domain model includes:

```text
User
 │
 └── Patient
       │
       ├── MotherProfile
       │      │
       │      ├── Pregnancy
       │      │      ├── PregnancyVisit
       │      │      ├── Observation
       │      │      ├── Medication
       │      │      ├── Appointment
       │      │      └── Alert
       │      │
       │      └── Delivery
       │             │
       │             └── Child
       │
       └── ChildProfile
              ├── Vaccination
              ├── GrowthRecord
              ├── ClinicVisit
              ├── Observation
              ├── Medication
              ├── Appointment
              └── Alert
```

Additional entities:

* Doctor
* Practitioner
* CareTeam
* ClinicalNote
* Prescription
* Notification
* AuditEvent

---

# 🛠️ Technology Stack

| Layer               | Technology                           |
| ------------------- | ------------------------------------ |
| Frontend            | Next.js / TypeScript                 |
| Backend             | Go                                   |
| API                 | REST / FHIR                          |
| Healthcare Standard | HL7 FHIR                             |
| Database            | PostgreSQL                           |
| API Management      | WSO2 API Manager                     |
| Identity            | OAuth2 / OpenID Connect              |
| Event Processing    | Siddhi                               |
| Cryptography        | ML-KEM / ML-DSA                      |
| Containers          | Docker                               |
| Orchestration       | Kubernetes                           |
| Developer Platform  | OpenChoreo                           |
| Observability       | OpenTelemetry / Prometheus / Grafana |
| Source Control      | Git / GitHub                         |
| CI/CD               | GitHub Actions / OpenChoreo          |

The exact components may be adjusted during implementation based on compatibility and experimental findings.

---

# 📁 Proposed Repository Structure

```text
adhya/
│
├── apps/
│   ├── web/
│   │   └── nextjs/
│   │
│   └── doctor-dashboard/
│
├── services/
│   ├── registration/
│   ├── maternal/
│   ├── child/
│   ├── fhir/
│   ├── observation/
│   ├── appointment/
│   ├── medication/
│   ├── vaccination/
│   ├── alert/
│   ├── notification/
│   ├── audit/
│   └── llm-gateway/
│
├── event-processing/
│   └── siddhi/
│
├── crypto/
│   ├── ml-kem/
│   ├── ml-dsa/
│   ├── classical/
│   └── hybrid/
│
├── infrastructure/
│   ├── docker/
│   ├── kubernetes/
│   ├── openchoreo/
│   ├── postgres/
│   └── wso2/
│
├── observability/
│   ├── otel/
│   ├── prometheus/
│   └── grafana/
│
├── benchmarks/
│   ├── classical/
│   ├── pqc/
│   └── hybrid/
│
├── docs/
│   ├── architecture/
│   ├── fhir/
│   ├── security/
│   ├── pqc/
│   ├── api/
│   └── research/
│
├── scripts/
│
├── tests/
│
├── docker-compose.yml
├── Makefile
├── README.md
└── LICENSE
```

---

# 🔄 Core Application Workflows

## Mother Registration

```text
Registration
     ↓
Create Patient
     ↓
Generate OPD Number
     ↓
Create Mother Profile
     ↓
Store FHIR Patient
     ↓
Audit Event
```

---

## Pregnancy Registration

```text
Mother
  ↓
Create Pregnancy
  ↓
Generate Pregnancy ID
  ↓
Set EDD
  ↓
Create Pregnancy Timeline
  ↓
Schedule Clinic
```

---

## Clinic Visit

```text
Appointment
    ↓
Patient Arrives
    ↓
Create Encounter
    ↓
Record Observations
    ↓
Update Pregnancy / Child Record
    ↓
Clinical Note
    ↓
Follow-up
    ↓
Audit
```

---

## Child Registration

```text
Delivery
   ↓
Create Child Patient
   ↓
Link Child → Mother
   ↓
Link Child → Pregnancy
   ↓
Create Birth Record
   ↓
Initialize Vaccination Schedule
   ↓
Initialize Growth Monitoring
```

---

## Vaccination

```text
Vaccination Schedule
        ↓
Upcoming Vaccine
        ↓
Reminder
        ↓
Clinic Visit
        ↓
Vaccination Administered
        ↓
FHIR Immunization
        ↓
Audit
```

---

## Growth Monitoring

```text
Child
 ↓
Clinic Visit
 ↓
Weight / Height
 ↓
Growth Record
 ↓
Store Observation
 ↓
Update Growth Timeline
 ↓
Healthcare Provider Review
```

---

# 🔒 Security Requirements

## Identity

* OAuth2
* OpenID Connect
* Secure sessions/tokens
* Role-based access

## Authorization

Example roles:

```text
PATIENT
DOCTOR
NURSE
ADMIN
SYSTEM
```

Authorization must be enforced at the API/service level rather than relying only on frontend restrictions.

---

## API Security

WSO2 API Manager will provide:

* Authentication integration
* Authorization policies
* Rate limiting
* API versioning
* API monitoring
* Controlled API exposure

---

## Data Security

The platform should protect:

* Patient identities
* OPD numbers
* Medical observations
* Pregnancy records
* Child records
* Vaccination records
* Medication information
* Clinical notes
* Audit information
* LLM context

---

# 📋 Non-Functional Requirements

## Security

* Authenticated access
* RBAC
* Secure APIs
* Audit logging
* Secure secrets
* PQC experimentation

## Scalability

Stateless services should support horizontal scaling.

## Availability

Kubernetes should automatically restart failed workloads.

## Observability

The system should expose:

* Metrics
* Logs
* Traces
* Health information

## Maintainability

Services should have clear boundaries and independently deployable components.

## Interoperability

Healthcare data should use FHIR representations instead of relying exclusively on proprietary schemas.

---

# 🧪 Testing Strategy

Testing will be performed at multiple levels.

## Unit Tests

Each service should test:

* Domain logic
* Validation
* FHIR transformations
* Authorization rules
* Event-processing logic

## Integration Tests

Test interactions between:

```text
API Gateway
     ↓
Services
     ↓
PostgreSQL
     ↓
Event Processing
```

## API Security Tests

Test:

* Authentication bypass
* Broken authorization
* BOLA/IDOR
* Rate-limit bypass
* Token validation
* Improper resource access
* Excessive data exposure
* API injection

## LLM Security Tests

Test:

* Prompt injection
* Context leakage
* Cross-patient access
* Unauthorized data retrieval
* Sensitive information exposure
* Tool authorization

## PQC Tests

Measure:

* Correctness
* Key generation
* Encapsulation/decapsulation
* Signing
* Verification
* Failure handling
* Hybrid operation

---

# 📈 Performance Evaluation

The research component will compare:

```text
Classical
    │
    ├── Latency
    ├── CPU
    ├── Memory
    └── Network
         │
         ▼
PQC
    │
    ├── Latency
    ├── CPU
    ├── Memory
    └── Network
         │
         ▼
Hybrid
    │
    ├── Latency
    ├── CPU
    ├── Memory
    └── Network
```

Experiments should be repeatable and performed under controlled configurations.

Potential experiment dimensions:

* Local vs Kubernetes
* Different CPU limits
* Different memory limits
* Different request rates
* Different payload sizes
* Different cryptographic configurations

---

# 🔬 Research Questions

### RQ1

How can post-quantum cryptography be integrated into a FHIR-based maternal and child healthcare API architecture?

### RQ2

What performance overhead is introduced by post-quantum cryptographic mechanisms compared with conventional cryptography?

### RQ3

How does PQC affect API latency, resource consumption, and network overhead in a containerized environment?

### RQ4

How can hybrid cryptographic approaches support migration from conventional cryptography toward post-quantum cryptography?

### RQ5

How can Kubernetes support scalable deployment of security-sensitive healthcare microservices?

### RQ6

How can event-processing technology be used to detect meaningful patterns in maternal and child healthcare observations?

### RQ7

How can healthcare data be exposed to LLM-based services while minimizing unnecessary data exposure and maintaining authorization and auditability?

---

# 🗺️ Development Roadmap

## Phase 1 — Requirements & Architecture

* Finalize maternal and child healthcare scope
* Define user roles
* Define domain entities
* Design mother-pregnancy-child relationship
* Study FHIR mappings
* Design service boundaries
* Design security architecture
* Design database model

---

## Phase 2 — Core Healthcare Platform

* Implement Go backend
* Implement PostgreSQL
* Implement patient registration
* Implement OPD generation
* Implement mother profile
* Implement pregnancy management
* Implement child registration
* Implement longitudinal timeline

---

## Phase 3 — Clinical Modules

* Implement clinic appointments
* Implement observations
* Implement weight monitoring
* Implement vaccination management
* Implement medication management
* Implement medicine collection slots
* Implement doctor notes

---

## Phase 4 — FHIR

* Implement FHIR Patient
* Implement Practitioner
* Implement Observation
* Implement Appointment
* Implement Encounter
* Implement Immunization
* Implement MedicationRequest
* Implement appropriate pregnancy representation
* Implement FHIR validation

---

## Phase 5 — Identity & API Security

* Integrate OAuth2/OIDC
* Implement RBAC
* Integrate WSO2 API Manager
* Implement API policies
* Implement rate limiting
* Implement audit logging
* Implement authorization testing

---

## Phase 6 — Event Processing

* Define healthcare events
* Integrate Siddhi
* Implement pattern detection
* Implement alert service
* Implement notifications
* Implement appointment reminders
* Implement vaccination reminders

---

## Phase 7 — PQC

* Implement cryptographic benchmark environment
* Integrate ML-KEM
* Integrate ML-DSA
* Implement classical baseline
* Implement hybrid configuration
* Measure performance
* Analyze results

---

## Phase 8 — LLM Gateway

* Design healthcare-data access boundary
* Implement authorization
* Implement context filtering
* Implement data minimization
* Implement de-identification where applicable
* Implement prompt security
* Implement response validation
* Implement LLM audit logging

---

## Phase 9 — Kubernetes

* Containerize services
* Create Kubernetes Deployments
* Create Services
* Configure Secrets
* Configure ConfigMaps
* Configure Ingress
* Configure health checks
* Configure resource limits
* Configure HPA
* Configure NetworkPolicies

---

## Phase 10 — OpenChoreo & Observability

* Configure OpenChoreo
* Configure deployment workflows
* Integrate OpenTelemetry
* Configure Prometheus
* Configure Grafana
* Add distributed tracing
* Monitor service health
* Monitor cryptographic overhead

---

## Phase 11 — Evaluation

Evaluate:

* Functional correctness
* API security
* FHIR interoperability
* Event processing
* Kubernetes scalability
* Observability
* PQC performance
* Hybrid cryptography
* LLM security boundary

---

# 🚀 Getting Started

## Prerequisites

Recommended development environment:

```text
Go
Node.js
npm / pnpm
Docker
Docker Compose
PostgreSQL
Kubernetes
kubectl
Git
```

Optional platform tooling:

```text
WSO2 API Manager
Siddhi
OpenChoreo
Prometheus
Grafana
OpenTelemetry
```

---

# ⚙️ Local Development

Clone the repository:

```bash
git clone <repository-url>
cd adhya
```

Start infrastructure:

```bash
docker compose up -d
```

Check running services:

```bash
docker compose ps
```

Run backend services:

```bash
make dev
```

Run the frontend:

```bash
cd apps/web
npm install
npm run dev
```

The exact commands may change as implementation progresses.

---

# 🐳 Container Architecture

Each independently deployable component can have its own container image.

Example:

```text
adhya/frontend
adhya/registration
adhya/maternal
adhya/child
adhya/fhir
adhya/appointment
adhya/medication
adhya/vaccination
adhya/observation
adhya/alert
adhya/notification
adhya/llm-gateway
```

---

# ☸️ Kubernetes Deployment

Example:

```bash
kubectl apply -f infrastructure/kubernetes/
```

Check workloads:

```bash
kubectl get pods
```

Check services:

```bash
kubectl get services
```

Check deployments:

```bash
kubectl get deployments
```

---

# 📊 Observability

Expected monitoring architecture:

```text
Application
    │
    ▼
OpenTelemetry
    │
    ├──────────► Metrics
    │
    ├──────────► Logs
    │
    └──────────► Traces
                    │
                    ▼
              Observability
                    │
             ┌──────┴──────┐
             ▼             ▼
        Prometheus       Grafana
```

---

# 🧪 Synthetic Data

Adhya is intended for software engineering and research experimentation.

Development and benchmarking should use **synthetic healthcare data**.

Example:

```text
Mother:
OPD-2026-000001

Pregnancy:
PREG-2026-000001

Child:
CHILD-2026-000001

Observation:
OBS-2026-000001
```

No real patient data should be introduced into the development environment.

---

# ⚠️ Scope & Limitations

## Included

* Maternal healthcare records
* Pregnancy records
* Child healthcare records
* Birth information
* Clinic management
* Appointment reminders
* Medication management
* Medicine collection slots
* Vaccination tracking
* Growth/weight monitoring
* Clinical observations
* Doctor dashboard
* FHIR resources
* API management
* Authentication and authorization
* Event processing
* Alerts
* PQC experimentation
* Hybrid cryptography
* Kubernetes
* OpenChoreo
* Observability
* LLM healthcare-data gateway
* Cryptographic benchmarking

## Not Included

The project does **not** aim to build:

* A complete hospital information system
* A production replacement for certified healthcare infrastructure
* An autonomous medical diagnosis system
* Autonomous treatment recommendations
* Autonomous prescription generation
* A complete telemedicine platform
* A replacement for healthcare professionals
* A system using real patient data during development
* A claim of complete quantum security

The original project specification explicitly positioned the platform as a working prototype and experimental platform rather than a complete certified healthcare infrastructure.

---

# 🔒 Security Principles

Adhya follows several core security principles:

### Least Privilege

Users should only access the healthcare information required for their role.

### Defense in Depth

Security should not depend on a single mechanism.

```text
Identity
   +
Authorization
   +
API Security
   +
Network Security
   +
Data Security
   +
Audit
   +
PQC Research
```

### Data Minimization

Only the healthcare information necessary for a particular operation should be provided to downstream services, especially LLM services.

### Secure by Design

Security requirements should be considered during architecture and domain design rather than added after implementation.

### Auditability

Sensitive healthcare operations should produce auditable events.

---

# 🧠 Project Architecture in One View

```text
                         ┌──────────────────────┐
                         │      Next.js UI      │
                         │                      │
                         │ Parent / Patient UI  │
                         │ Doctor Dashboard     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    WSO2 API Manager  │
                         │                      │
                         │ OAuth2/OIDC          │
                         │ RBAC                 │
                         │ Rate Limiting        │
                         │ API Policies         │
                         └──────────┬───────────┘
                                    │
               ┌────────────────────┼────────────────────┐
               │                    │                    │
               ▼                    ▼                    ▼
       Registration          Maternal Care         Child Health
          Service              Service               Service
               │                    │                    │
               └────────────────────┼────────────────────┘
                                    │
                                    ▼
                           ┌──────────────────┐
                           │   FHIR Service   │
                           └────────┬─────────┘
                                    │
                                    ▼
                           ┌──────────────────┐
                           │   PostgreSQL     │
                           └────────┬─────────┘
                                    │
                          Healthcare Events
                                    │
                                    ▼
                           ┌──────────────────┐
                           │      Siddhi      │
                           └────────┬─────────┘
                                    │
                         ┌──────────┴──────────┐
                         ▼                     ▼
                    Alert Service       Notification
                         │
                         ▼
                  Doctor Dashboard


             ┌─────────────────────────────┐
             │       LLM Gateway           │
             │                             │
             │ Auth → Filter → Minimize    │
             │ → Context → LLM → Audit     │
             └─────────────────────────────┘


             ┌─────────────────────────────┐
             │      PQC Security Layer     │
             │                             │
             │ ML-KEM                      │
             │ ML-DSA                      │
             │ Classical + PQC Hybrid      │
             └─────────────────────────────┘


             ┌─────────────────────────────┐
             │      Platform Layer         │
             │                             │
             │ Kubernetes                  │
             │ OpenChoreo                  │
             │ OpenTelemetry               │
             │ Prometheus                  │
             │ Grafana                     │
             └─────────────────────────────┘
```

---

# 📚 Project Significance

Adhya combines several areas of modern software engineering:

```text
                 Maternal & Child Healthcare
                            +
                         FHIR
                            +
                     Cybersecurity
                            +
                 Post-Quantum Cryptography
                            +
                   Cloud-Native Systems
                            +
                       Kubernetes
                            +
                    API Management
                            +
                  Event Processing
                            +
                     LLM Security
                            +
                   Platform Engineering
```

The result is intended to function as both:

1. A practical full-stack healthcare software engineering project.
2. An experimental platform for researching security and post-quantum cryptography in distributed healthcare systems.

---

# 📌 Expected Outcomes

The final system should provide:

1. Maternal healthcare management.
2. Pregnancy lifecycle management.
3. Child healthcare management from birth to five years.
4. OPD number assignment.
5. Longitudinal patient profiles.
6. Clinic and appointment management.
7. Medication and collection-slot management.
8. Vaccination tracking.
9. Growth and weight monitoring.
10. Clinical observation management.
11. Doctor dashboard.
12. FHIR-based healthcare data.
13. Secure API management.
14. OAuth2/OIDC authentication.
15. Role-based authorization.
16. Event-driven healthcare monitoring.
17. Automated alerts and reminders.
18. Audit logging.
19. Kubernetes deployment.
20. OpenChoreo-based cloud-native workflow.
21. ML-KEM integration research.
22. ML-DSA integration research.
23. Classical/PQC/Hybrid benchmarking.
24. Observability through metrics, logs, and traces.
25. Controlled healthcare-data access for LLM services.
26. Security evaluation of the LLM gateway.

---

# 🔬 Research Focus

The project should ultimately answer a broader engineering question:

> **What does it take to build a secure, interoperable, event-driven, cloud-native healthcare platform while preparing its cryptographic infrastructure for the post-quantum era?**

Adhya provides a concrete healthcare domain in which these technologies can be implemented, measured, and evaluated together.

---

# 📜 Disclaimer

Adhya is an academic and research-oriented prototype.

It is not intended to:

* provide medical diagnosis;
* replace healthcare professionals;
* make autonomous clinical decisions;
* prescribe treatment;
* replace certified healthcare infrastructure; or
* process real patient information during development.

All development and experimentation should use synthetic healthcare data.

---

# 🤝 Contributing

Contributions should maintain the project's core principles:

* Security first
* Privacy by design
* FHIR interoperability
* Clear service boundaries
* Testable components
* Observable services
* Least-privilege access
* Synthetic data for development
* Reproducible experiments

---

# 📄 License

License information will be added when the project license is finalized.

---

# 👨‍💻 Project Status

**Status:** 🚧 Research & Development

Current focus:

```text
Requirements
      ↓
Domain Modeling
      ↓
FHIR Architecture
      ↓
Service Design
      ↓
Core Implementation
      ↓
Security
      ↓
Event Processing
      ↓
PQC
      ↓
LLM Security
      ↓
Kubernetes
      ↓
Performance Evaluation
```

---

## Adhya

> **One longitudinal record. From mother to child. From pregnancy to early childhood. Secured for the future.**
