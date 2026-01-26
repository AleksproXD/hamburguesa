import { useState } from 'react';
import { Text, View } from 'react-native';
import '../global.css';

import carne from '../assets/3D/Carne.glb';
import lechuga from '../assets/3D/lechuga.glb';
import panSuperior from '../assets/3D/pan.glb';
import panBase from '../assets/3D/pan2.glb';
import tomate from '../assets/3D/tomate.glb';

import HamburgerCanvas from './organisms/HamburgerCanvas';
import ControlPanel from './organisms/ControlPanel';

type Ingrediente = {
  tipo: 'lechuga' | 'tomate' | 'carne';
  id: number;
};

type IngredienteConPosicion = Ingrediente & {
  yPosition: number;
};

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
  const models = { panBase, panSuperior, lechuga, tomate, carne };

  const ingredientesConDesplazamiento = posicionesIngredientes.map(ing => ({
    ...ing,
    yPosition: ing.yPosition + desplazamiento
  }));

  return (
    <View className="flex-1 bg-slate-900">
      <Text className="text-white text-4xl font-bold text-center pt-16 pb-4">
        MCalex
      </Text>
      
      <HamburgerCanvas
        ingredients={ingredientesConDesplazamiento}
        panSuperiorY={yPanSuperior + desplazamiento}
        panBaseY={-0.05 + desplazamiento}
        models={models}
      />

      <ControlPanel
        ingredientCount={ingredientes.length}
        totalPrice={precioTotal}
        onAddIngredient={agregarIngrediente}
        onClearAll={eliminarTodo}
        prices={PRECIOS}
      />
    </View>
  );
}