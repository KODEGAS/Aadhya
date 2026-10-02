# Execution & Run Guide for Aadhya

This guide provides step-by-step instructions for running, testing, validating, and deploying the Aadhya platform in local and Kubernetes development environments.

---

## 1. Prerequisites

Ensure the following tools are installed on your workstation:

| Tool | Minimum Version | Purpose |
|---|---|---|
| **Git** | 2.38+ | Source control |
| **Docker Engine & Docker Compose** | 24.0+ (Compose v2) | Container runtime and local service orchestration |
| **Kubectl** | 1.28+ | Kubernetes cluster management and Kustomize rendering |
| **Make** | 3.81+ | Automated command execution via Makefile |
| **Python 3 / pip** *(optional for local linting)* | 3.10+ | Local yamllint and pre-commit checks |

---

## 2. Developer Identity & Git Setup

Before committing or pushing to the repository, ensure your Git configuration complies with the project's identity and signing requirements:

```bash
# Configure local repository identity
git config user.name "kavix"
git config user.email "kavix@yahoo.com"

# Verify configuration
git config user.name
git config user.email
```

> [!IMPORTANT]
> **Commit Sign-Off Required:**
> All git commits must be signed off with `-s` (`--signoff`).
> Every commit message will include:
> `Signed-off-by: kavix <kavix@yahoo.com>`

---

## 3. Environment Configuration

The repository uses placeholder configuration templates. Real credentials must never be committed.

```bash
# Copy example environment configuration
cp .env.example .env

# Review and adjust local variables if required
cat .env
```

Ensure `.env` remains uncommitted (verified by `.gitignore` and CI checks).

---

## 4. Running the Local Database Stack (Docker Compose)

The local development stack orchestrates PostgreSQL with health checks.

### Start PostgreSQL
```bash
make db-up
```
Or directly:
```bash
docker compose up -d postgres
```

### Verify Service Health
```bash
docker compose ps
```
Wait until the status shows `healthy`.

### Inspect Database Logs
```bash
docker compose logs -f postgres
```

### Connect to Database via CLI
```bash
docker compose exec postgres psql -U adhya -d adhya
```

### Stop Database
```bash
make db-down
```

---

## 5. Running & Validating Kubernetes (K8s) Workloads

Aadhya provides declarative Kubernetes configurations using Kustomize with a base and environmental overlays.

### 5.1 Directory Structure
```
k8s/
├── base/
│   ├── kustomization.yaml       # Base assembly
│   ├── namespace.yaml           # aadhya namespace
│   ├── network-policy.yaml      # Default-deny, DNS, Postgres, Service policies
│   ├── postgres-deployment.yaml # Hardened deployment, probes, PVC, non-root UID 999
│   └── secrets-template.yaml    # Secret template (placeholders only)
└── overlays/
    └── dev/
        └── kustomization.yaml   # Dev overlay (reduced resource limits, dev labels)
```

### 5.2 Render & Inspect Manifests

Render the base configuration:
```bash
kubectl kustomize k8s/base
```

Render the development overlay configuration:
```bash
kubectl kustomize k8s/overlays/dev
```

### 5.3 Deploying to a Local Kubernetes Cluster (Minikube / Kind / Docker Desktop)

1. **Verify your active cluster context:**
   ```bash
   kubectl cluster-info
   ```

2. **Provision Secret Credentials:**
   Create the required secret in the `aadhya` namespace before deploying pods:
   ```bash
   kubectl create namespace aadhya --dry-run=client -o yaml | kubectl apply -f -

   kubectl create secret generic postgres-credentials \
     --namespace aadhya \
     --from-literal=POSTGRES_DB=adhya \
     --from-literal=POSTGRES_USER=adhya \
     --from-literal=POSTGRES_PASSWORD=dev-secure-password \
     --dry-run=client -o yaml | kubectl apply -f -
   ```

3. **Apply Development Overlay:**
   ```bash
   kubectl apply -k k8s/overlays/dev
   ```

4. **Monitor Pods and Services:**
   ```bash
   kubectl get all -n aadhya
   kubectl describe pod -l app.kubernetes.io/name=postgres -n aadhya
   ```

5. **Tear Down K8s Resources:**
   ```bash
   kubectl delete -k k8s/overlays/dev
   ```

---

## 6. Validation, Linters & Quality Gates

Run the local quality checks before opening a pull request:

```bash
# 1. Validate repository structure & prohibited files
make validate

# 2. Validate Docker Compose configuration
make compose-config

# 3. Render and test K8s overlays
make k8s-render-dev
```

### Automated CI Pipeline Checks
The repository CI (`.github/workflows/ci.yml`) executes:
1. **Repository Validation:** Ensures essential architecture, workflow, and coding-standards documents exist.
2. **Environment & Secret File Checks:** Rejects committed `.env` files and `.pem`/`.key` files.
3. **YAML Lint (`yamllint`):** Validates all YAML files against `.yamllint.yml`.
4. **Kubernetes Manifest Validation (`kubeconform`):** Verifies schema validity of all K8s resources in strict mode.
5. **Secret Scanning (`gitleaks`):** Detects hard-coded API keys, tokens, and credentials.
6. **Markdown Lint (`markdownlint`):** Checks documentation format and headers.
7. **Security Policy Audit (`checkov`):** Verifies non-root execution, privilege escalation denial, and security contexts.
8. **Compose Validation:** Tests Docker Compose configuration parsing.

---

## 7. Troubleshooting

* **Postgres pod CrashLoopBackOff / Permission Denied:**
  Ensure the volume mount allows UID 999 (postgres) to write. The deployment includes `fsGroup: 999`.
* **Cannot connect to Postgres from other pods:**
  Verify that the connecting pod has the label `db-client: "true"` as required by `network-policy.yaml`.
* **Port 5432 already in use on host:**
  Override the host port in `.env` by setting `POSTGRES_PORT=5433` or stop any locally running PostgreSQL instance.
