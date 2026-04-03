# Configuration Reference

This page describes the baseline environment variables included in the template.

## Core Application Variables

| Variable | Default | Purpose |
|---|---|---|
| `DATABASE_URL` | `postgresql+asyncpg://postgres:postgres@localhost:5432/app` | Database connection string |
| `SECRET_KEY` | `change-me-in-production` | JWT signing secret |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `480` | Token lifetime in minutes |
| `DEV_MODE` | `true` | Enables development-friendly behavior |
| `UPLOAD_DIR` | `./uploads` | Root directory for uploaded files |
| `CORS_ORIGINS` | `["http://localhost:5173"]` | Allowed frontend origins |

## Deployment Notes

- Change `SECRET_KEY` before any non-development deployment.
- Set `DEV_MODE=false` in staging and production.
- PostgreSQL is the standard app database for local, staging, and production environments.
- Keep SQLite only as an isolated fallback for tests or temporary experiments.
- Restrict `CORS_ORIGINS` to real application origins in deployed environments.

## Optional Documentation Deployment

The template includes a GitHub Pages docs deployment workflow in
`.github/workflows/docs.yml`.

- Keep it if the project will publish docs from GitHub Pages.
- Remove or disable it if documentation is hosted elsewhere.

## Security Automation Outputs

The template now includes:

- dependency audit artifacts from `.github/workflows/security-scan.yml`
- CycloneDX SBOM artifacts from `.github/workflows/sbom.yml`

Expected artifact filenames:

- `pip-audit-results.json`
- `npm-audit-results.json`
- `sbom-python.cdx.json`
- `sbom-javascript.cdx.json`

Document any additional project-specific environment variables here as the
application evolves.
