import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { bodyUserData, poseKey, stopAndSelect } from "./partUtils";
import { SelectionOutline } from "./SelectionOutline";
import type { PartViewProps } from "./types";

export function ProximitySensorPart({ onSelect, onSensor, part, selected, sensorActive }: PartViewProps) {
  const { position, rotation } = part;
  const select = stopAndSelect(onSelect);

  return (
    <>
      <RigidBody key={poseKey(part)} type="fixed" position={position} rotation={rotation} colliders={false} userData={bodyUserData(part)}><CuboidCollider sensor args={[0.43, 0.43, 0.43]} onIntersectionEnter={() => onSensor(part.id, true)} onIntersectionExit={() => onSensor(part.id, false)} /></RigidBody>
      <group position={position} rotation={rotation} onClick={select}>
        <mesh><torusGeometry args={[0.31, 0.025, 8, 32]} /><meshStandardMaterial color={sensorActive ? "#fbbf24" : "#42cfaa"} emissive={sensorActive ? "#c98a0d" : "#126b54"} emissiveIntensity={0.8} /></mesh>
        <mesh><sphereGeometry args={[0.09, 14, 12]} /><meshStandardMaterial color={sensorActive ? "#fbbf24" : "#42cfaa"} emissive={sensorActive ? "#fbbf24" : "#42cfaa"} emissiveIntensity={1.2} /></mesh>
        <SelectionOutline selected={selected} size={[0.95, 0.95, 0.95]} />
      </group>
    </>
  );
}
