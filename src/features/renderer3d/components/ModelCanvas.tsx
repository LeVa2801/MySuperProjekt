import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls, TransformControls } from "@react-three/drei";
import type { Object3D } from "three";
import { createPrimitiveGeometry } from "../model/primitiveGeometry";
import type { ModelObject } from "../model/modelTypes";

type Props = {
  models: ModelObject[];
  selectedId: string;
  mode: "translate" | "rotate" | "scale";
  onSelect: (id: string) => void;
  onTransform: (id: string, object: Object3D) => void;
};

function ModelMesh({ model, selected, onSelect }: { model: ModelObject; selected: boolean; onSelect: () => void }) {
  const geometry = useMemo(() => createPrimitiveGeometry(model.kind), [model.kind]);
  return (
    <mesh
      geometry={geometry}
      castShadow
      receiveShadow
      onClick={(event) => { event.stopPropagation(); onSelect(); }}
    >
      <meshStandardMaterial color={model.color} metalness={0.22} roughness={0.42} emissive={model.color} emissiveIntensity={selected ? 0.13 : 0} />
    </mesh>
  );
}

export function ModelCanvas({ models, selectedId, mode, onSelect, onTransform }: Props) {
  const [transformTarget, setTransformTarget] = useState<Object3D | null>(null);
  const selectedModel = models.find((model) => model.id === selectedId);

  return (
    <Canvas shadows camera={{ position: [4.5, 3.5, 5], fov: 42 }} onPointerMissed={() => { setTransformTarget(null); onSelect(""); }}>
      <color attach="background" args={["#0b1220"]} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 7, 5]} intensity={2} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <Grid position={[0, -0.01, 0]} args={[20, 20]} cellSize={0.25} cellThickness={0.5} cellColor="#27374a" sectionSize={1} sectionThickness={0.8} sectionColor="#3a526a" fadeDistance={16} infiniteGrid />
      {models.map((model) => (
        <group
          key={model.id}
          position={model.position}
          rotation={model.rotation}
          scale={model.scale}
          onClick={(event) => { event.stopPropagation(); onSelect(model.id); }}
          ref={(object) => { if (model.id === selectedId && object) setTransformTarget(object); }}
        >
          <ModelMesh model={model} selected={model.id === selectedId} onSelect={() => { onSelect(model.id); }} />
        </group>
      ))}
      {selectedModel && transformTarget && (
        <TransformControls
          object={transformTarget}
          mode={mode}
          size={0.85}
          onObjectChange={() => onTransform(selectedModel.id, transformTarget)}
        />
      )}
      <OrbitControls makeDefault target={[0, 0.5, 0]} minDistance={2} maxDistance={15} />
    </Canvas>
  );
}
