import type { ComponentType } from "react";
import type { MachinePartKind } from "../../model/types";
import { ConveyorPart } from "./ConveyorPart";
import { DoorPart } from "./DoorPart";
import { ExtraPart } from "./ExtraPart";
import { GuardPart } from "./GuardPart";
import { LightGatePart } from "./LightGatePart";
import { LinearAxisPart } from "./LinearAxisPart";
import { MotorPart } from "./MotorPart";
import { PlatePart } from "./PlatePart";
import { ProximitySensorPart } from "./ProximitySensorPart";
import { SafetySwitchPart } from "./SafetySwitchPart";
import { WorkpiecePart } from "./WorkpiecePart";
import type { PartViewProps } from "./types";

export const partViews: Record<MachinePartKind, ComponentType<PartViewProps>> = {
  conveyor: ConveyorPart,
  motor: MotorPart,
  axis: LinearAxisPart,
  lightGate: LightGatePart,
  proximity: ProximitySensorPart,
  workpiece: WorkpiecePart,
  safetySwitch: SafetySwitchPart,
  door: DoorPart,
  plate: PlatePart,
  guard: GuardPart,
  profile: ExtraPart,
  pneumaticCylinder: ExtraPart,
  gripper: ExtraPart,
  inductiveSensor: ExtraPart,
  limitSwitch: ExtraPart,
};