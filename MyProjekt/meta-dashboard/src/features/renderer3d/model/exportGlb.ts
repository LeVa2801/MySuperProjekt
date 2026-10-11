import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { Group, Mesh, MeshStandardMaterial } from "three";
import { createPrimitiveGeometry } from "./primitiveGeometry";
import type { ModelObject } from "./modelTypes";

export function exportModelsAsGlb(models: ModelObject[]): Promise<Blob> {
  const root = new Group();
  root.name = "MyDashboard Modell";
  for (const model of models) {
    const mesh = new Mesh(createPrimitiveGeometry(model.kind), new MeshStandardMaterial({ color: model.color, metalness: 0.22, roughness: 0.42 }));
    mesh.name = model.name;
    mesh.position.set(...model.position);
    mesh.rotation.set(...model.rotation);
    mesh.scale.set(...model.scale);
    root.add(mesh);
  }

  return new Promise((resolve, reject) => {
    new GLTFExporter().parse(
      root,
      (result) => {
        if (!(result instanceof ArrayBuffer)) {
          reject(new Error("Der GLB-Export hat kein Binärmodell erzeugt."));
          return;
        }
        resolve(new Blob([result], { type: "model/gltf-binary" }));
      },
      (error) => reject(error),
      { binary: true },
    );
  });
}
