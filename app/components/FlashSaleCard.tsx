import React from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

type FlashSaleItem = {
  id: number;
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
  const router = useRouter();
  
  const handleCardPress = () => {
    router.push({
      pathname: '/screens/item_details',
      params: {
        product: JSON.stringify(item),
      },
    });
  };
  
  return (
    <TouchableOpacity
      style={{ width: scale(140) }}
      className="bg-white rounded-xl p-2 m-2 shadow"
      onPress={handleCardPress}
      activeOpacity={0.8}
    >
      <Image
        source={
          typeof item.image === 'string' ? { uri: item.image } : item.image
        }
        style={{ width: '100%', height: verticalScale(100) }}
        className="rounded-md"
        resizeMode="contain"
      />

      {/* Stock left */}
      <Text style={{ fontSize: moderateScale(10) }} className="text-red-600 mt-1 font-medium">
        Only {item.stock} left
      </Text>

      {/* Price */}
      <View className="mt-1">
        <Text style={{ fontSize: moderateScale(14) }} className="text-primary font-bold">Rs.{item.price}</Text>
        <Text style={{ fontSize: moderateScale(10) }} className="text-gray-400 line-through">
          Rs.{item.oldPrice}
        </Text>
      </View>

      {/* Discount Badge */}
      <View className="absolute bottom-2 right-2 bg-red-500 px-1.5 py-0.5 rounded">
        <Text style={{ fontSize: moderateScale(10) }} className="text-white font-semibold">
          -{item.discount}%
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default FlashSaleCard;
