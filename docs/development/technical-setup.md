# F01 — Repository Technical Setup

## Objective

Establish the minimum reproducible engineering baseline required before product-feature implementation expands.

## Scope

This setup establishes:

- repository/editor conventions
- GitHub issue and pull-request templates
- code ownership baseline
- CI repository validation
- environment-variable conventions
- a minimal local PostgreSQL development dependency
- developer commands for local validation

It intentionally does not implement application services, authentication, FHIR APIs, WSO2, Siddhi, Kubernetes, LLM integration, or PQC. Those belong to later feature/platform work.

## Local prerequisites

- Git
- Docker Engine
- Docker Compose
- Make
- Node.js 22 LTS for the planned Next.js web application
- Go 1.25 or later for the WSO2 FHIR Server integration/development workflow

### WSO2 FHIR Server compatibility baseline

The current WSO2 FHIR Server documentation identifies:

| Component | Baseline |
|---|---|
| FHIR | R4 (4.0.1) |
| Go | 1.25 or later |
| PostgreSQL | 14 through 18 |

The WSO2 FHIR Server is a Go-based FHIR R4 server backed by PostgreSQL. It can be introduced as the interoperability layer in a later F12 implementation step; it is intentionally not started by the F01 local Compose stack.

## Configuration

Create a local .env from .env.example and replace placeholder values where required.

Never commit .env, credentials, tokens, private keys, or real healthcare data.

## Local database

The local PostgreSQL service is provided by Docker Compose.

Default connection:

- host: localhost
- port: 5432
- database: adhya
- user: adhya

The database is development-only and must contain synthetic data.

## Validation

Use:

- make validate for repository checks
- make compose-config for Compose validation
- make db-up to start PostgreSQL
- make db-down to stop local services

Application services and migrations will be introduced with their respective feature implementations.

## CI baseline

Pull requests and pushes to main run repository validation. Application-specific unit, integration, API, and security tests should be added to CI when the corresponding implementation exists.

## Scope boundary

Do not add production infrastructure or the final microservice topology during F01 merely to make the repository appear complete. Infrastructure should be introduced when required by an implemented capability.
