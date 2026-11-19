.PHONY: help up down logs dev-ai dev-api dev-web dev-admin test test-ai test-api test-web build clean

help:
	@echo "VN-MURL SafeWeb — Developer Command Shortcuts"
	@echo "--------------------------------------------------"
	@echo "make up          - Start all containers via Docker Compose"
	@echo "make down        - Stop all Docker containers"
	@echo "make logs        - Follow Docker container logs"
	@echo "make dev-ai      - Run FastAPI AI Microservice locally (:8000)"
	@echo "make dev-api     - Run ASP.NET Core 8 API locally (:5000)"
	@echo "make dev-web     - Run React Web User Portal (:3000)"
	@echo "make dev-admin   - Run React Web Admin SOC Portal (:3001)"
	@echo "make test        - Run all automated test suites"
	@echo "make test-ai     - Run pytest for AI microservice"
	@echo "make build       - Build all project components"
	@echo "make clean       - Clean temporary build and cache artifacts"

up:
	docker compose up --build -d

down:
	docker compose down

logs:
	docker compose logs -f

dev-ai:
	cd src/ai-service && uvicorn app:app --host 0.0.0.0 --port 8000 --reload

dev-api:
	cd src/api && dotnet run

dev-web:
	cd src/web && npm run dev:user

dev-admin:
	cd src/web && npm run dev:admin

test: test-ai test-web

test-ai:
	cd src/ai-service && pytest tests/ -v

test-api:
	cd src/api && dotnet build -c Release

test-web:
	cd src/web && npm run build

build:
	cd src/ai-service && python -m compileall .
	cd src/api && dotnet build -c Release
	cd src/web && npm run build

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name "bin" -exec rm -rf {} +
	find . -type d -name "obj" -exec rm -rf {} +

