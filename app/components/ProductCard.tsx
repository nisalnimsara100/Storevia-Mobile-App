import React from 'react';
import { Image, Text, View } from 'react-native';

interface ProductItem {
  image: string | { uri: string };
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  badges?: string[];
  rating?: number;
  reviews?: number;
  sold?: number;
}

export default function ProductCard({ item }: { item: ProductItem }) {
  return (
    <View className="flex-1 bg-white rounded-xl m-1 p-2 shadow">
      {/* Image with badges overlay */}
      <View className="relative">
        <Image
          source={
            typeof item.image === 'string' ? { uri: item.image } : item.image
          }
          className="w-full h-28 rounded-md"
          resizeMode="contain"
        />

        {/* Badges above image */}
        <View className="absolute bottom-1 left-1 flex-row">
          
            <Text
              className="text-[10px] bg-orange-100 text-orange-700 px-1 py-0.5 rounded mr-1"
            >
              FREE DELIVARY
            </Text>
         
        </View>
      </View>
      {/* Title */}
      <Text
        className="text-sm font-medium mt-2 text-gray-800"
        numberOfLines={2}
      >
        {item.name}
      </Text>
      {/* Price + Old Price + Discount */}
      <View className="flex-row items-center mt-1">
        <Text className="text-red-600 font-bold text-base">
          Rs.{item.price}
        </Text>
        <Text className="text-xs text-gray-400 line-through ml-1">
          Rs.{item.oldPrice}
        </Text>
        <Text className="text-xs text-green-600 ml-1">-{item.discount}%</Text>
      </View>
      {/* Rating + Sold */}
      <Text className="text-xs text-gray-500 mt-1">
        ⭐ {item.rating} ({item.reviews}) | {item.sold} Sold
      </Text>



      {/* Badges */}
      <View className="flex-row flex-wrap mt-1">
        {item.badges?.map((badge, i) => (
          <Text
            key={i}
            className="text-[10px] bg-green-100 text-green-700 p-1 rounded mr-1 mb-3"
          >
            {badge}
            {badge}{' '}
          </Text>
        ))}{' '}
      </View>
    </View>
  );
}
