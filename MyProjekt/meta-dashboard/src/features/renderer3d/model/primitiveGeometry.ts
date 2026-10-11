import {
  BoxGeometry,
  ConeGeometry,
  CylinderGeometry,
  PlaneGeometry,
  SphereGeometry,
  TorusGeometry,
} from "three";
import type { PrimitiveKind } from "./modelTypes";

export function createPrimitiveGeometry(kind: PrimitiveKind) {
  switch (kind) {
    case "box": return new BoxGeometry(1, 1, 1);
    case "sphere": return new SphereGeometry(0.6, 32, 20);
    case "cylinder": return new CylinderGeometry(0.5, 0.5, 1.2, 32);
    case "cone": return new ConeGeometry(0.6, 1.2, 32);
    case "torus": return new TorusGeometry(0.5, 0.16, 16, 36);
    case "plane": return new PlaneGeometry(1.2, 1.2);
  }
}
