import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { Euler, Quaternion, Vector3 } from "three";
import { bodyUserData, partQuaternion, poseKey, stopAndSelect } from "./partUtils";
import { SelectionOutline } from "./SelectionOutline";
import type { PartViewProps } from "./types";

const DOOR_WIDTH = 1;
const DOOR_HEIGHT = 0.9;
const DOOR_THICKNESS = 0.05;
const OPEN_ANGLE = -Math.PI / 2;

export function DoorPart({ onSelect, part, selected }: PartViewProps) {
  const select = stopAndSelect(onSelect);
  const angle = part.open ? OPEN_ANGLE : 0;
  const base = partQuaternion(part);
  const swing = new Quaternion().setFromEuler(new Euler(0, angle, 0));
  const hinge = new Vector3(-DOOR_WIDTH / 2, 0, 0);
  const localCenter = hinge.clone().add(new Vector3(DOOR_WIDTH / 2, 0, 0).applyQuaternion(swing));
  const worldCenter = localCenter.applyQuaternion(base).add(new Vector3(...part.position));
  const worldRotation = base.clone().multiply(swing);

  return (
    <>
      <RigidBody key={`${poseKey(part)}|${part.open}`} type="fixed" position={worldCenter.toArray()} quaternion={worldRotation.toArray()} colliders={false} userData={bodyUserData(part)}>
        <CuboidCollider args={[DOOR_WIDTH / 2, DOOR_HEIGHT / 2, DOOR_THICKNESS / 2]} />
      </RigidBody>
      <group position={part.position} rotation={part.rotation} onClick={select}>
        <group position={[hinge.x, 0, 0]} rotation={[0, angle, 0]}>
          <group position={[DOOR_WIDTH / 2, 0, 0]}>
            <mesh castShadow receiveShadow><boxGeometry args={[DOOR_WIDTH, DOOR_HEIGHT, DOOR_THICKNESS]} /><meshStandardMaterial color={part.open ? "#f59e0b" : "#3b82a6"} transparent opacity={0.55} metalness={0.3} roughness={0.3} /></mesh>
            <mesh position={[0, 0, 0]}><boxGeometry args={[DOOR_WIDTH + 0.02, DOOR_HEIGHT + 0.02, DOOR_THICKNESS + 0.01]} /><meshBasicMaterial color="#9bb4c8" wireframe /></mesh>
            <SelectionOutline selected={selected} size={[DOOR_WIDTH + 0.08, DOOR_HEIGHT + 0.08, 0.14]} />
          </group>
        </group>
        <mesh position={[hinge.x, 0, 0]}><cylinderGeometry args={[0.025, 0.025, DOOR_HEIGHT + 0.06, 10]} /><meshStandardMaterial color="#8495a8" metalness={0.8} /></mesh>
      </group>
    </>
  );
}