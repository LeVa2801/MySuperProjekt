import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import type { Group } from "three";
import { BROKEN_COLOR, bodyUserData, getDriveSpeed, localDirection, poseKey, stopAndSelect } from "./partUtils";
import { SelectionOutline } from "./SelectionOutline";
import type { PartViewProps } from "./types";

export function ConveyorPart({ broken, driven, onSelect, part, selected }: PartViewProps) {
  const driveSpeed = getDriveSpeed(driven);
  const { position, rotation } = part;
  const select = stopAndSelect(onSelect);
  const beltRef = useRef<Group>(null);
  const direction = localDirection(part, [1, 0, 0]);
  useFrame((state) => {
    beltRef.current?.children.forEach((stripe, index) => {
      stripe.position.x = ((-1.03 + index * 0.29 + state.clock.elapsedTime * driveSpeed * 0.55 + 1.03) % 2.06) - 1.03;
    });
  });

  return (
    <>
      <RigidBody key={poseKey(part)} type="fixed" position={position} rotation={rotation} colliders={false} userData={bodyUserData(part)} onContactForce={({ other }) => {
        if (driveSpeed > 0 && other.rigidBody?.isDynamic()) other.rigidBody.applyImpulse({ x: direction.x * driveSpeed * 0.001, y: direction.y * driveSpeed * 0.001, z: direction.z * driveSpeed * 0.001 }, true);
      }}>
        <CuboidCollider args={[1.28, 0.13, 0.48]} friction={0.92} />
      </RigidBody>
      <group position={position} rotation={rotation} onClick={select}>
        <mesh castShadow receiveShadow position={[0, -0.04, 0]}><boxGeometry args={[2.7, 0.2, 1]} /><meshStandardMaterial color={broken ? BROKEN_COLOR : selected ? "#294e68" : "#35465b"} metalness={0.55} roughness={0.48} /></mesh>
        <mesh position={[0, 0.071, 0]}><boxGeometry args={[2.54, 0.035, 0.88]} /><meshStandardMaterial color="#182333" roughness={0.9} /></mesh>
        <group ref={beltRef} position={[0, 0.094, 0]}>
          {Array.from({ length: 8 }, (_, index) => <mesh key={index} position={[-1.03 + index * 0.29, 0, 0]}><boxGeometry args={[0.045, 0.012, 0.74]} /><meshStandardMaterial color={driveSpeed > 0 ? "#71dbc0" : "#66788a"} /></mesh>)}
        </group>
        {[-1.22, 1.22].map((x) => <mesh key={x} position={[x, 0.07, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.11, 0.11, 0.18, 20]} /><meshStandardMaterial color="#8495a8" metalness={0.65} /></mesh>)}
        <SelectionOutline selected={selected} size={[2.8, 0.46, 1.08]} />
      </group>
    </>
  );
}