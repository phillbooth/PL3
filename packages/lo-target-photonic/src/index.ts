export interface PhotonicTargetCapability {
  readonly name: string;
  readonly supportedWavelengthsNm: readonly number[];
  readonly supportsPhaseControl: boolean;
  readonly supportsAmplitudeControl: boolean;
}

export interface PhotonicLoweringPlan {
  readonly sourceLogic: string;
  readonly targetCapability: string;
  readonly mappings: readonly string[];
}

export interface PhotonicTargetReport {
  readonly capabilities: readonly PhotonicTargetCapability[];
  readonly plans: readonly PhotonicLoweringPlan[];
  readonly warnings: readonly string[];
}
