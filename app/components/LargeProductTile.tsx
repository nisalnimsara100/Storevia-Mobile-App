import React from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

export default function LargeProductTile({ item }: { item: ProductItem }) {
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
        margin: 6,
        padding: 0,
        // subtle card shadow (Android/iOS)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
        overflow: 'hidden',
      }}
      onPress={handleCardPress}
      activeOpacity={0.9}
    >
      {/* Image with badges overlay */}
      <View style={{ position: 'relative', width: '100%', height: 140 }}>
        <Image
          source={typeof item.image === 'string' ? { uri: item.image } : item.image}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />

        {/* Badges above image (bottom-left) */}
        <View style={{ position: 'absolute', bottom: 8, left: 8, flexDirection: 'row' }}>
          <View style={{ backgroundColor: '#1f8f6f', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 6 }}>
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>FREE DELIVERY</Text>
          </View>
          <View style={{ backgroundColor: '#b37aa6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>GEMS</Text>
          </View>
        </View>
      </View>

      {/* Body content (title, price, badges, rating) */}
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: '#111' }} numberOfLines={2}>
          {item.name}
        </Text>

        {/* Price row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: '#ff6b35', fontWeight: '800', fontSize: 18 }}>Rs.{item.price}</Text>
            {item.oldPrice !== undefined && (
              <Text style={{ fontSize: 12, color: '#999', textDecorationLine: 'line-through', marginLeft: 8 }}>Rs.{item.oldPrice}</Text>
            )}
            {item.discount !== undefined && (
              <View style={{ backgroundColor: '#fff2f0', borderWidth: 1, borderColor: '#ffb4a6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 8 }}>
                <Text style={{ color: '#d84315', fontSize: 12, fontWeight: '700' }}>-{item.discount}%</Text>
              </View>
            )}
          </View>
        </View>

        {/* Gems save pill */}
        {item.badges && item.badges.length > 0 && (
          <View style={{ marginTop: 8 }}>
            {item.badges.map((b, i) => (
              <View key={i} style={{ alignSelf: 'flex-start', backgroundColor: '#efcde6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginBottom: 6 }}>
                <Text style={{ color: '#7a3b6b', fontSize: 12, fontWeight: '600' }}>{b}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Rating + Sold */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Ionicons name="star" size={14} color="#f6c84c" />
          <Text style={{ fontSize: 12, color: '#666', marginLeft: 6 }}>{item.rating ?? '-'} ({item.reviews ?? 0})</Text>
          <Text style={{ fontSize: 12, color: '#999', marginLeft: 8 }}>| {item.sold ?? 0} Sold</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}