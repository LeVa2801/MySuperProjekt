import { partCatalog } from "./partCatalog";
import type { MachinePart, MachinePartKind, MachineProject, Vec3 } from "./types";

export function createPart(kind: MachinePartKind, project: MachineProject): MachinePart {
  const instanceNumber = project.parts.filter((part) => part.kind === kind).length + 1;
  return {
    id: crypto.randomUUID(),
    kind,
    name: `${partCatalog[kind].label} ${instanceNumber}`,
    position: [...partCatalog[kind].defaultPosition],
    rotation: [0, 0, 0],
    ...(kind === "door" ? { open: false } : {}),
  };
}

export function updatePart(project: MachineProject, id: string, patch: (part: MachinePart) => MachinePart): MachineProject {
  return { ...project, parts: project.parts.map((part) => (part.id === id ? patch(part) : part)) };
}

function setVecComponent(vector: Vec3, axis: 0 | 1 | 2, value: number): Vec3 {
  const next: Vec3 = [...vector];
  next[axis] = value;
  return next;
}

export function movePart(project: MachineProject, id: string, axis: 0 | 1 | 2, value: number): MachineProject {
  return updatePart(project, id, (part) => ({ ...part, position: setVecComponent(part.position, axis, value) }));
}

export function rotatePart(project: MachineProject, id: string, axis: 0 | 1 | 2, radians: number): MachineProject {
  return updatePart(project, id, (part) => ({ ...part, rotation: setVecComponent(part.rotation, axis, radians) }));
}

export function setTransform(project: MachineProject, id: string, position: Vec3, rotation: Vec3): MachineProject {
  return updatePart(project, id, (part) => ({ ...part, position, rotation }));
}

export function removePart(project: MachineProject, id: string): MachineProject {
  return { ...project, parts: project.parts.filter((part) => part.id !== id) };
}