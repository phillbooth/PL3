# LO Vector

`lo-vector` is the package for LO vector value and vector operation concepts.

It belongs in:

```text
/packages/lo-vector
```

Use this package for:

```text
Vector<T, N>
vector dimensions
vector lanes
vector operations
vector safety rules
vector capability reports
vector lowering hints
```

## Boundary

`lo-vector` should not own compute target selection. That belongs in
`lo-compute`.

`lo-vector` should not own photonic representation. That belongs in
`lo-photonic` and `lo-target-photonic`.

Final rule:

```text
lo-vector describes vector values and operations.
lo-compute decides how compute work can be planned.
target packages decide how planned work is emitted.
```
