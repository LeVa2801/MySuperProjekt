export type Vec3 = [number, number, number];
export type MachinePartKind =
  | "conveyor" | "motor" | "axis" | "lightGate" | "proximity" | "workpiece"
  | "safetySwitch" | "door" | "plate" | "guard"
  | "profile" | "pneumaticCylinder" | "gripper" | "inductiveSensor" | "limitSwitch";
export type MachinePart = {
  id: string;
  kind: MachinePartKind;
  name: string;
  position: Vec3;
  /** Euler-Winkel in Radiant (XYZ). */
  rotation: Vec3;
  /** Nur für Schutztüren: Tür ist geöffnet. */
  open?: boolean;
};
export type MachineProject = { parts: MachinePart[] };

export type TransformMode = "translate" | "rotate";
/** Schadensprotokoll: Bauteil-ID -> Ursache. */
export type DamageMap = Record<string, string>;