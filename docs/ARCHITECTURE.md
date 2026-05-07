# Architecture

## Overview

This workspace separates the LO language core from the bespoke app that uses it.
Language documentation, compiler notes, examples and schemas live in
`packages/lo-core/`. The optional Secure App Kernel design lives in
`packages/lo-app-kernel/`. App source and build configuration live in
`packages/app/`. App planning and operational documentation live in `docs/`.

## Main Structure

```text
LO-app/
|-- docs/
|-- packages/
|   |-- lo-core/
|   |-- lo-app-kernel/
|   `-- app/
`-- tools/
```

## Package Layers

```text
LO Core
  language/compiler/type system/effects/memory/compute

LO Secure App Kernel
  request lifecycle, validation, security, auth, rate limits, jobs and reports

LO Standard Packages
  HTTP adapters, SQL adapters, Redis queue, OpenAPI generator, JS/WASM generators

LO Full Frameworks
  web frameworks, CMS, admin UI, frontend adapters, ORM and template systems
```

The Secure App Kernel is a partial framework layer. It enforces safe runtime
boundaries, but it must not become a full Laravel, Django, React or WordPress
style framework.

## Checked Run Smoke Tests

The framework layer can be exercised without compiling by running LO core
checked Run Mode against `.lo` test fixtures.

```text
packages/lo-app-kernel/tests/
`-- hello-world.lo
```

The current smoke test runs through the LO core prototype:

```bash
npm.cmd --prefix packages/lo-app-kernel run test:hello
```
