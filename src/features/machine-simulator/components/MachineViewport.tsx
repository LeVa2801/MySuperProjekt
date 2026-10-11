import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls, TransformControls } from "@react-three/drei";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { MathUtils } from "three";
import type { Object3D } from "three";
import type { MachineAnalysis } from "../model/analysis";
import type { DamageMap, MachinePart, TransformMode, Vec3 } from "../model/types";
import { MachinePartView } from "./MachinePartView";

type Props = {
  parts: MachinePart[];
  selectedId: string;
  running: boolean;
  halted: boolean;
  resetId: number;
  activeSensorIds: string[];
  damage: DamageMap;
  analysis: MachineAnalysis;
  transformMode: TransformMode;
  snap: boolean;
  onTransformMode: (mode: TransformMode) => void;
  onSnap: (snap: boolean) => void;
  onSelect: (id: string) => void;
  onSensor: (id: string, active: boolean) => void;
  onDamage: (id: string, reason: string) => void;
  onTransform: (id: string, position: Vec3, rotation: Vec3) => void;
};

export function MachineViewport({ parts, selectedId, running, halted, resetId, activeSensorIds, damage, analysis, transformMode, snap, onTransformMode, onSnap, onSelect, onSensor, onDamage, onTransform }: Props) {
  const [proxy, setProxy] = useState<Object3D | null>(null);
  const selectedPart = parts.find((part) => part.id === selectedId);
  const active = running && !halted;

  function isDriven(part: MachinePart) {
    if (!active || damage[part.id]) return false;
    return part.kind !== "conveyor" || analysis.drivenConveyorIds.has(part.id);
  }

  function commitTransform() {
    if (!proxy || !selectedPart) return;
    onTransform(selectedPart.id, [proxy.position.x, proxy.position.y, proxy.position.z], [proxy.rotation.x, proxy.rotation.y, proxy.rotation.z]);
  }

  return (
    <div className="panel machine-viewport-panel">
      <div className="output-heading">
        <div><span className="eyebrow">3D ANLAGE</span><h2>{parts.length} Bauteile · {active ? "Antrieb aktiv" : "Stillstand"}</h2></div>
        <div className="gizmo-toolbar" role="group" aria-label="Transform-Werkzeug">
          <button className={transformMode === "translate" ? "gizmo-button active" : "gizmo-button"} onClick={() => onTransformMode("translate")} title="Verschieben (G)">⤧ Verschieben <kbd>G</kbd></button>
          <button className={transformMode === "rotate" ? "gizmo-button active" : "gizmo-button"} onClick={() => onTransformMode("rotate")} title="Drehen (R)">⟳ Drehen <kbd>R</kbd></button>
          <label className="gizmo-snap"><input type="checkbox" checked={snap} onChange={(event) => onSnap(event.target.checked)} />Raster</label>
        </div>
      </div>
      <div className="machine-canvas-wrap">
        <Canvas shadows camera={{ position: [5.4, 4.8, 6], fov: 43 }} gl={{ antialias: true }}>
          <color attach="background" args={["#0b1220"]} />
          <ambientLight intensity={0.75} />
          <directionalLight position={[4, 8, 5]} intensity={2.1} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
          <Physics gravity={[0, -9.81, 0]} paused={!active}>
            <RigidBody type="fixed" position={[0, -0.16, 0]}><CuboidCollider args={[3.2, 0.16, 1.7]} friction={0.8} /><mesh receiveShadow><boxGeometry args={[6.4, 0.32, 3.4]} /><meshStandardMaterial color="#202e41" metalness={0.35} roughness={0.75} /></mesh></RigidBody>
            {parts.map((part) => <MachinePartView key={part.id} part={part} selected={part.id === selectedId} driven={isDriven(part)} broken={Boolean(damage[part.id])} overloaded={analysis.overloadedMotorIds.has(part.id)} circuitClosed={analysis.safetyClosed} resetId={resetId} sensorActive={activeSensorIds.includes(part.id)} onSelect={() => onSelect(part.id)} onSensor={onSensor} onDamage={onDamage} />)}
          </Physics>
          {selectedPart && <group ref={setProxy} position={selectedPart.position} rotation={selectedPart.rotation} />}
          {selectedPart && proxy && !running && (
            <TransformControls
              object={proxy}
              mode={transformMode}
              size={0.85}
              translationSnap={snap ? 0.05 : null}
              rotationSnap={snap ? MathUtils.degToRad(15) : null}
              onObjectChange={commitTransform}
            />
          )}
          <Grid position={[0, -0.335, 0]} args={[20, 20]} cellSize={0.5} cellThickness={0.6} cellColor="#27374a" sectionSize={2} sectionThickness={0.8} sectionColor="#354c63" fadeDistance={18} infiniteGrid />
          <OrbitControls makeDefault target={[0, 0.45, 0]} minDistance={3} maxDistance={12} />
        </Canvas>
        <span className="machine-canvas-hint">Bauteil anklicken · Achsen-Gizmo ziehen · G/R wechselt Verschieben/Drehen · Maus: Ansicht drehen</span>
      </div>
      <p className="machine-disclaimer">Echtzeit-Rigid-Body-Physik mit Gravitation, Kontakten und Kollisionen. Fehlerhaft aufgebaute Anlagen nehmen Schaden (Kollision, Einklemmen, Überlast, Sturz). Vereinfachte Simulation, kein Sicherheits- oder Anlagen-Nachweis.</p>
    </div>
  );
}