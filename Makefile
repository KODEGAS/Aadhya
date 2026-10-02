.PHONY: help validate compose-config db-up db-down db-logs db-ps db-shell

help:
	@echo "Available Makefile targets (Docker Compose workflow):"
	@echo "  make validate         - Validate repository foundation files and env safety"
	@echo "  make compose-config   - Validate docker-compose.yml configuration"
	@echo "  make db-up            - Start local PostgreSQL database container"
	@echo "  make db-down          - Stop local PostgreSQL database container"
	@echo "  make db-logs          - Follow PostgreSQL database container logs"
	@echo "  make db-ps            - Check PostgreSQL container status and health"
	@echo "  make db-shell         - Open psql shell inside the running database container"

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
	@echo "All foundation and environment checks passed."

compose-config:
	docker compose config

db-up:
	docker compose up -d postgres

db-down:
	docker compose down

db-logs:
	docker compose logs -f postgres

db-ps:
	docker compose ps

db-shell:
	docker compose exec postgres psql -U $${POSTGRES_USER:-adhya} -d $${POSTGRES_DB:-adhya}
