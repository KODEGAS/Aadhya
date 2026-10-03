.PHONY: help validate lint-md test build run compose-config db-up db-down db-logs db-ps db-shell \
        siddhi-up siddhi-down wso2-up wso2-down fhir-up fhir-down openchoreo-up openchoreo-down \
        platform-up platform-down

help:
	@echo "Available Makefile targets:"
	@echo "  make validate         - Run foundation validation, markdownlint, and Go test suite"
	@echo "  make test             - Run all Go unit and integration tests"
	@echo "  make build            - Build Go clinical backend binary (bin/server)"
	@echo "  make run              - Run Go clinical backend service locally"
	@echo "  make lint-md          - Run markdownlint on all documentation and Markdown files"
	@echo "  make compose-config   - Validate docker-compose.yml configuration"
	@echo ""
	@echo "Core Clinical Database (F01 Foundation Baseline):"
	@echo "  make db-up            - Start local PostgreSQL database container (adhya DB)"
	@echo "  make db-down          - Stop local PostgreSQL database container"
	@echo "  make db-logs          - Follow PostgreSQL database container logs"
	@echo "  make db-ps            - Check PostgreSQL container status and health"
	@echo "  make db-shell         - Open psql shell inside the running database container"
	@echo ""
	@echo "Platform Subsystems (Feature Preview Compose Profiles):"
	@echo "  make siddhi-up        - Start Siddhi CEP Stream Processor (port 8006, 9091) [F13 Preview]"
	@echo "  make siddhi-down      - Stop Siddhi CEP Stream Processor"
	@echo "  make wso2-up          - Start WSO2 API Manager & Identity Server (9443, 9444) [F14 Preview]"
	@echo "  make wso2-down        - Stop WSO2 AM and IS"
	@echo "  make fhir-up          - Start WSO2 FHIR (8290) and HAPI FHIR (8080, adhya_fhir DB) [F12 Preview]"
	@echo "  make fhir-down        - Stop FHIR services"
	@echo "  make openchoreo-up    - Start OpenChoreo / Choreo Connect Router (9095) [F17 Preview]"
	@echo "  make openchoreo-down  - Stop OpenChoreo Router"
	@echo "  make platform-up      - Start full platform preview (Postgres, Siddhi, WSO2, FHIR, OpenChoreo)"
	@echo "  make platform-down    - Stop all platform containers"

validate: lint-md test
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

test:
	go test -v ./...

build:
	mkdir -p bin
	go build -v -o bin/server ./cmd/server

run:
	go run ./cmd/server

lint-md:
	@if command -v npx >/dev/null 2>&1; then \
		npx --yes markdownlint-cli2 "**/*.md"; \
	else \
		echo "npx not found, skipping local markdownlint (CI will validate)."; \
	fi

compose-config:
	docker compose --profile platform config --quiet

# Core Database (F01 Foundation Baseline)
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

# Siddhi (F13 Event Processing Preview)
siddhi-up:
	docker compose --profile siddhi up -d siddhi-runner

siddhi-down:
	docker compose stop siddhi-runner

# WSO2 APIM + IS (F14 API Gateway & IAM Preview)
wso2-up:
	docker compose --profile wso2 up -d wso2-apim wso2-is

wso2-down:
	docker compose stop wso2-apim wso2-is

# FHIR (WSO2 MI + HAPI FHIR) (F12 Interoperability Preview)
fhir-up:
	docker compose --profile fhir up -d postgres wso2-fhir hapi-fhir

fhir-down:
	docker compose stop wso2-fhir hapi-fhir

# OpenChoreo (F17 Cloud-Native Ingress Preview)
openchoreo-up:
	docker compose --profile openchoreo up -d openchoreo-router

openchoreo-down:
	docker compose stop openchoreo-router

# Full Platform Preview
platform-up:
	docker compose --profile platform up -d

platform-down:
	docker compose down
