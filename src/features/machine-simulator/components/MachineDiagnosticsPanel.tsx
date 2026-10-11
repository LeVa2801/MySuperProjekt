import type { MachineAnalysis } from "../model/analysis";
import type { DamageMap, MachinePart } from "../model/types";

type Props = { parts: MachinePart[]; damage: DamageMap; analysis: MachineAnalysis };

export function MachineDiagnosticsPanel({ parts, damage, analysis }: Props) {
  const damaged = parts.filter((part) => damage[part.id]);
  return (
    <div className="panel machine-diagnostics">
      <div className="output-heading"><div><span className="eyebrow">DIAGNOSE</span><h2>Zustand der Anlage</h2></div></div>
      <div className="sensor-row"><i className={analysis.safetyClosed && analysis.hasSafetyCircuit ? "sensor-indicator active" : "sensor-indicator"} /><span>Sicherheitskreis</span><strong>{!analysis.hasSafetyCircuit ? "KEINER" : analysis.safetyClosed ? "GESCHLOSSEN" : "OFFEN"}</strong></div>
      {damaged.length > 0 && <div className="damage-list" role="alert">{damaged.map((part) => <p key={part.id}><strong>✖ {part.name}</strong> {damage[part.id]}</p>)}</div>}
      <ul className="diagnostic-list">{analysis.diagnostics.map((item) => <li className={`diagnostic-${item.level}`} key={item.message}>{item.message}</li>)}</ul>
    </div>
  );
}