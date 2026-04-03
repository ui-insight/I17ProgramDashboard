# Data Lineage

Use this page to record how important data moves through the application.

## Why Track Lineage

Data lineage helps reviewers answer:

- where data comes from
- how it is transformed
- where it is stored
- who can access it
- how it leaves the system

## Suggested Format

Track one row per important data flow:

| Data Set | Source | Processing | Storage | Consumers | Export / Retention Notes |
|---|---|---|---|---|---|
| _Example: user profile data_ | _signup form_ | _validation + normalization_ | _users table_ | _account admins_ | _retain while account active_ |

## Minimum Expectations

- identify any PII-bearing flows
- note whether uploaded files are stored, transformed, or forwarded elsewhere
- document external integrations and scheduled exports
- update this page when schema or workflow changes alter data movement
