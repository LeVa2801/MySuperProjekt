import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useCopyToClipboard } from "../../shared/hooks/useCopyToClipboard";
import { PageHeading } from "../../shared/components/PageHeading";
import { buildRequestSnippets } from "./requestSnippets";

export default function ApiGeneratorPage() {
  const [method, setMethod] = useState("GET");
  const [endpoint, setEndpoint] = useState("https://api.example.com/v1/items");
  const [token, setToken] = useState("");
  const [body, setBody] = useState('{\n  "name": "New item"\n}');
  const [activeTab, setActiveTab] = useState<"fetch" | "curl">("fetch");
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState("");
  const { copied, error: copyError, copy } = useCopyToClipboard();
  const supportsBody = ["POST", "PUT", "PATCH"].includes(method);
  const updateRequest = <K extends "method" | "endpoint" | "token" | "body">(field: K, value: string) => {
    if (field === "method") setMethod(value);
    else if (field === "endpoint") setEndpoint(value);
    else if (field === "token") setToken(value);
    else setBody(value);
    setGenerated(false);
    setError("");
  };

  const output = useMemo(() => buildRequestSnippets({ method, endpoint, token, body }), [body, endpoint, method, token]);
  const selectedOutput = activeTab === "fetch" ? output.fetch : output.curl;

  function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const parsed = new URL(endpoint.trim(), window.location.origin);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
      if (supportsBody && body.trim()) JSON.parse(body);
      setError("");
      setGenerated(true);
    } catch {
      setError(supportsBody && body.trim() ? "Prüfe die URL und stelle sicher, dass der Body gültiges JSON ist." : "Gib eine gültige HTTP- oder HTTPS-URL ein.");
      setGenerated(false);
    }
  }

  return (
    <section>
      <PageHeading eyebrow="ENTWICKLER-WERKZEUGE" title="API-Generator" subtitle="Erstelle sofort verwendbare Requests für deine REST-API."
        aside={<span className="status-pill"><span className="live-dot" /> Läuft im Browser</span>} />
      <div className="api-layout">
        <form className="panel stack-form api-form" onSubmit={generate}>
          <div><span className="eyebrow">REQUEST EINSTELLEN</span><h2>Endpoint konfigurieren</h2></div>
          <label htmlFor="api-method">Methode</label>
          <select id="api-method" value={method} onChange={(event) => updateRequest("method", event.target.value)}>{["GET", "POST", "PUT", "PATCH", "DELETE"].map((verb) => <option key={verb}>{verb}</option>)}</select>
          <label htmlFor="api-endpoint">Endpoint-URL</label>
          <input id="api-endpoint" type="text" value={endpoint} onChange={(event) => updateRequest("endpoint", event.target.value)} placeholder="https://api.example.com/v1/items" />
          <label htmlFor="api-token">Bearer Token <span className="label-optional">OPTIONAL</span></label>
          <input id="api-token" type="password" autoComplete="off" value={token} onChange={(event) => updateRequest("token", event.target.value)} placeholder="Dein Token wird nicht gespeichert" />
          {supportsBody && <><label htmlFor="api-body">JSON-Request-Body</label><textarea id="api-body" className="code-input" rows={7} value={body} onChange={(event) => updateRequest("body", event.target.value)} spellCheck={false} /></>}
          {(error || copyError) && <p className="field-error" role="alert">{error || copyError}</p>}
          <button className="primary-button" type="submit">Code generieren <span aria-hidden="true">→</span></button>
        </form>
        <div className="panel output-panel">
          <div className="output-heading"><div><span className="eyebrow">DEIN REQUEST</span><h2>Code-Vorschau</h2></div><button className="secondary-button" onClick={() => copy(selectedOutput)} disabled={!generated}>{copied ? "Kopiert ✓" : "Code kopieren"}</button></div>
          <div className="tabs"><button className={activeTab === "fetch" ? "tab active" : "tab"} onClick={() => setActiveTab("fetch")}>JavaScript Fetch</button><button className={activeTab === "curl" ? "tab active" : "tab"} onClick={() => setActiveTab("curl")}>cURL</button></div>
          <pre className="code-output"><code>{generated ? selectedOutput : "Konfiguriere deinen Request und wähle „Code generieren“."}</code></pre>
          <p className="security-note">Der Generator führt den Request nicht aus. Dein Token bleibt in diesem Tab und wird nicht gespeichert.</p>
        </div>
      </div>
    </section>
  );
}
