# Getting Started

## Prerequisites

- Python 3.11 or later
- Node.js 22 or later (with npm)
- Git
- Docker and Docker Compose (optional, for containerized development)

## Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ui-insight/{{PROJECT_NAME}}.git
cd {{PROJECT_NAME}}
```

### 2. Backend Setup

```bash
docker compose up -d postgres

cd backend
python -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Environment Configuration

```bash
cp ../.env.example ../.env
# Edit .env with your settings (defaults target the local Postgres container)
```

### 4. Start the Backend

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

The API is now available at `http://localhost:8000`. Visit `http://localhost:8000/docs`
for the interactive API documentation (Swagger UI).

### 5. Frontend Setup (New Terminal)

```bash
cd frontend
npm install
npm run dev
```

The frontend is now available at `http://localhost:5173`.

### 6. Verify Everything Works

- Frontend loads at `http://localhost:5173`
- API health check at `http://localhost:5173/api/v1/health` returns `{"status": "healthy"}`

## Docker Alternative

```bash
docker compose up --build
```

Access the application at `http://localhost:9200`.

## Running Tests

```bash
# Backend
cd backend && pytest -v --tb=short

# Frontend
cd frontend && npm run build && npm test

# Docs / template integrity
python scripts/check_template_docs.py
```

## Running the E2E Smoke Test

```bash
cd e2e
npm install
npm test
```

The Playwright config starts the frontend dev server automatically, so this
smoke test does not require the backend for the default homepage check.

If Playwright reports that Chromium is missing on first run, run:

```bash
cd e2e
npm run install:browsers
```

## Next Steps

- Read `CLAUDE.md` to understand the project conventions
- Treat `CLAUDE.md` as the canonical tracked agent guide; keep any local `AGENTS.md` copy in sync rather than editing both independently
- Use PostgreSQL as the default application database; keep SQLite limited to tests or isolated experiments
- Review the [Coding Standards](coding-standards.md)
- Check the [Architecture Overview](../architecture/overview.md)
- Review the [Deployment Quick Start](../deployment/quickstart.md)
