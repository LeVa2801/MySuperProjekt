import type { MachineProject } from "./types";

export const defaultMachine: MachineProject = {
  parts: [
    { id: "belt-main", kind: "conveyor", name: "Förderband", position: [-0.65, 0.18, 0], rotation: [0, 0, 0] },
    { id: "motor-main", kind: "motor", name: "Getriebemotor", position: [-0.65, 0.48, -0.68], rotation: [0, 0, 0] },
    { id: "axis-main", kind: "axis", name: "Pneumatikachse", position: [1.7, 0.4, 0], rotation: [0, 0, 0] },
    { id: "sensor-main", kind: "lightGate", name: "Lichtschranke", position: [0.85, 0.75, 0], rotation: [0, 0, 0] },
    { id: "door-main", kind: "door", name: "Schutztür", position: [0.2, 0.45, 1.05], rotation: [0, 0, 0], open: false },
    { id: "switch-main", kind: "safetySwitch", name: "Sicherheitsschalter", position: [0.75, 0.45, 1.05], rotation: [0, 0, 0] },
    { id: "workpiece-main", kind: "workpiece", name: "Werkstück", position: [-1.4, 1.0, 0], rotation: [0, 0, 0] },
  ],
};

/** Ergänzt Felder, die in älteren gespeicherten Projekten fehlen. */
export function normalizeProject(project: MachineProject): MachineProject {
  return { ...project, parts: project.parts.map((part) => ({ ...part, rotation: part.rotation ?? [0, 0, 0] })) };
}