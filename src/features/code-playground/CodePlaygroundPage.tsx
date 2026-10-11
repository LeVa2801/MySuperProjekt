import { useEffect, useRef, useState } from "react";
import { basicSetup } from "codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { EditorView } from "@codemirror/view";
import { oneDark } from "@codemirror/theme-one-dark";
import { PageHeading } from "../../shared/components/PageHeading";
import { useCopyToClipboard } from "../../shared/hooks/useCopyToClipboard";
import { useLocalStorage } from "../../shared/hooks/useLocalStorage";
import { downloadTextFile } from "../../shared/lib/download";
import { codeSamples, defaultCodeFiles } from "./codeSamples";
import type { CodeLanguage } from "./types";
import { useCodeRunner } from "./useCodeRunner";

export default function CodePlaygroundPage() {
  const [language, setLanguage] = useState<CodeLanguage>("C++");
  const [files, setFiles] = useLocalStorage<Record<CodeLanguage, string>>("dashboard-c-code", defaultCodeFiles);
  const [sampleIndex, setSampleIndex] = useState<Record<CodeLanguage, number>>({ C: 0, "C++": 0 });
  const { copied, copy } = useCopyToClipboard(1600);
  const { run, execute, stop } = useCodeRunner();
  const editorHost = useRef<HTMLDivElement>(null);
  const editorView = useRef<EditorView | null>(null);
  const sourceRef = useRef(files[language]);
  const [stdin, setStdin] = useState("");
  useEffect(() => {
    sourceRef.current = files[language];
  }, [files, language]);

  useEffect(() => {
    if (!editorHost.current) return;
    const view = new EditorView({
      doc: sourceRef.current,
      extensions: [
        basicSetup,
        cpp(),
        oneDark,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const source = update.state.doc.toString();
            sourceRef.current = source;
            setFiles((previous) => ({ ...previous, [language]: source }));
          }
        }),
      ],
      parent: editorHost.current,
    });
    editorView.current = view;
    return () => {
      view.destroy();
      editorView.current = null;
    };
  }, [language, setFiles]);

  function chooseLanguage(nextLanguage: CodeLanguage) {
    const nextView = editorView.current;
    if (nextView && nextLanguage !== language) {
      sourceRef.current = nextView.state.doc.toString();
      setFiles((previous) => ({ ...previous, [language]: sourceRef.current }));
      setLanguage(nextLanguage);
    }
  }

  function loadSample(index: number) {
    const source = codeSamples[language][index].source.replaceAll("\\\\n", "\\n");
    setSampleIndex((previous) => ({ ...previous, [language]: index }));
    setFiles((previous) => ({ ...previous, [language]: source }));
    const view = editorView.current;
    if (view) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: source } });
      view.focus();
    }
  }

  function downloadSource() {
    downloadTextFile(language === "C" ? "main.c" : "main.cpp", sourceRef.current);
  }

  const compileCommand = language === "C" ? "gcc -std=c11 -Wall -Wextra main.c -o main" : "g++ -std=c++17 -Wall -Wextra main.cpp -o main";

  return (
    <section>
      <PageHeading eyebrow="NATIVE ENTWICKLUNG" title="C / C++ Playground" subtitle="C- und C++-Code bearbeiten, Beispiele laden und Quellcode exportieren."
        aside={<span className="status-pill"><span className="live-dot" /> Lokal gespeichert</span>} />
      <div className="panel native-editor-panel">
        <div className="native-editor-toolbar">
          <div className="export-languages" role="group" aria-label="Programmiersprache auswählen">{(["C++", "C"] as const).map((item) => <button key={item} className={language === item ? "language-chip selected" : "language-chip"} onClick={() => chooseLanguage(item)}>{item}</button>)}</div>
          <label className="sample-picker">Vorlage <select aria-label="Codevorlage auswählen" value={sampleIndex[language]} onChange={(event) => loadSample(Number(event.target.value))}>{codeSamples[language].map((sample, index) => <option value={index} key={sample.name}>{sample.name}</option>)}</select></label>
          <span className="native-saved"><span className="live-dot" /> Autosave</span>
          <div className="export-actions"><button className="secondary-button" onClick={() => copy(sourceRef.current)}>{copied ? "Kopiert ✓" : "Code kopieren"}</button><button className="primary-button" onClick={downloadSource}>Datei exportieren ↓</button></div>
        </div>
        <div className="native-editor-host" ref={editorHost} aria-label={`${language}-Quellcodeeditor`} />
        <div className="run-bar">
          <button className="primary-button" onClick={() => execute(language, sourceRef.current, stdin)} disabled={run.state === "running"}>{run.state === "running" ? "Läuft…" : "▶ Kompilieren & Ausführen"}</button>
          {run.state === "running" && <button className="secondary-button" onClick={stop}>Stopp</button>}
          <label className="sample-picker">Eingabe (stdin) <input aria-label="Programmeingabe" value={stdin} onChange={(event) => setStdin(event.target.value)} placeholder="z. B. 5 3" /></label>
          <span className="native-saved">{run.status}</span>
        </div>
        <pre className="run-output" aria-label="Programmausgabe" aria-live="polite">{run.state === "idle" ? "Noch nicht ausgeführt." : <>{run.errors && <span className="run-errors">{run.errors}{"\n"}</span>}{run.output}{run.state === "done" && <span className="run-exit">{`\n[Beendet mit Code ${run.exitCode}]`}</span>}</>}</pre>
        <div className="compiler-info"><span><strong>Echter Clang-Compiler (WebAssembly)</strong><code>{compileCommand}</code></span><span>Läuft komplett lokal im Browser, ohne Upload. Beim ersten Start werden ca. 28 MB geladen. Endlosschleifen werden nach 10 s abgebrochen.</span></div>
      </div>
    </section>
  );
}
