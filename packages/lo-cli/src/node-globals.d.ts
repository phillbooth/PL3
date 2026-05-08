declare const process: {
  readonly argv: readonly string[];
  cwd(): string;
  exitCode?: number;
};
