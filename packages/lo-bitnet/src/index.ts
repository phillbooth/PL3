export type BitNetWeightSet = "ternary-b1.58";

export type BitNetQuantization = "i2_s" | "tl1" | "tl2";

export type BitNetEmbeddingQuantization = "none" | "f16" | "q6_k";

export type BitNetKernelFamily = "i2_s" | "tl1" | "tl2" | "auto";

export type BitNetRuntimeKind =
  | "bitnet.cpp"
  | "native-addon"
  | "external-process"
  | "plan-only";

export type BitNetDiagnosticSeverity = "warning" | "error";

export interface BitNetDiagnostic {
  readonly code: string;
  readonly severity: BitNetDiagnosticSeverity;
  readonly message: string;
  readonly path?: string;
}

export interface BitNetRuntimeAdapter {
  readonly name: string;
  readonly kind: BitNetRuntimeKind;
  readonly version?: string;
  readonly supportedQuantizations: readonly BitNetQuantization[];
  readonly supportedEmbeddingQuantizations: readonly BitNetEmbeddingQuantization[];
  readonly supportedKernelFamilies: readonly BitNetKernelFamily[];
}

export interface BitNetModelReference {
  readonly name: string;
  readonly path: string;
  readonly format: "gguf";
  readonly weightSet: BitNetWeightSet;
  readonly quantization: BitNetQuantization;
  readonly embeddingQuantization: BitNetEmbeddingQuantization;
  readonly parameterCount?: string;
  readonly maxContextTokens: number;
  readonly maxOutputTokens: number;
  readonly memoryEstimateBytes: number;
}

export interface BitNetGgufValidationResult {
  readonly model: BitNetModelReference;
  readonly valid: boolean;
  readonly diagnostics: readonly BitNetDiagnostic[];
}

export interface BitNetCpuRuntimeLimits {
  readonly threads: number;
  readonly timeoutMs: number;
  readonly maxPromptTokens: number;
  readonly maxOutputTokens: number;
  readonly memoryLimitBytes: number;
}

export interface BitNetCpuInferencePlan {
  readonly model: BitNetModelReference;
  readonly runtime: BitNetRuntimeKind;
  readonly kernelFamily: BitNetKernelFamily;
  readonly limits: BitNetCpuRuntimeLimits;
  readonly fallbackReason?: string;
  readonly report: true;
}

export interface BitNetInferenceReport {
  readonly modelName: string;
  readonly selectedTarget: "cpu.bitnet";
  readonly runtime: BitNetRuntimeKind;
  readonly quantization: BitNetQuantization;
  readonly embeddingQuantization: BitNetEmbeddingQuantization;
  readonly threads: number;
  readonly fallback: boolean;
  readonly diagnostics: readonly BitNetDiagnostic[];
}

export interface BitNetBenchmarkSample {
  readonly modelName: string;
  readonly runtime: BitNetRuntimeKind;
  readonly threads: number;
  readonly promptTokens: number;
  readonly outputTokens: number;
  readonly tokensPerSecond: number;
  readonly memoryBytes: number;
}

export interface BitNetBenchmarkReport {
  readonly samples: readonly BitNetBenchmarkSample[];
  readonly diagnostics: readonly BitNetDiagnostic[];
}

export function createBitNetCpuInferencePlan(
  model: BitNetModelReference,
  limits: BitNetCpuRuntimeLimits,
  options: {
    readonly runtime?: BitNetRuntimeKind;
    readonly kernelFamily?: BitNetKernelFamily;
    readonly fallbackReason?: string;
  } = {},
): BitNetCpuInferencePlan {
  return {
    model,
    runtime: options.runtime ?? "plan-only",
    kernelFamily: options.kernelFamily ?? "auto",
    limits,
    ...(options.fallbackReason === undefined
      ? {}
      : { fallbackReason: options.fallbackReason }),
    report: true,
  };
}

export function createBitNetInferenceReport(
  plan: BitNetCpuInferencePlan,
): BitNetInferenceReport {
  const diagnostics = validateBitNetCpuInferencePlan(plan);

  return {
    modelName: plan.model.name,
    selectedTarget: "cpu.bitnet",
    runtime: plan.runtime,
    quantization: plan.model.quantization,
    embeddingQuantization: plan.model.embeddingQuantization,
    threads: plan.limits.threads,
    fallback: plan.fallbackReason !== undefined,
    diagnostics,
  };
}

export function validateBitNetGgufModel(
  model: BitNetModelReference,
): BitNetGgufValidationResult {
  const diagnostics: BitNetDiagnostic[] = [];

  if (!model.path.toLowerCase().endsWith(".gguf")) {
    diagnostics.push({
      code: "LO_BITNET_GGUF_EXTENSION_REQUIRED",
      severity: "error",
      message: "BitNet model path must reference a GGUF file.",
      path: "model.path",
    });
  }

  if (model.weightSet !== "ternary-b1.58") {
    diagnostics.push({
      code: "LO_BITNET_WEIGHT_SET_UNSUPPORTED",
      severity: "error",
      message: "BitNet model must declare ternary-b1.58 weights.",
      path: "model.weightSet",
    });
  }

  if (model.maxContextTokens <= 0) {
    diagnostics.push({
      code: "LO_BITNET_CONTEXT_TOKENS_REQUIRED",
      severity: "error",
      message: "BitNet model requires a positive max context token limit.",
      path: "model.maxContextTokens",
    });
  }

  if (model.memoryEstimateBytes <= 0) {
    diagnostics.push({
      code: "LO_BITNET_MEMORY_ESTIMATE_REQUIRED",
      severity: "error",
      message: "BitNet model requires a positive memory estimate.",
      path: "model.memoryEstimateBytes",
    });
  }

  return {
    model,
    valid: diagnostics.every((diagnostic) => diagnostic.severity !== "error"),
    diagnostics,
  };
}

export function validateBitNetRuntimeAdapter(
  adapter: BitNetRuntimeAdapter,
  plan: BitNetCpuInferencePlan,
): readonly BitNetDiagnostic[] {
  const diagnostics: BitNetDiagnostic[] = [];

  if (!adapter.supportedQuantizations.includes(plan.model.quantization)) {
    diagnostics.push({
      code: "LO_BITNET_RUNTIME_QUANTIZATION_UNSUPPORTED",
      severity: "error",
      message: "BitNet runtime adapter does not support the model quantization.",
      path: "runtime.supportedQuantizations",
    });
  }

  if (
    !adapter.supportedEmbeddingQuantizations.includes(
      plan.model.embeddingQuantization,
    )
  ) {
    diagnostics.push({
      code: "LO_BITNET_RUNTIME_EMBEDDING_QUANTIZATION_UNSUPPORTED",
      severity: "error",
      message:
        "BitNet runtime adapter does not support the embedding quantization.",
      path: "runtime.supportedEmbeddingQuantizations",
    });
  }

  if (
    plan.kernelFamily !== "auto" &&
    !adapter.supportedKernelFamilies.includes(plan.kernelFamily)
  ) {
    diagnostics.push({
      code: "LO_BITNET_RUNTIME_KERNEL_UNSUPPORTED",
      severity: "error",
      message: "BitNet runtime adapter does not support the requested kernel.",
      path: "runtime.supportedKernelFamilies",
    });
  }

  return diagnostics;
}

export function validateBitNetCpuInferencePlan(
  plan: BitNetCpuInferencePlan,
): readonly BitNetDiagnostic[] {
  const diagnostics: BitNetDiagnostic[] = [];
  diagnostics.push(...validateBitNetGgufModel(plan.model).diagnostics);

  if (plan.model.path.trim().length === 0) {
    diagnostics.push({
      code: "LO_BITNET_MODEL_PATH_REQUIRED",
      severity: "error",
      message: "BitNet inference requires an explicit local model path.",
      path: "model.path",
    });
  }

  if (plan.limits.maxOutputTokens <= 0) {
    diagnostics.push({
      code: "LO_BITNET_MAX_OUTPUT_TOKENS_REQUIRED",
      severity: "error",
      message: "BitNet inference requires a positive max output token limit.",
      path: "limits.maxOutputTokens",
    });
  }

  if (plan.limits.threads <= 0) {
    diagnostics.push({
      code: "LO_BITNET_THREAD_LIMIT_REQUIRED",
      severity: "error",
      message: "BitNet inference requires a positive thread limit.",
      path: "limits.threads",
    });
  }

  if (plan.limits.timeoutMs <= 0) {
    diagnostics.push({
      code: "LO_BITNET_TIMEOUT_REQUIRED",
      severity: "error",
      message: "BitNet inference requires a positive timeout.",
      path: "limits.timeoutMs",
    });
  }

  if (plan.model.memoryEstimateBytes > plan.limits.memoryLimitBytes) {
    diagnostics.push({
      code: "LO_BITNET_MEMORY_LIMIT_EXCEEDED",
      severity: "error",
      message: "BitNet model memory estimate exceeds the configured limit.",
      path: "limits.memoryLimitBytes",
    });
  }

  if (plan.model.maxOutputTokens > plan.limits.maxOutputTokens) {
    diagnostics.push({
      code: "LO_BITNET_MODEL_OUTPUT_LIMIT_EXCEEDS_RUNTIME_LIMIT",
      severity: "warning",
      message:
        "BitNet model output capacity is higher than the runtime output limit.",
      path: "model.maxOutputTokens",
    });
  }

  if (plan.limits.maxPromptTokens > plan.model.maxContextTokens) {
    diagnostics.push({
      code: "LO_BITNET_PROMPT_LIMIT_EXCEEDS_CONTEXT",
      severity: "error",
      message: "BitNet prompt token limit exceeds the model context window.",
      path: "limits.maxPromptTokens",
    });
  }

  return diagnostics;
}
