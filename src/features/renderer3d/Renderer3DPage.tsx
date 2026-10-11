import { useState } from "react";
import type { FormEvent } from "react";
import { PageHeading } from "../../shared/components/PageHeading";
import { ModelPreview } from "../../shared/3d/ModelPreview";
import { defaultTransform } from "../../shared/3d/types";
import type { ModelKind } from "../../shared/3d/types";
import { inferModelKind } from "./inferModelKind";

/**
 * Component to render the 3D Renderer page, allowing users to generate 3D models from textual descriptions.
 */
export default function Renderer3DPage() {
  const [prompt, setPrompt] = useState("");
  const [kind, setKind] = useState<ModelKind>("cube");
  const [generatedPrompt, setGeneratedPrompt] = useState("Demo-Modell");
  const [error, setError] = useState("");

  function generateModel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const description = prompt.trim();
    if (!description) {
      setError("Beschreibe zuerst dein Modell.");
      return;
    }
    const nextKind = inferModelKind(description);
    setKind(nextKind);
    setGeneratedPrompt(description);
    setError("");
  }

  return (
    <section>
      <PageHeading eyebrow="KREATION & DESIGN" title="Text-to-3D Engine" subtitle="Beschreibe ein Objekt und drehe die generierte 3D-Vorschau."
        aside={<span className="status-pill"><span className="live-dot" /> Prozeduraler Renderer</span>} />
      <div className="engine-layout">
        <div className="panel viewport-panel">
          <div className="panel-heading"><div><span className="eyebrow">VIEWPORT</span><h2>{generatedPrompt}</h2></div><span className="viewport-badge">● LIVE PREVIEW</span></div>
          <div className="canvas-container"><ModelPreview models={[{ id: "preview", kind, transform: defaultTransform }]} /><span className="canvas-hint">Ziehen zum Drehen</span></div>
          <div className="model-meta"><span>Modelltyp <strong>{kind}</strong></span><span>Renderer <strong>Canvas 3D</strong></span><button className="text-button" onClick={() => { setKind("cube"); setGeneratedPrompt("Demo-Modell"); setPrompt(""); }}>Zurücksetzen</button></div>
        </div>
        <aside className="panel prompt-panel">
          <span className="eyebrow">NEUES MODELL</span><h2>Was möchtest du bauen?</h2><p className="muted-copy">Einfache Beschreibungen wie „eine blaue Kugel“ oder „ein hoher Zylinder“ werden direkt als 3D-Form visualisiert.</p>
          <form onSubmit={generateModel} className="stack-form">
            <label htmlFor="model-prompt">Beschreibung</label>
            <textarea id="model-prompt" rows={5} value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="z. B. ein leuchtender Planet" />
            {error && <p className="field-error" role="alert">{error}</p>}
            <button className="primary-button" type="submit">Modell generieren <span aria-hidden="true">↗</span></button>
          </form>
          <div className="shape-options"><span>UNTERSTÜTZTE GRUNDFORMEN</span><div>{(["cube", "sphere", "cylinder", "cone"] as const).map((shape) => <button key={shape} className={kind === shape ? "shape-chip selected" : "shape-chip"} onClick={() => setKind(shape)}>{shape}</button>)}</div></div>
        </aside>
      </div>
    </section>
  );
}
