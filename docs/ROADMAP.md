# I-17 Program Dashboard — Project Roadmap

## Project Purpose

The University of Idaho (Facility Code: 11901012) must maintain SEVP certification through the Form I-17 process administered by ICE/DHS. This certification allows the university to enroll F-1 and M-1 nonimmigrant students and issue immigration documents (I-20s). The recertification process requires tracking ~425 academic programs with detailed metadata including accreditation status, approval status, credit hours, modality, and more.

**This dashboard replaces manual spreadsheet-based tracking** with an interactive web application that supports compliance workflows, audit readiness, and collaborative human + AI-agent development.

## Data Security Policy

**Raw institutional data must NEVER be committed to the repository or processed by LLMs unless explicitly authorized.**

- The `.gitignore` excludes all `.xlsx`, `.csv`, `.xls`, `.tsv` files and `data/` directories
- The application reads data from a local directory path configured by the operator (Dana)
- All test fixtures and seed data in the repository must use **synthetic/example data only**
- AI coding agents must never include real program data in commits, prompts, or test files
- Database files (SQLite, PostgreSQL volumes) are gitignored

## MVP Deployment Model

The MVP runs **locally on Dana's machine only** — no cloud deployment. Dana points the application at local directories containing her spreadsheet data. The app ingests data into a local database and serves the dashboard on `localhost`.

## Tech Stack (from TEMPLATE-app)

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4 |
| Backend | FastAPI 0.133, Python 3.11+, Pydantic 2.12 |
| Database | PostgreSQL 16 local (async via SQLAlchemy 2 + asyncpg), or SQLite for simplicity |
| Auth | JWT (HS256) + bcrypt + RBAC (Phase 3 — MVP runs single-user) |
| Testing | pytest + Vitest + Playwright |
| CI/CD | GitHub Actions (lint, test, security scan, SBOM) |
| Docs | MkDocs Material |
| Containers | Docker Compose for local dev (optional — can run natively) |

---

## Module Roadmap

Development is organized into independent modules. Each module follows the pattern: **data model → API → UI → tests → docs**. Modules are designed so that a human developer or an AI coding agent can pick up any module and implement it end-to-end using the CLAUDE.md/AGENTS.md guidance.

---

### Module 0: Project Bootstrap (Foundation)
**Goal**: Customize the template for I-17 Program Dashboard identity and seed initial configuration.

| Task | Description | Agent-Friendly? |
|------|-------------|-----------------|
| 0.1 | Update README.md, mkdocs.yml, package.json, pyproject.toml with project name/description | Yes |
| 0.2 | Configure `.env.example` with project-specific defaults (including `DATA_DIR` for local data path) | Yes |
| 0.3 | Update CLAUDE.md/AGENTS.md project overview section (include data security policy) | Yes |
| 0.4 | Create initial Alembic migration infrastructure | Yes |
| 0.5 | Verify Docker Compose stack starts cleanly | Yes |
| 0.6 | Write ADR-003: I-17 Program data model design decisions | Yes |

**Depends on**: Nothing (start here)

---

### Module 1: Program Data Model & CRUD API
**Goal**: Model the ~425 academic programs from the recertification spreadsheet as a database-backed resource with full CRUD API.

#### Data Model: `Program`

Derived from the "PROGRAM SHEET" in the recertification spreadsheet:

| Field | Type | Source Column | Constraints |
|-------|------|---------------|-------------|
| `id` | UUID | (generated) | PK |
| `row_number` | Integer | # | Display ordering |
| `program_name` | String(500) | Program Name | Required, indexed |
| `is_accredited` | Boolean | Accredited? Yes or No | Required |
| `educational_objective` | Enum | Educational Objective | Associate, Bachelor, Certificate, Doctorate, Graduate Cert, Masters, Diploma, Academy, Apprenticeship, OJT, Journeyman, Vocational, Other |
| `has_concentrations` | Boolean | Concentrations? Yes or No | Required |
| `approval_status` | Enum | Approval Status | New Approved, Still Approved, No Longer Offered, Name Change, Withdrawn, Teach Out Phase, Deemed Approved |
| `effective_date` | Date (nullable) | Effective Date | Null for "Still Approved" |
| `date_instruction_began` | Date (nullable) | Date Instruction Began | Optional |
| `total_credit_hours` | Integer (nullable) | Total Credit Hours in Program | Null for clock-hour programs |
| `program_length_measurement` | Enum | Program Length Measurement | Semester, Quarter, Clock, Months, Years |
| `full_time_enrollment_hours` | Integer | Full-Time Enrollment | Required |
| `lab_classes_info` | Text (nullable) | Lab Classes | Free text |
| `instructional_sites` | String(500) (nullable) | Instructional Sites Program is Taught | e.g., "Moscow" |
| `additional_fees` | Text (nullable) | Additional Fees | Free text |
| `catalog_page` | String(50) | Page Number | Required |
| `is_license_cert_prep` | Boolean | State License or Cert Prep? | Required |
| `modality` | Enum | Modality | Resident, Distance, Hybrid, Both |
| `is_contracted` | Boolean | Contracted Program? | Required |
| `admission_standards` | Text (nullable) | Admission standards | Optional |
| `employment_cpt_required` | Boolean (nullable) | Employment/CPT Required? | Optional |
| `degree_plan_url` | String(1000) (nullable) | Degree Plan website | Optional |
| `comments` | Text (nullable) | Comments | Free text |
| `created_at` | DateTime | (generated) | Auto |
| `updated_at` | DateTime | (generated) | Auto |

#### Tasks

| Task | Description | Agent-Friendly? |
|------|-------------|-----------------|
| 1.1 | Create SQLAlchemy model `backend/app/models/program.py` | Yes |
| 1.2 | Create Pydantic schemas `backend/app/schemas/program.py` (Create, Update, Response, List) | Yes |
| 1.3 | Create API routes `backend/app/api/v1/programs.py` (GET list, GET by id, POST, PUT, DELETE) | Yes |
| 1.4 | Register router in `backend/app/api/v1/router.py` | Yes |
| 1.5 | Generate Alembic migration | Yes |
| 1.6 | Write pytest tests for all CRUD endpoints | Yes |
| 1.7 | Create data import script: parse spreadsheet from `DATA_DIR` → seed database (uses synthetic data in tests) | Yes |
| 1.8 | Add filtering/search API (by approval_status, educational_objective, modality, accreditation) | Yes |
| 1.9 | Add pagination support to list endpoint | Yes |

**Depends on**: Module 0

---

### Module 2: Program List UI
**Goal**: Build the primary dashboard view — a searchable, filterable, sortable table of all programs.

| Task | Description | Agent-Friendly? |
|------|-------------|-----------------|
| 2.1 | Create TypeScript types `frontend/src/types/program.ts` matching API schemas | Yes |
| 2.2 | Create API client functions `frontend/src/api/programs.ts` | Yes |
| 2.3 | Build `ProgramTable` component with sortable columns | Yes |
| 2.4 | Build filter bar (approval status, educational objective, modality, accreditation) | Yes |
| 2.5 | Build search input (program name full-text search) | Yes |
| 2.6 | Build `ProgramsPage` composing table + filters | Yes |
| 2.7 | Add route to App.tsx | Yes |
| 2.8 | Write Vitest component tests | Yes |
| 2.9 | Write Playwright e2e test for program list page | Yes |

**Depends on**: Module 1

---

### Module 3: Program Detail & Edit UI
**Goal**: View and edit individual program records through a form interface.

| Task | Description | Agent-Friendly? |
|------|-------------|-----------------|
| 3.1 | Build `ProgramDetail` page (read-only view) | Yes |
| 3.2 | Build `ProgramForm` component (create/edit with validation) | Yes |
| 3.3 | Implement enum dropdowns matching I-17 field constraints | Yes |
| 3.4 | Add inline validation matching backend Pydantic rules | Yes |
| 3.5 | Add route params and navigation | Yes |
| 3.6 | Write component and e2e tests | Yes |

**Depends on**: Module 2

---

### Module 4: Data Import/Export
**Goal**: Import programs from the existing Excel spreadsheet and export current data for SAA submission.

| Task | Description | Agent-Friendly? |
|------|-------------|-----------------|
| 4.1 | Backend: Excel upload endpoint (parse .xlsx, validate, preview changes) | Yes |
| 4.2 | Backend: Excel export endpoint (generate SAA-format spreadsheet) | Yes |
| 4.3 | Backend: CSV export endpoint | Yes |
| 4.4 | Frontend: Import wizard UI with preview/diff before commit | Yes |
| 4.5 | Frontend: Export buttons on program list page | Yes |
| 4.6 | Handle column mapping from SAA spreadsheet format to internal model | Yes |
| 4.7 | Write tests for import parsing edge cases | Yes |

**Depends on**: Module 1

---

### Module 5: Authentication & Authorization
**Goal**: Add user login and role-based access so that DSOs, PDSOs, and administrators have appropriate permissions.

| Task | Description | Agent-Friendly? |
|------|-------------|-----------------|
| 5.1 | Create User model and schemas | Yes |
| 5.2 | Implement registration and login endpoints | Yes |
| 5.3 | Define roles: Admin, PDSO, DSO, Viewer | Yes |
| 5.4 | Add RBAC middleware (viewers can read, DSOs can edit, PDSOs/Admins can delete/import) | Yes |
| 5.5 | Frontend: Login page and auth context | Yes |
| 5.6 | Frontend: Protected routes and role-based UI elements | Yes |
| 5.7 | Write auth tests | Yes |

**Depends on**: Module 0 (can be developed in parallel with Modules 1-3)

---

### Module 6: Change Tracking & Audit Log
**Goal**: Track all modifications to program records for compliance and audit purposes.

| Task | Description | Agent-Friendly? |
|------|-------------|-----------------|
| 6.1 | Create `AuditLog` model (who changed what, when, old/new values) | Yes |
| 6.2 | Implement SQLAlchemy event listeners or service-layer logging | Yes |
| 6.3 | API endpoint to retrieve audit history for a program | Yes |
| 6.4 | Frontend: Change history panel on program detail page | Yes |
| 6.5 | Frontend: Global activity log page for admins | Yes |
| 6.6 | Write tests | Yes |

**Depends on**: Modules 1, 5

---

### Module 7: Recertification Workflow & Status Dashboard
**Goal**: Track the overall recertification cycle — which programs have been reviewed, flagged, or need attention.

| Task | Description | Agent-Friendly? |
|------|-------------|-----------------|
| 7.1 | Add `review_status` field to Program (Not Reviewed, In Review, Approved, Flagged) | Yes |
| 7.2 | Build dashboard summary cards (total programs, by status, by objective, by modality) | Yes |
| 7.3 | Build charts/visualizations (status distribution, programs by college/department) | Yes |
| 7.4 | Add batch status update API (mark multiple programs as reviewed) | Yes |
| 7.5 | Frontend: Dashboard home page with summary stats | Yes |
| 7.6 | Write tests | Yes |

**Depends on**: Modules 1, 2

---

### Module 8: Notifications & Compliance Alerts
**Goal**: Alert users when programs need attention (teach-out deadlines, missing data, upcoming recertification dates).

| Task | Description | Agent-Friendly? |
|------|-------------|-----------------|
| 8.1 | Define alert rules (teach-out programs without end dates, missing required fields, etc.) | Yes |
| 8.2 | Backend: Alert generation service | Yes |
| 8.3 | Backend: Notifications API | Yes |
| 8.4 | Frontend: Notification bell/panel | Yes |
| 8.5 | Write tests | Yes |

**Depends on**: Modules 1, 5

---

### Future Modules (Planned)

| Module | Description | Priority |
|--------|-------------|----------|
| 9: Multi-Location Support | Track programs across I-17A/B campus locations | Medium |
| 10: SEVIS Integration Prep | Data model alignment with SEVIS field requirements | Medium |
| 11: Reporting & Analytics | Trend analysis, year-over-year program changes | Low |
| 12: Document Management | Attach catalogs, accreditation letters, SAA correspondence | Medium |
| 13: Multi-Institution Support | Support multiple facility codes for system-wide deployments | Low |

---

## Development Workflow

### For Human Developers
1. Pick a module/task from this roadmap
2. Create a feature branch: `feature/module-N-task-description`
3. Follow CLAUDE.md coding conventions
4. Run tests: `pytest` (backend), `npm test` (frontend)
5. Submit PR with CI passing

### For AI Coding Agents
1. Read CLAUDE.md/AGENTS.md for project rules
2. Reference this roadmap for task context and dependencies
3. Each task in the tables above is scoped for a single agent session
4. Follow the pattern: model → schema → route → test (backend) or type → api → component → test (frontend)
5. Include `Co-Authored-By` in commits per CLAUDE.md rules
6. Do not work on tasks whose dependencies are incomplete

### Agent Task Sizing
Tasks are intentionally scoped so that:
- Each task can be completed in a single agent session
- Tasks within a module can be done sequentially by one agent or distributed across multiple agents
- Cross-module dependencies are explicit (no hidden coupling)
- Each task produces testable, reviewable output

---

## Implementation Priority

```
Phase 1 (MVP):     Module 0 → Module 1 → Module 2 → Module 3
Phase 2 (Import):  Module 4
Phase 3 (Auth):    Module 5 → Module 6
Phase 4 (Ops):     Module 7 → Module 8
Phase 5 (Scale):   Modules 9-13
```

Phase 1 delivers a working dashboard that replaces the spreadsheet. Each subsequent phase adds a layer of production readiness.
