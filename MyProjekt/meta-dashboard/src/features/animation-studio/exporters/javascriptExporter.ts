import type { AnimationExporter } from "./types";
import { toExportTracks } from "./exportTracks";

export const javascriptExporter: AnimationExporter = {
  language: "JavaScript",
  fileExtension: "js",
  export(project) {
    const tracks = toExportTracks(project);
    const json = JSON.stringify(tracks, null, 2);
  return `// Lineare Keyframe-Animation. Winkel sind im Bogenmass angegeben.\nconst tracks = ${json};\n\nfunction sample(track, time) {\n  const frames = track.keyframes;\n  if (time <= frames[0].time) return frames[0];\n  if (time >= frames[frames.length - 1].time) return frames[frames.length - 1];\n  const index = frames.findIndex((frame) => frame.time >= time);\n  const from = frames[index - 1];\n  const to = frames[index];\n  const t = (time - from.time) / (to.time - from.time);\n  return Object.fromEntries(["x", "y", "z", "rx", "ry", "rz", "scale"].map((key) => [key, from[key] + (to[key] - from[key]) * t]));\n}\n\n// An die Transform-API deiner 3D-Engine anbinden.\nconsole.log(tracks.map((track) => ({ name: track.name, model: track.model, pose: sample(track, 1.0) })));`;
  },
};
