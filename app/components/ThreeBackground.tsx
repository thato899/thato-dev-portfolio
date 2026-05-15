'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';

function AnimatedSphere() {
  const meshRef = useRef(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });
  return (
    <Sphere ref={meshRef} args={[1.8, 128, 128]} position={[3, 1, -5]}>
      <MeshDistortMaterial color="#7c3aed" distort={0.6} speed={1.5} roughness={0.2} metalness={0.8} />
    </Sphere>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <Stars radius={200} depth={100} count={5000} fade speed={1} />
        <AnimatedSphere />
      </Canvas>
    </div>
  );
}
