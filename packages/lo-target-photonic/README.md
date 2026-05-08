# LO Target Photonic

`lo-target-photonic` is the package for LO photonic target backend planning.

It belongs in:

```text
/packages/lo-target-photonic
```

Use this package for:

```text
photonic backend plans
photonic target capabilities
logic-to-photonic lowering plans
photonic simulation targets
photonic target reports
```

## Boundary

`lo-target-photonic` should use `lo-photonic` concepts such as wavelength,
phase, amplitude, optical signal and optical channel. It should not own the
general photonic vocabulary itself.

Final rule:

```text
lo-photonic defines photonic concepts.
lo-target-photonic plans target backend output using those concepts.
```
