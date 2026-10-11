import { createCompiler } from "@live-codes/clang-wasm";
import type { RunRequest, WorkerMessage } from "./clangProtocol";

const post = (message: WorkerMessage) => self.postMessage(message);

type Compiler = Awaited<ReturnType<typeof createCompiler>>;
const compilers = new Map<string, Promise<Compiler>>();

self.onmessage = async (event: MessageEvent<RunRequest>) => {
  const { language, code, input, std, baseUrl } = event.data;
  try {
    const key = `${language}:${std}`;
    if (!compilers.has(key)) {
      post({ type: "status", text: "Compiler wird geladen (einmalig, ca. 28 MB)…" });
      compilers.set(key, createCompiler(language, { baseUrl: new URL(baseUrl), std }));
    }
    const compiler = await compilers.get(key)!;
    post({ type: "status", text: "Kompilieren und Ausführen…" });
    const result = await compiler.run(code, input, { compileArgs: ["-Wall", "-Wextra"] });
    post({ type: "done", output: result.output, errors: result.errors, exitCode: result.exitCode });
  } catch (error) {
    compilers.delete(`${language}:${std}`);
    post({ type: "failed", message: error instanceof Error ? error.message : String(error) });
  }
};
