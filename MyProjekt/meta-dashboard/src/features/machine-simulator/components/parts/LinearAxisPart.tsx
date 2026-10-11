import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import type { RapierRigidBody } from "@react-three/rapier";
import { ActiveCollisionTypes } from "@dimforge/rapier3d-compat";
import { BROKEN_COLOR, bodyUserData, getDriveSpeed, localDirection, partQuaternion, poseKey, stopAndSelect } from "./partUtils";
import type { BodyUserData } from "./partUtils";
import { SelectionOutline } from "./SelectionOutline";
import type { PartViewProps } from "./types";

export function LinearAxisPart({ broken, driven, onDamage, onSelect, part, selected }: PartViewProps) {
  const driveSpeed = getDriveSpeed(driven);
  const { position, rotation } = part;
  const select = stopAndSelect(onSelect);
  const axisRef = useRef<RapierRigidBody>(null);
  const direction = localDirection(part, [1, 0, 0]);
  const quaternion = partQuaternion(part);
  useFrame((state) => {
    if (!axisRef.current) return;
    const travel = driveSpeed > 0 ? Math.sin(state.clock.elapsedTime * 2) * 0.5 : 0;
    axisRef.current.setNextKinematicTranslation({ x: position[0] + direction.x * travel, y: position[1] + direction.y * travel, z: position[2] + direction.z * travel });
    axisRef.current.setNextKinematicRotation(quaternion);
  });

  return (
    <>
      <RigidBody key={poseKey(part)} ref={axisRef} type="kinematicPosition" position={position} rotation={rotation} colliders={false} userData={bodyUserData(part)}>
        <CuboidCollider
          args={[0.22, 0.12, 0.34]}
          activeCollisionTypes={ActiveCollisionTypes.ALL}
          onCollisionEnter={({ other }) => {
            const hit = other.rigidBodyObject?.userData as BodyUserData | undefined;
            if (driveSpeed > 0 && hit?.kind && hit.kind !== "workpiece") onDamage(part.id, `Achse ist gegen "${hit.name}" gefahren`);
          }}
        />
        <mesh castShadow receiveShadow onClick={select}><boxGeometry args={[0.42, 0.24, 0.68]} /><meshStandardMaterial color={broken ? BROKEN_COLOR : driveSpeed > 0 ? "#52c7a8" : "#95a4b4"} metalness={0.5} /></mesh>
      </RigidBody>
      <group position={position} rotation={rotation} onClick={select}>
        <mesh castShadow receiveShadow><boxGeometry args={[1.55, 0.15, 0.3]} /><meshStandardMaterial color={selected ? "#346d91" : "#576a7e"} metalness={0.7} roughness={0.35} /></mesh>
        {[-0.79, 0.79].map((x) => <mesh key={x} position={[x, 0, 0]}><boxGeometry args={[0.1, 0.25, 0.38]} /><meshStandardMaterial color="#29384b" /></mesh>)}
        <SelectionOutline selected={selected} size={[1.78, 0.4, 0.82]} />
      </group>
    </>
  );
}