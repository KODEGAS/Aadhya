# Execution & Run Guide for Aadhya (Docker Compose)

This guide provides instructions for setting up, running, testing, and validating the Aadhya platform locally using **Docker Compose** profiles.

---

## 1. Prerequisites

Ensure the following tools are installed on your workstation:

| Tool | Minimum Version | Purpose |
|---|---|---|
| **Git** | 2.38+ | Source control |
| **Docker Engine & Docker Compose** | 24.0+ (Compose v2) | Container runtime and local service orchestration |
| **Make** | 3.81+ | Automated command execution via Makefile |

---

## 2. Developer Identity & Git Setup

Before committing or pushing to the repository, ensure your Git configuration complies with the project's identity and signing requirements:

```bash
# Configure local repository identity with your email and username
git config user.name "your-username"
git config user.email "your-email@example.com"

# Verify configuration
git config user.name
git config user.email
```

> [!IMPORTANT]
> **Commit Sign-Off Required:**
> All git commits must be signed off with `-s` (`--signoff`).
> Every commit message will include:
> `Signed-off-by: your-username <your-email>`

---

## 3. Environment Configuration

The repository uses placeholder configuration templates. Real credentials must never be committed.

```bash
# Copy example environment configuration
cp .env.example .env

# Review local variables if needed
cat .env
```

Ensure `.env` remains uncommitted (verified by `.gitignore` and CI checks).

---

## 4. Platform Services & Docker Compose Profiles

The compose stack establishes the **F01 Foundation Baseline** and provides modular profile blueprints for downstream feature milestones.

### 4.1 Feature Scope Alignment

To prevent F01 from absorbing responsibilities belonging to later deliverables, understand the boundaries:

* **F01 Foundation Baseline (Default / Active Scope):**
  * PostgreSQL Clinical Database (`adhya-postgres` storing the `adhya` application database).
  * This is the only service started by default when invoking `docker compose up -d` without a profile.
* **F12 Interoperability Layer (Preview Profile `fhir`):**
  * HAPI FHIR JPA Server (`adhya-hapi-fhir`) persisting to an **isolated database** (`adhya_fhir`).
  * WSO2 Micro Integrator (`adhya-wso2-fhir`) for FHIR mediation.
  * *Formal implementation, validation, and profile compliance belong to F12.*
* **F13 Event Processing & Alerts (Preview Profile `siddhi`):**
  * Siddhi Stream Processor (`adhya-siddhi`) for in-memory CEP rule prototyping.
  * *Broker integration, persistent event streaming, and validated alert handlers belong to F13.*
* **F14 API Gateway & IAM (Preview Profile `wso2`):**
  * WSO2 API Manager (`adhya-wso2-apim`) & WSO2 Identity Server (`adhya-wso2-is`).
  * In this local preview, WSO2 services run in evaluation mode using self-contained embedded storage.
  * *Shared clustered PostgreSQL userstores, OAuth2 policy enforcement, and gateway routing belong to F14.*
* **F17 Platform Ingress & Deployment (Preview Profile `openchoreo`):**
  * OpenChoreo / Choreo Connect Router (`adhya-openchoreo-router`) stateless Envoy gateway.
  * *Kubernetes deployment manifests, routing ingress, and platform observability belong to F17.*

### 4.2 Service Inventory

| Service | Container | Image Version | Ports | Feature Mapping | Profile |
|---|---|---|---|---|---|
| **PostgreSQL (Clinical DB)** | `adhya-postgres` | `postgres:16-alpine` | `5432` | **F01 Foundation Baseline** | *(default)* |
| **Siddhi Stream Processor** | `adhya-siddhi` | `siddhiio/siddhi-runner-alpine:5.1.2` | `8006, 9091` | F13 Event Processing | `siddhi` |
| **WSO2 API Manager** | `adhya-wso2-apim` | `wso2/wso2am:4.3.0` | `9443, 8243, 8280` | F14 API Gateway | `wso2` |
| **WSO2 Identity Server** | `adhya-wso2-is` | `wso2/wso2is:7.0.0` | `9444` | F14 IAM & RBAC | `wso2` |
| **WSO2 FHIR (MI)** | `adhya-wso2-fhir` | `wso2/wso2mi:4.3.0` | `8290, 8253, 9164` | F12 Interoperability | `fhir` |
| **HAPI FHIR Server** | `adhya-hapi-fhir` | `hapiproject/hapi:v7.4.0` | `8080` | F12 Interoperability | `fhir` |
| **OpenChoreo Router** | `adhya-openchoreo-router` | `wso2/choreo-connect-router:1.2.0` | `9095` | F17 Platform Routing | `openchoreo` |

### 4.3 Database Persistence Separation

To prevent coupling between application clinical migrations and FHIR JPA persistence:
* The application stores its clinical models in the primary `adhya` database owned by user `adhya`.
* HAPI FHIR connects exclusively to a dedicated `adhya_fhir` database owned by user `adhya_fhir`.
* On initial container boot, `docker/postgres/init-fhir-db.sh` runs automatically to provision the separate `adhya_fhir` database and user credentials.

---

## 5. Running Services via Makefile

```bash
# View all available Makefile commands with feature alignments
make help
```

### Core Database (F01 Foundation Baseline)
```bash
make db-up       # Start Postgres adhya database (background)
make db-ps       # Check health status
make db-logs     # Follow logs
make db-shell    # Interactive psql shell for adhya clinical DB
make db-down     # Stop Postgres
```

### Starting Feature Preview Profiles
```bash
# 1. Siddhi Stream Processing (F13 Preview - CEP & Rule Evaluation)
make siddhi-up
make siddhi-down

# 2. WSO2 API Manager + Identity Server (F14 Preview - Gateway & IAM with embedded storage)
make wso2-up
make wso2-down

# 3. FHIR Services (F12 Preview - WSO2 MI + HAPI FHIR JPA on dedicated adhya_fhir DB)
make fhir-up
make fhir-down

# 4. OpenChoreo (F17 Preview - Choreo Connect Router)
make openchoreo-up
make openchoreo-down

# 5. Full Platform Preview (All services)
make platform-up
make platform-down
```

---

## 6. Validation, Linters & Quality Gates

Run the local quality checks before opening a pull request:

```bash
# 1. Validate repository structure, prohibited files & markdown linting
make validate

# 2. Validate Docker Compose service definitions
make compose-config
```

---

## 7. Troubleshooting

* **Port conflicts:**
  Adjust any conflicting port in `.env` (e.g. `POSTGRES_PORT=5433`, `FHIR_SERVER_PORT=8081`).
* **FHIR Database initialization:**
  If Postgres was previously initialized before the dedicated `adhya_fhir` database script was added, run:
  `docker compose exec postgres psql -U adhya -d adhya -c "CREATE USER adhya_fhir WITH PASSWORD 'change-me'; CREATE DATABASE adhya_fhir OWNER adhya_fhir;"`
* **WSO2 evaluation storage:**
  WSO2 APIM and IS in this preview environment use embedded storage. Do not persist production credentials or state; formal shared external database schemas are provisioned under F14.
* **Memory considerations:**
  WSO2 APIM and IS require at least 2GB RAM allocated to Docker. When developing features focused strictly on the core clinical database or services, use `make db-up` to conserve memory.
