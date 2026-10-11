export type RunRequest = { language: "c" | "cpp"; code: string; input: string; std: string; baseUrl: string };

export type WorkerMessage =
  | { type: "status"; text: string }
  | { type: "done"; output: string; errors: string[]; exitCode: number }
  | { type: "failed"; message: string };
