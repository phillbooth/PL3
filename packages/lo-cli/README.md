# LO CLI

`lo-cli` is the command-line interface for LO developers.

It belongs in:

```text
/packages/lo-cli
```

It coordinates other LO packages instead of owning language, runtime, server or
application behaviour.

## Responsibilities

```text
read project configuration
load environment mode
call the compiler
call the runtime
start server tools
run task tools
print safe output
generate reports
show diagnostics
```

## Early Commands

```text
lo check
lo build
lo run
lo serve
lo reports
lo security:check
lo routes
lo task
```

## Security Rules

CLI output is safe by default. It must redact `SecureString` values, bearer
tokens, API keys, cookies, database passwords and private key material.

Production mode is strict and should fail when critical unsafe features are
enabled without explicit reason.

## Non-Goals

`lo-cli` must not contain business logic, routing logic, authentication logic,
ORM logic, template rendering, CMS features, admin UI or frontend framework
behaviour.
