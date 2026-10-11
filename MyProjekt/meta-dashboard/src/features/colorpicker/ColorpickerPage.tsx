import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { PageHeading } from "../../shared/components/PageHeading";
import { useCopyToClipboard } from "../../shared/hooks/useCopyToClipboard";
import { useLocalStorage } from "../../shared/hooks/useLocalStorage";
import { isHexColor, starterColors } from "../../shared/lib/colors";
import { useSettings } from "../settings/useSettings";

export default function ColorpickerPage() {
  const { setAccent } = useSettings();
  const [color, setColor] = useState("#38BDF8");
  const [recentColors, setRecentColors] = useLocalStorage<string[]>("dashboard-color-history", []);
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const imageRef = useRef<HTMLImageElement>(null);
  const { copied, error: copyError, copy } = useCopyToClipboard(1600);
  const normalizedColor = isHexColor(color) ? color.toUpperCase() : "#38BDF8";

  useEffect(() => {
    function handlePaste(event: globalThis.ClipboardEvent) {
      const imageItem = Array.from(event.clipboardData?.items ?? []).find((item) => item.type.startsWith("image/"));
      const image = imageItem?.getAsFile();
      if (!image) return;
      event.preventDefault();
      setImageUrl(URL.createObjectURL(image));
      setImageError("");
    }
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  useEffect(() => {
    if (!imageUrl) return;
    return () => URL.revokeObjectURL(imageUrl);
  }, [imageUrl]);

  function saveColor() {
    setRecentColors((colors) => [normalizedColor, ...colors.filter((item) => item !== normalizedColor)].slice(0, 8));
  }

  function setPastedImage(image: Blob) {
    if (!image.type.startsWith("image/")) {
      setImageError("In der Zwischenablage wurde kein Bild gefunden.");
      return;
    }
    setImageUrl(URL.createObjectURL(image));
    setImageError("");
  }

  async function pasteFromClipboard() {
    if (!navigator.clipboard?.read) {
      setImageError("Der Zwischenablagezugriff ist hier nicht verfügbar. Kopiere das Bild und füge es mit Strg+V ein.");
      return;
    }
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find((type) => type.startsWith("image/"));
        if (imageType) {
          setPastedImage(await item.getType(imageType));
          return;
        }
      }
      setImageError("Die Zwischenablage enthält kein Bild. Kopiere zuerst einen Screenshot.");
    } catch (error) {
      console.error("Das Bild konnte nicht aus der Zwischenablage gelesen werden.", error);
      setImageError("Kein Zugriff auf die Zwischenablage. Bitte kopiere den Screenshot und füge ihn mit Strg+V ein.");
    }
  }

  function sampleImageColor(event: MouseEvent<HTMLImageElement>) {
    const image = imageRef.current;
    if (!image?.naturalWidth || !image.naturalHeight) {
      setImageError("Das Bild ist noch nicht vollständig geladen.");
      return;
    }
    const bounds = image.getBoundingClientRect();
    const x = Math.max(0, Math.min(image.naturalWidth - 1, Math.floor((event.clientX - bounds.left) * image.naturalWidth / bounds.width)));
    const y = Math.max(0, Math.min(image.naturalHeight - 1, Math.floor((event.clientY - bounds.top) * image.naturalHeight / bounds.height)));
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("Canvas 2D ist nicht verfügbar.");
      context.drawImage(image, x, y, 1, 1, 0, 0, 1, 1);
      const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
      setColor(`#${[red, green, blue].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`.toUpperCase());
      setImageError("");
    } catch (error) {
      console.error("Die Bildfarbe konnte nicht gelesen werden.", error);
      setImageError("Die Farbe aus diesem Bild konnte nicht gelesen werden.");
    }
  }

  return (
    <section>
      <PageHeading eyebrow="FARBEN & IDENTITÄT" title="Colorpicker" subtitle="Finde den perfekten Farbton und speichere deine Palette lokal."
        aside={<span className="status-pill"><span className="live-dot" /> Palette lokal gespeichert</span>} />
      <div className="color-layout">
        <div className="panel color-main">
          <div className="color-preview" style={{ background: normalizedColor }}><span>DEINE FARBE</span><strong>{normalizedColor}</strong></div>
          <div className="image-color-picker">
            <div className="image-picker-heading">
              <div><span className="eyebrow">FARBE AUS BILD</span><strong>Screenshot einfügen</strong></div>
              <button className="secondary-button" onClick={() => void pasteFromClipboard()}>Aus Zwischenablage</button>
            </div>
            {imageUrl ? (
              <div className="pasted-image-wrap">
                <img ref={imageRef} src={imageUrl} alt="Eingefügter Screenshot. Klicke auf eine Stelle, um ihre Farbe zu übernehmen." onClick={sampleImageColor} />
                <span className="image-picker-hint">Auf eine Stelle im Bild klicken, um die Farbe zu übernehmen</span>
                <button className="image-clear-button" aria-label="Eingefügtes Bild entfernen" title="Bild entfernen" onClick={() => { setImageUrl(""); setImageError(""); }}>×</button>
              </div>
            ) : (
              <div className="image-paste-empty">
                <span aria-hidden="true">▧</span>
                <p>Kopiere einen Screenshot und drücke <kbd>Strg</kbd> + <kbd>V</kbd></p>
                <small>Das Bild wird nur lokal im Browser verarbeitet.</small>
              </div>
            )}
            {imageError && <p className="field-error" role="alert">{imageError}</p>}
          </div>
          <div className="color-controls">
            <label className="native-color-label" htmlFor="native-color">Farbton wählen<input id="native-color" type="color" value={normalizedColor} onChange={(event) => setColor(event.target.value.toUpperCase())} /></label>
            <label htmlFor="hex-value">HEX-Wert</label>
            <div className="hex-row"><input id="hex-value" value={color} onChange={(event) => setColor(event.target.value)} maxLength={7} spellCheck={false} /><button className="secondary-button" onClick={() => copy(normalizedColor)}>{copied ? "Kopiert ✓" : "Kopieren"}</button></div>
            {color && !isHexColor(color) && <p className="field-error">Bitte gib einen HEX-Wert im Format #38BDF8 ein.</p>}
            {copyError && <p className="field-error" role="alert">{copyError}</p>}
            <div className="color-actions"><button className="primary-button" onClick={saveColor}>In Palette speichern</button><button className="secondary-button" onClick={() => setAccent(normalizedColor)}>Als Dashboard-Akzent verwenden</button></div>
          </div>
        </div>
        <div className="panel palette-panel">
          <div className="section-heading"><div><span className="eyebrow">SCHNELLSTART</span><h2>Farbpalette</h2></div></div>
          <div className="swatch-grid">{starterColors.map((swatch) => <button className="swatch" key={swatch} style={{ background: swatch }} aria-label={`Farbe ${swatch} auswählen`} title={swatch} onClick={() => setColor(swatch)} />)}</div>
          <div className="section-heading recent-heading"><div><span className="eyebrow">DEINE AUSWAHL</span><h2>Zuletzt gespeichert</h2></div>{recentColors.length > 0 && <button className="text-button" onClick={() => setRecentColors([])}>Leeren</button>}</div>
          {recentColors.length ? <div className="recent-list">{recentColors.map((swatch) => <button key={swatch} className="recent-swatch" onClick={() => setColor(swatch)}><span style={{ background: swatch }} />{swatch}<span className="recent-arrow">↗</span></button>)}</div> : <p className="empty-hint">Deine gespeicherten Farben erscheinen hier.</p>}
        </div>
      </div>
    </section>
  );
}
