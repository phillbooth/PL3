
---

# `AGENTS.md`

```md
# AGENTS.md

## Purpose

This file gives guidance to AI coding tools working on this repository.

## Project Type

This is a LO application template.

The repository contains:

- LO language/package files in `packages/LO/`
- Bespoke app files in `packages/app/`
- App documentation in `docs/`
- Helper scripts and generators in `tools/`

## Important Rules

- Do not place app-specific documentation inside `packages/LO/`.
- Do not place LO language documentation inside `docs/`.
- Keep the repository root clean.
- Do not commit secrets.
- Do not invent LO syntax without documenting it.
- Update relevant docs when changing architecture, requirements, security, API or deployment behaviour.

## Coding Rules

- Use strict typing.
- Handle undefined values explicitly.
- Handle errors explicitly.
- Keep files focused.
- Prefer small modules over large files.
- Keep compiler output out of Git unless specifically required.

## Documentation Rules

When adding or changing features, update:

- `docs/REQUIREMENTS.md`
- `docs/ARCHITECTURE.md`
- `docs/TASKS.md`
- `docs/CHANGELOG.md`

## Security Rules

- Never store real secrets in source control.
- Use `.env.example` for placeholder environment variables.
- Validate inputs.
- Avoid unsafe dynamic code execution.
- Keep runtime configuration separate from compiled output.

## Package Boundaries

### `packages/LO/`

Use for:

- LO language rules
- syntax
- type system
- compiler notes
- memory safety model
- examples
- standard library notes

### `packages/app/`

Use for:

- the actual app source
- app routes
- app modules
- app tests
- app build output
- app config

### `docs/`

Use for:

- requirements
- design
- architecture
- security
- API
- database
- deployment
- decisions
- changelog

### `tools/`

Use for:

- helper scripts
- generators
- local build utilities