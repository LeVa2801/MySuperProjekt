import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { bodyUserData, poseKey, stopAndSelect } from "./partUtils";
import { SelectionOutline } from "./SelectionOutline";
import type { PartViewProps } from "./types";

const SENSOR_KINDS = new Set(["inductiveSensor", "limitSwitch"]);

export function ExtraPart({ onSelect, onSensor, part, selected, sensorActive }: PartViewProps) {
  const { kind, position, rotation } = part;
  const select = stopAndSelect(onSelect);
  const isSensor = SENSOR_KINDS.has(kind);
  const dimensions: Record<string, [number, number, number]> = {
    profile: [0.06, 0.7, 0.06],
    pneumaticCylinder: [0.42, 0.11, 0.11],
    gripper: [0.2, 0.13, 0.11],
    inductiveSensor: [0.1, 0.12, 0.1],
    limitSwitch: [0.1, 0.12, 0.08],
  };
  const [x, y, z] = dimensions[kind];
  const sensorColor = sensorActive ? "#fbbf24" : "#42cfaa";
  const bodyColor = selected ? "#51a6d4" : "#52677d";

  return (
    <>
      <RigidBody key={poseKey(part)} type="fixed" position={position} rotation={rotation} colliders={false} userData={bodyUserData(part)}>
        <CuboidCollider
          sensor={isSensor}
          args={isSensor ? [kind === "inductiveSensor" ? 0.35 : 0.22, 0.22, 0.22] : [x, y, z]}
          onIntersectionEnter={isSensor ? () => onSensor(part.id, true) : undefined}
          onIntersectionExit={isSensor ? () => onSensor(part.id, false) : undefined}
        />
      </RigidBody>
      <group position={position} rotation={rotation} onClick={select}>
        {kind === "profile" && (
          <>
            <mesh castShadow><boxGeometry args={[0.12, 1.4, 0.12]} /><meshStandardMaterial color={bodyColor} metalness={0.8} roughness={0.35} /></mesh>
            <mesh position={[0, 0.55, 0.065]}><boxGeometry args={[0.025, 0.08, 0.01]} /><meshStandardMaterial color="#172333" /></mesh>
            <mesh position={[0, -0.55, 0.065]}><boxGeometry args={[0.025, 0.08, 0.01]} /><meshStandardMaterial color="#172333" /></mesh>
            <SelectionOutline selected={selected} size={[0.18, 1.46, 0.18]} />
          </>
        )}
        {kind === "pneumaticCylinder" && (
          <>
            <mesh castShadow><cylinderGeometry args={[0.11, 0.11, 0.65, 16]} /><meshStandardMaterial color={bodyColor} metalness={0.65} /></mesh>
            <mesh position={[0, 0.39, 0]}><cylinderGeometry args={[0.035, 0.035, 0.22, 12]} /><meshStandardMaterial color="#d4dce5" metalness={0.8} /></mesh>
            <SelectionOutline selected={selected} size={[0.28, 0.92, 0.28]} />
          </>
        )}
        {kind === "gripper" && (
          <>
            <mesh castShadow><boxGeometry args={[0.4, 0.22, 0.22]} /><meshStandardMaterial color={bodyColor} metalness={0.6} /></mesh>
            <mesh position={[-0.2, -0.19, 0]}><boxGeometry args={[0.08, 0.24, 0.1]} /><meshStandardMaterial color="#d4dce5" metalness={0.7} /></mesh>
            <mesh position={[0.2, -0.19, 0]}><boxGeometry args={[0.08, 0.24, 0.1]} /><meshStandardMaterial color="#d4dce5" metalness={0.7} /></mesh>
            <SelectionOutline selected={selected} size={[0.56, 0.58, 0.3]} />
          </>
        )}
        {kind === "inductiveSensor" && (
          <>
            <mesh castShadow><cylinderGeometry args={[0.09, 0.09, 0.24, 16]} /><meshStandardMaterial color={bodyColor} metalness={0.65} /></mesh>
            <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.07, 0.07, 0.035, 16]} /><meshStandardMaterial color={sensorColor} emissive={sensorColor} emissiveIntensity={sensorActive ? 1.2 : 0.35} /></mesh>
            <SelectionOutline selected={selected} size={[0.22, 0.32, 0.22]} />
          </>
        )}
        {kind === "limitSwitch" && (
          <>
            <mesh castShadow><boxGeometry args={[0.2, 0.2, 0.16]} /><meshStandardMaterial color={bodyColor} metalness={0.45} /></mesh>
            <mesh position={[0, 0.18, 0]} rotation={[0, 0, -0.35]}><cylinderGeometry args={[0.018, 0.018, 0.22, 8]} /><meshStandardMaterial color="#d4dce5" metalness={0.7} /></mesh>
            <mesh position={[0.035, 0.28, 0]}><sphereGeometry args={[0.045, 10, 8]} /><meshStandardMaterial color={sensorColor} emissive={sensorColor} emissiveIntensity={sensorActive ? 1.2 : 0.35} /></mesh>
            <SelectionOutline selected={selected} size={[0.34, 0.56, 0.28]} />
          </>
        )}
      </group>
    </>
  );
}
