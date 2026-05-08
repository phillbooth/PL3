import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createDocumentNode,
  createPackageNode,
  createProjectGraphEdge,
  createProjectGraphReport,
  defineProjectGraphBackendPolicy,
  defineProjectGraphScanPolicy,
  selectProjectGraphBackend,
  validateProjectGraphBackendReference,
  validateProjectGraph,
} from "../dist/index.js";

const graph = {
  version: "0.1.0",
  generatedAt: "2026-05-08T00:00:00.000Z",
  nodes: [
    createPackageNode(
      "package:lo-security",
      "lo-security",
      "packages/lo-security/README.md",
      "Reusable security primitives and reports.",
    ),
    createDocumentNode(
      "doc:security",
      "Security",
      "docs/SECURITY.md",
      ["document", "security"],
    ),
    {
      id: "type:SecureString",
      kind: "Type",
      label: "SecureString",
      sourcePath: "packages/lo-security/src/index.ts",
      tags: ["security", "type"],
    },
  ],
  edges: [
    createProjectGraphEdge(
      "package:lo-security",
      "type:SecureString",
      "provides",
    ),
    createProjectGraphEdge("doc:security", "package:lo-security", "documents"),
  ],
};

describe("lo-project-graph contracts", () => {
  it("validates a package/document/type graph", () => {
    assert.deepEqual(validateProjectGraph(graph), []);
  });

  it("reports missing edge endpoints", () => {
    const diagnostics = validateProjectGraph({
      ...graph,
      edges: [
        ...graph.edges,
        createProjectGraphEdge("package:missing", "type:SecureString", "uses"),
      ],
    });

    assert.equal(diagnostics[0]?.code, "LO_PROJECT_GRAPH_EDGE_FROM_MISSING");
  });

  it("creates graph reports and scan policy defaults", () => {
    const policy = defineProjectGraphScanPolicy({
      allowModelExtraction: false,
    });
    const backend = selectProjectGraphBackend(
      [
        {
          id: "lo_native",
          label: "LO native workspace scanner",
          source: "built-in",
          capabilities: ["workspace-metadata", "json-output", "report-output"],
        },
      ],
      defineProjectGraphBackendPolicy(),
    );
    const report = createProjectGraphReport(graph, {
      jsonPath: "build/graph/lo-project-graph.json",
      htmlPath: "build/graph/lo-project-graph.html",
      reportPath: "build/graph/LO_GRAPH_REPORT.md",
      aiMapPath: "build/graph/lo-ai-map.md",
      generatedFiles: [
        "build/graph/lo-project-graph.json",
        "build/graph/LO_GRAPH_REPORT.md",
      ],
    }, backend);

    assert.equal(policy.redactSecrets, true);
    assert.equal(report.backend?.selected, "lo_native");
    assert.equal(report.diagnostics.length, 0);
    assert.equal(report.manifest.reportPath, "build/graph/LO_GRAPH_REPORT.md");
  });

  it("allows Graphify as a swappable git backend only when pinned and allowed", () => {
    const backend = {
      id: "graphify",
      label: "Graphify",
      source: "git",
      packageName: "graphify",
      gitUrl: "https://github.com/safishamsi/graphify",
      gitRef: "v0.1.0",
      capabilities: [
        "static-analysis",
        "semantic-extraction",
        "json-output",
        "html-output",
        "report-output",
      ],
    };
    const policy = defineProjectGraphBackendPolicy({
      allowGitBackends: true,
    });

    assert.deepEqual(validateProjectGraphBackendReference(backend, policy), []);
    assert.equal(
      selectProjectGraphBackend([backend], policy).selected,
      "graphify",
    );
  });

  it("rejects unpinned git backends by default", () => {
    const diagnostics = validateProjectGraphBackendReference(
      {
        id: "graphify",
        label: "Graphify",
        source: "git",
        gitUrl: "https://github.com/safishamsi/graphify",
        capabilities: ["json-output"],
      },
      defineProjectGraphBackendPolicy({
        allowGitBackends: true,
      }),
    );

    assert.equal(
      diagnostics[0]?.code,
      "LO_PROJECT_GRAPH_GIT_BACKEND_REF_REQUIRED",
    );
  });
});
