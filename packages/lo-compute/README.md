# LO Compute

`lo-compute` is the package for LO compute planning concepts.

It belongs in:

```text
/packages/lo-compute
```

Use this package for:

```text
compute plans
compute capabilities
compute budgets
compute effects
target selection
offload planning
fallback planning
compute reports
```

## Boundary

`lo-compute` should describe how work can be planned across targets. It should
not own target-specific binary output or photonic mapping.

Final rule:

```text
lo-compute plans work.
lo-target-binary emits binary/native target plans.
lo-target-photonic emits photonic target plans.
```
