import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { BROKEN_COLOR, bodyUserData, poseKey, stopAndSelect } from "./partUtils";
import { SelectionOutline } from "./SelectionOutline";
import type { PartViewProps } from "./types";

export function SafetySwitchPart({ broken, circuitClosed, onSelect, part, selected }: PartViewProps) {
  const { position, rotation } = part;
  const select = stopAndSelect(onSelect);
  const led = circuitClosed ? "#39e7a5" : "#fb7185";

  return (
    <>
      <RigidBody key={poseKey(part)} type="fixed" position={position} rotation={rotation} colliders={false} userData={bodyUserData(part)}><CuboidCollider args={[0.06, 0.15, 0.05]} /></RigidBody>
      <group position={position} rotation={rotation} onClick={select}>
        <mesh castShadow><boxGeometry args={[0.12, 0.3, 0.1]} /><meshStandardMaterial color={broken ? BROKEN_COLOR : selected ? "#c79a12" : "#e0b020"} metalness={0.3} roughness={0.5} /></mesh>
        <mesh position={[0, 0.06, 0.055]}><sphereGeometry args={[0.032, 12, 10]} /><meshStandardMaterial color={led} emissive={led} emissiveIntensity={1.4} /></mesh>
        <mesh position={[0, -0.06, 0.055]}><boxGeometry args={[0.07, 0.07, 0.015]} /><meshStandardMaterial color="#1f2937" /></mesh>
        <SelectionOutline selected={selected} size={[0.18, 0.38, 0.16]} />
      </group>
    </>
  );
}