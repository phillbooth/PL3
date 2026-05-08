export type ComputeTarget = "cpu" | "wasm" | "binary" | "vector" | "photonic";

export interface ComputeCapability {
  readonly target: ComputeTarget;
  readonly features: readonly string[];
}

export interface ComputeBudget {
  readonly memoryBytes?: number;
  readonly timeoutMs?: number;
  readonly parallelism?: number;
}

export interface ComputePlan {
  readonly name: string;
  readonly preferredTarget: ComputeTarget;
  readonly fallbackTargets: readonly ComputeTarget[];
  readonly budget?: ComputeBudget;
  readonly requiredCapabilities: readonly string[];
}

export interface ComputeReport {
  readonly plans: readonly ComputePlan[];
  readonly capabilities: readonly ComputeCapability[];
  readonly warnings: readonly string[];
}
