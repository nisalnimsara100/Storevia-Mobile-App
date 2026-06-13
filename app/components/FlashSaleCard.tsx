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

const FlashSaleCard: React.FC<{ item: FlashSaleItem }> = ({ item }) => {
  const router = useRouter();

  const handleCardPress = () => {
    router.push({
      pathname: '/screens/item_details',
      params: { product: JSON.stringify(item) },
    });
  };

  return (
    <TouchableOpacity
      style={{
        width: scale(140),
        backgroundColor: '#fff',
        borderRadius: moderateScale(10),
        margin: scale(4),
        padding: scale(8),
        overflow: 'hidden',
      }}
      onPress={handleCardPress}
      activeOpacity={0.8}
    >
      <Image
        source={typeof item.image === 'string' ? { uri: item.image } : item.image}
        style={{ width: '100%', height: verticalScale(100), borderRadius: moderateScale(6) }}
        resizeMode="contain"
      />

      <Text
        style={{
          fontSize: moderateScale(10),
          color: '#ef4444',
          marginTop: verticalScale(6),
          fontWeight: '500',
        }}
      >
        Only {item.stock} left
      </Text>

      <View style={{ marginTop: verticalScale(4) }}>
        <Text
          style={{
            fontSize: moderateScale(14),
            color: '#f97316',
            fontWeight: '700',
          }}
        >
          Rs.{item.price}
        </Text>
        <Text
          style={{
            fontSize: moderateScale(10),
            color: '#9ca3af',
            textDecorationLine: 'line-through',
          }}
        >
          Rs.{item.oldPrice}
        </Text>
      </View>

      {/* Discount badge */}
      <View
        style={{
          position: 'absolute',
          top: scale(8),
          right: scale(8),
          backgroundColor: '#ef4444',
          paddingHorizontal: scale(5),
          paddingVertical: verticalScale(2),
          borderRadius: moderateScale(4),
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: moderateScale(10),
            fontWeight: '700',
          }}
        >
          -{item.discount}%
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default FlashSaleCard;
