# LO Project Graph

`lo-project-graph` is the package for LO project knowledge graph contracts.

It belongs in:

```text
/packages/lo-project-graph
```

Use this package for:

```text
project graph nodes
project graph relationships
package ownership maps
document and decision links
policy and unsafe feature classification
report output manifests
AI assistant map files
graph query, path and explain request contracts
```

## Graphify-Style Role

Graphify-style tooling is useful as inspiration and as an optional external
developer tool. `lo-project-graph` defines LO-native graph contracts so package,
documentation, policy and report relationships can be represented consistently.

This package must not become part of LO core, compile-time security enforcement
or production runtime.

## Boundary

`lo-project-graph` explains relationships. It does not enforce security,
compile source code, run tasks, serve HTTP or replace compiler checks.

Final rule:

```text
lo-project-graph maps and explains the project.
lo-core and lo-compiler define language checks.
lo-security and runtime packages enforce policy.
```
