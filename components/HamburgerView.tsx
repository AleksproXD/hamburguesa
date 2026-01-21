import { Canvas, useFrame } from '@react-three/fiber/native';
import { Suspense, useRef, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useGLTF } from '@react-three/drei/native';
import * as THREE from 'three';
import '../global.css';

// Componente para cada ingrediente con smooth shading
function Ingredient({ 
  modelPath, 
  yPosition, 
  scale = 1.0,
  xPosition = 0,
  zPosition = 0
}: { 
  modelPath: any; 
  yPosition: number;
  scale?: number;
  xPosition?: number;
  zPosition?: number;
}) {
  const meshRef = useRef<any>(null);
  const gltf: any = useGLTF(modelPath);

  // Aplicar smooth shading simple
  useEffect(() => {
    if (gltf?.scene) {
      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          // Solo activar smooth shading básico
          child.geometry.computeVertexNormals();
          if (child.material) {
            child.material.flatShading = false;
            child.material.needsUpdate = true;
          }
        }
      });
    }
  }, [gltf]);

  // Rotación automática como microondas
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  // Verificar que gltf.scene existe
  if (!gltf?.scene) return null;

  return (
    <primitive 
      ref={meshRef} 
      object={gltf.scene} 
      position={[xPosition, yPosition, zPosition]}
      scale={scale}
    />
  );
}

export default function HamburgerView() {
  return (
    <View className="flex-1 bg-black">
      <Text className="text-white text-4xl font-bold text-center pt-12 pb-2 tracking-wider">
        Hamburguesa
      </Text>
      <View className="flex-1 mx-2">
        <Canvas 
          camera={{ position: [3, 1.5, 3], fov: 50 }}
          gl={{ antialias: true }}
        >
          {/* Iluminación suave */}
          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <directionalLight position={[-10, 10, -10]} intensity={0.5} />
          <pointLight position={[0, 8, 5]} intensity={0.8} />
          
          {/* TODOS los ingredientes con EL MISMO tamaño pequeño-mediano */}
          <Suspense fallback={null}>
            {/* Pan Superior (Pan.glb) - ARRIBA */}
            <Ingredient 
              modelPath={require('../assets/3D/Pan.glb')} 
              yPosition={1} 
              scale={0.5}
            />
            {/* Lechuga - un poco más grande y ajustable en X */}
            <Ingredient 
              modelPath={require('../assets/3D/Lechuga.glb')} 
              yPosition={0.6} 
              xPosition={0.1} 
              scale={0.9}
            />
            {/* Tomate */}
            <Ingredient 
              modelPath={require('../assets/3D/tomatico.glb')} 
              yPosition={0.5} 
              scale={0.5}
            />
            {/* Carne */}
            <Ingredient 
              modelPath={require('../assets/3D/Carnita.glb')} 
              yPosition={0.2} 
              scale={0.5}
            />
            {/* Pan Inferior (Pan2.glb) - BASE ABAJO */}
            <Ingredient 
              modelPath={require('../assets/3D/Pan2.glb')} 
              yPosition={-0.1} 
              scale={0.5}
            />
          </Suspense>
        </Canvas>
      </View>
    </View>
  );
}