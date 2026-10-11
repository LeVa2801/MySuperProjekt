export type PrimitiveKind = "box" | "sphere" | "cylinder" | "cone" | "torus" | "plane";
export type Vector3Tuple = [number, number, number];

export type ModelObject = {
  id: string;
  name: string;
  kind: PrimitiveKind;
  position: Vector3Tuple;
  rotation: Vector3Tuple;
  scale: Vector3Tuple;
  color: string;
};

export const primitiveOptions: { kind: PrimitiveKind; label: string; icon: string }[] = [
  { kind: "box", label: "Würfel", icon: "▧" },
  { kind: "sphere", label: "Kugel", icon: "●" },
  { kind: "cylinder", label: "Zylinder", icon: "◉" },
  { kind: "cone", label: "Kegel", icon: "▲" },
  { kind: "torus", label: "Ring", icon: "◎" },
  { kind: "plane", label: "Fläche", icon: "▱" },
];

export function createModel(kind: PrimitiveKind, index: number, name?: string): ModelObject {
  const label = primitiveOptions.find((option) => option.kind === kind)?.label ?? "Objekt";
  return {
    id: crypto.randomUUID(),
    name: name?.trim() || `${label} ${index + 1}`,
    kind,
    position: [index * 0.35, 0.5, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    color: "#38bdf8",
  };
}

export function isModelObject(value: unknown): value is ModelObject {
  if (!value || typeof value !== "object") return false;
  const model = value as Partial<ModelObject>;
  return typeof model.id === "string"
    && typeof model.name === "string"
    && primitiveOptions.some((option) => option.kind === model.kind)
    && Array.isArray(model.position) && model.position.length === 3 && model.position.every(Number.isFinite)
    && Array.isArray(model.rotation) && model.rotation.length === 3 && model.rotation.every(Number.isFinite)
    && Array.isArray(model.scale) && model.scale.length === 3 && model.scale.every(Number.isFinite)
    && typeof model.color === "string" && /^#[\da-f]{6}$/i.test(model.color);
}
