# I-17 Program Dashboard

A web application for the University of Idaho to manage SEVP certification compliance.
Tracks ~425 academic programs required for the Form I-17 recertification process
submitted to ICE/DHS, enabling the university to enroll F-1 and M-1 nonimmigrant
students and issue I-20 immigration documents.

> **Built from the [UI-Insight TEMPLATE-app](https://github.com/ui-insight/TEMPLATE-app).**

## Data Security

**Raw institutional data is never committed to this repository.** The application reads
data from a configurable local directory (`DATA_DIR`). All `.xlsx`, `.csv`, and `.tsv`
files are gitignored. Test fixtures use synthetic data only.

---

## Quick Start (Local Development)

### Prerequisites

- Python 3.11+ (3.13 recommended)
- Node.js 22+ and npm
- Docker and Docker Compose (optional, for PostgreSQL)

### Backend

```bash
# Start PostgreSQL (or use SQLite — see .env.example)
docker compose up -d postgres

cd backend
python3.13 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example ../.env
# Edit .env: set DATA_DIR to your local spreadsheet directory
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The dashboard proxies API requests to the backend.

### Import Data

```bash
cd backend
source .venv/bin/activate
python -m app.services.import_programs "Recertification Program List 2026.xlsx"
```

The filename is relative to `DATA_DIR` (set in `.env`). Use `--dry-run` to preview without importing.

---

## Running Tests

```bash
# Backend (12 tests)
cd backend && source .venv/bin/activate && pytest -v --tb=short

# Frontend
cd frontend && npm run build && npm test
```

### Linting

```bash
# Backend
cd backend && source .venv/bin/activate && ruff check . && ruff format --check .

# Frontend
cd frontend && npx eslint .
```

---

## Project Structure

```
├── backend/              # FastAPI application
│   ├── app/
│   │   ├── api/v1/       # Route handlers (programs CRUD)
│   │   ├── models/       # SQLAlchemy ORM models (Program)
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic (import_programs)
│   │   └── config.py     # Settings (DATA_DIR, DATABASE_URL, etc.)
│   ├── migrations/       # Alembic
│   └── tests/            # pytest (12 tests)
├── frontend/             # React + TypeScript + Tailwind
│   └── src/
│       ├── api/          # API client (programs)
│       ├── components/   # ProgramTable, ProgramFilters, Pagination
│       ├── pages/        # ProgramsPage, ProgramDetailPage
│       └── types/        # TypeScript interfaces
├── docs/
│   └── ROADMAP.md        # Project roadmap and module plan
├── CLAUDE.md             # AI agent guidance (includes data security policy)
└── docker-compose.yml
```

See [docs/ROADMAP.md](docs/ROADMAP.md) for the full module roadmap.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). All contributors must follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Acknowledgments

- Built on patterns from [OpenERA](https://github.com/ui-insight/OpenERA) by the University of Idaho
- Part of the [UI-Insight](https://github.com/ui-insight) initiative
