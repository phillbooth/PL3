import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createAiGuideReport,
  createBuildReport,
  createReportDiagnostic,
  createReportMetadata,
  createSecurityReport,
  createTargetReport,
  serializeReportJson,
  summarizeDiagnostics,
  validateLoReport,
} from "../dist/index.js";

const metadata = createReportMetadata({
  kind: "build",
  name: "LO build report",
  projectName: "LO-app",
  projectVersion: "0.1.0",
  generatedAt: "2026-05-08T00:00:00.000Z",
  generator: {
    name: "lo-cli",
    version: "0.1.0",
    packageName: "@lo/cli",
  },
});

describe("lo-reports contracts", () => {
  it("summarises diagnostics by severity and status", () => {
    const diagnostics = [
      createReportDiagnostic("LO_TEST_WARNING", "warning", "Check this."),
      createReportDiagnostic("LO_TEST_ERROR", "error", "Fix this."),
    ];

    assert.deepEqual(summarizeDiagnostics(diagnostics), {
      info: 0,
      warnings: 1,
      errors: 1,
      critical: 0,
      total: 2,
      status: "error",
    });
  });

  it("creates build reports with metadata, artifacts and warnings", () => {
    const report = createBuildReport({
      metadata,
      diagnostics: [
        createReportDiagnostic(
          "LO_BUILD_TARGET_FALLBACK",
          "warning",
          "GPU target fell back to CPU.",
          { path: "targets.gpu" },
        ),
      ],
      targets: ["cpu", "wasm"],
      artifacts: [
        {
          path: "build/app.wasm",
          kind: "wasm",
          bytes: 1024,
          sha256: "sha256:example",
        },
      ],
      durationMs: 42,
    });

    assert.equal(report.kind, "build");
    assert.equal(report.summary.status, "warning");
    assert.equal(report.artifacts[0]?.path, "build/app.wasm");
    assert.match(serializeReportJson(report), /LO_BUILD_TARGET_FALLBACK/);
  });

  it("creates security, target and AI guide report variants", () => {
    const securityReport = createSecurityReport({
      metadata: createReportMetadata({
        ...metadata,
        kind: "security",
        name: "LO security report",
      }),
      checkedPolicies: ["secrets", "permissions"],
      blockedOperations: ["secret.print"],
      redactedSecrets: 2,
    });
    const targetReport = createTargetReport({
      metadata: createReportMetadata({
        ...metadata,
        kind: "target",
        name: "LO target report",
      }),
      requestedTargets: ["gpu", "cpu"],
      selectedTargets: ["cpu"],
      fallbackUsed: true,
    });
    const aiGuideReport = createAiGuideReport({
      metadata: createReportMetadata({
        ...metadata,
        kind: "ai-guide",
        name: "LO AI guide",
      }),
      sections: [
        {
          title: "Packages",
          summary: "Package ownership summary.",
          sourcePaths: ["lo.workspace.json"],
        },
      ],
      tokenEstimate: 128,
    });

    assert.equal(securityReport.redactedSecrets, 2);
    assert.equal(targetReport.fallbackUsed, true);
    assert.equal(aiGuideReport.sections[0]?.title, "Packages");
  });

  it("validates report metadata and diagnostic shape", () => {
    const report = {
      ...createBuildReport({
        metadata,
        diagnostics: [
          createReportDiagnostic("", "error", "Missing diagnostic code."),
        ],
      }),
      metadata: {
        ...metadata,
        name: "",
        kind: "security",
      },
    };

    assert.deepEqual(
      validateLoReport(report).map((diagnostic) => diagnostic.code),
      [
        "LO_REPORT_NAME_REQUIRED",
        "LO_REPORT_KIND_MISMATCH",
        "LO_REPORT_DIAGNOSTIC_CODE_REQUIRED",
      ],
    );
  });
});
