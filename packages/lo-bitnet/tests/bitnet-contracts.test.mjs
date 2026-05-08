import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createBitNetCpuInferencePlan,
  createBitNetInferenceReport,
  validateBitNetCpuInferencePlan,
  validateBitNetGgufModel,
  validateBitNetRuntimeAdapter,
} from "../dist/index.js";

const model = {
  name: "BitNet-b1.58-2B-4T",
  path: "./models/BitNet-b1.58-2B-4T/ggml-model-i2_s.gguf",
  format: "gguf",
  weightSet: "ternary-b1.58",
  quantization: "i2_s",
  embeddingQuantization: "q6_k",
  parameterCount: "2B",
  maxContextTokens: 2048,
  maxOutputTokens: 256,
  memoryEstimateBytes: 4_294_967_296,
};

const limits = {
  threads: 8,
  timeoutMs: 30_000,
  maxPromptTokens: 1024,
  maxOutputTokens: 256,
  memoryLimitBytes: 4_294_967_296,
};

describe("lo-bitnet contracts", () => {
  it("validates a GGUF BitNet model and report", () => {
    const plan = createBitNetCpuInferencePlan(model, limits, {
      runtime: "bitnet.cpp",
      kernelFamily: "i2_s",
      fallbackReason: "GPU unavailable",
    });

    assert.equal(validateBitNetGgufModel(model).valid, true);
    assert.deepEqual(validateBitNetCpuInferencePlan(plan), []);
    assert.equal(createBitNetInferenceReport(plan).fallback, true);
  });

  it("rejects non-GGUF model paths", () => {
    assert.equal(
      validateBitNetGgufModel({ ...model, path: "./model.bin" }).diagnostics[0]
        ?.code,
      "LO_BITNET_GGUF_EXTENSION_REQUIRED",
    );
  });

  it("checks runtime adapter compatibility", () => {
    const plan = createBitNetCpuInferencePlan(model, limits, {
      runtime: "bitnet.cpp",
      kernelFamily: "i2_s",
    });
    const adapter = {
      name: "bitnet.cpp",
      kind: "bitnet.cpp",
      supportedQuantizations: ["i2_s"],
      supportedEmbeddingQuantizations: ["q6_k"],
      supportedKernelFamilies: ["i2_s", "auto"],
    };

    assert.deepEqual(validateBitNetRuntimeAdapter(adapter, plan), []);
  });
});
