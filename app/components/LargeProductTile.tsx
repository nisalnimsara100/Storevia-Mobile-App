import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

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
      params: { product: JSON.stringify(item) },
    });
  };

  const formatNumber = (n?: number) => {
    if (n === undefined || n === null) return '0';
    if (n < 1000) return String(n);
    if (n < 1_000_000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k';
    return (n / 1_000_000).toFixed(1) + 'M';
  };

  return (
    <TouchableOpacity
      style={{
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: moderateScale(10),
        margin: scale(4),
        overflow: 'hidden',
      }}
      onPress={handleCardPress}
      activeOpacity={0.9}
    >
      {/* Image */}
      <View style={{ width: '100%', height: verticalScale(160) }}>
        <Image
          source={typeof item.image === 'string' ? { uri: item.image } : item.image}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />

        {/* Bottom badge strip */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            flexDirection: 'row',
          }}
        >
          <View
            style={{
              backgroundColor: '#16a34a',
              paddingHorizontal: scale(6),
              paddingVertical: verticalScale(3),
            }}
          >
            <Text
              style={{ color: '#fff', fontSize: moderateScale(9), fontWeight: '700' }}
            >
              FREE DELIVERY
            </Text>
          </View>
          <View
            style={{
              backgroundColor: '#7c3aed',
              paddingHorizontal: scale(6),
              paddingVertical: verticalScale(3),
            }}
          >
            <Text
              style={{ color: '#fff', fontSize: moderateScale(9), fontWeight: '700' }}
            >
              GEMS
            </Text>
          </View>
        </View>
      </View>

      {/* Body */}
      <View style={{ padding: scale(8) }}>
        <Text
          style={{
            fontSize: moderateScale(13),
            fontWeight: '400',
            color: '#111827',
            lineHeight: verticalScale(18),
          }}
          numberOfLines={2}
        >
          {item.name}
        </Text>

        {/* Price row */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            marginTop: verticalScale(4),
          }}
        >
          <Text
            style={{
              color: '#f97316',
              fontWeight: '700',
              fontSize: moderateScale(16),
            }}
          >
            Rs.{item.price.toFixed(2)}
          </Text>
          {item.discount !== undefined && item.discount > 0 && (
            <Text
              style={{
                color: '#ef4444',
                fontSize: moderateScale(12),
                fontWeight: '600',
                marginLeft: scale(6),
              }}
            >
              -{item.discount}%
            </Text>
          )}
        </View>

        {/* Gems badges */}
        {item.badges && item.badges.length > 0 && (
          <View style={{ marginTop: verticalScale(4) }}>
            {item.badges.map((b, i) => (
              <View
                key={i}
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: '#f3e8ff',
                  borderWidth: 1,
                  borderColor: '#d8b4fe',
                  paddingHorizontal: scale(8),
                  paddingVertical: verticalScale(3),
                  borderRadius: moderateScale(6),
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Ionicons
                  name="diamond"
                  size={moderateScale(10)}
                  color="#7c3aed"
                  style={{ marginRight: scale(3) }}
                />
                <Text
                  style={{
                    color: '#7c3aed',
                    fontSize: moderateScale(10),
                    fontWeight: '600',
                  }}
                >
                  {b}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Rating + Sold */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: verticalScale(4),
          }}
        >
          <Ionicons name="star" size={moderateScale(12)} color="#fbbf24" />
          <Text
            style={{
              fontSize: moderateScale(11),
              color: '#6b7280',
              marginLeft: scale(3),
            }}
          >
            {item.rating ?? '-'}
          </Text>
          <Text
            style={{
              fontSize: moderateScale(11),
              color: '#9ca3af',
              marginLeft: scale(3),
            }}
          >
            ({item.reviews ?? 0})
          </Text>
          <Text
            style={{
              fontSize: moderateScale(11),
              color: '#9ca3af',
              marginLeft: scale(6),
            }}
          >
            | {formatNumber(item.sold)} Sold
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
