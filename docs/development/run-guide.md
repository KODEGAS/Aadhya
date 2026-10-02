# Execution & Run Guide for Aadhya (Docker Compose)

This guide provides instructions for setting up, running, testing, and validating the Aadhya platform locally using **Docker Compose**.

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

## 4. Running the Local Database Stack (Docker Compose)

Aadhya uses Docker Compose for orchestrating local dependencies with container health checks.

### Inspect Available Makefile Targets
```bash
make help
```

### Start the PostgreSQL Container
```bash
make db-up
```
*(Runs `docker compose up -d postgres`)*

### Verify Service Health & Status
```bash
make db-ps
```
Wait until the status displays `healthy`.

### Follow Database Logs
```bash
make db-logs
```

### Connect to Database via Interactive Shell
```bash
make db-shell
```
*(Executes `psql -U adhya -d adhya` inside the running container)*

### Stop the Database
```bash
make db-down
```

---

## 5. Validation, Linters & Quality Gates

Run the local quality checks before opening a pull request:

```bash
# 1. Validate repository structure & prohibited files
make validate

# 2. Validate Docker Compose configuration
make compose-config
```

### Automated CI Pipeline Checks
The repository CI (`.github/workflows/ci.yml`) executes:
1. **Repository Validation:** Ensures essential architecture, workflow, and coding-standards documents exist.
2. **Environment & Secret File Checks:** Rejects committed `.env` files and `.pem`/`.key` files.
3. **YAML Lint (`yamllint`):** Validates all YAML files against `.yamllint.yml`.
4. **Secret Scanning (`gitleaks`):** Detects hard-coded API keys, tokens, and credentials.
5. **Markdown Lint (`markdownlint`):** Checks documentation format and headers.
6. **Docker Compose Validation:** Verifies Compose syntax and service definitions.

---

## 6. Troubleshooting

* **Port 5432 already in use on host:**
  Override the host port in `.env` by setting `POSTGRES_PORT=5433` or stop any locally running PostgreSQL instance on your host.
* **Database not ready:**
  The PostgreSQL container defines a health check using `pg_isready`. Give it approximately 5–10 seconds to finish initializing before running dependent commands.
