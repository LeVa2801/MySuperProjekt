import { PageHeading } from "../../shared/components/PageHeading";
import { MachineDiagnosticsPanel } from "./components/MachineDiagnosticsPanel";
import { MachineInspector } from "./components/MachineInspector";
import { MachinePalette } from "./components/MachinePalette";
import { MachineSensorPanel } from "./components/MachineSensorPanel";
import { MachineToolbar } from "./components/MachineToolbar";
import { MachineViewport } from "./components/MachineViewport";
import { useMachineSimulation } from "./hooks/useMachineSimulation";

export default function MachineSimulatorPage() {
  const sim = useMachineSimulation();
  const { running, halted, emergencyStop, safetyTripped } = sim;

  return (
    <section>
      <PageHeading eyebrow="PHYSIKBASIERTER MASCHINENBAUKASTEN" title="Maschinensimulation 3D" subtitle="Baue eine Anlage aus Aktoren und Sensoren und teste sie mit Kollisions- und Schwerkraftsimulation."
        aside={<span className={running && !halted ? "status-pill machine-live" : "status-pill"}><span className="live-dot" />{emergencyStop ? "NOT-AUS" : safetyTripped ? "Sicherheitskreis offen" : running ? "Simulation läuft" : "Simulation angehalten"}</span>} />
      <MachineToolbar running={running} emergencyStop={emergencyStop} safetyTripped={safetyTripped} activeSensorCount={sim.activeSensorIds.length} onToggleRunning={sim.toggleRunning} onToggleEmergencyStop={sim.toggleEmergencyStop} onReset={sim.resetSimulation} />
      <div className="machine-layout">
        <MachineViewport parts={sim.parts} selectedId={sim.selectedId} running={running} halted={halted} resetId={sim.resetId} activeSensorIds={sim.activeSensorIds} damage={sim.damage} analysis={sim.analysis} transformMode={sim.transformMode} snap={sim.snap} onTransformMode={sim.setTransformMode} onSnap={sim.setSnap} onSelect={sim.selectPart} onSensor={sim.setSensorActive} onDamage={sim.reportDamage} onTransform={sim.transformPart} />
        <aside className="machine-sidebar">
          <MachinePalette onAdd={sim.addPart} />
          <MachineInspector selectedPart={sim.selectedPart} damageReason={sim.selectedPart ? sim.damage[sim.selectedPart.id] : undefined} canRemove={sim.parts.length > 1} onRename={sim.renameSelected} onMove={sim.moveSelected} onRotate={sim.rotateSelected} onToggleOpen={sim.setSelectedOpen} onRemove={sim.removeSelected} />
          <MachineSensorPanel parts={sim.parts} activeSensorIds={sim.activeSensorIds} />
          <MachineDiagnosticsPanel parts={sim.parts} damage={sim.damage} analysis={sim.analysis} />
        </aside>
      </div>
    </section>
  );
}
