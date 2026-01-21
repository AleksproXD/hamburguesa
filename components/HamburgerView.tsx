import { Gltf, OrbitControls, useGLTF } from '@react-three/drei/native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { Suspense, useRef } from 'react';
import { Text, View } from 'react-native';
import '../global.css';

// Importar los modelos GLB
import carne from '../assets/3D/Carne.glb';
import lechuga from '../assets/3D/lechuga.glb';
import panSuperior from '../assets/3D/pan.glb';
import panBase from '../assets/3D/Pan2.glb';
import tomate from '../assets/3D/tomate.glb';

// Componente para cada ingrediente
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

  // Rotación automática como microondas
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  if (!gltf?.scene) return null;

  return (
    // <primitive 
    //   ref={meshRef} 
    //   object={gltf.scene} 
    //   position={[xPosition, yPosition, zPosition]}
    //   scale={scale}
    // />
    <group>
      <Gltf src={panSuperior}/>
      <Gltf src={lechuga}/>
      <Gltf src={tomate}/>
      <Gltf src={carne}/>
    </group>
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
          <OrbitControls/>
          {/* TODOS los ingredientes importados con .glb */}
          <Suspense fallback={null}>
            {/* Pan Superior (Pan.glb) - ARRIBA */}
            <Ingredient 
              modelPath={panSuperior} 
              yPosition={1} 
              scale={0.5}
            />
            {/* Lechuga - un poco más grande */}
            <Ingredient 
              modelPath={lechuga} 
              yPosition={0.6} 
              xPosition={0.1} 
              scale={0.9}
            />
            {/* Tomate */}
            <Ingredient 
              modelPath={tomate} 
              yPosition={0.5} 
              scale={0.5}
            />
            {/* Carne */}
            <Ingredient 
              modelPath={carne} 
              yPosition={0.2} 
              scale={0.5}
            />
            {/* Pan Inferior (Pan2.glb) - BASE ABAJO */}
            <Ingredient 
              modelPath={panBase} 
              yPosition={-0.1} 
              scale={0.5}
            />
          </Suspense>
        </Canvas>
      </View>
    </View>
  );
}