# Development Guide

## Engineering workflow
Adhya follows:

`Issue → Branch → Design → Implementation → Tests → Security Check → PR → Review → Merge → Trello Done`

## Repository responsibilities
- Backend/domain owners maintain clinical business logic and APIs.
- Frontend owners maintain user-facing workflows and accessibility.
- Security/AI owners review authentication, authorization, API security, audit, LLM and security-test changes.
- Platform/research owners maintain containers, Kubernetes, observability, event infrastructure and PQC benchmarking.

## Local development
Use synthetic healthcare data only. Real patient data must not be placed in the repository, local fixtures, logs or test environments.

Before development, configure local environment variables from the documented example configuration and start the required services with the project's container tooling.

## Issue execution
Every task must have:
- Clear definition
- Complexity
- Dependencies
- Subtasks
- Definition of Done
- GitHub Issue
- Trello card

## Definition of Done
A task is complete when the relevant code/design is implemented, automated tests exist, security checks are performed where applicable, documentation is updated, the PR is reviewed, CI passes and the Trello DoD is satisfied.

## Healthcare-domain rule
Domain changes must preserve the longitudinal relationship:

`Mother → Pregnancy → Delivery → Child`.

Clinical data must remain attributable to the correct patient and encounter context.

## FHIR rule
When a domain object has an approved FHIR mapping, API and persistence changes must not silently diverge from the documented mapping.

## Security rule
Authentication is not authorization. Every protected clinical operation must enforce the required patient/provider scope and role permissions.
