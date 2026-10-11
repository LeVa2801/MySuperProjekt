declare module "@live-codes/clang-wasm" {
  export interface RunResult { stdout: string; stderr: string; output: string; errors: string[]; exitCode: number }
  export interface Compiler { run(code: string, input?: string, options?: { compileArgs?: string[] }): Promise<RunResult> }
  export function createCompiler(language: string, options: { baseUrl: URL; std?: string | null }): Promise<Compiler>;
}
