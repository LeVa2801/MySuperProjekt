import { machinePartKinds, partCatalog, type PartCategory } from "../model/partCatalog";
import type { MachinePartKind } from "../model/types";

type Props = { onAdd: (kind: MachinePartKind) => void };
const categories: PartCategory[] = ["Mechanik & Gestell", "Antriebe & Achsen", "Sensoren", "Sicherheit", "Werkstücke"];

export function MachinePalette({ onAdd }: Props) {
  return (
    <div className="panel machine-palette">
      <div className="output-heading"><div><span className="eyebrow">BAUKASTEN · {machinePartKinds.length} KOMPONENTEN</span><h2>Bauteile hinzufügen</h2></div></div>
      {categories.map((category) => {
        const kinds = machinePartKinds.filter((kind) => partCatalog[kind].category === category);
        return (
          <section className="machine-palette-category" key={category}>
            <h3>{category}<span>{kinds.length}</span></h3>
            <div className="machine-palette-grid">
              {kinds.map((kind) => <button className="machine-palette-item" key={kind} onClick={() => onAdd(kind)} title={`${partCatalog[kind].label} hinzufügen`}><span>{partCatalog[kind].icon}</span>{partCatalog[kind].paletteLabel}<i>＋</i></button>)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
