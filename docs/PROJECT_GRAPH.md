# Project Graph

## Summary

LO should support Graphify-style project maps as optional developer tooling.
The goal is to help humans and AI assistants understand package ownership,
documentation links, policies, reports and design decisions without treating
the graph as a compiler or runtime authority.

Primary references:

- https://graphify.net/
- https://github.com/safishamsi/graphify

## Package

```text
packages/lo-project-graph
```

The package owns graph contracts for:

```text
Package
Document
Flow
Type
Effect
Policy
UnsafeFeature
Report
Target
CompilerRule
RuntimeRule
SecurityRule
ComputeFeature
Decision
```

## Outputs

Recommended generated output paths:

```text
build/graph/lo-project-graph.json
build/graph/lo-project-graph.html
build/graph/LO_GRAPH_REPORT.md
build/graph/lo-ai-map.md
```

## CLI Direction

Current command:

```bash
lo graph
lo graph --out build/graph
```

Planned future query commands:

```bash
lo graph --html
lo graph --json
lo graph --report
lo graph query "Which package owns SecureString?"
lo graph explain lo-security
lo graph path lo-api-server lo-security
```

## Safety Rules

Project graphs must not:

```text
replace compiler checks
replace security reports
replace runtime enforcement
be required for production runtime
leak secrets into graph nodes or reports
silently send code, docs or media to model APIs
```

Project graph scans should:

```text
redact secrets by default
mark relationship confidence as EXTRACTED, INFERRED or AMBIGUOUS
make model-assisted extraction opt-in
record generated output paths
distinguish source facts from inferred relationships
```

## Boundary

The graph explains LO. It does not enforce LO.
