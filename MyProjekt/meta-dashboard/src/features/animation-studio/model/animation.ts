import { defaultTransform } from "../../../shared/3d/types";
import type { Transform } from "../../../shared/3d/types";
import type { AnimationProject, AnimationTrack, Keyframe } from "./types";

export function createDefaultAnimation(): AnimationProject {
  return {
    duration: 4,
    tracks: [{
      id: "track-cube",
      name: "Würfel",
      kind: "cube",
      keyframes: [
        { id: "cube-start", time: 0, ...defaultTransform },
        { id: "cube-end", time: 4, ...defaultTransform, x: 1.3, ry: Math.PI * 2, y: 0.4 },
      ],
    }],
  };
}

export function sampleTrack(track: AnimationTrack, time: number): Transform {
  const keyframes = [...track.keyframes].sort((first, second) => first.time - second.time);
  if (keyframes.length === 0) return defaultTransform;
  const poseOf = ({ x, y, z, rx, ry, rz, scale }: Keyframe): Transform => ({ x, y, z, rx, ry, rz, scale });
  if (time <= keyframes[0].time) return poseOf(keyframes[0]);
  if (time >= keyframes[keyframes.length - 1].time) return poseOf(keyframes[keyframes.length - 1]);
  const nextIndex = keyframes.findIndex((keyframe) => keyframe.time >= time);
  const from = keyframes[nextIndex - 1];
  const to = keyframes[nextIndex];
  const progress = (time - from.time) / (to.time - from.time);
  return {
    x: from.x + (to.x - from.x) * progress,
    y: from.y + (to.y - from.y) * progress,
    z: from.z + (to.z - from.z) * progress,
    rx: from.rx + (to.rx - from.rx) * progress,
    ry: from.ry + (to.ry - from.ry) * progress,
    rz: from.rz + (to.rz - from.rz) * progress,
    scale: from.scale + (to.scale - from.scale) * progress,
  };
}

export function fitKeyframesToDuration(keyframes: Keyframe[], duration: number) {
  const resized: Keyframe[] = [];
  [...keyframes].sort((first, second) => first.time - second.time).forEach((frame) => {
    const adjusted = frame.time > duration ? { ...frame, time: duration } : frame;
    const previous = resized[resized.length - 1];
    if (previous && previous.time === adjusted.time) resized[resized.length - 1] = adjusted;
    else resized.push(adjusted);
  });
  return resized;
}
