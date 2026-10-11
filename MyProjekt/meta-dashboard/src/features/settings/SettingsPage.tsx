import { PageHeading } from "../../shared/components/PageHeading";
import { DEFAULT_ACCENT, isHexColor, starterColors } from "../../shared/lib/colors";
import { useSettings } from "./useSettings";

/**
 * Component to render the Settings page with theme and accent color customization.
 */
export default function SettingsPage() {
  const { theme, setTheme, accent, setAccent } = useSettings();
  function updateAccent(value: string) {
    setAccent(value);
  }

  return (
    <section>
      <PageHeading eyebrow="PERSÖNLICHES SETUP" title="Settings" subtitle="Richte deinen Arbeitsbereich so ein, wie du am liebsten arbeitest."
        aside={<span className="status-pill"><span className="live-dot" /> Automatisch gespeichert</span>} />
      <div className="settings-layout">
        <div className="panel setting-panel"><div className="setting-title"><span className="setting-icon">◐</span><div><h2>Erscheinungsbild</h2><p>Wähle das Farbschema für deinen Arbeitsbereich.</p></div></div><div className="theme-options"><button className={theme === "dark" ? "theme-option selected" : "theme-option"} onClick={() => setTheme("dark")}><span className="theme-preview dark-preview"><i /><i /><i /></span><span>Dunkel</span>{theme === "dark" && <span className="selected-mark">✓</span>}</button><button className={theme === "light" ? "theme-option selected" : "theme-option"} onClick={() => setTheme("light")}><span className="theme-preview light-preview"><i /><i /><i /></span><span>Hell</span>{theme === "light" && <span className="selected-mark">✓</span>}</button></div></div>
        <div className="panel setting-panel"><div className="setting-title"><span className="setting-icon">◉</span><div><h2>Akzentfarbe</h2><p>Die Farbe für Buttons, Links und Hervorhebungen.</p></div></div><div className="accent-controls"><div className="swatch-grid compact-swatches">{starterColors.slice(0, 6).map((color) => <button key={color} className={accent.toUpperCase() === color ? "swatch selected" : "swatch"} style={{ background: color }} aria-label={`Akzentfarbe ${color}`} onClick={() => updateAccent(color)} />)}</div><label className="accent-custom" htmlFor="accent-custom">Eigener HEX-Wert<input id="accent-custom" type="color" value={isHexColor(accent) ? accent : "#38BDF8"} onChange={(event) => updateAccent(event.target.value.toUpperCase())} /></label></div></div>
        <div className="panel setting-panel storage-setting"><span className="eyebrow">DATEN & PRIVATSPHÄRE</span><h2>Deine Daten bleiben bei dir</h2><p className="muted-copy">Einstellungen, Aufgaben und deine Farbpalette werden lokal in diesem Browser gespeichert. Der API-Generator und 3D-Preview benötigen keinen externen Dienst.</p><div className="storage-status"><span className="live-dot" /> Lokaler Browser-Speicher aktiv</div></div>
        <div className="settings-actions"><button className="secondary-button" onClick={() => { setTheme("dark"); setAccent(DEFAULT_ACCENT); }}>Standardeinstellungen wiederherstellen</button><span className="saved-status">Änderungen werden automatisch gespeichert</span></div>
      </div>
    </section>
  );
}
