# AGENTS.md — Adhya Engineering Agent Guide

## 1. Purpose

This file defines the project-wide rules for AI coding agents and automated development assistants working on **Adhya — Maternal & Child Longitudinal Healthcare Platform**.

Agents must treat this document together with the repository documentation as the source of truth for implementation decisions.

Before changing code, an agent must inspect the relevant issue, architecture, requirements, API/FHIR design, security requirements, and existing implementation.

---

## 2. Product Context

Adhya is a longitudinal healthcare platform connecting:

`Mother → Pregnancy → Delivery → Child`

The platform is intended to support maternal care from pre-pregnancy through pregnancy and postpartum stages, and child healthcare from birth through age five.

Core capabilities include:

- User registration and identity
- OPD number assignment
- Mother profiles
- Pregnancy lifecycle
- Clinical encounters and observations
- Medication and medicine collection
- Appointments and reminders
- Doctor connection and clinical dashboards
- Child profiles
- Vaccination management
- Growth and development monitoring
- FHIR-based clinical data
- Event-driven alerts
- API security
- Secure LLM access to authorized healthcare context
- Post-quantum cryptography research
- Kubernetes-based deployment and observability

The platform must use **synthetic healthcare data only** during development, testing, research, and demonstration.

---

## 3. Source-of-Truth Hierarchy

When documents disagree, agents should not silently choose a solution.

Use this order of authority:

1. Approved requirements / SRS
2. Approved architecture documentation
3. Accepted ADRs
4. Security requirements and threat model
5. FHIR/API/data-model specifications
6. GitHub Issue acceptance criteria
7. Existing implementation
8. General engineering conventions

If a conflict cannot be resolved from these sources:

- stop the affected implementation,
- identify the conflict,
- propose alternatives,
- request a decision or create an ADR when appropriate.

Do not silently rewrite requirements to fit an implementation.

---

## 4. Task Execution Model

Every implementation task follows:

`GitHub Issue → Branch → Understand → Design → Implement → Test → Security Check → Documentation → PR → Review → Merge → Trello Done`

An agent must not start implementation merely because an issue exists.

Before coding:

- Read the GitHub Issue and any relevant sub-issues/subtasks.
- Check its dependencies.
- If an implementation plan, approach, or task-specific design exists, review it before implementation.
- Inspect related code.
- Inspect relevant documentation.
- Identify API, database, FHIR and security impact.
- Confirm the task's Definition of Done.

---

## 5. Git Branching Rules

Never develop directly on `main`.

Use short-lived branches.

### Branch types

| Prefix | Purpose | Example |
|---|---|---|
| `feature/` | Product functionality | `feature/F04-pregnancy-lifecycle` |
| `fix/` | Normal defect correction | `fix/F04-edd-validation` |
| `security/` | Security controls or remediation | `security/F14-rbac-enforcement` |
| `docs/` | Documentation | `docs/F01-fhir-design` |
| `chore/` | Tooling/maintenance | `chore/F01-ci-baseline` |
| `research/` | Research experiments/benchmarks | `research/F19-pqc-benchmarking` |

Prefer:

`<type>/Fxx-short-kebab-description`

Agents must create branches from the latest appropriate `main` baseline unless the issue explicitly requires another base.

---

## 6. GitHub Issue Discipline

One issue should represent one coherent engineering outcome.

Agents must:

- implement only the requested issue scope,
- avoid unrelated refactoring,
- preserve existing behavior unless the issue requires change,
- update the issue when scope changes,
- reference the issue in the PR.

If implementation reveals that another task is needed, create or recommend a separate issue instead of silently expanding scope.

---

## 7. Pull Request Requirements

Every implementation PR must include:

- Related GitHub Issue
- Summary of changes
- Design decisions
- Tests performed
- Security impact
- Database impact
- API impact
- FHIR impact
- Documentation impact
- Known limitations

PR title format:

`[Fxx] Short description`

Documentation-only changes should still use the same review discipline.

---

## 8. Definition of Done

A task is not complete merely because the code works locally.

Where applicable, the agent must ensure:

- [ ] Implementation completed
- [ ] Unit tests added/updated
- [ ] Integration/API tests added/updated
- [ ] Security checks completed
- [ ] Database migrations included
- [ ] API/OpenAPI documentation updated
- [ ] FHIR mapping updated
- [ ] Architecture/ADR updated if required
- [ ] Configuration documented
- [ ] Synthetic test data used
- [ ] CI passes
- [ ] PR review completed
- [ ] GitHub Issue acceptance criteria satisfied
- [ ] Trello Definition of Done satisfied

Only then should the Trello card move to **Done**.

---

## 9. Healthcare Data Rules

Healthcare data is sensitive.

Agents must:

- use synthetic data only,
- never introduce real patient information,
- avoid exposing unnecessary clinical information in logs,
- avoid placing clinical data in source-code comments,
- protect patient identifiers,
- preserve patient-to-record relationships,
- maintain auditability of clinical changes.

The internal immutable patient identifier must remain distinct from the operational OPD number.

OPD numbers must not be used as database primary keys.

---

## 10. Longitudinal Domain Integrity

Agents must preserve the core relationship:

`Mother → Pregnancy → Delivery → Child`

Changes involving pregnancy, delivery, or child creation must preserve referential integrity and historical traceability.

A child created from a delivery event must remain correctly linked to the mother and the corresponding pregnancy.

Agents must not redesign this lifecycle without an approved architectural decision.

---

## 11. FHIR Rules

FHIR is an interoperability layer and must not be treated as an afterthought.

Agents must read the relevant official FHIR documentation/specification before implementing or modifying FHIR resources, profiles, mappings, validation, or FHIR-facing APIs. Repository FHIR design documents define Adhya-specific decisions; official FHIR documentation is the external technical reference.

Current baseline mappings include:

| Adhya concept | FHIR resource |
|---|---|
| Mother | Patient |
| Child | Patient |
| Doctor | Practitioner |
| Provider relationship | CareTeam / PractitionerRole |
| Pregnancy | Condition / EpisodeOfCare — final mapping requires design decision |
| Clinic visit | Encounter |
| Clinical observation | Observation |
| Medication | MedicationRequest |
| Vaccination | Immunization |
| Appointment | Appointment |
| Clinical documentation | DocumentReference / clinical documentation |
| Alert | Communication / DetectedIssue |

Where the exact mapping is not finalized, agents must not invent a definitive mapping. Propose the mapping through the appropriate design document or ADR.

---

## 12. API Security Rules

Security is part of implementation, not a final-stage activity.

Agents must:

- validate untrusted input,
- enforce authentication where required,
- enforce authorization server-side,
- apply least privilege,
- validate patient/provider scope,
- prevent cross-patient access,
- avoid leaking sensitive information through errors,
- avoid logging secrets or tokens,
- add negative authorization tests for protected operations.

Authentication does not equal authorization.

A valid authenticated user must still be checked against the requested clinical resource.

---

## 13. Secrets and Configuration

Never commit:

- passwords,
- API keys,
- OAuth client secrets,
- private keys,
- tokens,
- production credentials,
- real patient information.

Use environment variables or the project's designated secret-management mechanism.

Example configuration files must contain placeholders only.

If an agent discovers a committed secret:

1. Treat it as compromised.
2. Recommend immediate rotation.
3. Stop propagating the secret.
4. Follow the security incident process.
5. Do not simply hide the secret in a subsequent commit.

---

## 14. AI / LLM Rules

The LLM subsystem is an information-support component, not an autonomous clinical decision-maker.

Agents must not implement functionality that:

- diagnoses patients,
- autonomously prescribes treatment,
- autonomously changes clinical records,
- bypasses authorization,
- retrieves unrestricted patient data,
- exposes another patient's context.

The secure LLM gateway must enforce:

`User Authorization → Context Authorization → Data Minimization → De-identification where applicable → Prompt/Tool Security → LLM → Audit`

Potential threats to consider include:

- prompt injection,
- sensitive-data leakage,
- excessive data exposure,
- unauthorized patient context,
- cross-patient contamination,
- insecure tool access,
- insufficient auditability.

---

## 15. PQC Research Rules

PQC functionality is part of the security/research layer.

The current research direction includes:

- ML-KEM for key establishment
- ML-DSA for signatures
- Classical cryptography
- PQC cryptography
- Hybrid approaches

Agents must distinguish:

- production security controls,
- experimental implementations,
- benchmark results,
- research assumptions.

Do not claim that an implementation is universally quantum-secure.

Benchmark claims must be supported by measured evidence.

Important metrics include:

- key generation time
- signing time
- verification time
- key sizes
- signature sizes
- ciphertext sizes
- CPU usage
- memory usage
- network overhead
- request latency

---

## 16. Database Rules

Database changes must use migrations.

Agents must consider:

- foreign-key relationships,
- uniqueness,
- nullability,
- indexes,
- auditability,
- migration rollback/recovery,
- backward compatibility,
- clinical-history preservation.

Avoid destructive schema changes without an explicit migration strategy.

---

## 17. Event-Driven Architecture

Event processing must preserve reliable clinical state.

Relevant event-driven components include:

- clinical observations,
- appointments,
- vaccination events,
- growth measurements,
- alerts,
- audit events.

Agents introducing an event must document:

- event name,
- producer,
- consumer,
- payload/schema,
- delivery expectations,
- retry behavior,
- failure behavior,
- idempotency requirements.

Siddhi rules must be testable with synthetic event streams.

---

## 18. Kubernetes and Platform Rules

Deployment changes must consider:

- Deployments
- Services
- Ingress
- ConfigMaps
- Secrets
- health probes
- resource requests/limits
- HPA
- Network Policies
- logging
- metrics
- tracing

Agents must avoid introducing unnecessary infrastructure complexity.

The platform should remain understandable and reproducible for the project team.

---

## 19. Testing Strategy

Testing should occur at the appropriate level:

`Unit → Integration → API → Security → End-to-End`

Security-sensitive features should include negative tests.

Examples:

- unauthenticated request
- wrong-role request
- wrong-patient request
- expired/invalid token
- malformed input
- excessive request rate
- unauthorized LLM context
- cross-patient access attempt

Do not test only successful paths.

---

## 20. Documentation Rules

When behavior changes, determine whether documentation must also change.

Potentially affected documentation:

- SRS
- architecture
- ADR
- database design
- FHIR design
- OpenAPI
- security architecture
- threat model
- deployment documentation
- runbooks
- research methodology

Do not create an ADR for every implementation detail. Use ADRs for decisions with meaningful architectural, security, interoperability, operational or research consequences.

---

## 21. Agent Behavior

Agents should:

- inspect before modifying,
- make the smallest coherent change,
- preserve existing architecture,
- explain assumptions,
- identify uncertainty,
- avoid speculative features,
- avoid unnecessary dependencies,
- avoid large unrelated refactors,
- test changes,
- update documentation,
- report incomplete work honestly.

Agents must never claim a test, deployment, review, benchmark, or security validation was performed when it was not.

---

## 22. Scope Control

The following are outside the current core scope unless explicitly approved:

- full hospital management
- billing
- insurance
- pharmacy management
- autonomous diagnosis
- autonomous treatment
- unrestricted medical AI
- real patient data
- unnecessary mobile-app expansion
- large-scale ML systems unrelated to the research objectives

If an implementation request expands scope, identify it before proceeding.

---

## 23. Research Reproducibility

Research-related changes must record:

- objective,
- hypothesis/research question,
- environment,
- software/library versions,
- configuration,
- dataset characteristics,
- experiment procedure,
- metrics,
- results,
- limitations.

Performance comparisons must use controlled and repeatable conditions.

---

## 24. Final Agent Checklist

Before creating a PR, the agent should verify:

- [ ] I read the issue and dependencies.
- [ ] I checked the relevant architecture/design documents.
- [ ] I stayed within issue scope.
- [ ] I used the correct branch type.
- [ ] I did not introduce secrets or real healthcare data.
- [ ] I considered authorization and data exposure.
- [ ] I added/updated appropriate tests.
- [ ] I updated affected documentation.
- [ ] I checked database/API/FHIR impacts.
- [ ] I recorded significant architectural decisions.
- [ ] I ran the available validation commands.
- [ ] I reported anything I could not validate.
- [ ] The PR references the GitHub Issue.

## 25. Related Documentation

- `docs/architecture/ARCHITECTURE.md`
- `docs/development/git-workflow.md`
- `docs/development/development-guide.md`
- `docs/development/coding-standards.md`
- `docs/development/environment-strategy.md`
- `docs/architecture/ADR/README.md`
- `docs/requirements/phase1-foundation.md`

This file should evolve as the project architecture and engineering process mature.
