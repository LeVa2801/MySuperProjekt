import { useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "../../../shared/hooks/useLocalStorage";
import { analyzeMachine } from "../model/analysis";
import { defaultMachine, normalizeProject } from "../model/defaults";
import { createPart, movePart, removePart, rotatePart, setTransform, updatePart } from "../model/machineOps";
import type { DamageMap, MachinePartKind, MachineProject, TransformMode, Vec3 } from "../model/types";

export function useMachineSimulation() {
  const [storedMachine, setMachine] = useLocalStorage<MachineProject>("dashboard-machine-project", defaultMachine);
  const machine = useMemo(() => normalizeProject(storedMachine), [storedMachine]);
  const [selectedId, setSelectedId] = useState("belt-main");
  const [running, setRunning] = useState(false);
  const [emergencyStop, setEmergencyStop] = useState(false);
  const [activeSensorIds, setActiveSensorIds] = useState<string[]>([]);
  const [resetId, setResetId] = useState(0);
  const [damage, setDamage] = useState<DamageMap>({});
  const [transformMode, setTransformMode] = useState<TransformMode>("translate");
  const [snap, setSnap] = useState(true);
  const selectedPart = machine.parts.find((part) => part.id === selectedId) ?? machine.parts[0];
  const analysis = useMemo(() => analyzeMachine(machine.parts, damage), [machine.parts, damage]);
  const safetyTripped = analysis.hasSafetyCircuit && !analysis.safetyClosed;
  const halted = emergencyStop || safetyTripped;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key.toLowerCase() === "g") setTransformMode("translate");
      if (event.key.toLowerCase() === "r") setTransformMode("rotate");
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function addPart(kind: MachinePartKind) {
    const part = createPart(kind, machine);
    setMachine((previous) => ({ ...previous, parts: [...previous.parts, part] }));
    setSelectedId(part.id);
  }

  function editSelected(edit: (project: MachineProject, id: string) => MachineProject) {
    if (selectedPart) setMachine((previous) => edit(normalizeProject(previous), selectedPart.id));
  }

  function renameSelected(name: string) {
    editSelected((project, id) => updatePart(project, id, (part) => ({ ...part, name })));
  }

  function setSelectedOpen(open: boolean) {
    editSelected((project, id) => updatePart(project, id, (part) => ({ ...part, open })));
  }

  function removeSelected() {
    if (!selectedPart) return;
    setSelectedId(machine.parts.find((part) => part.id !== selectedPart.id)?.id ?? "");
    setMachine((previous) => removePart(previous, selectedPart.id));
  }

  function transformPart(id: string, position: Vec3, rotation: Vec3) {
    setMachine((previous) => setTransform(previous, id, position, rotation));
  }

  function toggleRunning() {
    setRunning((value) => !value);
  }

  function toggleEmergencyStop() {
    if (!emergencyStop) setRunning(false);
    setEmergencyStop(!emergencyStop);
  }

  function resetSimulation() {
    setRunning(false);
    setEmergencyStop(false);
    setActiveSensorIds([]);
    setDamage({});
    setResetId((value) => value + 1);
  }

  function setSensorActive(id: string, active: boolean) {
    setActiveSensorIds((previous) => active ? previous.includes(id) ? previous : [...previous, id] : previous.filter((item) => item !== id));
  }

  function reportDamage(id: string, reason: string) {
    setDamage((previous) => previous[id] ? previous : { ...previous, [id]: reason });
  }

  return {
    parts: machine.parts, selectedPart, selectedId, running, emergencyStop, halted, safetyTripped, activeSensorIds, resetId,
    damage, analysis, transformMode, snap,
    selectPart: setSelectedId, setTransformMode, setSnap, addPart, renameSelected, setSelectedOpen,
    moveSelected: (axis: 0 | 1 | 2, value: number) => editSelected((project, id) => movePart(project, id, axis, value)),
    rotateSelected: (axis: 0 | 1 | 2, radians: number) => editSelected((project, id) => rotatePart(project, id, axis, radians)),
    removeSelected, transformPart, toggleRunning, toggleEmergencyStop, resetSimulation, setSensorActive, reportDamage,
  };
}