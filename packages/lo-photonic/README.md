# LO Photonic

`lo-photonic` is the package for photonic and wavelength hardware concepts.

It belongs in:

```text
/packages/lo-photonic
```

Use this package for:

```text
Wavelength
Phase
Amplitude
OpticalSignal
OpticalChannel
photonic target planning
photonic simulation
logic-to-light mapping
```

## Boundary

`lo-photonic` must not own `Tri`, `Logic<N>` or Omni logic semantics. Those
belong in `lo-logic`.

Photonic may map logic states to light properties:

```text
Decision.Deny   -> phase 180deg
Decision.Review -> amplitude 0
Decision.Allow  -> phase 0deg
```

Final rule:

```text
lo-logic handles the logic model.
lo-photonic handles photonic representation and target planning.
```
