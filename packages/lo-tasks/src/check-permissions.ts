import type { TaskDefinition, TaskError } from "./types.js";

export function checkTaskPermissions(task: TaskDefinition): TaskError | undefined {
  const usesShell = task.effects.includes("shell");

  if (usesShell && task.unsafe !== true) {
    return {
      task: task.name,
      code: "LO_TASK_SHELL_DENIED",
      safeMessage: "Shell execution is disabled unless the task is explicitly unsafe.",
      effect: "shell",
      suggestedFix: "Use safe built-in task operations or mark the task unsafe with a reason and strict permissions."
    };
  }

  if (task.unsafe === true && (task.reason === undefined || task.reason.trim().length === 0)) {
    return {
      task: task.name,
      code: "LO_TASK_UNSAFE_REASON_REQUIRED",
      safeMessage: "Unsafe tasks must include a reason.",
      suggestedFix: "Add a reason explaining why the unsafe task is temporarily required."
    };
  }

  return undefined;
}
