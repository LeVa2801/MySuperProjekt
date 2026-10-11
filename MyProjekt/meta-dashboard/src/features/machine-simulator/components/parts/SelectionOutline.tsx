import type { Vec3 } from "../../model/types";

export function SelectionOutline({ selected, size }: { selected: boolean; size: Vec3 }) {
  if (!selected) return null;
  return <mesh><boxGeometry args={size} /><meshBasicMaterial color="#7dd3fc" wireframe transparent opacity={0.6} /></mesh>;
}
