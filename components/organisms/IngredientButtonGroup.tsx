import { ScrollView, View } from 'react-native';
import IngredientButton from '../molecules/IngredientButton';

interface IngredientButtonGroupProps {
  onAddIngredient: (tipo: 'lechuga' | 'tomate' | 'carne') => void;
  prices: {
    lechuga: number;
    tomate: number;
    carne: number;
  };
}

export default function IngredientButtonGroup({
  onAddIngredient,
  prices
}: IngredientButtonGroupProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      className="mb-4"
    >
      <View className="flex-row gap-3 px-2">
        <IngredientButton
          label="Lechuga"
          price={prices.lechuga}
          bgColor="bg-green-600"
          textColor="text-green-200"
          onPress={() => onAddIngredient('lechuga')}
        />
        
        <IngredientButton
          label="Tomate"
          price={prices.tomate}
          bgColor="bg-red-600"
          textColor="text-red-200"
          onPress={() => onAddIngredient('tomate')}
        />
        
        <IngredientButton
          label="Carne"
          price={prices.carne}
          bgColor="bg-amber-700"
          textColor="text-amber-200"
          onPress={() => onAddIngredient('carne')}
        />
      </View>
    </ScrollView>
  );
}
