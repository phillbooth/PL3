# LO Target AI Accelerator

`lo-target-ai-accelerator` is the package for NPU, TPU, AI-chip and related
accelerator target planning contracts.

It belongs in:

```text
/packages/lo-target-ai-accelerator
```

Use this package for:

```text
NPU target capability reports
TPU target capability reports
AI accelerator target planning
precision support reports
memory limit reports
model operation mapping plans
fallback reports
```

## Boundary

This package plans AI accelerator targets. It does not define neural network
models, tensor shapes, generic AI safety policy or CPU fallback kernels.

Related packages:

| Package | Responsibility |
|---|---|
| `lo-neural` | Neural model, layer, inference and training contracts |
| `lo-vector` | Vector, matrix and tensor shape contracts |
| `lo-ai` | Generic AI inference safety and report contracts |
| `lo-compute` | Target selection and fallback planning |
| `lo-target-cpu` | CPU fallback target planning |
| `lo-target-gpu` | GPU target planning |
| `lo-lowbit-ai` | Low-bit AI backend selection |
| `lo-target-photonic` | Future photonic target planning |

Final rule:

```text
lo-target-ai-accelerator maps suitable AI workloads to NPU/TPU/AI-chip plans.
It does not make any accelerator mandatory for LO.
CPU-compatible fallback remains the baseline.
```
