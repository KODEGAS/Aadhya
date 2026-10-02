.PHONY: help validate compose-config db-up db-down k8s-render-base k8s-render-dev

help:
	@echo "Available Makefile targets:"
	@echo "  make validate         - Validate repository foundation files and env safety"
	@echo "  make compose-config   - Validate docker-compose.yml configuration"
	@echo "  make db-up            - Start local PostgreSQL database container"
	@echo "  make db-down          - Stop local PostgreSQL database container"
	@echo "  make k8s-render-base  - Render Kubernetes base manifests via Kustomize"
	@echo "  make k8s-render-dev   - Render Kubernetes dev overlay manifests via Kustomize"

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

k8s-render-base:
	kubectl kustomize k8s/base

k8s-render-dev:
	kubectl kustomize k8s/overlays/dev
