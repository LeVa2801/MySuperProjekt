import type { AnimationLanguage, AnimationProject } from "../model/types";
import { createCFamilyExporter } from "./cFamilyExporter";
import { javascriptExporter } from "./javascriptExporter";
import { pythonExporter } from "./pythonExporter";
import type { AnimationExporter } from "./types";

export const animationExporters: Record<AnimationLanguage, AnimationExporter> = {
  "C++": createCFamilyExporter("C++"),
  C: createCFamilyExporter("C"),
  JavaScript: javascriptExporter,
  Python: pythonExporter,
};

export const animationLanguages = Object.keys(animationExporters) as AnimationLanguage[];

export function exportAnimation(project: AnimationProject, language: AnimationLanguage) {
  return animationExporters[language].export(project);
}
