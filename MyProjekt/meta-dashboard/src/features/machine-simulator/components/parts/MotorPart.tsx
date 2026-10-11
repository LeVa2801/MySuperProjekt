import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { BROKEN_COLOR, bodyUserData, getDriveSpeed, poseKey, stopAndSelect } from "./partUtils";
import { SelectionOutline } from "./SelectionOutline";
import type { PartViewProps } from "./types";

const OVERLOAD_SECONDS = 2;

export function MotorPart({ broken, driven, onDamage, onSelect, overloaded, part, selected }: PartViewProps) {
  const driveSpeed = getDriveSpeed(driven);
  const { position, rotation } = part;
  const select = stopAndSelect(onSelect);
  const loadTime = useRef(0);
  useFrame((_, delta) => {
    if (!(driven && overloaded)) { loadTime.current = 0; return; }
    loadTime.current += delta;
    if (loadTime.current > OVERLOAD_SECONDS) onDamage(part.id, "Motor durchgebrannt: zu viele Förderbänder angeschlossen");
  });

  return (
    <>
      <RigidBody key={poseKey(part)} type="fixed" position={position} rotation={rotation} colliders={false} userData={bodyUserData(part)}><CuboidCollider args={[0.3, 0.22, 0.23]} /></RigidBody>
      <group position={position} rotation={rotation} onClick={select}>
        <mesh castShadow receiveShadow><boxGeometry args={[0.6, 0.44, 0.46]} /><meshStandardMaterial color={broken ? BROKEN_COLOR : selected ? "#346d91" : "#354e66"} metalness={0.55} roughness={0.4} /></mesh>
        <mesh position={[0.36, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.13, 0.13, 0.16, 20]} /><meshStandardMaterial color={driveSpeed > 0 ? "#56d6ad" : "#8a99a8"} metalness={0.7} /></mesh>
        <mesh position={[0, 0.225, 0]}><boxGeometry args={[0.28, 0.04, 0.32]} /><meshStandardMaterial color={driveSpeed > 0 ? "#49dbad" : "#fb7185"} emissive={driveSpeed > 0 ? "#176c4e" : "#6d142a"} emissiveIntensity={0.55} /></mesh>
        <SelectionOutline selected={selected} size={[0.75, 0.62, 0.56]} />
      </group>
    </>
  );
}