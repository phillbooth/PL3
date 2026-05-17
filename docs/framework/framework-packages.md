# Framework: Packages

## Purpose

Packages define code, dependency and authority boundaries.

## Short Definition

A package declares what it exports, what it keeps internal, what effects it may
use and what permissions it requires.

## Syntax Example

```logicn
package users {
  export secure flow getUser
  export secure flow updateUserEmail

  internal repository UsersRepository
  internal flow calculateRisk
}
```

## Security Rules

- Package exports must be explicit.
- Internal flows and repositories must not become public by accident.
- Package effects and required capabilities must be declared.
- Dependencies must be visible in package reports.
- Production profiles must exclude development-only and benchmark packages
  unless explicitly overridden with a reason.

## Generated Reports

```text
package-index.json
package-authority-report.json
package-dependency-report.json
package-network-report.json
```

## v1 Scope

Package ownership, exports, internal symbols, declared effects and dependency
reports.
