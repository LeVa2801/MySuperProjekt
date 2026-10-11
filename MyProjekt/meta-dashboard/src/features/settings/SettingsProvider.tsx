import { useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { useLocalStorage } from "../../shared/hooks/useLocalStorage";
import { DEFAULT_ACCENT } from "../../shared/lib/colors";
import { SettingsContext } from "./settingsContext";
import type { Theme } from "./types";
/**
 * Provider component to manage and provide the Settings context to its children.
 */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>("dashboard-theme", "dark");
  const [accent, setAccent] = useLocalStorage("dashboard-accent", DEFAULT_ACCENT);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.setProperty("--accent-color", accent);
    document.documentElement.style.setProperty("--accent-glow", `${accent}26`);
  }, [theme, accent]);

  const value = useMemo(() => ({ theme, accent, setTheme, setAccent }), [theme, accent, setTheme, setAccent]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
