import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { bodyUserData, poseKey, stopAndSelect } from "./partUtils";
import { SelectionOutline } from "./SelectionOutline";
import type { PartViewProps } from "./types";

export function LightGatePart({ onSelect, onSensor, part, selected, sensorActive }: PartViewProps) {
  const { position, rotation } = part;
  const select = stopAndSelect(onSelect);

  return (
    <>
      <RigidBody key={poseKey(part)} type="fixed" position={position} rotation={rotation} colliders={false} userData={bodyUserData(part)}><CuboidCollider sensor args={[0.38, 0.38, 0.42]} onIntersectionEnter={() => onSensor(part.id, true)} onIntersectionExit={() => onSensor(part.id, false)} /></RigidBody>
      <group position={position} rotation={rotation} onClick={select}>
        {[-0.42, 0.42].map((x) => <mesh key={x} position={[x, 0, 0]} castShadow><boxGeometry args={[0.1, 0.82, 0.18]} /><meshStandardMaterial color={selected ? "#315e7e" : "#354960"} metalness={0.5} /></mesh>)}
        <mesh position={[0, 0.16, 0]}><boxGeometry args={[0.84, 0.035, 0.06]} /><meshStandardMaterial color={sensorActive ? "#fb7185" : "#34d399"} emissive={sensorActive ? "#fb7185" : "#146244"} emissiveIntensity={sensorActive ? 1.5 : 0.7} /></mesh>
        <mesh position={[-0.42, 0.34, 0]}><sphereGeometry args={[0.075, 12, 10]} /><meshStandardMaterial color={sensorActive ? "#fb7185" : "#39e7a5"} emissive={sensorActive ? "#fb7185" : "#39e7a5"} emissiveIntensity={1.2} /></mesh>
        <SelectionOutline selected={selected} size={[0.99, 0.93, 0.34]} />
      </group>
    </>
  );
}