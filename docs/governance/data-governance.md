# Data Governance

This document defines the data governance standards for {{PROJECT_NAME}}.

## Principles

1. **Data is an asset** — treat all data with appropriate care and documentation
2. **Classify before storing** — determine data sensitivity before designing storage
3. **Minimize collection** — only collect data that is necessary for the application
4. **Document lineage** — track where data comes from and where it goes
5. **Secure by default** — apply the most restrictive access appropriate to the data class

## Database Conventions

### Development
- PostgreSQL 16 via asyncpg is the standard application database in local and deployed environments
- Seed data for development in `backend/app/db/seed.py`
- Early scaffold stages may bootstrap tables automatically in `DEV_MODE=true`

### Production
- PostgreSQL 16 via asyncpg
- Alembic for schema migrations (never modify production schema manually)
- Regular backups with tested restore procedures

### Test and Fallback Usage
- SQLite via aiosqlite is reserved for isolated tests and one-off local experiments

### Schema Standards
- All models extend the common `Base` class from `backend/app/db/base.py`
- One SQLAlchemy model file per resource in `backend/app/models/`
- Corresponding Pydantic schema file in `backend/app/schemas/`
- Use SQLAlchemy relationships for foreign key associations
- Add database indexes for frequently queried columns

## Data Flow Documentation

Document the flow of data through your application:

1. **Ingestion** — how data enters the system (user input, API, file upload, integration)
2. **Processing** — how data is transformed or enriched
3. **Storage** — where data is persisted and for how long
4. **Access** — who can view or modify data and through what interfaces
5. **Export** — how data leaves the system (reports, APIs, integrations)

Capture the resulting inventory in [Data Lineage](data-lineage.md).

## Regulatory Compliance

Depending on the data your application handles, you may need to comply with:

| Regulation | Applies When |
|---|---|
| **FERPA** | Handling student education records |
| **HIPAA** | Handling protected health information |
| **GDPR** | Processing data of EU residents |
| **PCI-DSS** | Processing payment card data |
| **GLBA** | Handling financial information |
| **State Laws** | Various state-specific data privacy requirements |

Document which regulations apply in this file as your application's data model becomes clear.

## Data Retention

Define retention policies for each category of data:

| Data Category | Retention Period | Disposal Method |
|---|---|---|
| _Example: User accounts_ | _Active + 1 year_ | _Soft delete, then purge_ |
| _Example: Audit logs_ | _7 years_ | _Archive, then delete_ |

## Reference

For a detailed data governance implementation, see:
- [OpenERA Data Lineage](https://github.com/ui-insight/OpenERA/blob/main/docs/governance/data-lineage.md)
- [OpenERA UDM Conformance](https://github.com/ui-insight/OpenERA/blob/main/docs/governance/udm-conformance.md)
