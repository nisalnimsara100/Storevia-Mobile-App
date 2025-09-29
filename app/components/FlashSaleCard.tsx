import React from 'react';
import { Image, Text, View } from 'react-native';

type FlashSaleItem = {
  image: any;
  stock: number;
  price: number;
  oldPrice: number;
  discount: number;
};

type FlashSaleCardProps = {
  item: FlashSaleItem;
};

const FlashSaleCard: React.FC<FlashSaleCardProps> = ({ item }) => {
  return (
    <View className="w-36 bg-white rounded-xl p-2 m-2 shadow">
      <Image
        source={
          typeof item.image === 'string' ? { uri: item.image } : item.image
        }
        className="w-full h-24 rounded-md"
        resizeMode="contain"
      />

      {/* Stock left */}
      <Text className="text-xs text-red-600 mt-1 font-medium">
        Only {item.stock} left
      </Text>

      {/* Price */}
      <View className="mt-1">
        <Text className="text-primary font-bold">Rs.{item.price}</Text>
        <Text className="text-xs text-gray-400 line-through">
          Rs.{item.oldPrice}
        </Text>
      </View>

      {/* Discount Badge */}
      <View className="absolute bottom-2 right-2 bg-red-500 px-1.5 py-0.5 rounded">
        <Text className="text-white text-xs font-semibold">
          -{item.discount}%
        </Text>
      </View>
    </View>
  );
};

export default FlashSaleCard;
