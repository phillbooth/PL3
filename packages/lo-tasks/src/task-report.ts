import type { TaskDefinition, TaskResult } from "./types.js";

export interface TaskReport {
  readonly task: string;
  readonly unsafe: boolean;
  readonly reason?: string;
  readonly status: TaskResult["status"];
  readonly effects: TaskDefinition["effects"];
  readonly permissions: TaskDefinition["permissions"];
  readonly durationMs: number;
  readonly warnings: readonly string[];
}

export function createTaskReport(task: TaskDefinition, result: TaskResult): TaskReport {
  return {
    task: task.name,
    unsafe: task.unsafe === true,
    ...(task.reason !== undefined ? { reason: task.reason } : {}),
    status: result.status,
    effects: task.effects,
    permissions: task.permissions,
    durationMs: result.durationMs,
    warnings: result.warnings
  };
}
