import type { CliCommand, CliContext, CliResult } from "./types.js";

function notImplemented(command: string): CliResult {
  return {
    ok: false,
    code: 2,
    message: `lo ${command} is defined but not implemented yet.`
  };
}

function createPlaceholderCommand(name: string, description: string): CliCommand {
  return {
    name,
    description,
    run: async (_context: CliContext) => notImplemented(name)
  };
}

export const commands: readonly CliCommand[] = [
  createPlaceholderCommand("check", "Parse and type-check a LO project."),
  createPlaceholderCommand("build", "Build project outputs."),
  createPlaceholderCommand("run", "Run a LO entrypoint."),
  createPlaceholderCommand("serve", "Start the API server package."),
  createPlaceholderCommand("reports", "Generate or display reports."),
  createPlaceholderCommand("security:check", "Check security rules and unsafe features."),
  createPlaceholderCommand("routes", "List declared API routes."),
  createPlaceholderCommand("task", "Run a safe task through lo-tasks.")
];

export function findCommand(name: string): CliCommand | undefined {
  return commands.find((command) => command.name === name);
}
