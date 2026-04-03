# Data Classification

All data stored or processed by {{PROJECT_NAME}} must be classified according to the
following framework, aligned with university data governance policy.

## Classification Levels

### Public
- **Definition**: Information that can be freely shared with anyone
- **Examples**: published research, public event information, directory listings
- **Controls**: no special access controls required
- **Storage**: standard database storage

### Internal
- **Definition**: information intended for use within the university community
- **Examples**: internal policies, operational data, non-sensitive business records
- **Controls**: authentication required; available to all authenticated users
- **Storage**: standard database storage with authenticated access

### Confidential
- **Definition**: information that could cause harm if disclosed inappropriately
- **Examples**: personnel records, financial data, draft policies, internal communications
- **Controls**: role-based access control; encryption at rest recommended
- **Storage**: encrypted database fields or encrypted volumes

### Restricted
- **Definition**: information protected by law, regulation, or contractual obligation
- **Examples**: SSN, FERPA-protected records, HIPAA data, financial account numbers
- **Controls**: strict role-based access; encryption at rest required; audit logging
- **Storage**: encrypted fields; access logged; data minimization enforced
- **Additional**: never store SSN, DOB, or banking information unless absolutely required

## Data Inventory

Maintain an inventory of all data elements your application handles:

| Data Element | Classification | Location | Access Roles | Regulation |
|---|---|---|---|---|
| _Example: User email_ | _Internal_ | _users table_ | _All authenticated_ | _None_ |
| _Example: Employee salary_ | _Confidential_ | _personnel table_ | _Admin only_ | _None_ |
| _Example: Student GPA_ | _Restricted_ | _N/A (do not store)_ | _N/A_ | _FERPA_ |

Update this inventory as new data elements are added to the application.

## Handling Rules by Classification

| Rule | Public | Internal | Confidential | Restricted |
|---|---|---|---|---|
| Authentication | No | Yes | Yes | Yes |
| Authorization (RBAC) | No | Optional | Yes | Yes |
| Encryption at rest | No | No | Recommended | Required |
| Encryption in transit | Recommended | Yes | Yes | Yes |
| Audit logging | No | No | Recommended | Required |
| Data retention policy | Optional | Yes | Yes | Yes |
| Disposal procedures | None | Delete | Secure delete | Secure delete + audit |

## Reference

For an example of data classification in practice, see:
[OpenERA Security Data Handling](https://github.com/ui-insight/OpenERA/blob/main/docs/security/data-handling.md)
