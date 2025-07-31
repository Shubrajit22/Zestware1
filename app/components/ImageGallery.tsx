"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";

function UniformModel() {
  const gltf = useLoader(GLTFLoader, "/models/uniform.glb"); // Your uniform 3D model
  return <primitive object={gltf.scene} scale={1.5} />;
}

export default function Uniform3D() {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas camera={{ position: [0, 1.5, 3] }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            <UniformModel />
          </Stage>
          <OrbitControls enableZoom={false} />
        </Suspense>
      </Canvas>
    </div>
  );
}
