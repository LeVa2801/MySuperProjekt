import type { AnimationLanguage, AnimationProject } from "../model/types";

export interface AnimationExporter {
  language: AnimationLanguage;
  fileExtension: string;
  export(project: AnimationProject): string;
}
