import type { TaskDefinition } from "./types.js";

export interface LoadedTasks {
  readonly path: string;
  readonly tasks: readonly TaskDefinition[];
}

export async function loadTasks(path: string): Promise<LoadedTasks> {
  return {
    path,
    tasks: []
  };
}
