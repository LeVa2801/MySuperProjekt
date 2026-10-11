import type { MachinePart } from "../../model/types";

export type PartViewProps = {
  part: MachinePart;
  selected: boolean;
  /** Antrieb liefert Leistung (läuft, kein Halt, nicht defekt, ggf. Motor vorhanden). */
  driven: boolean;
  broken: boolean;
  overloaded: boolean;
  /** Sicherheitskreis (alle Türen zu) geschlossen. */
  circuitClosed: boolean;
  resetId: number;
  sensorActive: boolean;
  onSelect: () => void;
  onSensor: (id: string, active: boolean) => void;
  onDamage: (id: string, reason: string) => void;
};