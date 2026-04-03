# {{PROJECT_NAME}}

> **This repository was created from the [UI-Insight TEMPLATE-app](https://github.com/ui-insight/TEMPLATE-app).**
> Replace this section with a description of your application.

## About This Template

This template provides a production-ready starting point for building university business
applications with AI-assisted (agentic) development. It defines:

- **Tech Stack**: React 19 + TypeScript + Tailwind CSS frontend, FastAPI + SQLAlchemy backend, PostgreSQL standard database
- **Documentation Standards**: MkDocs Material site with architecture, governance, and security docs
- **Data Governance**: Classification framework, handling rules, and database conventions
- **Security Standards**: JWT auth, RBAC, dependency scanning, and institutional review checklist
- **CI/CD**: GitHub Actions for testing, linting, and security scanning
- **Agent Guidance**: `CLAUDE.md` provides comprehensive context for AI coding agents
- **Docs Automation**: strict MkDocs validation, optional docs deployment, and template integrity checks
- **Security Artifacts**: dependency audit artifacts and CycloneDX SBOM generation
- **Browser Smoke Tests**: Playwright `e2e/` scaffold for end-to-end validation

### Reference Implementation

This template follows patterns established in [OpenERA](https://github.com/ui-insight/OpenERA),
the University of Idaho's open-source electronic research administration system.

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 22+ and npm
- Docker and Docker Compose (optional, for containerized development)

### Using This Template

1. Click **"Use this template"** on GitHub (or clone and remove git history)
2. Find and replace `{{PROJECT_NAME}}` with your project name across all files
3. Update `CLAUDE.md` with your project description and any project-specific rules
4. Update this `README.md` with your project's overview
5. Review `.github/CODEOWNERS`, `SECURITY.md`, Postgres settings, and docs deployment settings for your real maintainers and hosting setup

This template tracks `CLAUDE.md` as the canonical repository agent guide and
`AGENTS.md` as a synchronized companion file for toolchains that read it. Keep
them aligned instead of maintaining two divergent rule sets by hand.

### First Customization Check

After your initial rename pass, run:

```bash
python scripts/check_template_docs.py
```

That catches unexpected leftover template placeholders and broken MkDocs nav links.

### Development Setup

**Backend** (Terminal 1):
```bash
docker compose up -d postgres

cd backend
python -m venv .venv
source .venv/bin/activate    # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example ../.env   # Defaults target the local Postgres container
uvicorn app.main:app --reload --port 8000
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm install
npm run dev
```

The frontend dev server runs at `http://localhost:5173` and proxies API requests to `http://localhost:8000`.
The standard local database is PostgreSQL on `localhost:5432`; SQLite is kept only as an optional fallback for isolated experiments.

### Docker

```bash
docker compose up --build
```

Access the application at `http://localhost:9200`. The stack includes PostgreSQL, the FastAPI backend, and the nginx-served frontend.

---

## Project Structure

```
├── backend/              # FastAPI application
│   ├── alembic.ini       # Migration configuration
│   ├── app/
│   │   ├── api/v1/       # Route handlers
│   │   ├── auth/         # Authentication logic
│   │   ├── db/           # Database engine and seeds
│   │   ├── models/       # SQLAlchemy ORM models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   ├── config.py     # Settings
│   │   └── main.py       # App entry point
│   ├── migrations/       # Alembic migration environment
│   └── tests/
├── frontend/             # React application
│   └── src/
│       ├── api/          # API client modules
│       ├── components/   # UI components
│       ├── pages/        # Route pages
│       └── types/        # TypeScript interfaces
├── docs/                 # MkDocs documentation
├── e2e/                  # Playwright smoke tests
├── AGENTS.md             # Synchronized agent guide for compatible toolchains
├── CLAUDE.md             # Canonical tracked AI agent context
├── .claude/README.md     # Local tool-helper guidance
├── scripts/              # Template maintenance helpers
└── docker-compose.yml
```

See `CLAUDE.md` for the complete project structure and conventions.

---

## Development

### Running Tests

```bash
# Backend
cd backend && pytest -v --tb=short

# Frontend
cd frontend && npm run build && npm test
```

### Linting and Formatting

```bash
# Backend
cd backend && ruff check . && ruff format .

# Frontend
cd frontend && npx eslint .
```

### Database Migrations

```bash
cd backend
./.venv/bin/alembic revision --autogenerate -m "describe change"
./.venv/bin/alembic upgrade head
```

The scaffold still auto-creates tables in `DEV_MODE=true` for quick local starts,
but Postgres plus Alembic is the standard path once the app has real schema history.

### End-to-End Smoke Test

```bash
cd e2e
npm install
npm test
```

The Playwright config starts the frontend dev server automatically on
`http://127.0.0.1:4173` for the homepage smoke test.

If Playwright reports that Chromium is missing on first run, install it with:

```bash
cd e2e
npm run install:browsers
```

### Documentation

```bash
pip install mkdocs-material
python scripts/check_template_docs.py
mkdocs serve
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

All contributors must follow the [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting instructions.
CI also generates dependency audit artifacts and SBOMs from the GitHub Actions workflows.

---

## Acknowledgments

- Built on patterns from [OpenERA](https://github.com/ui-insight/OpenERA) by the University of Idaho
- Part of the [UI-Insight](https://github.com/ui-insight) initiative
