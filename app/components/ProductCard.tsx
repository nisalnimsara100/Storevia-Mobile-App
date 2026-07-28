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
  cod?: number;
}

export default function ProductCard({ item }: { item: ProductItem }) {
  const router = useRouter();

  const handleCardPress = () => {
    router.push({
      pathname: '/screens/item_details',
      params: { itemId: item.id.toString() },
    });
  };

  return (
    <TouchableOpacity
      style={{
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 4,
        padding: 8,
      }}
      onPress={handleCardPress}
      activeOpacity={0.8}
    >
      <View style={{ position: 'relative' }}>
        <Image
          source={typeof item.image === 'string' ? { uri: item.image } : item.image}
          style={{ width: '100%', height: 112, borderRadius: 6 }}
          resizeMode="contain"
        />
        {Number(item.cod) === 0 && (
          <View style={{ position: 'absolute', bottom: 4, left: 4 }}>
            <Text
              style={{
                fontSize: 10,
                backgroundColor: '#fff7ed',
                color: '#f97316',
                paddingHorizontal: 4,
                paddingVertical: 2,
                borderRadius: 4,
              }}
            >
              FREE DELIVERY
            </Text>
          </View>
        )}
      </View>

      <Text
        style={{ fontSize: 13, fontWeight: '500', marginTop: 8, color: '#111827' }}
        numberOfLines={2}
      >
        {item.name}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
        <Text style={{ color: '#f97316', fontWeight: '700', fontSize: 14 }}>
          Rs.{item.price}
        </Text>
        {item.oldPrice && (
          <Text
            style={{
              fontSize: 11,
              color: '#9ca3af',
              textDecorationLine: 'line-through',
              marginLeft: 4,
            }}
          >
            Rs.{item.oldPrice}
          </Text>
        )}
        {item.discount ? (
          <Text style={{ fontSize: 11, color: '#ef4444', marginLeft: 4 }}>
            -{item.discount}%
          </Text>
        ) : null}
      </View>

      <Text style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
        ⭐ {item.rating} ({item.reviews}) · {item.sold} Sold
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
        {item.badges?.map((badge, i) => (
          <Text
            key={i}
            style={{
              fontSize: 10,
              backgroundColor: '#f0fdf4',
              color: '#16a34a',
              padding: 4,
              borderRadius: 4,
              marginRight: 4,
              marginBottom: 4,
            }}
          >
            {badge}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );
}
