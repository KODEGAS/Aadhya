# Environment & Configuration Strategy

## Environments
Adhya uses separate configuration for:

| Environment | Purpose |
|---|---|
| Local | Developer implementation and unit/integration testing |
| CI | Automated quality and security checks |
| Staging | Production-like integration and end-to-end validation |
| Research | Controlled PQC/performance experiments |
| Production-like demo | Final project demonstration |

## Configuration principles
- Configuration is externalized from application code.
- Environment-specific values are never hard-coded.
- Secrets are never committed to Git.
- Kubernetes Secrets/appropriate secret management is used for deployed sensitive configuration.
- Non-sensitive defaults may be documented in example configuration files.

## Data policy
Only synthetic healthcare data is permitted during development, CI, staging and research unless an explicitly approved future process states otherwise.

## Kubernetes configuration
For Kubernetes-based environments, configuration is separated from container images and application code using Kubernetes `ConfigMap` resources for non-sensitive settings and Kubernetes `Secret` resources or an approved external secret manager for sensitive values. Deployment manifests should reference these resources rather than embedding environment-specific values. Resource-specific configuration should be reviewed alongside the Kubernetes deployment documentation.

## Configuration categories
- Database connection
- API gateway endpoints
- OAuth2/OIDC configuration
- Event-processing configuration
- LLM gateway configuration
- PQC experiment configuration
- Observability configuration

## Local configuration
Developers should maintain a local environment file outside version control and use a committed example file containing placeholders only.

## Rotation
Credentials must be replaceable without code changes. If a secret is accidentally committed, treat it as compromised, rotate it and remove it from future repository history according to the incident process.
