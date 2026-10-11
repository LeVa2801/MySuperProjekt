import { useEffect, useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import coreURL from "@ffmpeg/core?url";
import wasmURL from "@ffmpeg/core/wasm?url";
import { PageHeading } from "../../shared/components/PageHeading";

type OutputVideo = { url: string; fileName: string; size: number };
type Resolution = "source" | "1080" | "720";

const supportedExtensions = new Set(["avi", "m4v", "mkv", "mov", "mp4", "mpeg", "mpg", "ogv", "webm"]);

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getOutputName(fileName: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "").trim() || "video";
  return `${baseName}-komprimiert.mp4`;
}

export default function VideoCompressorPage() {
  const [source, setSource] = useState<File | null>(null);
  const [output, setOutput] = useState<OutputVideo | null>(null);
  const [quality, setQuality] = useState(22);
  const [resolution, setResolution] = useState<Resolution>("source");
  const [status, setStatus] = useState<"idle" | "loading" | "encoding" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const sourceVideoRef = useRef<HTMLVideoElement>(null);
  const operationRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!source || !sourceVideoRef.current) return;
    const url = URL.createObjectURL(source);
    sourceVideoRef.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [source]);

  useEffect(() => {
    if (!output) return;
    return () => URL.revokeObjectURL(output.url);
  }, [output]);

  useEffect(() => () => {
    operationRef.current += 1;
    ffmpegRef.current?.terminate();
  }, []);

  function chooseFile(file: File | undefined) {
    if (!file) return;
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!file.type.startsWith("video/") && !supportedExtensions.has(extension)) {
      setError("Bitte wähle eine Videodatei aus, zum Beispiel MP4, MOV oder WebM.");
      return;
    }
    operationRef.current += 1;
    setSource(file);
    setOutput(null);
    setError("");
    setProgress(0);
    setStatus("idle");
  }

  function cancel() {
    operationRef.current += 1;
    ffmpegRef.current?.terminate();
    ffmpegRef.current = null;
    setStatus("idle");
    setProgress(0);
  }

  async function compress() {
    if (!source || status === "loading" || status === "encoding") return;
    const operation = ++operationRef.current;
    setOutput(null);
    setError("");
    setProgress(0);
    setStatus("loading");

    let ffmpeg = ffmpegRef.current;
    if (!ffmpeg) {
      ffmpeg = new FFmpeg();
      ffmpegRef.current = ffmpeg;
    }

    const updateProgress = ({ progress: value }: { progress: number }) => {
      if (operation === operationRef.current && Number.isFinite(value)) {
        setProgress(Math.min(99, Math.max(0, Math.round(value * 100))));
      }
    };

    ffmpeg.on("progress", updateProgress);
    try {
      if (!ffmpeg.loaded) {
        await ffmpeg.load({ coreURL, wasmURL });
      }
      if (operation !== operationRef.current) return;

      setStatus("encoding");
      const extension = source.name.split(".").pop()?.toLowerCase() ?? "video";
      const inputPath = `input.${supportedExtensions.has(extension) ? extension : "video"}`;
      await ffmpeg.writeFile(inputPath, await fetchFile(source));
      if (operation !== operationRef.current) return;

      const scaleFilter = resolution === "source"
        ? "scale=trunc(iw/2)*2:trunc(ih/2)*2"
        : `scale=w='trunc(iw*min(1\\,${resolution}/ih)/2)*2':h='trunc(ih*min(1\\,${resolution}/ih)/2)*2'`;
      const exitCode = await ffmpeg.exec([
        "-i", inputPath,
        "-map", "0:v:0",
        "-map", "0:a?",
        "-vf", scaleFilter,
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", String(quality),
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        "output.mp4",
      ]);
      if (operation !== operationRef.current) return;
      if (exitCode !== 0) throw new Error(`FFmpeg hat den Export mit Fehlercode ${exitCode} beendet.`);

      const encoded = await ffmpeg.readFile("output.mp4");
      if (operation !== operationRef.current) return;
      if (typeof encoded === "string") throw new Error("FFmpeg hat keine Videodatei erzeugt.");

      const bytes = new Uint8Array(encoded.byteLength);
      bytes.set(encoded);
      const blob = new Blob([bytes.buffer], { type: "video/mp4" });
      setOutput({ url: URL.createObjectURL(blob), fileName: getOutputName(source.name), size: blob.size });
      setProgress(100);
      setStatus("done");
    } catch (cause) {
      if (operation !== operationRef.current) return;
      setStatus("error");
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      ffmpeg.off("progress", updateProgress);
    }
  }

  const reduction = source && output
    ? Math.round((1 - output.size / source.size) * 100)
    : null;
  const busy = status === "loading" || status === "encoding";

  return (
    <section>
      <PageHeading
        eyebrow="LOKALE MEDIENWERKZEUGE"
        title="MP4 Video-Kompressor"
        subtitle="Eigene Videos lokal zu MP4 komprimieren – mit Kontrolle über Qualität und Auflösung."
        aside={<span className="status-pill"><span className="live-dot" /> Kein Upload</span>}
      />
      <div className="video-compressor-layout">
        <div className="panel video-settings-panel">
          <div className="panel-heading">
            <div><span className="eyebrow">QUELLE</span><h2>Videodatei auswählen</h2></div>
            {source && <span className="video-file-size">{formatBytes(source.size)}</span>}
          </div>
          <input
            ref={fileInputRef}
            className="video-file-input"
            type="file"
            accept="video/*,.mkv,.m4v"
            aria-label="Videodatei auswählen"
            disabled={busy}
            onChange={(event) => {
              chooseFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          <button className="video-file-picker" type="button" disabled={busy} onClick={() => fileInputRef.current?.click()}>
            <span className="video-file-icon">▶</span>
            <strong>{source ? source.name : "Video auswählen"}</strong>
            <span>MP4, MOV, WebM und weitere lokale Videodateien</span>
          </button>

          <div className="video-control">
            <div className="video-control-heading"><label htmlFor="video-quality">Qualität und Komprimierung</label><output htmlFor="video-quality">CRF {quality}</output></div>
            <input id="video-quality" type="range" min="18" max="30" step="1" value={quality} disabled={busy} onChange={(event) => setQuality(Number(event.target.value))} />
            <div className="video-range-labels"><span>Höhere Qualität · größere Datei</span><span>Kleinere Datei</span></div>
            <p>CRF 22 ist ein ausgewogener Startwert. Für kleinen Text oder feine Details kannst du einen niedrigeren Wert wählen.</p>
          </div>

          <label className="video-resolution" htmlFor="video-resolution">
            <span><strong>Maximale Auflösung</strong><small>Die Quelle wird nicht hochskaliert.</small></span>
            <select id="video-resolution" value={resolution} disabled={busy} onChange={(event) => {
              const value = event.target.value;
              if (value === "source" || value === "1080" || value === "720") setResolution(value);
            }}>
              <option value="source">Original beibehalten</option>
              <option value="1080">Bis 1080p</option>
              <option value="720">Bis 720p</option>
            </select>
          </label>

          <div className="video-privacy-note"><span className="live-dot" /> Die Datei bleibt auf deinem Gerät. Beim ersten Start wird der lokale FFmpeg-Encoder einmalig geladen.</div>

          {error && <p className="video-error" role="alert">{error}</p>}
          <div className="video-actions">
            <button className="primary-button" type="button" onClick={compress} disabled={!source || busy}>
              {status === "loading" ? "Encoder wird geladen…" : status === "encoding" ? "Video wird komprimiert…" : "MP4 erstellen"}
            </button>
            {busy && <button className="secondary-button" type="button" onClick={cancel}>Abbrechen</button>}
          </div>
          {busy && <div className="video-progress" role="status" aria-live="polite"><div><span>{status === "loading" ? "Lade lokalen Encoder" : "Komprimiere Video"}</span><span>{status === "loading" ? "Einmaliger Download, ca. 30 MB" : `ca. ${progress}%`}</span></div><progress max="100" value={status === "loading" ? undefined : progress} /></div>}
        </div>

        <div className="video-preview-column">
          {source && <div className="panel video-preview-panel"><div className="output-heading"><h2>Original</h2><span>{formatBytes(source.size)}</span></div><video ref={sourceVideoRef} controls preload="metadata" /></div>}
          {output && <div className="panel video-preview-panel video-output-panel"><div className="output-heading"><h2>Komprimiertes MP4</h2><span>{formatBytes(output.size)}</span></div><video src={output.url} controls preload="metadata" /><p>{reduction !== null && (reduction >= 0 ? `${reduction}% kleiner als das Original.` : `${Math.abs(reduction)}% größer als das Original.`)} Prüfe insbesondere kleine Texte im Vorschaubild.</p><a className="primary-button video-download" href={output.url} download={output.fileName}>MP4 herunterladen ↓</a></div>}
          {!source && <div className="panel video-empty-preview"><span aria-hidden="true">▶</span><h2>Dein Video bleibt privat</h2><p>Wähle eine Videodatei auf deinem Gerät aus. Nach dem Export kannst du Original und Ergebnis direkt vergleichen.</p></div>}
        </div>
      </div>
    </section>
  );
}
