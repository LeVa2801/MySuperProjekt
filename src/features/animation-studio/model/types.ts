import type { ModelKind, Transform } from "../../../shared/3d/types";

export type Keyframe = Transform & { id: string; time: number };
export type AnimationTrack = { id: string; name: string; kind: ModelKind; keyframes: Keyframe[] };
export type AnimationProject = { duration: number; tracks: AnimationTrack[] };
export type AnimationLanguage = "C++" | "C" | "JavaScript" | "Python";
