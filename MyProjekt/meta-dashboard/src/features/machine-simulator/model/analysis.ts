import type { DamageMap, MachinePart, Vec3 } from "./types";

export type Diagnostic = { level: "ok" | "warn" | "error"; message: string };
export type MachineAnalysis = {
  /** Alle Sicherheitsschalter sind durch eine geschlossene Tür betätigt. */
  safetyClosed: boolean;
  hasSafetyCircuit: boolean;
  drivenConveyorIds: Set<string>;
  overloadedMotorIds: Set<string>;
  diagnostics: Diagnostic[];
};

export const MOTOR_REACH = 1.6;
export const SWITCH_REACH = 0.8;
const PLATE_LIMIT: Vec3 = [3.2, 3, 1.7];

function distance(a: Vec3, b: Vec3) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

/** Reine Funktion: Regelprüfung des Aufbaus, keine Physik. */
export function analyzeMachine(parts: MachinePart[], damage: DamageMap): MachineAnalysis {
  const diagnostics: Diagnostic[] = [];
  const healthy = (part: MachinePart) => !damage[part.id];
  const ofKind = (kind: MachinePart["kind"]) => parts.filter((part) => part.kind === kind);
  const motors = ofKind("motor");
  const conveyors = ofKind("conveyor");
  const doors = ofKind("door");
  const switches = ofKind("safetySwitch");

  const drivenConveyorIds = new Set<string>();
  const overloadedMotorIds = new Set<string>();
  for (const conveyor of conveyors) {
    const reachable = motors.filter((motor) => healthy(motor) && distance(motor.position, conveyor.position) <= MOTOR_REACH);
    if (reachable.length) drivenConveyorIds.add(conveyor.id);
    else diagnostics.push({ level: "warn", message: `${conveyor.name} hat keinen funktionsfähigen Antrieb in Reichweite.` });
  }
  for (const motor of motors) {
    const load = conveyors.filter((conveyor) => distance(motor.position, conveyor.position) <= MOTOR_REACH).length;
    if (load > 1) {
      overloadedMotorIds.add(motor.id);
      diagnostics.push({ level: "error", message: `${motor.name} treibt ${load} Förderbänder an und wird überlastet.` });
    }
  }

  let safetyClosed = true;
  for (const sw of switches) {
    const door = doors.find((candidate) => distance(candidate.position, sw.position) <= SWITCH_REACH);
    if (!door) {
      safetyClosed = false;
      diagnostics.push({ level: "error", message: `${sw.name} sitzt an keiner Schutztür – Sicherheitskreis offen.` });
    } else if (door.open) {
      safetyClosed = false;
      diagnostics.push({ level: "warn", message: `${door.name} ist geöffnet – Sicherheitskreis unterbrochen.` });
    }
  }
  for (const door of doors) {
    if (!switches.some((sw) => distance(door.position, sw.position) <= SWITCH_REACH)) {
      diagnostics.push({ level: "error", message: `${door.name} hat keinen Sicherheitsschalter: Öffnen wird nicht erkannt.` });
    }
  }
  if (ofKind("axis").length && !doors.length && !ofKind("guard").length) {
    diagnostics.push({ level: "warn", message: "Bewegte Achse ohne Schutzeinrichtung (Schutzgitter oder Schutztür)." });
  }
  for (const part of parts) {
    if (part.kind !== "workpiece" && part.position.some((value, index) => Math.abs(value) > PLATE_LIMIT[index])) {
      diagnostics.push({ level: "warn", message: `${part.name} liegt außerhalb der Maschinenplatte.` });
    }
  }
  if (!diagnostics.length) diagnostics.push({ level: "ok", message: "Keine Aufbaufehler erkannt." });

  return { safetyClosed, hasSafetyCircuit: switches.length > 0, drivenConveyorIds, overloadedMotorIds, diagnostics };
}
