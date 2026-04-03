# Production Deployment

This template is designed to start simple in development and harden cleanly for
production deployments.

## Baseline Expectations

- run the FastAPI backend behind a production ASGI server
- standardize on PostgreSQL 16 via asyncpg
- manage schema changes through Alembic migrations
- terminate TLS at nginx, a load balancer, or your platform edge
- store secrets in environment variables or a managed secret store
- review CORS, upload paths, and log retention before launch

## Minimum Production Checklist

- [ ] `SECRET_KEY` changed from the template default
- [ ] `DEV_MODE=false`
- [ ] PostgreSQL configured and backed up
- [ ] HTTPS enabled
- [ ] CORS locked to known origins
- [ ] dependency scans reviewed
- [ ] SBOM artifacts generated and retained
- [ ] institutional security review completed

## Container Strategy

The included Docker setup is a starting point, not a complete institutional
deployment standard. Before production launch, confirm:

- image provenance and update cadence
- persistent storage for uploads if your app needs them
- backup and restore plans
- monitoring and alerting expectations

Use this page to document your project's final production topology once the
deployment target is known.
