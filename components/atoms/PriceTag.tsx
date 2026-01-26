import { Text, View } from 'react-native';

interface PriceTagProps {
  label: string;
  value: string;
  valueColor?: string;
  valueSize?: string;
}

export default function PriceTag({ 
  label, 
  value, 
  valueColor = 'text-white',
  valueSize = 'text-lg'
}: PriceTagProps) {
  return (
    <View className="flex-row justify-between items-center">
      <Text className="text-gray-300 text-base font-semibold">
        {label}
      </Text>
      <Text className={`${valueColor} ${valueSize} font-bold`}>
        {value}
      </Text>
    </View>
  );
}