import { Text } from 'react-native';

interface IngredientCountProps {
  count: number;
}

export default function IngredientCount({ count }: IngredientCountProps) {
  return (
    <Text className="text-white text-lg font-bold">
      {count}
    </Text>
  );
}