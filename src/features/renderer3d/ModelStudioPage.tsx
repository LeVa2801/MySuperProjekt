import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Object3D } from "three";
import { PageHeading } from "../../shared/components/PageHeading";
import { ModelCanvas } from "./components/ModelCanvas";
import { exportModelsAsGlb } from "./model/exportGlb";
import { createModel, isModelObject, primitiveOptions } from "./model/modelTypes";
import type { ModelObject, PrimitiveKind } from "./model/modelTypes";
import { inferModelKind } from "./inferModelKind";

/**
 * Key used for storing the 3D models in the local storage.
 */
const STORAGE_KEY = "dashboard-model-studio-v1";

/**
 * Loads the 3D models from the local storage.
 * @returns An array of ModelObject instances.
 */
function loadModels(): ModelObject[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [createModel("box", 0, "Würfel 1")];
    const parsed: unknown = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.every(isModelObject)) return parsed;
    console.error("Das gespeicherte 3D-Projekt hat ein ungültiges Format.");
  } catch (error) {
    console.error("Das gespeicherte 3D-Projekt konnte nicht geladen werden.", error);
  }
  return [createModel("box", 0, "Würfel 1")];
}

/**
 * Component to render the 3D Model Studio page, allowing users to create, edit, and export 3D models.
 */ 
export default function ModelStudioPage() {
  const [models, setModels] = useState(loadModels);
  const [selectedId, setSelectedId] = useState("");
  const [mode, setMode] = useState<"translate" | "rotate" | "scale">("translate");
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(true);
  const selected = models.find((model) => model.id === selectedId);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
        setSaved(true);
        setError("");
      } catch (storageError) {
        console.error("Das 3D-Projekt konnte nicht gespeichert werden.", storageError);
        setError("Speichern im lokalen Browser-Speicher ist fehlgeschlagen.");
      }
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [models]);

  function addModel(kind: PrimitiveKind, name?: string) {
    const model = createModel(kind, models.length, name);
    setSaved(false);
    setModels((current) => [...current, model]);
    setSelectedId(model.id);
  }

  function updateSelected(patch: Partial<ModelObject>) {
    setSaved(false);
    setModels((current) => current.map((model) => model.id === selectedId ? { ...model, ...patch } : model));
  }

  function updateVector(key: "position" | "rotation" | "scale", axis: 0 | 1 | 2, value: number) {
    if (!selected || !Number.isFinite(value)) return;
    const vector: [number, number, number] = [...selected[key]];
    vector[axis] = key === "rotation" ? value * Math.PI / 180 : value;
    updateSelected({ [key]: vector });
  }

  function syncTransform(id: string, object: Object3D) {
    setSaved(false);
    setModels((current) => current.map((model) => model.id === id ? {
      ...model,
      position: [object.position.x, object.position.y, object.position.z],
      rotation: [object.rotation.x, object.rotation.y, object.rotation.z],
      scale: [object.scale.x, object.scale.y, object.scale.z],
    } : model));
  }

  function createFromPrompt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const description = prompt.trim();
    if (!description) {
      setError("Gib eine kurze Beschreibung ein, um ein passendes Grundobjekt hinzuzufügen.");
      return;
    }
    const inferred = inferModelKind(description);
    const kind: PrimitiveKind = inferred === "cube" ? "box" : inferred;
    addModel(kind, description);
    setPrompt("");
    setError("");
  }

  async function exportGlb() {
    if (!models.length) {
      setError("Füge zuerst mindestens ein Objekt zum Modell hinzu.");
      return;
    }
    try {
      const blob = await exportModelsAsGlb(models);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "modell.glb";
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setError("");
    } catch (exportError) {
      console.error("Der GLB-Export ist fehlgeschlagen.", exportError);
      setError("Das 3D-Modell konnte nicht als GLB exportiert werden.");
    }
  }

  return (
    <section>
      <PageHeading eyebrow="KREATION & DESIGN" title="3D Modellstudio" subtitle="Erstelle Modelle direkt im 3D-Viewport: Grundkörper hinzufügen, formen, färben und als GLB exportieren."
        aside={<span className="status-pill"><span className="live-dot" /> {saved ? "Lokal gespeichert" : "Speichert …"}</span>} />
      <div className="model-studio-layout">
        <div className="panel model-studio-viewport">
          <div className="model-studio-toolbar">
            <div className="model-transform-tools" role="group" aria-label="Transform-Werkzeug">
              <button className={mode === "translate" ? "active" : ""} onClick={() => setMode("translate")} title="Verschieben">↔ Verschieben</button>
              <button className={mode === "rotate" ? "active" : ""} onClick={() => setMode("rotate")} title="Drehen">⟳ Drehen</button>
              <button className={mode === "scale" ? "active" : ""} onClick={() => setMode("scale")} title="Skalieren">⤢ Skalieren</button>
            </div>
            <button className="secondary-button model-export-button" onClick={() => void exportGlb()}>↓ GLB exportieren</button>
          </div>
          <div className="model-studio-canvas">
            <ModelCanvas models={models} selectedId={selectedId} mode={mode} onSelect={setSelectedId} onTransform={syncTransform} />
            <span className="canvas-hint">Gizmo ziehen · Maus drehen · Scrollen zoomen</span>
          </div>
          <div className="model-studio-status">
            <span>{models.length} {models.length === 1 ? "Objekt" : "Objekte"} in der Szene</span>
            <span>{selected?.name ?? "Kein Objekt ausgewählt"}</span>
          </div>
        </div>
        <aside className="model-studio-sidebar">
          <div className="panel model-studio-panel">
            <div className="model-studio-heading"><div><span className="eyebrow">BAUKASTEN</span><h2>Grundkörper</h2></div></div>
            <div className="model-primitive-grid">
              {primitiveOptions.map((option) => <button className="model-primitive-button" key={option.kind} onClick={() => addModel(option.kind)}><span>{option.icon}</span>{option.label}<i>＋</i></button>)}
            </div>
            <form className="model-prompt-form" onSubmit={createFromPrompt}>
              <label htmlFor="model-studio-prompt">Schnellstart per Beschreibung</label>
              <div><input id="model-studio-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="z. B. eine blaue Kugel" /><button aria-label="Objekt aus Beschreibung erstellen" type="submit">＋</button></div>
              <small>Fügt ein passendes Grundobjekt in die Szene ein.</small>
            </form>
          </div>
          <div className="panel model-studio-panel">
            <div className="model-studio-heading"><div><span className="eyebrow">SZENE</span><h2>Objekte <span>{models.length}</span></h2></div></div>
            <div className="model-object-list">
              {models.map((model) => (
                <button className={model.id === selectedId ? "model-object-row selected" : "model-object-row"} key={model.id} onClick={() => setSelectedId(model.id)}>
                  <i style={{ backgroundColor: model.color }} /> <span>{model.name}</span><small>{primitiveOptions.find((item) => item.kind === model.kind)?.label}</small>
                </button>
              ))}
              {!models.length && <p className="empty-hint">Noch keine Objekte. Füge einen Grundkörper hinzu.</p>}
            </div>
          </div>
          {selected && <div className="panel model-studio-panel">
            <div className="model-studio-heading"><div><span className="eyebrow">OBJEKT</span><h2>Eigenschaften</h2></div><button className="model-delete-button" title="Objekt löschen" onClick={() => { setSaved(false); setModels((current) => current.filter((model) => model.id !== selected.id)); setSelectedId(""); }}>×</button></div>
            <label className="model-field">Name<input value={selected.name} onChange={(event) => updateSelected({ name: event.target.value })} /></label>
            <label className="model-field model-color-field">Farbe<input type="color" value={selected.color} onChange={(event) => updateSelected({ color: event.target.value })} /></label>
            {(["position", "rotation", "scale"] as const).map((key) => (
              <fieldset className="model-vector-controls" key={key}>
                <legend>{key === "position" ? "Position" : key === "rotation" ? "Drehung (°)" : "Skalierung"}</legend>
                {(["X", "Y", "Z"] as const).map((axis, index) => <label key={axis}>{axis}<input type="number" step={key === "rotation" ? 5 : 0.1} value={Number((key === "rotation" ? selected[key][index] * 180 / Math.PI : selected[key][index]).toFixed(2))} onChange={(event) => updateVector(key, index as 0 | 1 | 2, Number(event.target.value))} /></label>)}
              </fieldset>
            ))}
          </div>}
          {error && <p className="field-error model-studio-error" role="alert">{error}</p>}
        </aside>
      </div>
    </section>
  );
}
