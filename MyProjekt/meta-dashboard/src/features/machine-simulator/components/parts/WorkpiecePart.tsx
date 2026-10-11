import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import type { RapierRigidBody } from "@react-three/rapier";
import { BROKEN_COLOR, bodyUserData, poseKey, stopAndSelect } from "./partUtils";
import { SelectionOutline } from "./SelectionOutline";
import type { PartViewProps } from "./types";

const IMPACT_SPEED = 5.5;
const CRUSH_FORCE = 40;
const FALL_LIMIT_Y = -0.9;

export function WorkpiecePart({ broken, onDamage, onSelect, part, resetId, selected }: PartViewProps) {
  const select = stopAndSelect(onSelect);
  const bodyRef = useRef<RapierRigidBody>(null);
  const lastSpeed = useRef(0);
  useFrame(() => {
    const body = bodyRef.current;
    if (!body) return;
    const velocity = body.linvel();
    lastSpeed.current = Math.hypot(velocity.x, velocity.y, velocity.z);
    if (body.translation().y < FALL_LIMIT_Y) onDamage(part.id, "Werkstück ist von der Maschine gefallen");
  });

  return (
    <RigidBody
      key={`${part.id}-${resetId}-${poseKey(part)}`}
      ref={bodyRef}
      type="dynamic"
      position={part.position}
      rotation={part.rotation}
      colliders={false}
      linearDamping={0.12}
      angularDamping={0.35}
      restitution={0.08}
      userData={bodyUserData(part)}
      onCollisionEnter={() => { if (lastSpeed.current > IMPACT_SPEED) onDamage(part.id, `Werkstück ist mit ${lastSpeed.current.toFixed(1)} m/s aufgeschlagen`); }}
      onContactForce={({ totalForceMagnitude }) => { if (totalForceMagnitude > CRUSH_FORCE) onDamage(part.id, "Werkstück wurde eingeklemmt und zerdrückt"); }}
    >
      <CuboidCollider args={[0.22, 0.22, 0.22]} friction={0.7} />
      <mesh castShadow receiveShadow onClick={select}><boxGeometry args={[0.44, 0.44, 0.44]} /><meshStandardMaterial color={broken ? BROKEN_COLOR : selected ? "#38bdf8" : "#e6a44b"} roughness={0.38} /></mesh>
      <SelectionOutline selected={selected} size={[0.47, 0.47, 0.47]} />
    </RigidBody>
  );
}