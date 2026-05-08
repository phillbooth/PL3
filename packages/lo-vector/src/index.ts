export interface VectorDimension {
  readonly lanes: number;
}

export interface VectorType {
  readonly elementType: string;
  readonly dimension: VectorDimension;
}

export interface VectorOperation {
  readonly name: string;
  readonly inputs: readonly VectorType[];
  readonly output: VectorType;
}

export interface VectorReport {
  readonly operations: readonly VectorOperation[];
  readonly warnings: readonly string[];
}
