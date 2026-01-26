import { Text, TouchableOpacity, View } from 'react-native';
import StatsPanel from '../molecules/StatsPanel';
import IngredientButtonGroup from './IngredientButtonGroup';

interface ControlPanelProps {
  ingredientCount: number;
  totalPrice: number;
  onAddIngredient: (tipo: 'lechuga' | 'tomate' | 'carne') => void;
  onClearAll: () => void;
  prices: {
    lechuga: number;
    tomate: number;
    carne: number;
  };
}

export default function ControlPanel({
  ingredientCount,
  totalPrice,
  onAddIngredient,
  onClearAll,
  prices
}: ControlPanelProps) {
  return (
    <View className="pb-10 px-4">
      <StatsPanel 
        ingredientCount={ingredientCount}
        totalPrice={totalPrice}
      />
      
      <IngredientButtonGroup 
        onAddIngredient={onAddIngredient}
        prices={prices}
      />

      <TouchableOpacity
        onPress={onClearAll}
        className="bg-red-500 px-8 py-4 rounded-2xl mx-4"
        disabled={ingredientCount === 0}
        style={{ opacity: ingredientCount === 0 ? 0.4 : 1 }}
        activeOpacity={0.7}
      >
        <Text className="text-white font-bold text-base text-center">
          Eliminar Todo
        </Text>
      </TouchableOpacity>
    </View>
  );
}