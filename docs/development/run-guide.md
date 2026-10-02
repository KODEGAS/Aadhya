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
git config user.name your-username
git config user.email "your-email

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

The stack supports modular Compose profiles to run only what you need:

| Service | Container | Image Version | Ports | Profile |
|---|---|---|---|---|
| **PostgreSQL** | `adhya-postgres` | `postgres:16-alpine` | `5432` | *(default)* |
| **Siddhi Stream Processor** | `adhya-siddhi` | `siddhiio/siddhi-runner-alpine:5.1.2` | `8006, 9091` | `siddhi` |
| **WSO2 API Manager** | `adhya-wso2-apim` | `wso2/wso2am:4.3.0` | `9443, 8243, 8280` | `wso2` |
| **WSO2 Identity Server** | `adhya-wso2-is` | `wso2/wso2is:7.0.0` | `9444` | `wso2` |
| **WSO2 FHIR (MI)** | `adhya-wso2-fhir` | `wso2/wso2mi:4.3.0` | `8290, 8253, 9164` | `fhir` |
| **HAPI FHIR Server** | `adhya-hapi-fhir` | `hapiproject/hapi:v7.4.0` | `8080` | `fhir` |
| **OpenChoreo Router** | `adhya-openchoreo-router` | `wso2/choreo-connect-router:1.2.0` | `9095` | `openchoreo` |

---

## 5. Running Services via Makefile

```bash
# View all available Makefile commands
make help
```

### Core Database (Fast local dev baseline)
```bash
make db-up       # Start Postgres (background)
make db-ps       # Check health status
make db-logs     # Follow logs
make db-shell    # Interactive psql shell
make db-down     # Stop Postgres
```

### Starting Specific Subsystems
```bash
# 1. Siddhi Stream Processing (CEP & Clinical Rules)
make siddhi-up
make siddhi-down

# 2. WSO2 API Manager + Identity Server (API Gateway & IAM)
make wso2-up
make wso2-down

# 3. FHIR Services (WSO2 MI Healthcare + HAPI FHIR JPA)
make fhir-up
make fhir-down

# 4. OpenChoreo (Choreo Connect Router)
make openchoreo-up
make openchoreo-down

# 5. Full Platform Stack (All services)
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
* **Memory usage with WSO2 services:**
  WSO2 APIM and IS require at least 2GB RAM allocated to Docker Desktop. When working on features that only require database persistence, use `make db-up` to conserve memory.
