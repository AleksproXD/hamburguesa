import { Gltf } from '@react-three/drei/native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { Suspense, useRef, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import '../global.css';

// Importar los modelos GLB
import carne from '../assets/3D/Carne.glb';
import lechuga from '../assets/3D/lechuga.glb';
import panSuperior from '../assets/3D/pan.glb';
import panBase from '../assets/3D/pan2.glb';
import tomate from '../assets/3D/tomate.glb';

// Componente para cada ingrediente que gira
function IngredienteGiratorio({ 
  modelPath, 
  yPosition, 
  scale = 0.5,
  xPosition = 0
}: { 
  modelPath: any; 
  yPosition: number;
  scale?: number;
  xPosition?: number;
}) {
  const groupRef = useRef<any>(null);

  // Rotación automática como microondas
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[xPosition, yPosition, 0]}>
      <Gltf src={modelPath} scale={scale} />
    </group>
  );
}

type Ingrediente = {
  tipo: 'lechuga' | 'tomate' | 'carne';
  id: number;
};

export default function HamburgerView() {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [contadorId, setContadorId] = useState(0);

  // Agregar ingrediente
  const agregarIngrediente = (tipo: 'lechuga' | 'tomate' | 'carne') => {
    setIngredientes([...ingredientes, { tipo, id: contadorId }]);
    setContadorId(contadorId + 1);
  };

  // Eliminar todo
  const eliminarTodo = () => {
    setIngredientes([]);
  };

  // Calcular posiciones dinámicamente
  const calcularPosiciones = () => {
    const posiciones = [];
    let yActual = 0.3;
    const separacion = 0.1;

    ingredientes.forEach((ing) => {
      posiciones.push({ ...ing, yPosition: yActual });
      yActual += separacion;
    });

    return posiciones;
  };

  const posicionesIngredientes = calcularPosiciones();
  const yPanSuperior = ingredientes.length > 0 ? 0.3 + (ingredientes.length * 0.1) + 0.1 : 0.3;

  return (
    <View className="flex-1 bg-black">
      <Text className="text-white text-4xl font-bold text-center pt-12 pb-2 tracking-wider">
        Crea tu Hamburguesa 🍔
      </Text>
      
      {/* Canvas 3D */}
      <View className="flex-1 mx-2">
        <Canvas 
          camera={{ position: [3, 1.5, 3], fov: 50 }}
          gl={{ antialias: true }}
        >
          {/* Iluminación suave */}
          <ambientLight intensity={1.2} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <directionalLight position={[-10, 10, -10]} intensity={0.5} />
          <pointLight position={[0, 8, 5]} intensity={0.8} />
          
          <Suspense fallback={null}>
            {/* Pan Superior - siempre arriba */}
            <IngredienteGiratorio 
              modelPath={panSuperior} 
              yPosition={yPanSuperior} 
              scale={0.5}
            />
            
            {/* Ingredientes agregados dinámicamente */}
            {posicionesIngredientes.map((ing) => (
              <IngredienteGiratorio
                key={ing.id}
                modelPath={
                  ing.tipo === 'lechuga' ? lechuga :
                  ing.tipo === 'tomate' ? tomate : carne
                }
                yPosition={ing.yPosition}
                scale={ing.tipo === 'lechuga' ? 0.7 : 0.5}
                xPosition={ing.tipo === 'lechuga' ? 0.05 : 0}
              />
            ))}
            
            {/* Pan Base - siempre abajo */}
            <IngredienteGiratorio 
              modelPath={panBase} 
              yPosition={0.1} 
              scale={0.5}
            />
          </Suspense>
        </Canvas>
      </View>

      {/* Botones de control */}
      <View className="pb-8 px-4">
        <Text className="text-gray-400 text-center text-sm mb-3">
          Ingredientes: {ingredientes.length}
        </Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
          <View className="flex-row gap-3 px-2">
            {/* Botón Lechuga */}
            <TouchableOpacity
              onPress={() => agregarIngrediente('lechuga')}
              className="bg-green-600 px-6 py-3 rounded-full"
            >
              <Text className="text-white font-bold text-center">🥬 Lechuga</Text>
            </TouchableOpacity>

            {/* Botón Tomate */}
            <TouchableOpacity
              onPress={() => agregarIngrediente('tomate')}
              className="bg-red-600 px-6 py-3 rounded-full"
            >
              <Text className="text-white font-bold text-center">🍅 Tomate</Text>
            </TouchableOpacity>

            {/* Botón Carne */}
            <TouchableOpacity
              onPress={() => agregarIngrediente('carne')}
              className="bg-amber-700 px-6 py-3 rounded-full"
            >
              <Text className="text-white font-bold text-center">🥩 Carne</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Botón Eliminar Todo */}
        <TouchableOpacity
          onPress={eliminarTodo}
          className="bg-red-500 px-6 py-3 rounded-full mx-4"
          disabled={ingredientes.length === 0}
          style={{ opacity: ingredientes.length === 0 ? 0.5 : 1 }}
        >
          <Text className="text-white font-bold text-center">🗑️ Eliminar Todo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}