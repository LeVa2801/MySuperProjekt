import { MathUtils } from "three";
import type { MachinePart } from "../model/types";

type Props = {
  selectedPart: MachinePart | undefined;
  damageReason: string | undefined;
  canRemove: boolean;
  onRename: (name: string) => void;
  onMove: (axis: 0 | 1 | 2, value: number) => void;
  onRotate: (axis: 0 | 1 | 2, radians: number) => void;
  onToggleOpen: (open: boolean) => void;
  onRemove: () => void;
};

const axes = ["X", "Y", "Z"] as const;

export function MachineInspector({ selectedPart, damageReason, canRemove, onRename, onMove, onRotate, onToggleOpen, onRemove }: Props) {
  return (
    <div className="panel machine-inspector">
      <div className="output-heading"><div><span className="eyebrow">BAUTEIL-INSPEKTOR</span><h2>{selectedPart?.name ?? "Kein Bauteil"}</h2></div></div>
      {selectedPart ? <>
        {damageReason && <p className="damage-note" role="alert">⚠ Defekt: {damageReason}</p>}
        <label className="machine-name-label">Name<input value={selectedPart.name} onChange={(event) => onRename(event.target.value)} /></label>
        {selectedPart.kind === "door" && <label className="door-toggle"><input type="checkbox" checked={Boolean(selectedPart.open)} onChange={(event) => onToggleOpen(event.target.checked)} />Tür geöffnet</label>}
        {axes.map((axis, index) => <label className="machine-axis-control" key={axis}><span>Position {axis}</span><input type="range" min={index === 1 ? 0 : -3.2} max={index === 1 ? 3 : 3.2} step={0.05} value={selectedPart.position[index]} onChange={(event) => onMove(index as 0 | 1 | 2, Number(event.target.value))} /><output>{selectedPart.position[index].toFixed(2)} m</output></label>)}
        {axes.map((axis, index) => <label className="machine-axis-control" key={`r${axis}`}><span>Drehung {axis}</span><input type="range" min={-180} max={180} step={5} value={Math.round(MathUtils.radToDeg(selectedPart.rotation[index]))} onChange={(event) => onRotate(index as 0 | 1 | 2, MathUtils.degToRad(Number(event.target.value)))} /><output>{Math.round(MathUtils.radToDeg(selectedPart.rotation[index]))}°</output></label>)}
        <p className="transform-hint">Meter relativ zur Maschinenplatte. Im Viewport per Gizmo (G/R) verschieben und drehen.</p>
        <button className="delete-machine-part" disabled={!canRemove} onClick={onRemove}>Bauteil entfernen ×</button>
      </> : <p className="empty-hint">Füge ein Bauteil hinzu.</p>}
    </div>
  );
}