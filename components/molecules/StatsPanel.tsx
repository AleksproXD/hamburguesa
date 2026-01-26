import { Text, View } from 'react-native';

interface StatsPanelProps {
  ingredientCount: number;
  totalPrice: number;
}

export default function StatsPanel({ 
  ingredientCount, 
  totalPrice 
}: StatsPanelProps) {
  return (
    <View className="bg-gray-800 rounded-2xl p-4 mb-4 mx-2">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-gray-300 text-base font-semibold">
          Ingredientes:
        </Text>
        <Text className="text-white text-lg font-bold">
          {ingredientCount}
        </Text>
      </View>
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-300 text-base font-semibold">
          Precio Total:
        </Text>
        <Text className="text-green-400 text-2xl font-bold">
          ${totalPrice.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}