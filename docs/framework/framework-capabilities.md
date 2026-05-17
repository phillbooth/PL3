# Framework: Capabilities

## Purpose

Capabilities describe what an actor, service, package, flow or tool is
authorised to do.

## Short Definition

A capability is declared authority for protected action or protected data
access.

## Examples

```text
users.pii.read
users.email.update
orders.refund
payments.charge
ai.external_tool.call
dataset.export
```

## Capabilities Versus Effects

| Concept | Meaning | Example |
|---|---|---|
| `effects` | What the code is technically allowed to do | `db.read`, `db.write`, `audit.write` |
| `capabilities` | What the actor is authorised to do | `users.read`, `users.email.update`, `users.pii.read` |

You normally need both.

## Permission Relationship

Normal developers should usually use `permission` blocks. A permission compiles
into actor capabilities, code effects, data exposure rules, audit requirements
and reports.

## Security Rules

- Capabilities must be explicit.
- Sensitive capabilities require audit-friendly reports.
- Missing capabilities must fail closed.
- Capability inheritance must be visible in effective policy reports.

## Generated Reports

```text
capability-report.json
policy-effective-report.json
security-report.json
```

## v1 Scope

Capability names, route/flow/package links and effective capability reports.

## Knowledge Base

See [Capabilities](../Knowledge-Bases/capabilities.md) and
[Permission, Capability And Actor Model](../Knowledge-Bases/permission-capability-actor-model.md).
