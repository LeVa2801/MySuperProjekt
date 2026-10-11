import { useContext } from "react";
import { SettingsContext } from "./settingsContext";

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings muss innerhalb von SettingsProvider verwendet werden.");
  return context;
}
