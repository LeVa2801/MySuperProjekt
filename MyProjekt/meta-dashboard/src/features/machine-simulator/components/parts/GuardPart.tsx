import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { bodyUserData, poseKey, stopAndSelect } from "./partUtils";
import { SelectionOutline } from "./SelectionOutline";
import type { PartViewProps } from "./types";

export function GuardPart({ onSelect, part, selected }: PartViewProps) {
  const { position, rotation } = part;
  const select = stopAndSelect(onSelect);

  return (
    <>
      <RigidBody key={poseKey(part)} type="fixed" position={position} rotation={rotation} colliders={false} userData={bodyUserData(part)}><CuboidCollider args={[0.7, 0.5, 0.03]} /></RigidBody>
      <group position={position} rotation={rotation} onClick={select}>
        <mesh castShadow><boxGeometry args={[1.4, 1, 0.06]} /><meshStandardMaterial color="#facc15" transparent opacity={0.22} /></mesh>
        <mesh><boxGeometry args={[1.4, 1, 0.07]} /><meshBasicMaterial color="#eab308" wireframe /></mesh>
        <SelectionOutline selected={selected} size={[1.46, 1.06, 0.14]} />
      </group>
    </>
  );
}