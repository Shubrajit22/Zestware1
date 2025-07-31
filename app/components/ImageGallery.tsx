"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";

// Load GLB model
function UniformModel() {
  const { scene } = useGLTF("/models/uniform.glb");
  return <primitive object={scene} scale={1.5} />;
}

// 3D Viewer Component
export default function Uniform3D() {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.5, 3] }}>
        <Suspense
          fallback={
            // Use Drei <Html> to display fallback inside canvas
            <Html>
              <div className="text-sm text-gray-500 bg-white px-2 py-1 rounded">
                Loading 3D Model...
              </div>
            </Html>
          }
        >
          {/* Lights */}
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={1} />

          {/* Model */}
          <UniformModel />

          {/* Controls */}
          <OrbitControls enableZoom={false} />
        </Suspense>
      </Canvas>
    </div>
  );
}
