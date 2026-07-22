import { useAuthStore } from '@/app/stores/useAuthStore';
import { useReviewsStore } from '@/app/stores/useReviewsStore';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const BASE_URL = process.env.EXPO_PUBLIC_APP_BASE_URL;

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  seller_id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  item_price: string;
  order_status: string;
}

interface Order {
  id: number;
  order_number: string;
  order_status: string;
  order_items: OrderItem[];
}

interface OrdersResponse {
  orders: Order[];
  message: string;
}

interface ToReviewProps {
  onCountChange?: (count: number) => void;
}

const ToReview = ({ onCountChange }: ToReviewProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const submittedReviews = useReviewsStore((state) => state.submittedReviews);
  const USER_EMAIL = user?.email;

  const fetchOrders = async () => {
    if (!BASE_URL || !USER_EMAIL) {
      setError(!USER_EMAIL ? 'User email not available.' : 'Base URL not configured.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BASE_URL}/api/orders/user_orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: USER_EMAIL }),
      });

      if (!response.ok) throw new Error('Failed to fetch orders.');

      const data: OrdersResponse = await response.json();
      setOrders(data.orders ?? []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Unable to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [USER_EMAIL]);

  const reviewedKeys = new Set(submittedReviews.map((r) => r.key));

  const pendingOrders = orders
    .filter((order) => order.order_status.toLowerCase() === 'delivered')
    .map((order) => ({
      ...order,
      order_items: order.order_items.filter(
        (item) => !reviewedKeys.has(`${order.id}-${item.product_id}`)
      ),
    }))
    .filter((order) => order.order_items.length > 0);

  useEffect(() => {
    const count = pendingOrders.reduce((sum, order) => sum + order.order_items.length, 0);
    onCountChange?.(count);
  }, [orders, submittedReviews]);

  const handleReviewPress = (order: Order, item: OrderItem) => {
    router.push({
      pathname: '/screens/my_reviews_screen/WriteReview',
      params: {
        orderId: String(order.id),
        productId: String(item.product_id),
        productName: item.product_name,
        productImage: item.product_image,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator size="small" color="#FF5722" />
        <Text style={styles.stateText}>Loading orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (pendingOrders.length === 0) {
    return (
      <View style={styles.stateContainer}>
        <Ionicons name="chatbox-ellipses-outline" size={40} color="#ccc" />
        <Text style={styles.stateText}>Nothing to review right now.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {pendingOrders.map((order) => (
        <View key={order.id} style={styles.orderCard}>
          <View style={styles.shopHeader}>
            <MaterialCommunityIcons name="storefront-outline" size={18} color="#000" />
            <Text style={styles.shopName}>{order.order_number}</Text>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </View>

          {order.order_items.map((item) => (
            <View key={`${order.id}-${item.id}`} style={styles.itemBlock}>
              <View style={styles.productRow}>
                <Image
                  source={{ uri: item.product_image }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {item.product_name}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.reviewBtn}
                  activeOpacity={0.7}
                  onPress={() => handleReviewPress(order, item)}
                >
                  <Text style={styles.reviewBtnText}>Review</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.gemsBanner}>
                <Text style={styles.gemsIcon}>💎</Text>
                <Text style={styles.gemsText}>
                  Earn max <Text style={styles.gemsBold}>600</Text> Gems (Rs. 6) by writing a
                  review!
                </Text>
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

export default ToReview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  stateText: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#FF5722',
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  orderCard: {
    padding: 15,
    borderBottomWidth: 8,
    borderBottomColor: '#F5F5F5',
  },
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  shopName: {
    fontSize: 15,
    fontWeight: '700',
    marginHorizontal: 6,
  },
  itemBlock: {
    marginBottom: 12,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 6,
    backgroundColor: '#E1E1E1',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  productName: {
    fontSize: 13.5,
    lineHeight: 18,
    color: '#222',
  },
  reviewBtn: {
    borderWidth: 1,
    borderColor: '#FF5722',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  reviewBtnText: {
    color: '#FF5722',
    fontWeight: '700',
    fontSize: 13,
  },
  gemsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F0',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
  },
  gemsIcon: {
    fontSize: 13,
    marginRight: 6,
  },
  gemsText: {
    fontSize: 12,
    color: '#555',
    flex: 1,
  },
  gemsBold: {
    color: '#e53935',
    fontWeight: '700',
  },
});
