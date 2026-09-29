# Phase 1 — Foundation Documentation

## Objective

Establish the documentation and engineering conventions required before feature implementation expands.

## Foundation documents

| Document | Purpose |
|---|---|
| `AGENTS.md` | Project-wide instructions for AI coding agents and automated development assistants |
| `docs/architecture/ARCHITECTURE.md` | System architecture baseline |
| `docs/development/git-workflow.md` | Branching, commits, PRs, review and merge workflow |
| `docs/development/development-guide.md` | Developer workflow and engineering rules |
| `docs/development/coding-standards.md` | API, database, security, clinical-data and testing standards |
| `docs/development/environment-strategy.md` | Environment configuration and secret handling |
| `docs/architecture/ADR/README.md` | Architecture Decision Record process |

## Phase 1 work packages

| Task | Complexity | Branch |
|---|---|---|
| F01 Foundation & Architecture | High | `docs/phase1-foundation` |
| Agent engineering guidance | Medium | `docs/phase1-foundation` |
| Architecture Decision Records | Medium | `docs/ADR-xxxx-title` |
| Git & branching workflow | Medium | `docs/F01-git-workflow` |
| Development guide | Medium | `docs/F01-development-guide` |
| Coding standards | Low | `docs/F01-coding-standards` |
| Environment strategy | Medium | `docs/F01-environment-strategy` |

## Dependencies

Phase 1 has no product-feature dependency. F02 and later feature branches should be created from the resulting approved `main` baseline.

## Acceptance criteria

- Architecture baseline exists.
- `AGENTS.md` defines project-wide agent behavior and engineering constraints.
- Git branching and PR rules are documented.
- Development workflow is documented.
- Coding standards are documented.
- Environment and secret handling are documented.
- ADR process exists.
- Documentation is reviewed through a PR before becoming the project baseline.
