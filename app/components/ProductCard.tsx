import React from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface ProductItem {
  id: number;
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
  const router = useRouter();
  
  const handleCardPress = () => {
    router.push({
      pathname: '/screens/item_details',
      params: { itemId: item.id.toString() }
    });
  };
  
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        margin: 4,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
      }}
      onPress={handleCardPress}
      activeOpacity={0.8}
    >
      {/* Image with badges overlay */}
      <View style={{ position: 'relative' }}>
        <Image
          source={
            typeof item.image === 'string' ? { uri: item.image } : item.image
          }
          style={{
            width: '100%',
            height: 112,
            borderRadius: 6,
          }}
          resizeMode="contain"
        />

        {/* Badges above image */}
        <View
          style={{
            position: 'absolute',
            bottom: 4,
            left: 4,
            flexDirection: 'row',
          }}
        >
          <Text
            style={{
              fontSize: 10,
              backgroundColor: '#fff3e0',
              color: '#e65100',
              paddingHorizontal: 4,
              paddingVertical: 2,
              borderRadius: 4,
              marginRight: 4,
            }}
          >
            FREE DELIVERY
          </Text>
        </View>
      </View>
      {/* Title */}
      <Text
        style={{
          fontSize: 14,
          fontWeight: '500',
          marginTop: 8,
          color: '#333',
        }}
        numberOfLines={2}
      >
        {item.name}
      </Text>
      {/* Price + Old Price + Discount */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
        <Text style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: 16 }}>
          Rs.{item.price}
        </Text>
        <Text style={{ fontSize: 12, color: '#999', textDecorationLine: 'line-through', marginLeft: 4 }}>
          Rs.{item.oldPrice}
        </Text>
        <Text style={{ fontSize: 12, color: '#388e3c', marginLeft: 4 }}>-{item.discount}%</Text>
      </View>
      {/* Rating + Sold */}
      <Text
        style={{
          fontSize: 12,
          color: '#666',
          marginTop: 4,
        }}
      >
        ⭐ {item.rating} ({item.reviews}) | {item.sold} Sold
      </Text>



      {/* Badges */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
        {item.badges?.map((badge, i) => (
          <Text
            key={i}
            style={{
              fontSize: 10,
              backgroundColor: '#e8f5e9',
              color: '#2e7d32',
              padding: 4,
              borderRadius: 4,
              marginRight: 4,
              marginBottom: 12,
            }}
          >
            {badge}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );
}
