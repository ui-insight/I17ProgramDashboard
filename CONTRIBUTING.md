# Contributing to {{PROJECT_NAME}}

Thank you for your interest in contributing! This document provides guidelines for
contributing to this project.

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch from `main`
4. Follow the [development setup guide](docs/contributing/getting-started.md)
5. Replace template metadata and placeholders before shipping user-facing work

## Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes following the [coding standards](docs/contributing/coding-standards.md)
3. Write tests for new functionality
4. Ensure all tests pass: `cd backend && pytest` and `cd frontend && npm test`
5. Ensure linting passes: `cd backend && ruff check .` and `cd frontend && npx eslint .`
6. If docs or template guidance changed, run `python scripts/check_template_docs.py`
7. Commit with a descriptive message
8. Push and create a pull request

## Key Conventions

- **Backend**: Python 3.11+, FastAPI, async SQLAlchemy, Pydantic, Ruff formatting
- **Frontend**: React 19, TypeScript, Tailwind CSS only, functional components with hooks
- **Database**: PostgreSQL is the standard application database; SQLite is reserved for isolated tests or one-off local experiments
- **E2E**: Playwright smoke tests in `e2e/` for browser-level validation
- **Styling**: Tailwind utility classes only — no CSS component libraries
- **Testing**: pytest (backend), Vitest (frontend)
- **Branching**: feature branches from `main`, never direct commits to `main`

## AI-Assisted Contributions

When using AI coding agents:
- Include `Co-Authored-By: [Agent Name] <noreply@anthropic.com>` in commit messages
- Label pull requests with `ai-assisted`
- Fill in the Agent Context section of the PR template
- Treat `CLAUDE.md` as the maintained source of truth for tracked agent guidance
- Treat `AGENTS.md`, if used locally, as a derived or exported copy unless the project explicitly decides to track it
- See the [Agent Coordination Guide](docs/contributing/agent-coordination.md) for details

## Code of Conduct

All contributors must follow the [Code of Conduct](CODE_OF_CONDUCT.md).
