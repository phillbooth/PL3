# Testing

## Summary

This workspace currently uses the LO core prototype for checked Run Mode smoke
tests. These tests execute `.lo` source directly and do not produce compiled
artefacts.

## Current Smoke Test

The app-kernel package has a hello-world fixture:

```text
packages/lo-app-kernel/tests/hello-world.lo
```

Run it from the workspace root:

```bash
npm.cmd --prefix packages/lo-app-kernel run test:hello
```

Expected output:

```text
hello from LO app kernel test
```

## Test Types

- Checked Run Mode smoke tests
- Unit tests
- Integration tests
- Security checks
- Manual testing
- Build verification

## Test Structure

```text
packages/app/tests/
|-- unit/
`-- integration/

packages/lo-app-kernel/tests/
`-- hello-world.lo
```
