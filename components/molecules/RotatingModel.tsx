import { Gltf } from '@react-three/drei/native';
import { useFrame } from '@react-three/fiber/native';
import { useRef } from 'react';

interface RotatingModelProps {
  modelPath: any;
  yPosition: number;
  scale?: number;
  xPosition?: number;
}

export default function RotatingModel({ 
  modelPath, 
  yPosition, 
  scale = 0.5,
  xPosition = 0
}: RotatingModelProps) {
  const groupRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={[xPosition, yPosition, 0]}>
      <Gltf src={modelPath} scale={scale} />
    </group>
  );
}