import { Text, TouchableOpacity } from 'react-native';

interface IngredientButtonProps {
  label: string;
  price: number;
  bgColor: string;
  textColor: string;
  onPress: () => void;
}

export default function IngredientButton({
  label,
  price,
  bgColor,
  textColor,
  onPress
}: IngredientButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${bgColor} px-8 py-4 rounded-2xl`}
      activeOpacity={0.7}
    >
      <Text className="text-white font-bold text-base text-center">
        {label}
      </Text>
      <Text className={`${textColor} text-xs text-center mt-1`}>
        +${price.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
}