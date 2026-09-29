# Git & Branching Workflow

## Purpose
This document defines the Git workflow for Adhya. GitHub Issues are the engineering source of truth; Trello is the execution board.

## Branch model
Adhya uses a protected `main` branch and short-lived task branches.

```
main
 ├── feature/F02-user-registration
 ├── feature/F03-mother-profile
 ├── feature/F04-pregnancy-lifecycle
 ├── fix/Fxx-short-description
 ├── security/Fxx-security-change
 ├── docs/Fxx-documentation
 └── chore/Fxx-tooling-or-maintenance
```

### Branch types
| Prefix | Use | Example |
|---|---|---|
| `feature/` | New product capability | `feature/F04-pregnancy-lifecycle` |
| `fix/` | Non-security defect | `fix/F04-edd-calculation` |
| `security/` | Security control or vulnerability remediation | `security/F14-rbac-enforcement` |
| `docs/` | Documentation-only work | `docs/F01-fhir-design` |
| `chore/` | Tooling, CI, dependency, maintenance | `chore/F01-ci-baseline` |

## Naming rule
Use the feature/issue identifier first when available: `<type>/Fxx-short-kebab-description`.

## Standard task flow
1. Select a GitHub Issue.
2. Confirm dependencies are complete.
3. Move the corresponding Trello card to **Ready**.
4. Create a branch from the latest `main`.
5. Implement only the issue scope.
6. Run unit, integration, API and relevant security tests.
7. Verify test coverage for the changed behavior, including regression coverage where practical.
8. Update documentation affected by the change.
8. Open a pull request into `main`.
9. Obtain review and pass CI.
11. Squash-merge the PR and delete the branch.
12. Move the Trello card to **Done** only after the Definition of Done is satisfied.

## Main branch policy
- No direct development commits to `main`.
- Every implementation change goes through a PR.
- CI must pass before merge.
- Security-sensitive changes require review by the security owner.
- Database, FHIR and API contract changes must update their corresponding documentation.

## Commit convention
Use concise conventional-style messages:
- `feat(F04): add pregnancy registration`
- `fix(F04): validate EDD calculation`
- `security(F14): enforce doctor patient scope`
- `docs(F01): document branch strategy`
- `test(F05): add observation API tests`
- `chore(F01): update local compose setup`

## Pull request rules
PR title: `[Fxx] Short change description`.

PR body must contain:
- GitHub Issue reference
- What changed
- Why it changed
- Tests executed
- Security impact
- API/FHIR/database impact
- Documentation impact
- Known limitations

## Dependency rule
Do not start a dependent feature merely because its issue exists. Its prerequisite feature must meet its DoD or the dependency must be explicitly documented as a temporary blocker.
