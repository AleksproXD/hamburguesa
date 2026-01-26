import { Canvas } from '@react-three/fiber/native';
import { Suspense } from 'react';
import { View } from 'react-native';
import RotatingModel from '../molecules/RotatingModel';

interface Ingredient {
  tipo: 'lechuga' | 'tomate' | 'carne';
  id: number;
  yPosition: number;
}

interface HamburgerCanvasProps {
  ingredients: Ingredient[];
  panSuperiorY: number;
  panBaseY: number;
  models: {
    panBase: any;
    panSuperior: any;
    lechuga: any;
    tomate: any;
    carne: any;
  };
}

export default function HamburgerCanvas({
  ingredients,
  panSuperiorY,
  panBaseY,
  models
}: HamburgerCanvasProps) {
  return (
    <View className="flex-1 mx-4 my-2 bg-gray-800 rounded-3xl border-2 border-gray-700">
      <Canvas 
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-5, 3, -5]} intensity={0.6} />
        <pointLight position={[0, 5, 3]} intensity={0.8} color="#ffffff" />
        
        <Suspense fallback={null}>
          <RotatingModel 
            modelPath={models.panBase} 
            yPosition={panBaseY} 
            scale={0.5}
          />
          
          {ingredients.map((ing) => (
            <RotatingModel
              key={ing.id}
              modelPath={
                ing.tipo === 'lechuga' ? models.lechuga :
                ing.tipo === 'tomate' ? models.tomate : models.carne
              }
              yPosition={ing.yPosition}
              scale={ing.tipo === 'lechuga' ? 0.6 : 0.5}
              xPosition={ing.tipo === 'lechuga' ? 0.05 : 0}
            />
          ))}
          
          <RotatingModel 
            modelPath={models.panSuperior} 
            yPosition={panSuperiorY} 
            scale={0.5}
          />
        </Suspense>
      </Canvas>
    </View>
  );
}