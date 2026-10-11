import type { ThreeEvent } from "@react-three/fiber";
import { Euler, Quaternion, Vector3 } from "three";
import type { MachinePart } from "../../model/types";

const DRIVE_SPEED = 1.6;
export const BROKEN_COLOR = "#5b1f24";

export function getDriveSpeed(driven: boolean) {
  return driven ? DRIVE_SPEED : 0;
}

export function stopAndSelect(onSelect: () => void) {
  return (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect();
  };
}

export function poseKey(part: MachinePart) {
  return `${part.position.join(",")}|${part.rotation.join(",")}`;
}

export function partQuaternion(part: MachinePart) {
  return new Quaternion().setFromEuler(new Euler(...part.rotation));
}

/** Lokale Richtung des Bauteils in Weltkoordinaten. */
export function localDirection(part: MachinePart, local: [number, number, number]) {
  return new Vector3(...local).applyQuaternion(partQuaternion(part));
}

export function bodyUserData(part: MachinePart) {
  return { partId: part.id, kind: part.kind, name: part.name };
}

export type BodyUserData = ReturnType<typeof bodyUserData>;