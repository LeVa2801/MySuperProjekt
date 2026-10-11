import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";
import { TodoNavBadge } from "../features/todo/TodoNavBadge";

export type NavItem = { path: string; navLabel: string; end?: boolean; Badge?: ComponentType };

export type AppDefinition = NavItem & {
  cardTitle: string;
  description: string | ((stats: { openTodos: number }) => string);
  tag: string;
  icon: string;
  Component: LazyExoticComponent<ComponentType>;
};

export const apps: AppDefinition[] = [
  {
    path: "/code-playground", navLabel: "C / C++ Playground", cardTitle: "C / C++ Playground",
    description: "C- und C++-Programme schreiben, direkt ausführen und als Quelldatei exportieren.",
    tag: "BEREIT", icon: "</>", Component: lazy(() => import("../features/code-playground/CodePlaygroundPage")),
  },
  {
    path: "/machine-simulator", navLabel: "Maschinensimulation", cardTitle: "Maschinensimulation 3D",
    description: "Förderbänder, Antriebe, Achsen und Sensoren physikbasiert zusammensetzen und testen.",
    tag: "PHYSIK", icon: "⚙", Component: lazy(() => import("../features/machine-simulator/MachineSimulatorPage")),
  },
  {
    path: "/3d-engine", navLabel: "3D Modellstudio", cardTitle: "3D Modellstudio",
    description: "Erstelle 3D-Modelle visuell aus Grundkörpern, bearbeite sie im Viewport und exportiere sie als GLB.",
    tag: "MODELLIEREN", icon: "◈", Component: lazy(() => import("../features/renderer3d/ModelStudioPage")),
  },
  {
    path: "/animation", navLabel: "Animation Studio", cardTitle: "Animation Studio",
    description: "Animierte 3D-Modelle mit Keyframes erstellen und in vier Sprachen exportieren.",
    tag: "BEREIT", icon: "▶", Component: lazy(() => import("../features/animation-studio/AnimationStudioPage")),
  },
  {
    path: "/api-generator", navLabel: "API-Generator", cardTitle: "API-Generator",
    description: "Erstelle Fetch- und cURL-Beispiele für deine REST-Endpunkte.",
    tag: "BEREIT", icon: "⌘", Component: lazy(() => import("../features/api-generator/ApiGeneratorPage")),
  },
  {
    path: "/video-compressor", navLabel: "Video-Kompressor", cardTitle: "MP4 Video-Kompressor",
    description: "Komprimiere eigene Videos lokal zu MP4 und behalte Auflösung und Textschärfe unter Kontrolle.",
    tag: "LOKAL", icon: "▶", Component: lazy(() => import("../features/video-compressor/VideoCompressorPage")),
  },
  {
    path: "/colorpicker", navLabel: "Colorpicker", cardTitle: "Colorpicker",
    description: "Wähle Farben, kopiere Hex-Werte und verwalte deine Palette.",
    tag: "BEREIT", icon: "◉", Component: lazy(() => import("../features/colorpicker/ColorpickerPage")),
  },
  {
    path: "/todo", navLabel: "Todo", cardTitle: "Todo", Badge: TodoNavBadge,
    description: ({ openTodos }) => `${openTodos} offene ${openTodos === 1 ? "Aufgabe" : "Aufgaben"} in deiner lokalen Liste.`,
    tag: "BEREIT", icon: "✓", Component: lazy(() => import("../features/todo/TodoPage")),
  },
  {
    path: "/settings", navLabel: "Settings", cardTitle: "Settings",
    description: "Passe Farbschema und Akzentfarbe des Dashboards an.",
    tag: "BEREIT", icon: "⚙", Component: lazy(() => import("../features/settings/SettingsPage")),
  },
];

export const navigationItems: NavItem[] = [{ path: "/", navLabel: "Übersicht", end: true }, ...apps];
