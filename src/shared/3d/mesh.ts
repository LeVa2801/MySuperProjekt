import type { ModelKind } from "./types";
export type Point3D = [number, number, number];
export type Mesh = { vertices: Point3D[]; faces: number[][] };

/**
 * Creates a 3D mesh for the specified model kind.
 * @param kind - The kind of 3D model to create ("cube", "sphere", "cylinder", "cone").
 * @returns The generated mesh with vertices and faces.
 */

export function createMesh(kind: ModelKind): Mesh {
  if (kind === "cube") {
    return {
      vertices: [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
      ],
      faces: [[0, 3, 2, 1], [4, 5, 6, 7], [0, 1, 5, 4], [3, 7, 6, 2], [1, 2, 6, 5], [0, 4, 7, 3]],
    };
  }

  const segments = 28;
  if (kind === "sphere") {
    const vertices: Point3D[] = [];
    const faces: number[][] = [];
    const rings = 14;
    for (let lat = 0; lat <= rings; lat += 1) {
      const phi = (Math.PI * lat) / rings;
      for (let lon = 0; lon < segments; lon += 1) {
        const theta = (2 * Math.PI * lon) / segments;
        vertices.push([Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta)]);
      }
    }
    for (let lat = 0; lat < rings; lat += 1) {
      for (let lon = 0; lon < segments; lon += 1) {
        const next = (lon + 1) % segments;
        faces.push([lat * segments + lon, lat * segments + next, (lat + 1) * segments + next, (lat + 1) * segments + lon]);
      }
    }
    return { vertices, faces };
  }

  const vertices: Point3D[] = [];
  const faces: number[][] = [];
  for (let index = 0; index < segments; index += 1) {
    const angle = (2 * Math.PI * index) / segments;
    vertices.push([Math.cos(angle), -1, Math.sin(angle)]);
  }
  if (kind === "cylinder") {
    for (let index = 0; index < segments; index += 1) {
      const angle = (2 * Math.PI * index) / segments;
      vertices.push([Math.cos(angle), 1, Math.sin(angle)]);
    }
    faces.push(Array.from({ length: segments }, (_, index) => segments - 1 - index));
    faces.push(Array.from({ length: segments }, (_, index) => segments + index));
    for (let index = 0; index < segments; index += 1) {
      const next = (index + 1) % segments;
      faces.push([index, next, segments + next, segments + index]);
    }
  } else {
    const tip = vertices.push([0, 1, 0]) - 1;
    faces.push(Array.from({ length: segments }, (_, index) => segments - 1 - index));
    for (let index = 0; index < segments; index += 1) {
      faces.push([index, (index + 1) % segments, tip]);
    }
  }
  return { vertices, faces };
}
