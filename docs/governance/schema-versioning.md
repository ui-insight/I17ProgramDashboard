# Schema Versioning

This template includes SQLAlchemy and Alembic in the default stack, but projects
often begin with simple local iteration before their schema stabilizes.

## Development Posture

The starter app currently creates tables from ORM metadata on startup for
zero-configuration local development.

That is useful early, but it should not be the long-term migration strategy for
production systems.

## Recommended Policy

1. Use metadata-driven startup only for early local iteration.
2. Introduce and maintain Alembic migrations as soon as persistent models and
   real data lifecycles appear.
3. Never change a deployed schema manually.
4. Review schema changes alongside their data-governance implications.

## Change Checklist

- [ ] model changes reviewed
- [ ] matching Pydantic schemas updated
- [ ] migration generated and reviewed
- [ ] tests updated
- [ ] data lineage docs updated if data flow changed

## Guidance for Template Consumers

If your project is moving beyond prototype-stage persistence, add:

- `backend/alembic.ini`
- `backend/migrations/`
- deployment steps that run `alembic upgrade head`

Document the chosen migration workflow here once it is established.
