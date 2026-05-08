import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import type { CliContext, CliResult } from "./types.js";

type GraphNodeKind = "Package" | "Document" | "Report";
type GraphEdgeKind = "documents" | "generates";

interface WorkspaceConfig {
  readonly name: string;
  readonly packages: readonly string[];
  readonly docs?: Readonly<Record<string, string>>;
}

interface GraphNode {
  readonly id: string;
  readonly kind: GraphNodeKind;
  readonly label: string;
  readonly sourcePath?: string;
  readonly tags: readonly string[];
}

interface GraphEdge {
  readonly from: string;
  readonly to: string;
  readonly kind: GraphEdgeKind;
  readonly confidence: "EXTRACTED" | "INFERRED";
  readonly evidencePath?: string;
}

interface ProjectGraph {
  readonly version: string;
  readonly generatedAt: string;
  readonly nodes: readonly GraphNode[];
  readonly edges: readonly GraphEdge[];
}

interface GraphOutputPaths {
  readonly directory: string;
  readonly jsonPath: string;
  readonly reportPath: string;
}

export async function runGraphCommand(context: CliContext): Promise<CliResult> {
  const outputDirectory = resolveOutputDirectory(context);
  const workspacePath = join(context.cwd, "lo.workspace.json");
  const workspace = parseWorkspaceConfig(await readFile(workspacePath, "utf8"));
  const graph = createWorkspaceGraph(workspace);
  const paths: GraphOutputPaths = {
    directory: outputDirectory,
    jsonPath: join(outputDirectory, "lo-project-graph.json"),
    reportPath: join(outputDirectory, "LO_GRAPH_REPORT.md"),
  };

  await mkdir(paths.directory, { recursive: true });
  await writeFile(paths.jsonPath, `${JSON.stringify(graph, null, 2)}\n`, "utf8");
  await writeFile(paths.reportPath, renderGraphReport(workspace, graph), "utf8");

  return {
    ok: true,
    code: 0,
    message: "LO project graph generated.",
    details: [
      `Graph JSON: ${relative(context.cwd, paths.jsonPath)}`,
      `Graph report: ${relative(context.cwd, paths.reportPath)}`,
      `Nodes: ${graph.nodes.length}`,
      `Edges: ${graph.edges.length}`,
    ],
  };
}

function resolveOutputDirectory(context: CliContext): string {
  const outIndex = context.args.findIndex((arg) => arg === "--out");
  const outValue = outIndex >= 0 ? context.args[outIndex + 1] : undefined;
  return resolve(context.cwd, outValue ?? "build/graph");
}

function parseWorkspaceConfig(rawJson: string): WorkspaceConfig {
  const parsed: unknown = JSON.parse(rawJson);

  if (!isRecord(parsed)) {
    throw new Error("lo.workspace.json must contain an object.");
  }

  const name = typeof parsed["name"] === "string" ? parsed["name"] : "LO-app";
  const packages = Array.isArray(parsed["packages"])
    ? parsed["packages"].filter((value): value is string => typeof value === "string")
    : [];
  const docs = isStringMap(parsed["docs"]) ? parsed["docs"] : undefined;

  return {
    name,
    packages,
    ...(docs === undefined ? {} : { docs }),
  };
}

function createWorkspaceGraph(workspace: WorkspaceConfig): ProjectGraph {
  const packageNodes = workspace.packages.map((packagePath) =>
    createPackageNode(packagePath),
  );
  const documentNodes = Object.entries(workspace.docs ?? {}).map(([name, path]) =>
    createDocumentNode(name, path),
  );
  const reportNode: GraphNode = {
    id: "report:project-graph",
    kind: "Report",
    label: "LO Project Graph Report",
    sourcePath: "build/graph/LO_GRAPH_REPORT.md",
    tags: ["report", "project-graph"],
  };

  return {
    version: "0.1.0",
    generatedAt: new Date().toISOString(),
    nodes: [...packageNodes, ...documentNodes, reportNode],
    edges: [
      ...createDocumentEdges(documentNodes, packageNodes),
      {
        from: "package:lo-project-graph",
        to: reportNode.id,
        kind: "generates",
        confidence: "INFERRED",
        evidencePath: "packages/lo-project-graph/README.md",
      },
    ],
  };
}

function createPackageNode(packagePath: string): GraphNode {
  const label = packagePath.split("/").at(-1) ?? packagePath;

  return {
    id: `package:${label}`,
    kind: "Package",
    label,
    sourcePath: `${packagePath}/README.md`,
    tags: ["package"],
  };
}

function createDocumentNode(name: string, sourcePath: string): GraphNode {
  return {
    id: `doc:${name}`,
    kind: "Document",
    label: name,
    sourcePath,
    tags: ["document"],
  };
}

function createDocumentEdges(
  documents: readonly GraphNode[],
  packages: readonly GraphNode[],
): readonly GraphEdge[] {
  const edges: GraphEdge[] = [];

  for (const document of documents) {
    const packageNode = packages.find(
      (node) =>
        document.sourcePath !== undefined &&
        node.sourcePath !== undefined &&
        document.sourcePath.startsWith(node.sourcePath.replace(/\/README\.md$/, "")),
    );

    if (packageNode !== undefined) {
      edges.push({
        from: document.id,
        to: packageNode.id,
        kind: "documents",
        confidence: "EXTRACTED",
        ...(document.sourcePath === undefined
          ? {}
          : { evidencePath: document.sourcePath }),
      });
    }
  }

  return edges;
}

function renderGraphReport(workspace: WorkspaceConfig, graph: ProjectGraph): string {
  const packages = graph.nodes.filter((node) => node.kind === "Package");
  const documents = graph.nodes.filter((node) => node.kind === "Document");

  return [
    "# LO Graph Report",
    "",
    `Workspace: ${workspace.name}`,
    `Generated: ${graph.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Packages: ${packages.length}`,
    `- Documents: ${documents.length}`,
    `- Relationships: ${graph.edges.length}`,
    "",
    "## Package Nodes",
    "",
    ...packages.map((node) => `- ${node.label} (${node.sourcePath ?? "no source"})`),
    "",
    "## Suggested Questions",
    "",
    "- Which package owns a concept?",
    "- Which documents describe a package?",
    "- Which packages generate project reports?",
    "",
  ].join("\n");
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringMap(value: unknown): value is Readonly<Record<string, string>> {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every((item) => typeof item === "string");
}
