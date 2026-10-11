import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { createMesh } from "./mesh";
import type { AnimatedModel } from "./types";


/**
 * Component to render a 3D model preview using a canvas element.
 * @param models - An array of animated 3D models to display.
 */
export function ModelPreview({ models }: { models: AnimatedModel[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelsRef = useRef(models);
  const renderRef = useRef<() => void>(() => {});
  const rotation = useRef({ x: -0.35, y: 0.55 });
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const [rotationFrame, redraw] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) {
      console.error("Der 3D-Preview benötigt Canvas-Unterstützung.");
      return;
    }

    const render = () => {
      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(bounds.width, 1);
      const height = Math.max(bounds.height, 1);
      const ratio = window.devicePixelRatio || 1;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#0b1220";
      context.fillRect(0, 0, width, height);
      context.strokeStyle = "rgba(148, 163, 184, 0.1)";
      context.lineWidth = 1;
      for (let x = width / 2 % 36; x < width; x += 36) {
        context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke();
      }
      for (let y = height / 2 % 36; y < height; y += 36) {
        context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke();
      }

      const { x: angleX, y: angleY } = rotation.current;
      const scale = Math.min(width, height) * 0.32;
      const faces = modelsRef.current.flatMap((model, modelIndex) => {
        const mesh = createMesh(model.kind);
        const transform = model.transform;
        const projected = mesh.vertices.map(([vertexX, vertexY, vertexZ]) => {
          const x = vertexX * transform.scale;
          const y = vertexY * transform.scale;
          const z = vertexZ * transform.scale;
          const cosZ = Math.cos(transform.rz);
          const sinZ = Math.sin(transform.rz);
          const modelX = x * cosZ - y * sinZ;
          const modelY = x * sinZ + y * cosZ;
          const rotatedModelY = modelY * Math.cos(transform.rx) - z * Math.sin(transform.rx);
          const rotatedModelZ = modelY * Math.sin(transform.rx) + z * Math.cos(transform.rx);
          const worldX = modelX * Math.cos(transform.ry) + rotatedModelZ * Math.sin(transform.ry);
          const worldZ = -modelX * Math.sin(transform.ry) + rotatedModelZ * Math.cos(transform.ry);
          const rotatedX = worldX * Math.cos(angleY) + worldZ * Math.sin(angleY);
          const rotatedZ = -worldX * Math.sin(angleY) + worldZ * Math.cos(angleY);
          const rotatedY = (rotatedModelY + transform.y) * Math.cos(angleX) - rotatedZ * Math.sin(angleX);
          const depth = (rotatedModelY + transform.y) * Math.sin(angleX) + rotatedZ * Math.cos(angleX) + transform.z;
          const perspective = 3.8 / (3.8 - depth);
          return {
            x: width / 2 + (rotatedX + transform.x) * scale * perspective,
            y: height / 2 + 4 - rotatedY * scale * perspective,
            depth,
          };
        });
        return mesh.faces.map((face) => ({
          points: face.map((index) => projected[index]),
          depth: face.reduce((sum, index) => sum + projected[index].depth, 0) / face.length,
          modelIndex,
        }));
      }).sort((first, second) => first.depth - second.depth);
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent-color").trim() || "#38bdf8";
      const match = accent.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
      const channels = match
        ? match.slice(1).map((channel) => Number.parseInt(channel, 16) / 255)
        : [0.22, 0.74, 0.97];
      const maxChannel = Math.max(...channels);
      const minChannel = Math.min(...channels);
      const delta = maxChannel - minChannel;
      let hue = 0;
      if (delta !== 0) {
        if (maxChannel === channels[0]) hue = ((channels[1] - channels[2]) / delta) % 6;
        else if (maxChannel === channels[1]) hue = (channels[2] - channels[0]) / delta + 2;
        else hue = (channels[0] - channels[1]) / delta + 4;
        hue = Math.round(hue * 60);
        if (hue < 0) hue += 360;
      }
      faces.forEach((face) => {
        context.beginPath();
        face.points.forEach((point, index) => {
          if (index === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        });
        context.closePath();
        const lightness = Math.max(31, Math.min(67, 49 + face.depth * 9));
        context.fillStyle = `hsl(${hue + face.modelIndex * 31}, 76%, ${lightness}%)`;
        context.fill();
        context.strokeStyle = "rgba(255, 255, 255, 0.28)";
        context.lineWidth = 1;
        context.stroke();
      });
    };

    renderRef.current = render;
    render();
    const observer = new ResizeObserver(render);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    modelsRef.current = models;
    renderRef.current();
  }, [models, rotationFrame]);

    /**
      * Handles pointer movement on the canvas to rotate the 3D model.
      * @param event - The pointer event triggered by user interaction.
    */
  function handlePointerMove(event: PointerEvent<HTMLCanvasElement>) {
    if (!dragStart.current) return;
    const deltaX = event.clientX - dragStart.current.x;
    const deltaY = event.clientY - dragStart.current.y;
    rotation.current = { x: rotation.current.x + deltaY * 0.012, y: rotation.current.y + deltaX * 0.012 };
    dragStart.current = { x: event.clientX, y: event.clientY };
    redraw((count) => count + 1);
  }

  return (
    <canvas
      ref={canvasRef}
      className="model-canvas"
      aria-label="Interaktive 3D-Vorschau. Ziehe, um die Szene zu drehen."
      onPointerDown={(event) => { dragStart.current = { x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId); }}
      onPointerMove={handlePointerMove}
      onPointerUp={() => { dragStart.current = null; }}
      onPointerCancel={() => { dragStart.current = null; }}
    />
  );
}
