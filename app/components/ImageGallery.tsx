"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function UniformModel() {
  const { scene } = useGLTF("/models/uniform.glb");
  return <primitive object={scene} scale={1.5} />;
}

export default function Uniform3D() {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.5, 3] }}>
        <Suspense fallback={<div className="text-center text-gray-500">Loading 3D Model...</div>}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <UniformModel />
          <OrbitControls enableZoom={false} />
        </Suspense>
      </Canvas>
    </div>
  );
}
