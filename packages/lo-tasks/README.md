# LO Tasks

`lo-tasks` is the safe task runner for LO projects.

It belongs in:

```text
/packages/lo-tasks
```

It provides typed, permissioned project automation as a safer alternative to raw
shell scripts.

## Responsibilities

```text
load task definitions
run named tasks
resolve dependencies
check permissions
enforce declared effects
support dry run mode
generate task reports
deny shell by default
redact safe output
return typed task results
```

## Safe Built-In Operations

Future task operations should prefer explicit built-ins:

```text
filesystem.copy()
filesystem.remove()
filesystem.mkdir()
filesystem.exists()
compiler.check()
compiler.build()
reports.generate()
schemas.generateJson()
openapi.generate()
tests.run()
```

## Unsafe Shell

Raw shell is disabled by default. If added later, it must require an `unsafe`
task, a reason, a timeout, permissions, reporting and redaction. Production mode
may deny shell entirely.

## Non-Goals

`lo-tasks` must not contain application behaviour, routing, authentication, ORM
logic, template rendering, admin UI, payment logic, queue drivers, CMS features
or business rules.
