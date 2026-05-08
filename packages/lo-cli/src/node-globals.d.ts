declare const process: {
  readonly argv: readonly string[];
  cwd(): string;
  exitCode?: number;
};

declare module "node:fs/promises" {
  export function mkdir(path: string, options?: { readonly recursive?: boolean }): Promise<void>;
  export function readFile(path: string, encoding: "utf8"): Promise<string>;
  export function writeFile(path: string, data: string, encoding: "utf8"): Promise<void>;
}

declare module "node:path" {
  export function join(...paths: readonly string[]): string;
  export function resolve(...paths: readonly string[]): string;
  export function relative(from: string, to: string): string;
}
