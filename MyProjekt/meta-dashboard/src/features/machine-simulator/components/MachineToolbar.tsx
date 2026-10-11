

type Props = {
  running: boolean;
  emergencyStop: boolean;
  safetyTripped: boolean;
  activeSensorCount: number;
  onToggleRunning: () => void;
  onToggleEmergencyStop: () => void;
  onReset: () => void;
};

export function MachineToolbar({ running, emergencyStop, safetyTripped, activeSensorCount, onToggleRunning, onToggleEmergencyStop, onReset }: Props) {
  return (
    <div className="machine-toolbar panel">
      <div className="machine-toolbar-left"><button className="primary-button" disabled={emergencyStop || safetyTripped} onClick={onToggleRunning}>{running ? "Ⅱ  Pause" : "▶  Maschine starten"}</button><button className={emergencyStop ? "emergency-button tripped" : "emergency-button"} onClick={onToggleEmergencyStop}>{emergencyStop ? "NOT-AUS zurücksetzen" : "●  NOT-AUS"}</button><button className="secondary-button" onClick={onReset}>↺  Physik zurücksetzen</button></div>
      <div className="machine-readouts"><span><i className={activeSensorCount ? "sensor-indicator active" : "sensor-indicator"} />Sensoren aktiv <strong>{activeSensorCount}</strong></span><span>Physik <strong>Rapier 3D · 9,81 m/s²</strong></span></div>
    </div>
  );
}
