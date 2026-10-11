import type { AnimationExporter } from "./types";
import { toExportTracks } from "./exportTracks";

export const pythonExporter: AnimationExporter = {
  language: "Python",
  fileExtension: "py",
  export(project) {
    const tracks = toExportTracks(project);
  return `# Lineare Keyframe-Animation. Winkel sind im Bogenmass angegeben.\nimport json\n\ntracks = json.loads(r'''${JSON.stringify(tracks)}''')\n\n\ndef sample(track, time):\n    frames = track["keyframes"]\n    if time <= frames[0]["time"]:\n        return frames[0]\n    if time >= frames[-1]["time"]:\n        return frames[-1]\n    for left, right in zip(frames, frames[1:]):\n        if right["time"] >= time:\n            amount = (time - left["time"]) / (right["time"] - left["time"])\n            return {key: left[key] + (right[key] - left[key]) * amount\n                    for key in ("x", "y", "z", "rx", "ry", "rz", "scale")}\n    return frames[-1]\n\n\n# An die Transform-API deiner 3D-Engine anbinden.\nfor track in tracks:\n    print(track["name"], track["model"], sample(track, 1.0))`;
  },
};
