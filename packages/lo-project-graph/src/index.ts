export type ProjectGraphNodeKind =
  | "Package"
  | "Document"
  | "Flow"
  | "Type"
  | "Effect"
  | "Policy"
  | "UnsafeFeature"
  | "Report"
  | "Target"
  | "CompilerRule"
  | "RuntimeRule"
  | "SecurityRule"
  | "ComputeFeature"
  | "Decision";

export type ProjectGraphEdgeKind =
  | "owns"
  | "provides"
  | "uses"
  | "checked_by"
  | "enforced_by"
  | "documents"
  | "generates"
  | "fallback_for"
  | "maps_to"
  | "classified_as"
  | "depends_on"
  | "explains";

export type ProjectGraphConfidence = "EXTRACTED" | "INFERRED" | "AMBIGUOUS";

export type ProjectGraphDiagnosticSeverity = "warning" | "error";

export interface ProjectGraphDiagnostic {
  readonly code: string;
  readonly severity: ProjectGraphDiagnosticSeverity;
  readonly message: string;
  readonly path?: string;
}

export interface ProjectGraphNode {
  readonly id: string;
  readonly kind: ProjectGraphNodeKind;
  readonly label: string;
  readonly sourcePath?: string;
  readonly summary?: string;
  readonly tags: readonly string[];
}

export interface ProjectGraphEdge {
  readonly from: string;
  readonly to: string;
  readonly kind: ProjectGraphEdgeKind;
  readonly confidence: ProjectGraphConfidence;
  readonly evidencePath?: string;
  readonly rationale?: string;
}

export interface ProjectGraph {
  readonly version: string;
  readonly generatedAt: string;
  readonly nodes: readonly ProjectGraphNode[];
  readonly edges: readonly ProjectGraphEdge[];
}

export type ProjectGraphScanSource =
  | "markdown"
  | "lo-source"
  | "typescript"
  | "json-report"
  | "schema"
  | "diagram"
  | "pdf"
  | "image"
  | "video";

export interface ProjectGraphScanPolicy {
  readonly include: readonly string[];
  readonly exclude: readonly string[];
  readonly sources: readonly ProjectGraphScanSource[];
  readonly allowModelExtraction: boolean;
  readonly redactSecrets: boolean;
  readonly commitGeneratedGraph: boolean;
}

export interface ProjectGraphOutputManifest {
  readonly jsonPath: string;
  readonly htmlPath?: string;
  readonly reportPath: string;
  readonly aiMapPath: string;
  readonly generatedFiles: readonly string[];
}

export interface ProjectGraphBuildPlan {
  readonly root: string;
  readonly policy: ProjectGraphScanPolicy;
  readonly output: ProjectGraphOutputManifest;
}

export interface ProjectGraphQueryRequest {
  readonly query: string;
  readonly graphPath?: string;
}

export interface ProjectGraphPathRequest {
  readonly from: string;
  readonly to: string;
  readonly graphPath?: string;
}

export interface ProjectGraphExplainRequest {
  readonly nodeId: string;
  readonly graphPath?: string;
}

export interface ProjectGraphReport {
  readonly graph: ProjectGraph;
  readonly manifest: ProjectGraphOutputManifest;
  readonly diagnostics: readonly ProjectGraphDiagnostic[];
  readonly warnings: readonly string[];
}

export const DEFAULT_PROJECT_GRAPH_SCAN_POLICY: ProjectGraphScanPolicy = {
  include: ["README.md", "docs/**", "packages/**"],
  exclude: ["**/dist/**", "**/node_modules/**", "**/.env", "**/*.log"],
  sources: ["markdown", "lo-source", "typescript", "json-report", "schema"],
  allowModelExtraction: false,
  redactSecrets: true,
  commitGeneratedGraph: false,
};

export function defineProjectGraphScanPolicy(
  policy: Partial<ProjectGraphScanPolicy> = {},
): ProjectGraphScanPolicy {
  return {
    include: policy.include ?? DEFAULT_PROJECT_GRAPH_SCAN_POLICY.include,
    exclude: policy.exclude ?? DEFAULT_PROJECT_GRAPH_SCAN_POLICY.exclude,
    sources: policy.sources ?? DEFAULT_PROJECT_GRAPH_SCAN_POLICY.sources,
    allowModelExtraction:
      policy.allowModelExtraction ??
      DEFAULT_PROJECT_GRAPH_SCAN_POLICY.allowModelExtraction,
    redactSecrets:
      policy.redactSecrets ?? DEFAULT_PROJECT_GRAPH_SCAN_POLICY.redactSecrets,
    commitGeneratedGraph:
      policy.commitGeneratedGraph ??
      DEFAULT_PROJECT_GRAPH_SCAN_POLICY.commitGeneratedGraph,
  };
}

export function createProjectGraphReport(
  graph: ProjectGraph,
  manifest: ProjectGraphOutputManifest,
): ProjectGraphReport {
  const diagnostics = validateProjectGraph(graph);

  return {
    graph,
    manifest,
    diagnostics,
    warnings: diagnostics
      .filter((diagnostic) => diagnostic.severity === "warning")
      .map((diagnostic) => diagnostic.message),
  };
}

export function validateProjectGraph(
  graph: ProjectGraph,
): readonly ProjectGraphDiagnostic[] {
  const diagnostics: ProjectGraphDiagnostic[] = [];
  const nodeIds = new Set<string>();

  graph.nodes.forEach((node, index) => {
    if (node.id.trim().length === 0) {
      diagnostics.push({
        code: "LO_PROJECT_GRAPH_NODE_ID_REQUIRED",
        severity: "error",
        message: "Project graph node requires an id.",
        path: `nodes.${index}.id`,
      });
      return;
    }

    if (nodeIds.has(node.id)) {
      diagnostics.push({
        code: "LO_PROJECT_GRAPH_NODE_ID_DUPLICATE",
        severity: "error",
        message: `Project graph node id "${node.id}" is duplicated.`,
        path: `nodes.${index}.id`,
      });
    }

    nodeIds.add(node.id);
  });

  graph.edges.forEach((edge, index) => {
    if (!nodeIds.has(edge.from)) {
      diagnostics.push({
        code: "LO_PROJECT_GRAPH_EDGE_FROM_MISSING",
        severity: "error",
        message: `Project graph edge references missing source node "${edge.from}".`,
        path: `edges.${index}.from`,
      });
    }

    if (!nodeIds.has(edge.to)) {
      diagnostics.push({
        code: "LO_PROJECT_GRAPH_EDGE_TO_MISSING",
        severity: "error",
        message: `Project graph edge references missing target node "${edge.to}".`,
        path: `edges.${index}.to`,
      });
    }

    if (edge.confidence === "AMBIGUOUS" && edge.rationale === undefined) {
      diagnostics.push({
        code: "LO_PROJECT_GRAPH_AMBIGUOUS_EDGE_NEEDS_RATIONALE",
        severity: "warning",
        message: "Ambiguous project graph edges should explain their rationale.",
        path: `edges.${index}.rationale`,
      });
    }
  });

  return diagnostics;
}

export function createPackageNode(
  id: string,
  label: string,
  sourcePath: string,
  summary?: string,
): ProjectGraphNode {
  return {
    id,
    kind: "Package",
    label,
    sourcePath,
    ...(summary === undefined ? {} : { summary }),
    tags: ["package"],
  };
}

export function createDocumentNode(
  id: string,
  label: string,
  sourcePath: string,
  tags: readonly string[] = ["document"],
): ProjectGraphNode {
  return {
    id,
    kind: "Document",
    label,
    sourcePath,
    tags,
  };
}

export function createProjectGraphEdge(
  from: string,
  to: string,
  kind: ProjectGraphEdgeKind,
  confidence: ProjectGraphConfidence = "EXTRACTED",
  evidencePath?: string,
): ProjectGraphEdge {
  return {
    from,
    to,
    kind,
    confidence,
    ...(evidencePath === undefined ? {} : { evidencePath }),
  };
}
