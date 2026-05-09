export type AiAcceleratorKind =
  | "npu"
  | "tpu"
  | "ane"
  | "dsp"
  | "ai-chip"
  | "plan-only";

export interface AiAcceleratorCapability {
  readonly name: string;
  readonly kind: AiAcceleratorKind;
  readonly vendor?: string;
  readonly supportedPrecisions: readonly string[];
  readonly maxMemoryBytes?: number;
  readonly features: readonly string[];
}

export interface AiAcceleratorPlan {
  readonly flow: string;
  readonly model: string;
  readonly accelerator: string;
  readonly operations: readonly string[];
  readonly fallback: "cpu" | "gpu" | "low_bit_ai" | "reject";
}

export interface AiAcceleratorReport {
  readonly capabilities: readonly AiAcceleratorCapability[];
  readonly plans: readonly AiAcceleratorPlan[];
  readonly warnings: readonly string[];
}
