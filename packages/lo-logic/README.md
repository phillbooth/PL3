# LO Logic

`lo-logic` is the package for LO multi-state logic concepts.

It belongs in:

```text
/packages/lo-logic
```

Use this package for:

```text
Tri
Logic<N>
Decision
RiskLevel
Omni logic
multi-state logic
conversion rules
truth tables
logic reports
```

## Boundary

`Tri` is a logic model. `Omni` is a wider logic model. Photonic support is a
hardware or compute mapping.

Final rule:

```text
lo-logic handles Tri, Logic<N> and Omni.
lo-photonic handles how logic may be represented using light.
```

## Naming Decision

Use `lo-logic`, not `lo-tri`.

`lo-tri` is too narrow because LO may support `Tri`, `Logic<4>`, `Logic<5>`,
`Logic<N>`, `Decision`, `RiskLevel`, Omni logic and multi-state compute.
