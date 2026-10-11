import type { MachinePartKind, Vec3 } from "./types";

export type PartCategory = "Mechanik & Gestell" | "Antriebe & Achsen" | "Sensoren" | "Sicherheit" | "Werkstücke";
type PartDescriptor = { label: string; paletteLabel: string; icon: string; defaultPosition: Vec3; isSensor: boolean; category: PartCategory };

export const partCatalog: Record<MachinePartKind, PartDescriptor> = {
  conveyor: { label: "Förderband", paletteLabel: "Förderband", icon: "⇢", defaultPosition: [-0.65, 0.18, 0], isSensor: false, category: "Mechanik & Gestell" },
  motor: { label: "Getriebemotor", paletteLabel: "Antriebsmotor", icon: "⚙", defaultPosition: [-0.65, 0.48, -0.68], isSensor: false, category: "Antriebe & Achsen" },
  axis: { label: "Pneumatikachse", paletteLabel: "Lineare Achse", icon: "↔", defaultPosition: [1.7, 0.4, 0], isSensor: false, category: "Antriebe & Achsen" },
  pneumaticCylinder: { label: "Pneumatikzylinder", paletteLabel: "Pneumatikzylinder", icon: "⇆", defaultPosition: [1.2, 0.55, 0.85], isSensor: false, category: "Antriebe & Achsen" },
  gripper: { label: "Greifer", paletteLabel: "Greifer", icon: "⊣", defaultPosition: [1.8, 0.7, 0.75], isSensor: false, category: "Antriebe & Achsen" },
  lightGate: { label: "Lichtschranke", paletteLabel: "Lichtschranke", icon: "⌁", defaultPosition: [0.85, 0.75, 0], isSensor: true, category: "Sensoren" },
  proximity: { label: "Näherungssensor", paletteLabel: "Näherungssensor", icon: "◉", defaultPosition: [-0.8, 0.8, 0.5], isSensor: true, category: "Sensoren" },
  inductiveSensor: { label: "Induktiver Sensor", paletteLabel: "Induktiver Sensor", icon: "◉", defaultPosition: [0.1, 0.9, 0.65], isSensor: true, category: "Sensoren" },
  limitSwitch: { label: "Endschalter", paletteLabel: "Mechanischer Endschalter", icon: "↧", defaultPosition: [1.1, 0.9, 0.45], isSensor: true, category: "Sensoren" },
  workpiece: { label: "Werkstück", paletteLabel: "Werkstück", icon: "■", defaultPosition: [-1.4, 1, 0], isSensor: false, category: "Werkstücke" },
  safetySwitch: { label: "Sicherheitsschalter", paletteLabel: "Sicherheitsschalter", icon: "⛨", defaultPosition: [0.75, 0.45, 1.05], isSensor: false, category: "Sicherheit" },
  door: { label: "Schutztür", paletteLabel: "Schutztür", icon: "🚪", defaultPosition: [0.2, 0.45, 1.05], isSensor: false, category: "Sicherheit" },
  plate: { label: "Platte", paletteLabel: "Stahlplatte", icon: "▭", defaultPosition: [0, 0.03, 1.1], isSensor: false, category: "Mechanik & Gestell" },
  guard: { label: "Schutzgitter", paletteLabel: "Schutzgitter", icon: "▦", defaultPosition: [0, 0.5, -1.3], isSensor: false, category: "Sicherheit" },
  profile: { label: "Aluprofil", paletteLabel: "Aluminiumprofil", icon: "▥", defaultPosition: [-2.6, 0.75, -1.2], isSensor: false, category: "Mechanik & Gestell" },
};

export const machinePartKinds = Object.keys(partCatalog) as MachinePartKind[];