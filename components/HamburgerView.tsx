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

  // Rotación automática
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
  base: 1.5 // Precio base de los panes
};

export default function HamburgerView() {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [contadorId, setContadorId] = useState(0);

  // Agregar ingrediente
  const agregarIngrediente = (tipo: 'lechuga' | 'tomate' | 'carne') => {
    setIngredientes([...ingredientes, { tipo, id: contadorId }]);
    setContadorId(contadorId + 1);
  };

  // Eliminar todo (deja solo los panes)
  const eliminarTodo = () => {
    setIngredientes([]);
    setContadorId(0);
  };

  // Calcular posiciones dinámicamente - cada ingrediente se apila sobre el anterior
  const calcularPosiciones = (): IngredienteConPosicion[] => {
    const posiciones: IngredienteConPosicion[] = [];
    let yActual = 0.25; // Posición inicial sobre el pan base
    const separacion = 0.12; // Espacio entre ingredientes

    ingredientes.forEach((ing) => {
      posiciones.push({ ...ing, yPosition: yActual });
      yActual += separacion;
    });

    return posiciones;
  };

  const posicionesIngredientes = calcularPosiciones();
  
  // Pan superior se posiciona encima del último ingrediente o en posición base si no hay ingredientes
  const yPanSuperior = ingredientes.length > 0 
    ? 0.25 + (ingredientes.length * 0.12) + 0.05
    : 0.35;
  
  // Calcular el centro Y de toda la hamburguesa para desplazar TODO el modelo
  const alturaPanBase = -0.05;
  const alturaPanSuperior = yPanSuperior;
  const centroY = (alturaPanBase + alturaPanSuperior) / 2;
  const desplazamiento = -centroY; // Desplazamos todo para centrar en Y=0

  // Calcular precio total
  const calcularPrecioTotal = (): number => {
    let total = PRECIOS.base; // Precio base (panes)
    ingredientes.forEach((ing) => {
      total += PRECIOS[ing.tipo];
    });
    return total;
  };

  const precioTotal = calcularPrecioTotal();

  return (
    <View className="flex-1 bg-black">
      <Text className="text-white text-4xl font-bold text-center pt-16 pb-4 tracking-wider">
        Crea tu Hamburguesa
      </Text>
      
      {/* Canvas 3D - Aquí se renderiza la hamburguesa */}
      <View className="flex-1 mx-4 my-2">
        <Canvas 
          camera={{ position: [0, 0, 4], fov: 45 }}
          gl={{ antialias: true }}
        >
          {/* Iluminación */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <directionalLight position={[-5, 3, -5]} intensity={0.6} />
          <pointLight position={[0, 5, 3]} intensity={0.8} color="#ffffff" />
          
          <Suspense fallback={null}>
            {/* Pan Base - SIEMPRE visible */}
            <IngredienteGiratorio 
              modelPath={panBase} 
              yPosition={-0.05 + desplazamiento} 
              scale={0.5}
            />
            
            {/* Ingredientes agregados - se apilan dinámicamente */}
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
            
            {/* Pan Superior - SIEMPRE visible, se mueve según ingredientes */}
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
        {/* Contador de precio e ingredientes */}
        <View className="bg-gray-800 rounded-2xl p-4 mb-4 mx-2">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-300 text-base font-semibold">
              Ingredientes:
            </Text>
            <Text className="text-white text-lg font-bold">
              {ingredientes.length}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-300 text-base font-semibold">
              Precio Total:
            </Text>
            <Text className="text-green-400 text-2xl font-bold">
              ${precioTotal.toFixed(2)}
            </Text>
          </View>
        </View>
        
        {/* Botones para agregar ingredientes */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="mb-4"
        >
          <View className="flex-row gap-3 px-2">
            <TouchableOpacity
              onPress={() => agregarIngrediente('lechuga')}
              className="bg-green-600 px-8 py-4 rounded-2xl"
              activeOpacity={0.7}
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
              className="bg-red-600 px-8 py-4 rounded-2xl"
              activeOpacity={0.7}
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
              className="bg-amber-700 px-8 py-4 rounded-2xl"
              activeOpacity={0.7}
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

        {/* Botón Eliminar Todo */}
        <TouchableOpacity
          onPress={eliminarTodo}
          className="bg-red-500 px-8 py-4 rounded-2xl mx-4"
          disabled={ingredientes.length === 0}
          style={{ opacity: ingredientes.length === 0 ? 0.4 : 1 }}
          activeOpacity={0.7}
        >
          <Text className="text-white font-bold text-base text-center">
            Eliminar Todo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}