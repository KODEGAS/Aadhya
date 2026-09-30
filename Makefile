.PHONY: validate compose-config db-up db-down

validate:
	@test -f AGENTS.md
	@test -f docs/architecture/ARCHITECTURE.md
	@test -f docs/development/git-workflow.md
	@test -f docs/development/development-guide.md
	@test -f docs/development/coding-standards.md
	@test -f docs/development/environment-strategy.md
	@test -f docs/architecture/ADR/README.md
	@test ! -f .env
	@test ! -f .env.local

compose-config:
	docker compose config

db-up:
	docker compose up -d postgres

db-down:
	docker compose down
