import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ShopData {
  id: string;
  name: string;
  logoUrl: string;
  isMall: boolean;
  storeType: string;
  sellerRating: number;
  shipOnTime: number;
  chatResponse: string | number;
}

interface ShopDetailsProps {
  storeId?: number | string;
  storeName?: string;
  productName?: string;
  productImage?: string;
  productId?: number | string;
}

const ShopDetails = ({
  storeId,
  storeName,
  productName,
  productImage,
  productId,
}: ShopDetailsProps) => {
  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [loading, setLoading] = useState(true);

  const [isFollowing, setIsFollowing] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const fetchShopData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockResponse: ShopData = {
        id: '123',
        name: 'ProMate',
        logoUrl:
          'https://play-lh.googleusercontent.com/QoiGnvynjBjtraueo9bqoSceqfJb6oMRmHl4qMd3D6qXzb5egnqS2HPmSVK0eSoUQIQ=w240-h480-rw', // Better placeholder with text
        isMall: true,
        storeType: 'Flagship Store',
        sellerRating: 95,
        shipOnTime: 100,
        chatResponse: '--',
      };

      setShopData(mockResponse);
      setLoading(false);
    };

    fetchShopData();
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isFollowing) {
      Alert.alert('Success', 'Store is following');
    } else {
    }
  }, [isFollowing]);

  const toggleFollow = () => {
    setIsFollowing((prev) => !prev);
  };

  const handleChatPress = () => {
    const chatId = storeId ?? shopData?.id ?? 'seller';
    router.push({
      pathname: '/screens/chat_screen/[chatId]',
      params: {
        chatId: String(chatId),
        storeId: storeId != null ? String(storeId) : '',
        storeName: storeName ?? shopData?.name ?? 'Store',
        productName: productName ?? 'Product',
        productImage: productImage ?? '',
        productId: productId != null ? String(productId) : '',
      },
    });
  };
  const getBadgeStatus = (percentage: number) => {
    if (percentage >= 75) {
      return { label: 'High', color: '#4CAF50', bg: '#E8F5E9' };
    } else if (percentage >= 50) {
      return { label: 'Medium', color: '#FF9800', bg: '#FFF3E0' };
    } else {
      return { label: 'Low', color: '#F44336', bg: '#FFEBEE' };
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#FF5722" />
      </View>
    );
  }

  if (!shopData) return null;

  const ratingStatus = getBadgeStatus(shopData.sellerRating);
  const shipStatus = getBadgeStatus(shopData.shipOnTime);

  return (
    <View style={styles.container}>
      {/* --- TOP SECTION: Logo, Name, Visit Button --- */}
      <View style={styles.topRow}>
        {/* Logo Wrapper */}
        <View style={styles.logoContainer}>
          {/* UPDATED: Now displaying the actual Image */}
          <Image
            source={{ uri: shopData.logoUrl }}
            style={styles.logoImage}
            resizeMode="cover"
          />

          <TouchableOpacity
            style={[styles.addBadge, isFollowing && styles.addBadgeActive]}
            onPress={toggleFollow}
            activeOpacity={0.8}
          >
            <Text style={styles.addBadgeText}>{isFollowing ? '✓' : '+'}</Text>
          </TouchableOpacity>
        </View>

        {/* Name & Badges */}
        <View style={styles.infoContainer}>
          <Text style={styles.shopName}>{shopData.name}</Text>

          {/* Mall / Flagship Badge */}
          {shopData.isMall && (
            <View style={styles.mallBadgeContainer}>
              <View style={styles.mallTag}>
                <Text style={styles.mallText}>Mall</Text>
              </View>
              <View style={styles.storeTypeTag}>
                <Text style={styles.storeTypeText}>{shopData.storeType}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.visitButton}>
            <Text style={styles.visitButtonText}>Visit Store</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatButton} onPress={handleChatPress}>
            <Text style={styles.chatButtonText}>Chat with Seller</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- BOTTOM SECTION: Stats Grid --- */}
      <View style={styles.statsContainer}>
        {/* Col 1: Seller Ratings */}
        <View style={styles.statItem}>
          <View style={styles.statValueRow}>
            <Text style={styles.statValue}>{shopData.sellerRating}%</Text>
            <View
              style={[
                styles.dynamicBadge,
                { backgroundColor: ratingStatus.bg },
              ]}
            >
              <Text
                style={[styles.dynamicBadgeText, { color: ratingStatus.color }]}
              >
                {ratingStatus.label}
              </Text>
            </View>
          </View>
          <Text style={styles.statLabel}>Seller Ratings</Text>
        </View>

        {/* Divider */}
        <View style={styles.verticalDivider} />

        {/* Col 2: Ship on Time */}
        <View style={styles.statItem}>
          <View style={styles.statValueRow}>
            <Text style={styles.statValue}>{shopData.shipOnTime}%</Text>
            <View
              style={[styles.dynamicBadge, { backgroundColor: shipStatus.bg }]}
            >
              <Text
                style={[styles.dynamicBadgeText, { color: shipStatus.color }]}
              >
                {shipStatus.label}
              </Text>
            </View>
          </View>
          <Text style={styles.statLabel}>Ship on Time</Text>
        </View>

        {/* Divider */}
        <View style={styles.verticalDivider} />

        {/* Col 3: Chat Response */}
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{shopData.chatResponse}</Text>
          <Text style={styles.statLabel} numberOfLines={1}>
            Chat Response...
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ShopDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 10,
    marginHorizontal: 16,
  },
  loadingContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* --- Top Row Styles --- */
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    position: 'relative',
    marginRight: 12,
  },
  logoImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  addBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#FF5722',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  addBadgeActive: {
    backgroundColor: '#4CAF50',
  },
  addBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: -2,
    textAlign: 'center',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  shopName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  mallBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mallTag: {
    backgroundColor: '#4A148C',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  mallText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  storeTypeTag: {
    borderWidth: 1,
    borderColor: '#4A148C',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  storeTypeText: {
    color: '#4A148C',
    fontSize: 10,
    fontWeight: '500',
  },
  actionButtons: {
    alignItems: 'flex-end',
    gap: 8,
  },
  visitButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  visitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  chatButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF5722',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  chatButtonText: {
    color: '#FF5722',
    fontWeight: '600',
    fontSize: 13,
  },

  /* --- Stats Row Styles --- */
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 8,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 6,
  },
  dynamicBadge: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  dynamicBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },
});
