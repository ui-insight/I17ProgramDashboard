# Security Overview

This document describes the security architecture and practices for {{PROJECT_NAME}}.

## Authentication

- **Method**: JWT (HS256) token-based authentication
- **Password storage**: bcrypt hashing with appropriate work factor
- **Token expiration**: configurable via `ACCESS_TOKEN_EXPIRE_MINUTES` environment variable
- **Token storage**: localStorage on the client (see Known Limitations below)

## Authorization

- **Model**: Role-Based Access Control (RBAC)
- **Implementation**: define roles appropriate to your application in `backend/app/auth/roles.py`
- **Enforcement**: FastAPI dependencies check user roles on protected endpoints

## Input Validation

- All API inputs validated through Pydantic schemas
- Frontend forms should implement client-side validation as well
- Never trust client-side validation alone — always validate server-side

## CORS

- Configured via `CORS_ORIGINS` environment variable
- Restricted to known frontend origins
- Must be properly configured for production deployment

## File Uploads

- Files stored with UUID-prefixed names to prevent path traversal
- Served through authenticated API endpoints only
- File type and size validation required
- Never serve uploaded files directly from the filesystem

## Secrets Management

- All secrets via environment variables (`.env` files, never committed)
- The application refuses to start in production with default `SECRET_KEY`
- See `.env.example` for all configurable secrets

## Dependency Security

- **Dependabot** enabled for automated vulnerability alerts
- **pip-audit** scans Python dependencies in CI
- **npm audit** scans JavaScript dependencies in CI
- **CycloneDX SBOMs** generated in CI for Python and JavaScript dependencies
- Regular dependency updates via automated pull requests

### Security Artifacts

The template CI emits reviewable security artifacts:

- `pip-audit-results.json` from the Python dependency audit workflow
- `npm-audit-results.json` from the JavaScript dependency audit workflow
- `sbom-python.cdx.json` as the Python CycloneDX SBOM
- `sbom-javascript.cdx.json` as the JavaScript CycloneDX SBOM

These artifacts are intended for CI review and recordkeeping. Local generation
may require network access to install audit or SBOM tooling.

## Known Limitations

!!! warning "Development Defaults"
    The following are acceptable for development but must be addressed before production:

    - JWT tokens stored in localStorage (vulnerable to XSS; consider httpOnly cookies for production)
    - Default local PostgreSQL credentials and connection string (must be replaced for shared or production environments)
    - Optional SQLite fallback should stay limited to isolated local experiments
    - Default `SECRET_KEY` (must be changed)
    - `DEV_MODE=true` bypasses security checks

## Production Checklist

Before deploying to production, verify:

- [ ] `SECRET_KEY` changed from default
- [ ] `DEV_MODE` set to `false`
- [ ] PostgreSQL configured as database
- [ ] CORS origins restricted to production domain(s)
- [ ] HTTPS configured (TLS termination at load balancer or reverse proxy)
- [ ] File upload limits configured
- [ ] Rate limiting configured
- [ ] Logging and monitoring enabled
- [ ] Dependency audit passing (`pip-audit`, `npm audit`)

## Reference

For a comprehensive security implementation example, see:
[OpenERA Security Overview](https://github.com/ui-insight/OpenERA/blob/main/docs/security/overview.md)
