import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createAiInferenceReport,
  defineAiModelRegistry,
  defineAiSafetyPolicy,
  findAiModel,
  selectAiInferenceTarget,
  validateAiInferenceRequest,
} from "../dist/index.js";

const model = {
  name: "LocalBitNetAssistant",
  format: "gguf",
  source: "local-file",
  capabilities: [
    {
      task: "summarisation",
      maxContextTokens: 2048,
      maxOutputTokens: 256,
      supportsStreaming: true,
      supportedTargets: ["cpu.bitnet", "cpu.generic"],
    },
  ],
  memoryEstimate: {
    modelBytes: 3_000_000_000,
    contextBytes: 512_000_000,
    workingBytes: 256_000_000,
    totalBytes: 3_768_000_000,
  },
  safetyPolicy: defineAiSafetyPolicy(),
};

describe("lo-ai contracts", () => {
  it("registers and finds approved models", () => {
    const registry = defineAiModelRegistry([
      { id: "local.bitnet", descriptor: model, approved: true, tags: ["local"] },
    ]);

    assert.equal(findAiModel(registry, "local.bitnet")?.approved, true);
    assert.equal(findAiModel(registry, "missing"), undefined);
  });

  it("selects cpu.bitnet when GPU is unavailable for the model", () => {
    const request = {
      model,
      prompt: { input: "Summarise this text." },
      task: "summarisation",
      targetPreference: ["gpu", "cpu.bitnet", "cpu.generic"],
      options: {
        maxOutputTokens: 128,
        contextTokens: 1024,
        timeoutMs: 30_000,
        stream: false,
      },
    };

    const selection = selectAiInferenceTarget(request);
    const report = createAiInferenceReport(request);

    assert.equal(selection.selectedTarget, "cpu.bitnet");
    assert.equal(selection.fallbackUsed, true);
    assert.equal(report.selectedTarget, "cpu.bitnet");
    assert.equal(report.diagnostics.length, 0);
  });

  it("rejects unsafe prompt logging policy", () => {
    const request = {
      model: {
        ...model,
        safetyPolicy: defineAiSafetyPolicy({
          logPrompts: true,
          redactSecretsFromPrompts: false,
        }),
      },
      prompt: { input: "Hello" },
      task: "summarisation",
      targetPreference: ["cpu.bitnet"],
      options: {
        maxOutputTokens: 128,
        contextTokens: 1024,
        timeoutMs: 30_000,
        stream: false,
      },
    };

    assert.equal(
      validateAiInferenceRequest(request)[0]?.code,
      "LO_AI_PROMPT_LOGGING_REQUIRES_REDACTION",
    );
  });
});
