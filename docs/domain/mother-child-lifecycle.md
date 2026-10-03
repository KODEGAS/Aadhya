# Mother & Child Longitudinal Domain Model & Clinical Lifecycles

## 1. Executive Summary & Clinical Journey

Adhya models the continuous, longitudinal healthcare journey of maternal and pediatric patients within the Sri Lankan / public healthcare clinic context (MOH / Clinic / Midwife / VOG / Pediatrician).

The core lifecycle consists of four interconnected domain aggregates:

```mermaid
flowchart LR
    NMS["1. Newly Married Session & Preconception"] --> FP["2. Family Planning or Prep"]
    FP --> PREG["3. Pregnancy Lifecycle (~40 weeks)"]
    PREG --> DELIV["4. Delivery & Birth Linkage"]
    DELIV --> CHILD["5. Pediatric Care (0–5 Years)"]
    DELIV --> POSTPARTUM["6. Postpartum Maternal Care"]
```

### 1.1 Clinical Provenance & Rule Classification Taxonomy

Clinical rules, alert thresholds, visit schedules, and data-mapping conventions in this document are categorized into four distinct provenance classes:

| Class | Tag | Definition | Authoritative Source / Scope |
|---|---|---|---|
| **Clinical Reference** | `[CR]` | Evidence-based medical guidelines, diagnostic criteria, and clinical trial consensus. | WHO Guidelines, FIGO, NICE, ISSHP, ISUOG standards. |
| **Local Policy** | `[LP]` | Public health administrative protocols, national immunization schedules, and clinic operational models. | Sri Lanka Ministry of Health / Family Health Bureau (FHB), Epidemiology Unit National Immunization Programme (2021). |
| **Implementation Rule** | `[IR]` | Software-specific parameters, notification grace periods, alert debouncing, and temporal window heuristics. | Adhya platform engineering requirements and workflow tolerances. |
| **Research / Demo Assumption** | `[RA]` | Synthetic thresholds, test values, or simplified heuristics used strictly for prototypes and development testing. | Experimental setups, local Siddhi demo rules (subject to clinical validation). |

---

## 2. Phase 1: Newly Married Session & Screening (Issue #28)

### 2.1 Couple Registration & Midwife Contact
* **Trigger:** Newly married couple meets Public Health Midwife (PHM) / Medical Officer of Health (MOH) clinic (`[LP]` Sri Lanka FHB Preconception Care Package).
* **Identifier:** Maternal/Couple Operational ID + link to Primary Mother `Patient` record.
* **Initial Disease Screening Checklist (`[LP]` FHB Newly Married Package; `[CR]` WHO Preconception Care Guidelines):**
  * **Blood Hb:** Result (g/dL), timestamp, healthcare provider.
  * **Rubella:** Immunization/titer status (Immune, Non-Immune, Pending).
  * **Thalassemia:** Carrier screening (Negative, Beta-Thal Trait, Alpha-Thal Trait, Confirmed).
  * **Diabetes:** Fasting Blood Sugar (FBS) or Random Blood Sugar (RBS) (mg/dL or mmol/L).
* **Clinical Health Advice:** Lifestyle, nutritional counseling, and recorded localized clinical guidance.

### 2.2 Family Planning Decision Gateway
A critical branch point after screening:
```mermaid
flowchart TD
    Screening["Complete Preconception Screening"] --> Gateway{"Ask for Plan: Pregnancy Intended?"}
    Gateway -->|NO| FamilyPlan["Family Planning Module"]
    Gateway -->|YES| Prep["Pregnancy Preparation Module"]

    FamilyPlan --> FP_Method["Record Method (Oral, Injectable, IUD, Barrier, Implant)"]
    FamilyPlan --> FP_Notes["Record Clinical Notes & Localized Instructions"]
    FamilyPlan --> FP_FollowUp["Schedule Follow-up Consultation"]

    Prep --> FolicAcid["Folic Acid Protocol (3 Months Prior)"]
    Prep --> RubellaProt["Rubella Protocol (3 Month Schedule)"]
    Prep --> PreBlood["Pre-pregnancy Blood Panels"]
    Prep --> NotifyPHM["Notify Assigned Area Midwife"]
```

---

## 3. Phase 2: Pregnancy Preparation Protocols (Issue #28)

1. **Folic Acid Protocol (`[CR]` WHO Guideline: Optimal serum and RBC folate concentrations 2016; `[LP]` FHB Maternal Care Package):**
   * Prescription: Daily 400mcg (standard risk) or 5mg (high risk / prior NTD) folic acid at least 3 months prior to planned conception.
   * Tracking: Start date, target end date, daily compliance status, reminder cadence (`[IR]`).
2. **Rubella Protocol (`[CR]` WHO Rubella Position Paper; `[LP]` Sri Lanka National Immunization Protocol):**
   * Screening titration check; if non-immune, vaccinate with live-attenuated MMR/Rubella vaccine.
   * Protocol Constraint: Avoid conception for 3 months post-vaccination.
3. **Midwife Notification Event (`[LP]` Sri Lanka PHM Field Practice):**
   * State Machine: `PENDING` → `NOTIFIED` → `ACKNOWLEDGED` → `ACTIVE_SUPPORT` (`[IR]`).

---

## 4. Phase 3: Active Pregnancy Lifecycle (Issues #5, #28, #29, #30, #31, #32)

### 4.1 Registration & Dating
* **Confirmation Milestone:** Confirmation of pregnancy via UPT / ultrasound (~6-8 weeks) (`[CR]` WHO Antenatal Care Guidelines).
* **Estimated Date of Delivery (EDD):** Calculated via Naegele's rule from Last Menstrual Period (LMP) and adjusted by Dating Ultrasound scan (`[CR]` ACOG Committee Opinion No. 700).
* **Gestational Age (GA):** Calculated continuously in weeks + days:
  $$\text{GA (weeks)} = \frac{\text{Current Date} - \text{LMP}}{7}$$

### 4.2 Clinical Milestones & Assessments
* **First VOG Assessment (Clinical 1 Full Check) (`[LP]` Sri Lanka FHB Antenatal Routine Protocol):**
  * Target: First trimester (8–12 weeks).
  * Assessment: Obstetric risk score, pelvic exam, baseline vitals, initial ultrasound, high-risk flags.

### 4.3 Longitudinal Pregnancy Observations & Vitals
| Clinical Vital / Measurement | Normal Range / Schedule | Clinical Alert Trigger | Event / Siddhi Pattern | Provenance & Authoritative Source |
|---|---|---|---|---|
| **Hemoglobin (Hb)** | $11.0 - 14.0\text{ g/dL}$ | **$\text{Hb} < 7.0\text{ g/dL}$ (Severe Anemia)** | High-priority clinical alert to VOG/PHM | `[CR]` WHO Haemoglobin concentrations for diagnosis of anaemia (WHO/NMH/NHD/MNM/11.1); `[LP]` FHB Maternal Guidelines |
| **Fetal Heart Rate (FHR)** | $110 - 160\text{ bpm}$ | $\text{FHR} < 110\text{ bpm}$ (Bradycardia) or $> 160\text{ bpm}$ (Tachycardia) | Immediate fetal distress anomaly alert | `[CR]` FIGO Consensus Guidelines on Fetal Monitoring (2015); NICE [CG190] |
| **Repeated FHR Pattern** | Stable across visits | 2+ consecutive abnormal readings or prolonged deceleration | Siddhi temporal window anomaly pattern | `[IR]` Alert debounce heuristic; `[RA]` Local prototype demo rule |
| **Blood Pressure (BP)** | Systolic $< 120$, Diastolic $< 80\text{ mmHg}$ | $\ge 140/90\text{ mmHg}$ or repeat elevation within 4 hrs | Preeclampsia screening alert | `[CR]` ISSHP Guidelines on Hypertensive Disorders of Pregnancy (2021); NICE [NG133] |
| **Dating & Anomaly Scans** | 11-14 wk (NT), 18-22 wk (Anomaly), 32-36 wk (Growth) | Scan overdue by $> 14\text{ days}$ of target window | `pregnancy.scan.missing.v1` alert | `[CR]` ISUOG Practice Guidelines; `[LP]` FHB Routine Scan Protocol; `[IR]` 14-day software grace window |
| **Routine Clinic Visits** | Monthly to 28 wk; Fortnightly to 36 wk; Weekly to term | Appointment missed beyond grace period ($> 48\text{ hrs}$) | `pregnancy.appointment.missed.v1` alert | `[LP]` Sri Lanka FHB Antenatal Clinic Schedule; `[IR]` 48-hour notification grace period |

### 4.4 Ultrasound Scans & Image Reference Storage
* Scans store structured metadata in PostgreSQL:
  * `scan_type` (DATING, NUCHAL_TRANSLUCENCY, ANOMALY, GROWTH, BIOPHYSICAL_PROFILE)
  * `gestational_age_days`
  * `biparietal_diameter_mm`, `femur_length_mm`, `abdominal_circumference_mm`, `estimated_fetal_weight_g`
  * `placental_position`, `amniotic_fluid_index`
  * `image_reference`: URI reference to secure object storage (e.g. MinIO / S3 bucket), preserving cryptographic digest / SHA-256 hash.

---

## 5. Phase 4: Delivery & Maternal-Child Linkage (Issues #5, #8)

* **Delivery Record (`[LP]` Sri Lanka Maternal Hospital Protocol; `[CR]` WHO Labour Care Guide):**
  * Mode of delivery: SVD (Spontaneous Vaginal Delivery), Instrumental, Elective CS, Emergency CS.
  * Maternal outcome, blood loss estimation, postpartum complications.
* **Child Birth Record & Identity Genesis (`[LP]` Birth Registration Act; `[CR]` Neonatal Resuscitation Guidelines):**
  * Immediate generation of Child `Patient` resource.
  * Immutable link: `Child.mother_patient_id` $\rightarrow$ `Mother.patient_id`.
  * Birth parameters: Birth weight (grams), Birth length (cm), Head circumference (cm).
  * 1-minute and 5-minute APGAR scores (`[CR]` AAP / ACOG Committee Opinion No. 644).

---

## 6. Phase 5: Pediatric Care & Development (0–5 Years) (Issues #8, #9, #10, #25, #26, #27)

### 6.1 National Immunization Schedule (Birth to 5 Years)
* **Authoritative Source:** `[LP]` National Immunization Programme, Epidemiology Unit, Ministry of Health, Sri Lanka (Updated 2021 Schedule) aligned with `[CR]` WHO Expanded Programme on Immunization (EPI).

| Timing | Vaccine | Antigen Protection | Route / Site | Provenance |
|---|---|---|---|---|
| **At Birth** | BCG | Tuberculosis | Intradermal (Left upper arm) | `[LP]` Sri Lanka NIP / `[CR]` WHO |
| **2 Months** | Pentavalent 1 + OPV 1 + fIPV 1 | DTP, HepB, Hib + Polio | IM (Anterolateral thigh) + Oral | `[LP]` Sri Lanka NIP / `[CR]` WHO |
| **4 Months** | Pentavalent 2 + OPV 2 + fIPV 2 | DTP, HepB, Hib + Polio | IM + Oral | `[LP]` Sri Lanka NIP / `[CR]` WHO |
| **6 Months** | Pentavalent 3 + OPV 3 | DTP, HepB, Hib + Polio | IM + Oral | `[LP]` Sri Lanka NIP / `[CR]` WHO |
| **9 Months** | MMR 1 | Measles, Mumps, Rubella | Subcutaneous | `[LP]` Sri Lanka NIP |
| **12 Months** | Live JE | Japanese Encephalitis | Subcutaneous | `[LP]` Sri Lanka NIP (Endemic zone protocol) |
| **18 Months** | DTP Booster + OPV 4 | Diphtheria, Tetanus, Pertussis, Polio | IM + Oral | `[LP]` Sri Lanka NIP / `[CR]` WHO |
| **3 Years** | MMR 2 | Measles, Mumps, Rubella | Subcutaneous | `[LP]` Sri Lanka NIP |
| **5 Years** | aTd / DT | Adult Tetanus & Diphtheria | IM | `[LP]` Sri Lanka NIP |

Vaccine State Machine:
`SCHEDULED` $\rightarrow$ `ADMINISTERED` (with batch #, expiry, provider) | `MISSED` | `CONTRAINDICATED` (`[IR]`).

### 6.2 Child Growth Monitoring (0–59 Months)
* **Weight Monitoring (Weight-for-Age) (`[CR]` WHO Child Growth Standards 2006):**
  * Measurements plotted against standard WHO growth percentiles and standard deviations (SD).
  * Z-score thresholds:
    * $> +2\text{ SD}$: Overweight
    * $-2\text{ SD}$ to $+2\text{ SD}$: Normal growth
    * $<-2\text{ SD}$: Moderate Underweight
    * $<-3\text{ SD}$: Severe Acute Malnutrition (SAM)
  * **Growth Faltering Alert (`[LP]` Sri Lanka Child Health Development Record (CHDR); `[IR]` Software alert trigger):** Weight stagnation or drop over 2 consecutive monthly clinic measurements.
* **Height / Length Monitoring (Length/Height-for-Age) (`[CR]` WHO Child Growth Standards 2006):**
  * Length measured recumbent ($< 24\text{ months}$); Standing height ($\ge 24\text{ months}$).
  * Z-score thresholds:
    * $<-2\text{ SD}$: Stunted
    * $<-3\text{ SD}$: Severely Stunted

---

## 7. Initial Design Baseline: FHIR R4 Standard Resource Mapping (Subject to F12 Validation)

> [!NOTE]
> **Design Baseline Notice:**
> The resource mappings below represent the **initial architectural baseline** for maternal and child healthcare entities. These mappings are **hypotheses** established for domain modeling and require formal profiling, implementation, and validation against the official HL7 FHIR R4 specification and Sri Lanka Digital Health Interoperability standards during **F12 (FHIR Interoperability)**.
>
> In particular, the following mappings remain open design decisions subject to upcoming Architecture Decision Records (ADRs):
> * **Pregnancy Lifecycle:** Candidate mappings include `EpisodeOfCare` (representing the longitudinal episode), `Condition` (representing the clinical state of pregnancy), or a coordinated combination of both.
> * **Doctor / Provider Relationships:** Modeled as `PractitionerRole` and/or `CareTeam`.
> * **Clinical Alerts:** Modeled as `DetectedIssue` (for clinical safety/risk detection) and/or `Communication` (for notification dispatch).
>
> Implementers must not treat these mappings as final or immutable until validated under F12.

| Domain Entity | Proposed FHIR R4 Resource | Identifiers / Codes | Status / ADR Need |
|---|---|---|---|
| **Mother Patient** | `Patient` | National ID / Clinic Registration Number | Design Baseline |
| **Child Patient** | `Patient` | Child Birth Registration No, `link.other` $\rightarrow$ Mother | Design Baseline |
| **Midwife / Doctor** | `Practitioner` / `PractitionerRole` | SLMC License No / MOH Area Role | Design Baseline |
| **Pregnancy Lifecycle** | `EpisodeOfCare` & `Condition` | SNOMED CT: `77386006` (Pregnancy) | Open Design Decision (Requires F12 ADR) |
| **Clinic / Home Visit** | `Encounter` | `Encounter.participant` = Midwife/Doctor | Design Baseline |
| **Screening / Vitals / FHR** | `Observation` | LOINC codes (e.g. `8867-4` Heart rate, `718-7` Hemoglobin) | Design Baseline |
| **Ultrasound Scans** | `DiagnosticReport` + `Media` | LOINC `24602-5` (Obstetric ultrasound) | Design Baseline |
| **Folic Acid / Medicine** | `MedicationRequest` | RxNorm / National Formulary | Design Baseline |
| **Vaccine Dose** | `Immunization` | CVX codes / National Vaccine Code | Design Baseline |
| **Growth Assessment** | `Observation` | LOINC `29463-7` (Body weight), `8302-2` (Body height) | Design Baseline |
| **Clinical Alerts** | `DetectedIssue` / `Communication` | Alert severity and clinical category | Open Design Decision (Requires F12 ADR) |

---

## 8. Event-Driven Architecture & Siddhi Pattern Rules

> [!IMPORTANT]
> **Event Rules & Security Boundary Notice:**
> The event patterns below (e.g. `R1` to `R5`) represent software implementation rules (`[IR]`) and prototype heuristics (`[RA]`). In production (under F13 Event Processing and F14 API Gateway), events must be ingested through the authenticated API Gateway / Message Broker with cryptographic provenance, rather than unauthenticated direct HTTP receiver endpoints.

Domain services publish versioned JSON CloudEvents to the event bus. Siddhi CEP processes streams and emits actionable alerts:

```mermaid
flowchart TD
    subgraph EventStream["Domain Event Ingestion"]
        E1["pregnancy.appointment.scheduled.v1"]
        E2["pregnancy.appointment.completed.v1"]
        E3["clinical.observation.fhr.v1"]
        E4["clinical.observation.hb.v1"]
        E5["pregnancy.scan.completed.v1"]
    end

    subgraph SiddhiRules["Siddhi CEP Pattern Engine"]
        R1["Pattern: Scheduled AND NOT Completed within 48h"]
        R2["Filter: FHR < 110 OR FHR > 160"]
        R3["Pattern: 2 consecutive abnormal FHR events within 14 days"]
        R4["Filter: Hb < 7.0 g/dL"]
        R5["Temporal Join: GA >= 22 wk AND NOT AnomalyScanCompleted"]
    end

    subgraph Alerts["Clinical Alert Egress"]
        A1["pregnancy.appointment.missed.v1"]
        A2["clinical.alert.fetal_distress.v1"]
        A3["clinical.alert.repeated_fhr_anomaly.v1"]
        A4["clinical.alert.severe_anemia.v1"]
        A5["pregnancy.scan.missing.v1"]
    end

    E1 & E2 --> R1 --> A1
    E3 --> R2 --> A2
    E3 --> R3 --> A3
    E4 --> R4 --> A4
    E5 --> R5 --> A5
```
