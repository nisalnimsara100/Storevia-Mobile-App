import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
const USER_EMAIL = process.env.EXPO_PUBLIC_APP_EMAIL;

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
  cancel_reason: string | null;
}

interface Order {
  id: number;
  order_number: string;
  address_id: number;
  delivery_date: string | null;
  note: string | null;
  order_fee: string;
  voucher_discount_amount: string;
  order_cod: string;
  order_status: string;
  user_email: string;
  created_at: string;
  cancel_reason: string | null;
  order_items: OrderItem[];
  order_varients: unknown[];
}

interface OrdersResponse {
  orders: Order[];
  message: string;
}

const All = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (value: string | number) => {
    const parsed = typeof value === 'string' ? parseFloat(value) : value;
    if (Number.isNaN(parsed)) return String(value);
    return parsed.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized === 'cancelled' || normalized === 'canceled') return '#E53935';
    if (normalized === 'delivered') return '#4CAF50';
    if (normalized === 'placed') return '#FF5722';
    return '#4A90E2';
  };

  const getButtonsForStatus = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized === 'cancelled' || normalized === 'canceled') {
      return ['Cancelled', 'Buy again'];
    }
    if (normalized === 'delivered') {
      return ['Return/Refund', 'Buy again'];
    }
    return ['Buy again'];
  };

  const fetchOrders = async () => {
    if (!BASE_URL) {
      setError('Base URL not configured.');
      setLoading(false);
      return;
    }

    if (!USER_EMAIL) {
      setError('User email not available.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BASE_URL}/api/orders/user_orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email: USER_EMAIL }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders.');
      }

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
  }, []);

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

  if (orders.length === 0) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateText}>No orders yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {orders.map((order) => {
        const itemCount = order.order_items.reduce(
          (sum, item) => sum + (item.quantity ?? 0),
          0,
        );
        const buttons = getButtonsForStatus(order.order_status);

        return (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.shopHeader}>
              <View style={styles.shopInfo}>
                <MaterialCommunityIcons
                  name="storefront-outline"
                  size={18}
                  color="black"
                />
                <Text style={styles.shopName}>{order.order_number}</Text>
                <Ionicons name="chevron-forward" size={16} color="#999" />
              </View>
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(order.order_status) },
                ]}
              >
                {order.order_status}
              </Text>
            </View>

            {order.order_items.map((item, index) => (
              <View
                key={`${order.id}-${item.id}`}
                style={[
                  styles.productSection,
                  index > 0 && styles.productSectionSpacing,
                ]}
              >
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: item.product_image }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                </View>

                <View style={styles.productDetails}>
                  <Text style={styles.productTitle} numberOfLines={2}>
                    {item.product_name}
                  </Text>
                  <View style={styles.variantBadge}>
                    <Text style={styles.variantText}>
                      Delivery: {order.delivery_date ?? 'TBD'}
                    </Text>
                  </View>
                  <View style={styles.priceQtyRow}>
                    <Text style={styles.priceText}>
                      Rs. {formatPrice(item.item_price)}
                    </Text>
                    <Text style={styles.qtyText}>Qty: {item.quantity}</Text>
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Total({itemCount} Item{itemCount === 1 ? '' : 's'}):{' '}
                <Text style={styles.totalAmount}>
                  Rs. {formatPrice(order.order_fee)}
                </Text>
              </Text>
            </View>

            <View style={styles.buttonGroup}>
              {buttons.map((btn) => (
                <TouchableOpacity
                  key={`${order.id}-${btn}`}
                  style={[
                    styles.button,
                    btn === 'Buy again'
                      ? styles.primaryButton
                      : styles.secondaryButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      btn === 'Buy again'
                        ? styles.primaryButtonText
                        : styles.secondaryButtonText,
                    ]}
                  >
                    {btn}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

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
    backgroundColor: '#FFFFFF',
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
    borderBottomWidth: 12,
    borderBottomColor: '#F5F5F5', 
  },
  shopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  shopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopName: {
    fontSize: 15,
    fontWeight: '700',
    marginHorizontal: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
  productSection: {
    flexDirection: 'row',
  },
  productSectionSpacing: {
    marginTop: 14,
  },
  imageWrapper: {
    width: 90,
    height: 90,
    backgroundColor: '#E1E1E1', // If image fails, you will see a grey box
    borderRadius: 6,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productDetails: {
    flex: 1,
    marginLeft: 15,
  },
  productTitle: {
    fontSize: 14,
    lineHeight: 18,
    color: '#222',
  },
  variantBadge: {
    backgroundColor: '#F8F8F8',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
    marginTop: 8,
  },
  variantText: {
    fontSize: 12,
    color: '#777',
  },
  priceQtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '600',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    alignItems: 'flex-end',
    marginTop: 18,
  },
  totalLabel: {
    fontSize: 14,
    color: '#444',
  },
  totalAmount: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 4,
    marginLeft: 10,
    borderWidth: 1,
    minWidth: 115,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#FF5722',
    borderColor: '#FF5722',
  },
  secondaryButton: {
    backgroundColor: '#FFF',
    borderColor: '#D1D1D1',
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  buttonText: {
    fontSize: 14,
  }
});

export default All;