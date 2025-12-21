import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface ProductItem {
  id: number;
  image: string | { uri: string };
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  badges?: string[];
  tags?: string[];
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
  
  const formatNumber = (n?: number) => {
    if (n === undefined || n === null) return '0';
    if (n < 1000) return String(n);
    if (n < 1000000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k';
    return (n / 1000000).toFixed(1) + 'M';
  };
  
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 4,
        padding: 0,
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
      <View style={{ position: 'relative', width: '100%', height: 160 }}>
        <Image
          source={typeof item.image === 'string' ? { uri: item.image } : item.image}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />

        {/* Connected badges at bottom-left (smaller + inset) */}
        <View style={{ position: 'absolute', bottom: 0, left: 0, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#4a8b71', paddingHorizontal: 6, paddingVertical: 4, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
              <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: '#fff', fontSize: 9, fontWeight: '700', letterSpacing: -0.5 }}>FREE DELIVERY</Text>
            </View>
            <View style={{ backgroundColor: '#b67ba5', paddingHorizontal: 3, paddingVertical: 4, borderTopRightRadius: 5, borderBottomRightRadius: 5, flexDirection: 'row', alignItems: 'center' }}>
              <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: '#fff', fontSize: 9, fontWeight: '700', letterSpacing: -0.5 }}>GEMS</Text>
            </View>
        </View>
      </View>

      {/* Body content */}
      <View style={{ padding: 8 }}>
        <Text style={{ fontSize: 13, fontWeight: '400', color: '#333', lineHeight: 18 }} numberOfLines={2}>
          {item.name}
        </Text>

        {/* Price row */}
        <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 4 }}>
          <Text style={{ color: '#ff5722', fontWeight: '700', fontSize: 18 }}>Rs.{item.price}</Text>
          {item.discount !== undefined && (
            <Text style={{ color: '#ff5722', fontSize: 13, fontWeight: '600', marginLeft: 6 }}>-{item.discount}%</Text>
          )}
        </View>

        {/* Gems save pill */}
        {item.badges && item.badges.length > 0 && (
          <View style={{ marginTop: 4 }}>
            {item.badges.map((b, i) => (
              <View key={i} style={{ alignSelf: 'flex-start', backgroundColor: '#b67ba5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="diamond" size={10} color="#fff" style={{ marginRight: 4 }} />
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600', letterSpacing: -0.2 }}>{b}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Rating + Sold */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Ionicons name="star" size={14} color="#ffc107" />
          <Text style={{ fontSize: 12, color: '#888', marginLeft: 3, fontWeight: '500' }}>{item.rating ?? '-'}</Text>
          <Text style={{ fontSize: 11, color: '#aaa', marginLeft: 3 }}>({item.reviews ?? 0})</Text>
          <Text style={{ fontSize: 11, color: '#aaa', marginLeft: 6 }}>| {formatNumber(item.sold)} Sold</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
