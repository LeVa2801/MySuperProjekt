import type { AnimationProject } from "../model/types";

export function toExportTracks(project: AnimationProject) {
  return project.tracks.map((track) => ({
    name: track.name,
    model: track.kind,
    keyframes: [...track.keyframes].sort((first, second) => first.time - second.time).map(({ time, x, y, z, rx, ry, rz, scale }) => ({
      time, x, y, z, rx, ry, rz, scale,
    })),
  }));
}

export type ExportTrack = ReturnType<typeof toExportTracks>[number];

export function formatNumber(value: number) {
  return Number(value.toFixed(4)).toString();
}
