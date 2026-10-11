import { partCatalog } from "../model/partCatalog";
import type { MachinePart } from "../model/types";

type Props = { parts: MachinePart[]; activeSensorIds: string[] };

export function MachineSensorPanel({ parts, activeSensorIds }: Props) {
  return (
    <div className="panel machine-sensors">
      <div className="output-heading"><div><span className="eyebrow">EINGÄNGE</span><h2>Sensorstatus</h2></div></div>
      {parts.filter((part) => partCatalog[part.kind].isSensor).map((part) => <div className="sensor-row" key={part.id}><i className={activeSensorIds.includes(part.id) ? "sensor-indicator active" : "sensor-indicator"} /><span>{part.name}</span><strong>{activeSensorIds.includes(part.id) ? "BELEGT" : "FREI"}</strong></div>)}
      {!parts.some((part) => partCatalog[part.kind].isSensor) && <p className="empty-hint">Noch keine Sensoren in der Anlage.</p>}
    </div>
  );
}
