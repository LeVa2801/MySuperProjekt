import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { BROKEN_COLOR, bodyUserData, poseKey, stopAndSelect } from "./partUtils";
import { SelectionOutline } from "./SelectionOutline";
import type { PartViewProps } from "./types";

export function PlatePart({ broken, onSelect, part, selected }: PartViewProps) {
  const { position, rotation } = part;
  const select = stopAndSelect(onSelect);

  return (
    <>
      <RigidBody key={poseKey(part)} type="fixed" position={position} rotation={rotation} colliders={false} userData={bodyUserData(part)}><CuboidCollider args={[0.6, 0.03, 0.4]} friction={0.8} /></RigidBody>
      <group position={position} rotation={rotation} onClick={select}>
        <mesh castShadow receiveShadow><boxGeometry args={[1.2, 0.06, 0.8]} /><meshStandardMaterial color={broken ? BROKEN_COLOR : selected ? "#7aa0bd" : "#8b9bab"} metalness={0.85} roughness={0.3} /></mesh>
        <SelectionOutline selected={selected} size={[1.26, 0.12, 0.86]} />
      </group>
    </>
  );
}