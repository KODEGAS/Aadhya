# Coding Standards

## General principles
- Prefer simple, explicit code over clever abstractions.
- Keep modules cohesive and interfaces small.
- Validate input at trust boundaries.
- Return consistent API errors.
- Do not log credentials, tokens, clinical secrets or unnecessary patient information.

## API standards
- Version public API contracts.
- Use resource-oriented naming.
- Validate request schemas.
- Enforce authorization server-side.
- Document new endpoints in OpenAPI.
- Add negative authorization tests for protected endpoints.

## Clinical data
- Use immutable internal patient identifiers.
- OPD numbers are identifiers for operational use, not database primary keys.
- Preserve auditability of clinical changes.
- Use synthetic fixtures in development and automated tests.

## Database
- Use migrations for schema changes.
- Avoid destructive migrations without an explicit migration/recovery plan.
- Add constraints for important relationships and uniqueness rules.
- Index high-volume lookup and relationship fields based on measured query needs.

## Security
- Never commit secrets.
- Treat external input as untrusted.
- Apply least privilege.
- Avoid sensitive data in exception messages and logs.
- Security-sensitive changes use the `security/` branch type and receive security review.

## Testing
New behavior should include appropriate unit and integration/API tests. Bug fixes should include a regression test when practical.
