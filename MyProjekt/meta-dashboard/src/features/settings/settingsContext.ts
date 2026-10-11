import { createContext } from "react";
import type { Theme } from "./types";

export type SettingsContextValue = {
  theme: Theme;
  accent: string;
  setTheme: (theme: Theme) => void;
  setAccent: (accent: string) => void;
};

export const SettingsContext = createContext<SettingsContextValue | null>(null);
