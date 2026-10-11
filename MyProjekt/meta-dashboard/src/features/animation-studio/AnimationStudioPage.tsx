import { useEffect, useMemo, useState } from "react";
import { PageHeading } from "../../shared/components/PageHeading";
import { ModelPreview } from "../../shared/3d/ModelPreview";
import { defaultTransform } from "../../shared/3d/types";
import type { ModelKind, Transform } from "../../shared/3d/types";
import { useCopyToClipboard } from "../../shared/hooks/useCopyToClipboard";
import { useLocalStorage } from "../../shared/hooks/useLocalStorage";
import { downloadTextFile } from "../../shared/lib/download";
import { createDefaultAnimation, fitKeyframesToDuration, sampleTrack } from "./model/animation";
import type { AnimationLanguage, AnimationProject, Keyframe } from "./model/types";
import { animationExporters, exportAnimation } from "./exporters";

export default function AnimationStudioPage() {
  const [project, setProject] = useLocalStorage<AnimationProject>("dashboard-animation-project", createDefaultAnimation());
  const [selectedTrackId, setSelectedTrackId] = useState("track-cube");
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [language, setLanguage] = useState<AnimationLanguage>("C++");
  const { copied, error: copyError, copy } = useCopyToClipboard();
  const [downloaded, setDownloaded] = useState(false);

  const activeTrack = project.tracks.find((track) => track.id === selectedTrackId) ?? project.tracks[0];
  const activeTransform = activeTrack ? sampleTrack(activeTrack, currentTime) : defaultTransform;
  const previewModels = useMemo(() => project.tracks.map((track) => ({
    id: track.id,
    kind: track.kind,
    transform: sampleTrack(track, currentTime),
  })), [project.tracks, currentTime]);
  const code = useMemo(() => exportAnimation(project, language), [project, language]);

  useEffect(() => {
    if (!playing) return;
    let animationFrame = 0;
    let previousTimestamp: number | null = null;
    const advance = (timestamp: number) => {
      if (previousTimestamp !== null) {
        const delta = (timestamp - previousTimestamp) / 1000;
        setCurrentTime((time) => (time + delta) % project.duration);
      }
      previousTimestamp = timestamp;
      animationFrame = requestAnimationFrame(advance);
    };
    animationFrame = requestAnimationFrame(advance);
    return () => cancelAnimationFrame(animationFrame);
  }, [playing, project.duration]);

  function setTrackProperty(property: keyof Transform, value: number) {
    if (!activeTrack) return;
    const newKeyframeId = crypto.randomUUID();
    setProject((previous) => ({
      ...previous,
      tracks: previous.tracks.map((track) => {
        if (track.id !== activeTrack.id) return track;
        const existing = track.keyframes.find((keyframe) => Math.abs(keyframe.time - currentTime) < 0.015);
        const transform = { ...sampleTrack(track, currentTime), [property]: value };
        const keyframe: Keyframe = { id: existing?.id ?? newKeyframeId, time: currentTime, ...transform };
        return {
          ...track,
          keyframes: existing
            ? track.keyframes.map((frame) => frame.id === existing.id ? keyframe : frame)
            : [...track.keyframes, keyframe].sort((first, second) => first.time - second.time),
        };
      }),
    }));
  }

  function addKeyframe() {
    if (!activeTrack) return;
    const newKeyframeId = crypto.randomUUID();
    setProject((previous) => ({
      ...previous,
      tracks: previous.tracks.map((track) => track.id === activeTrack.id
        ? {
            ...track,
            keyframes: [
              ...track.keyframes.filter((frame) => Math.abs(frame.time - currentTime) >= 0.015),
              { id: newKeyframeId, time: currentTime, ...sampleTrack(track, currentTime) },
            ].sort((first, second) => first.time - second.time),
          }
        : track),
    }));
  }

  function addTrack(kind: ModelKind) {
    const id = crypto.randomUUID();
    const firstKeyframeId = crypto.randomUUID();
    const label = { cube: "Würfel", sphere: "Kugel", cylinder: "Zylinder", cone: "Kegel" }[kind];
    setProject((previous) => ({
      ...previous,
      tracks: [...previous.tracks, {
        id,
        name: `${label} ${previous.tracks.filter((track) => track.kind === kind).length + 1}`,
        kind,
        keyframes: [{ id: firstKeyframeId, time: 0, ...defaultTransform }],
      }],
    }));
    setSelectedTrackId(id);
    setCurrentTime(0);
  }

  function downloadCode() {
    downloadTextFile(`animation.${animationExporters[language].fileExtension}`, code);
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 1800);
  }

  return (
    <section>
      <PageHeading eyebrow="3D ANIMATION & CODE" title="Animation Studio" subtitle="Keyframe-Animationen erstellen, abspielen und als Quellcode exportieren."
        aside={<span className="status-pill"><span className="live-dot" /> Lokal gespeichert</span>} />
      <div className="animation-layout">
        <div className="animation-workspace">
          <div className="panel animation-preview-panel">
            <div className="panel-heading"><div><span className="eyebrow">LIVE VORSCHAU</span><h2>{activeTrack?.name ?? "Szene"}</h2></div><span className="animation-clock">{currentTime.toFixed(2)} s</span></div>
            <div className="canvas-container animation-canvas"><ModelPreview models={previewModels} /><span className="canvas-hint">Szene · {project.tracks.length} {project.tracks.length === 1 ? "Objekt" : "Objekte"}</span></div>
            <div className="transport-row"><button className="primary-button transport-button" onClick={() => setPlaying((value) => !value)}>{playing ? "Ⅱ  Pause" : "▶  Abspielen"}</button><button className="secondary-button" onClick={() => { setPlaying(false); setCurrentTime(0); }}>⏮  Anfang</button><label className="duration-control">Dauer <input type="number" min="1" max="30" step="1" value={project.duration} onChange={(event) => {
              const duration = Math.max(1, Math.min(30, Number(event.target.value) || 1));
              setProject((previous) => ({ ...previous, duration, tracks: previous.tracks.map((track) => ({
                ...track,
                keyframes: fitKeyframesToDuration(track.keyframes, duration),
              })) }));
              setCurrentTime((time) => Math.min(time, duration));
            }} /> s</label></div>
          </div>

          <div className="panel timeline-panel">
            <div className="output-heading"><div><span className="eyebrow">TIMELINE</span><h2>Keyframes</h2></div><button className="primary-button keyframe-button" onClick={addKeyframe}>＋ Keyframe bei {currentTime.toFixed(1)} s</button></div>
            <input className="timeline-scrubber" aria-label="Animationszeit" type="range" min="0" max={project.duration} step="0.01" value={currentTime} onChange={(event) => { setPlaying(false); setCurrentTime(Number(event.target.value)); }} />
            <div className="timeline-labels"><span>0:00</span><span>{project.duration.toFixed(1)} s</span></div>
            <div className="keyframe-list">
              {activeTrack?.keyframes.map((frame) => <button key={frame.id} className={Math.abs(currentTime - frame.time) < 0.015 ? "keyframe-chip selected" : "keyframe-chip"} onClick={() => { setPlaying(false); setCurrentTime(frame.time); }}><span className="keyframe-diamond" />{frame.time.toFixed(2)} s</button>)}
              {activeTrack?.keyframes.length === 0 && <span className="empty-hint">Noch keine Keyframes. Füge einen Keyframe hinzu.</span>}
            </div>
          </div>

          <div className="panel export-panel">
            <div className="output-heading"><div><span className="eyebrow">CODE EXPORT</span><h2>In andere Sprachen übernehmen</h2></div><div className="export-actions"><button className="secondary-button" onClick={() => copy(code)}>{copied ? "Kopiert ✓" : "Code kopieren"}</button><button className="primary-button" onClick={downloadCode}>{downloaded ? "Heruntergeladen ✓" : "Datei exportieren ↓"}</button></div></div>
            <div className="export-languages" role="group" aria-label="Programmiersprache auswählen">{(["C++", "C", "JavaScript", "Python"] as const).map((item) => <button key={item} className={language === item ? "language-chip selected" : "language-chip"} onClick={() => setLanguage(item)}>{item}</button>)}</div>
            <pre className="code-output animation-code"><code>{code}</code></pre>
            <p className="security-note">Der Export enthält Keyframe-Daten und lineare Interpolation. Die Werte müssen an die Transform-API deiner Engine angepasst werden. Die Vorschau läuft im Browser; C/C++/Python werden hier nicht ausgeführt.</p>
            {copyError && <p className="field-error" role="alert">{copyError}</p>}
          </div>
        </div>

        <aside className="animation-sidebar">
          <div className="panel tracks-panel">
            <div className="output-heading"><div><span className="eyebrow">SZENE</span><h2>Modelle</h2></div><span className="track-total">{project.tracks.length}</span></div>
            <div className="track-list">{project.tracks.map((track) => <div className={track.id === activeTrack?.id ? "track-item selected" : "track-item"} key={track.id}><button className="track-select" onClick={() => setSelectedTrackId(track.id)}><span className={`track-shape shape-${track.kind}`}>{track.kind === "sphere" ? "●" : track.kind === "cylinder" ? "▰" : track.kind === "cone" ? "▲" : "■"}</span><span><strong>{track.name}</strong><small>{track.keyframes.length} Keyframes</small></span></button><button className="track-delete" aria-label={`${track.name} entfernen`} disabled={project.tracks.length <= 1} onClick={() => {
              setProject((previous) => ({ ...previous, tracks: previous.tracks.filter((item) => item.id !== track.id) }));
            }}>×</button></div>)}</div>
            <label className="add-track-label" htmlFor="add-track">Modell hinzufügen</label>
            <select id="add-track" value="" onChange={(event) => { if (event.target.value) addTrack(event.target.value as ModelKind); }}><option value="">Grundform wählen…</option><option value="cube">Würfel</option><option value="sphere">Kugel</option><option value="cylinder">Zylinder</option><option value="cone">Kegel</option></select>
          </div>

          {activeTrack && <div className="panel transform-panel">
            <div className="output-heading"><div><span className="eyebrow">TRANSFORM</span><h2>{activeTrack.name}</h2></div><button className="text-button" onClick={addKeyframe}>Keyframe +</button></div>
            <p className="transform-time">Werte bei <strong>{currentTime.toFixed(2)} s</strong></p>
            {([
              { key: "x", label: "Position X", min: -3, max: 3, step: 0.05, value: activeTransform.x },
              { key: "y", label: "Position Y", min: -3, max: 3, step: 0.05, value: activeTransform.y },
              { key: "z", label: "Position Z", min: -3, max: 3, step: 0.05, value: activeTransform.z },
              { key: "rx", label: "Rotation X", min: -180, max: 180, step: 1, value: activeTransform.rx * 180 / Math.PI },
              { key: "ry", label: "Rotation Y", min: -180, max: 180, step: 1, value: activeTransform.ry * 180 / Math.PI },
              { key: "rz", label: "Rotation Z", min: -180, max: 180, step: 1, value: activeTransform.rz * 180 / Math.PI },
              { key: "scale", label: "Skalierung", min: 0.25, max: 2, step: 0.05, value: activeTransform.scale },
            ] as const).map((control) => <label className="transform-control" key={control.key}><span>{control.label}</span><input type="range" min={control.min} max={control.max} step={control.step} value={control.value} onChange={(event) => {
              const value = Number(event.target.value);
              setTrackProperty(control.key, control.key === "rx" || control.key === "ry" || control.key === "rz" ? value * Math.PI / 180 : value);
            }} /><output>{control.key === "rx" || control.key === "ry" || control.key === "rz" ? `${Math.round(control.value)}°` : control.value.toFixed(2)}</output></label>)}
            <p className="transform-hint">Änderungen legen am aktuellen Zeitpunkt automatisch einen Keyframe an.</p>
          </div>}
        </aside>
      </div>
    </section>
  );
}
