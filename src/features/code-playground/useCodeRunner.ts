import { useEffect, useRef, useState } from "react";
import type { WorkerMessage } from "./clangProtocol";
import type { CodeLanguage } from "./types";

export type RunState = { state: "idle" | "running" | "done"; status: string; output: string; errors: string; exitCode: number };

const TIMEOUT_MS = 10000;
const idleState: RunState = { state: "idle", status: "", output: "", errors: "", exitCode: 0 };

export function useCodeRunner() {
  const [run, setRun] = useState<RunState>(idleState);
  const worker = useRef<Worker | null>(null);
  const timer = useRef<number | null>(null);

  function clearTimer() {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
  }

  function terminate() {
    clearTimer();
    worker.current?.terminate();
    worker.current = null;
  }

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
    worker.current?.terminate();
  }, []);

  function stop() {
    terminate();
    setRun({ ...idleState, status: "Abgebrochen" });
  }

  function execute(language: CodeLanguage, code: string, stdin: string) {
    terminate();
    const instance = new Worker(new URL("./clangWorker.ts", import.meta.url), { type: "module" });
    worker.current = instance;
    setRun({ ...idleState, state: "running", status: "Starte…" });

    const armTimeout = () => {
      clearTimer();
      timer.current = window.setTimeout(() => {
        terminate();
        setRun({ state: "done", status: "Zeitlimit", output: "", errors: "Abbruch: Das Programm lief länger als 10 Sekunden (Endlosschleife?).", exitCode: -1 });
      }, TIMEOUT_MS);
    };

    instance.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const message = event.data;
      if (message.type === "status") {
        setRun((previous) => ({ ...previous, status: message.text }));
        if (message.text.startsWith("Kompilieren")) armTimeout();
        else clearTimer();
        return;
      }
      terminate();
      if (message.type === "done") {
        const errors = message.errors.join("\n");
        setRun({ state: "done", status: errors ? "Kompilierfehler" : "Fertig", output: message.output, errors, exitCode: errors ? 1 : message.exitCode });
      } else {
        setRun({ state: "done", status: "Fehler", output: "", errors: message.message, exitCode: -1 });
      }
    };

    instance.postMessage({
      language: language === "C" ? "c" : "cpp",
      code,
      input: stdin.endsWith("\n") || stdin === "" ? stdin : `${stdin}\n`,
      std: language === "C" ? "gnu17" : "gnu++17",
      baseUrl: new URL(`${import.meta.env.BASE_URL}clang/`, window.location.href).href,
    });
  }

  return { run, execute, stop };
}
