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

type Ingrediente = {
  tipo: 'lechuga' | 'tomate' | 'carne';
  id: number;
};

type IngredienteConPosicion = Ingrediente & {
  yPosition: number;
};

// Precios de ingredientes
const PRECIOS = {
  lechuga: 0.5,
  tomate: 0.75,
  carne: 2.5,
  base: 1.5
};

export default function HamburgerView() {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [contadorId, setContadorId] = useState(0);

  const agregarIngrediente = (tipo: 'lechuga' | 'tomate' | 'carne') => {
    setIngredientes([...ingredientes, { tipo, id: contadorId }]);
    setContadorId(contadorId + 1);
  };

  const eliminarTodo = () => {
    setIngredientes([]);
    setContadorId(0);
  };

  const calcularPosiciones = (): IngredienteConPosicion[] => {
    const posiciones: IngredienteConPosicion[] = [];
    let yActual = 0.25;
    const separacion = 0.12;

    ingredientes.forEach((ing) => {
      posiciones.push({ ...ing, yPosition: yActual });
      yActual += separacion;
    });

    return posiciones;
  };

  const posicionesIngredientes = calcularPosiciones();
  
  const yPanSuperior = ingredientes.length > 0 
    ? 0.25 + (ingredientes.length * 0.12) + 0.05
    : 0.35;
  
  const alturaPanBase = -0.05;
  const alturaPanSuperior = yPanSuperior;
  const centroY = (alturaPanBase + alturaPanSuperior) / 2;
  const desplazamiento = -centroY;

  const calcularPrecioTotal = (): number => {
    let total = PRECIOS.base;
    ingredientes.forEach((ing) => {
      total += PRECIOS[ing.tipo];
    });
    return total;
  };

  const precioTotal = calcularPrecioTotal();

  return (
    <View className="flex-1 bg-gradient-to-b from-gray-900 to-black">
      <Text className="text-white text-4xl font-bold text-center pt-16 pb-4 tracking-wider">
        Crea tu Hamburguesa
      </Text>
      
      {/* Canvas 3D */}
      <View className="flex-1 mx-4 my-2 bg-gray-800/30 rounded-3xl overflow-hidden">
        <Canvas 
          camera={{ position: [0, 0, 4], fov: 45 }}
          gl={{ antialias: true }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <directionalLight position={[-5, 3, -5]} intensity={0.6} />
          <pointLight position={[0, 5, 3]} intensity={0.8} color="#ffffff" />
          
          <Suspense fallback={null}>
            <IngredienteGiratorio 
              modelPath={panBase} 
              yPosition={-0.05 + desplazamiento} 
              scale={0.5}
            />
            
            {posicionesIngredientes.map((ing) => (
              <IngredienteGiratorio
                key={ing.id}
                modelPath={
                  ing.tipo === 'lechuga' ? lechuga :
                  ing.tipo === 'tomate' ? tomate : carne
                }
                yPosition={ing.yPosition + desplazamiento}
                scale={ing.tipo === 'lechuga' ? 0.6 : 0.5}
                xPosition={ing.tipo === 'lechuga' ? 0.05 : 0}
              />
            ))}
            
            <IngredienteGiratorio 
              modelPath={panSuperior} 
              yPosition={yPanSuperior + desplazamiento} 
              scale={0.5}
            />
          </Suspense>
        </Canvas>
      </View>

      {/* Panel de control */}
      <View className="pb-10 px-4">
        {/* Info panel */}
        <View className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-5 mb-4 mx-2 shadow-lg">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-300 text-base font-semibold">
              Ingredientes:
            </Text>
            <Text className="text-white text-lg font-bold">
              {ingredientes.length}
            </Text>
          </View>
          <View className="border-t border-gray-600 pt-3 flex-row justify-between items-center">
            <Text className="text-gray-300 text-base font-semibold">
              Precio Total:
            </Text>
            <Text className="text-green-400 text-2xl font-bold">
              ${precioTotal.toFixed(2)}
            </Text>
          </View>
        </View>
        
        {/* Botones de ingredientes */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="mb-4"
        >
          <View className="flex-row gap-3 px-2">
            <TouchableOpacity
              onPress={() => agregarIngrediente('lechuga')}
              className="bg-green-600 px-8 py-4 rounded-2xl shadow-lg"
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-base text-center">
                Lechuga
              </Text>
              <Text className="text-green-200 text-xs text-center mt-1">
                +${PRECIOS.lechuga.toFixed(2)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => agregarIngrediente('tomate')}
              className="bg-red-600 px-8 py-4 rounded-2xl shadow-lg"
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-base text-center">
                Tomate
              </Text>
              <Text className="text-red-200 text-xs text-center mt-1">
                +${PRECIOS.tomate.toFixed(2)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => agregarIngrediente('carne')}
              className="bg-amber-700 px-8 py-4 rounded-2xl shadow-lg"
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-base text-center">
                Carne
              </Text>
              <Text className="text-amber-200 text-xs text-center mt-1">
                +${PRECIOS.carne.toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Botón Eliminar */}
        <TouchableOpacity
          onPress={eliminarTodo}
          className="bg-red-500 px-8 py-4 rounded-2xl mx-4 shadow-lg"
          disabled={ingredientes.length === 0}
          style={{ opacity: ingredientes.length === 0 ? 0.4 : 1 }}
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-base text-center">
            Eliminar Todo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}