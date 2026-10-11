export type ModelKind = "cube" | "sphere" | "cylinder" | "cone";
export type Transform = { x: number; y: number; z: number; rx: number; ry: number; rz: number; scale: number };
export type AnimatedModel = { id: string; kind: ModelKind; transform: Transform };

export const defaultTransform: Transform = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, scale: 1 };
