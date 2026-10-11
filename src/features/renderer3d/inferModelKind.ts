import type { ModelKind } from "../../shared/3d/types";

const keywordRules: { kind: ModelKind; pattern: RegExp }[] = [
  { kind: "sphere", pattern: /kugel|ball|planet|sphere/ },
  { kind: "cylinder", pattern: /zylinder|dose|cylinder/ },
  { kind: "cone", pattern: /kegel|cone/ },
];

/**
 * Infers the kind of 3D model based on the provided description.
 * @param description - The textual description of the model.
 * @returns The inferred ModelKind, defaulting to "cube" if no match is found.
 */
export function inferModelKind(description: string): ModelKind {
  const normalized = description.toLocaleLowerCase("de");
  return keywordRules.find(({ pattern }) => pattern.test(normalized))?.kind ?? "cube";
}
