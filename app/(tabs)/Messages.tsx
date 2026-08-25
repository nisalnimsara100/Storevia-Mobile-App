import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useAuthStore } from '@/app/stores/useAuthStore';

const BASE_URL = process.env.EXPO_PUBLIC_APP_BASE_URL;

// Type definitions
interface OrderMessage {
  id: number;
  type: 'order';
  title: string;
  date: string;
  content: string;
  orderNumber: string;
  status: string;
}
interface DeliveryMessage {
  id: number;
  type: 'delivery';
  title: string;
  date: string;
  content: string;
  orderNumber: string;
  deliveryStatus: string;
  deliveryTime: string;
}

// Shape returned by the same /api/orders/user_orders endpoint used in
// my_orders_screen/All.tsx (only the fields this screen actually uses).
interface ApiOrderItem {
  product_name: string;
}

interface ApiOrder {
  id: number;
  order_number: string;
  delivery_date: string | null;
  order_status: string;
  created_at: string;
  order_items: ApiOrderItem[];
}

interface OrdersResponse {
  orders: ApiOrder[];
}

type Message = OrderMessage | DeliveryMessage;

const Messages: React.FC = () => {
  const [orderMessages, setOrderMessages] = useState<OrderMessage[]>([]);
  const [deliveryMessages, setDeliveryMessages] = useState<DeliveryMessage[]>(
    [],
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const user = useAuthStore((state) => state.user);
  const insets = useSafeAreaInsets();

  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Describe an order's items without fabricating any content that isn't
  // actually in the API response.
  const describeItems = (items: ApiOrderItem[]): string => {
    if (!items?.length) return 'Order update';
    const [first] = items;
    return items.length > 1
      ? `${first.product_name} and ${items.length - 1} other item${items.length > 2 ? 's' : ''}`
      : first.product_name;
  };

  const loadMessages = useCallback(async (): Promise<void> => {
    if (!BASE_URL || !user?.email) {
      setOrderMessages([]);
      setDeliveryMessages([]);
      return;
    }

    try {
      setRefreshing(true);

      const response = await fetch(`${BASE_URL}/api/orders/user_orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders.');
      }

      const data: OrdersResponse = await response.json();
      const orders = data.orders ?? [];

      const delivered: DeliveryMessage[] = [];
      const inProgress: OrderMessage[] = [];

      orders.forEach((order) => {
        const content = describeItems(order.order_items);

        if (order.order_status?.toLowerCase() === 'delivered') {
          delivered.push({
            id: order.id,
            type: 'delivery',
            title: 'Order Delivered',
            date: formatDate(order.created_at),
            content,
            orderNumber: order.order_number,
            deliveryStatus: order.order_status,
            deliveryTime: formatDate(order.delivery_date ?? order.created_at),
          });
        } else {
          inProgress.push({
            id: order.id,
            type: 'order',
            title: 'Order Update',
            date: formatDate(order.created_at),
            content,
            orderNumber: order.order_number,
            status: order.order_status,
          });
        }
      });

      setOrderMessages(inProgress);
      setDeliveryMessages(delivered);
    } catch (error) {
      console.error('Error loading order messages:', error);
      setOrderMessages([]);
      setDeliveryMessages([]);
    } finally {
      setRefreshing(false);
    }
  }, [user?.email]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Event handlers
  const onRefresh = (): void => {
    loadMessages();
  };

  const handleChatPress = (): void => {
    router.push('/screens/chat_screen');
  };

  const handleOrdersPress = (): void => {
    router.push('/screens/my_orders_screen');
  };

  const handleVouchersPress = (): void => {
    router.push('/screens/voucher_screen');
  };

  const handlePromosPress = (): void => {
    // Navigate to the promos screen using expo-router
    router.push('/screens/promos_screen');
  };

  const handleStartShopping = (): void => {
    Alert.alert('Shopping', 'Redirecting to shopping...');
  };

  const handleMessagePress = (message: Message): void => {
    if (!message?.title) {
      Alert.alert('Error', 'Invalid message data');
      return;
    }
    Alert.alert(
      'Message Details',
      `Type: ${message.type}\nTitle: ${message.title}\nDate: ${message.date}`,
    );
  };

  // Render order message
  const renderOrderMessage = (message: OrderMessage) => (
    <TouchableOpacity
      key={message.id}
      style={styles.orderMessageContainer}
      onPress={() => handleMessagePress(message)}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderIconContainer}>
          <Ionicons name="bag" size={20} color="#FF6B35" />
        </View>
        <Text style={styles.orderTitle} numberOfLines={2}>
          {message.title}
        </Text>
      </View>
      <Text style={styles.messageDate}>{message.date}</Text>
      <View style={styles.orderContent}>
        <View style={styles.orderImageContainer}>
          <Ionicons name="bag-outline" size={40} color="#FF6B35" />
        </View>
        <View style={styles.orderTextContainer}>
          <Text style={styles.orderText} numberOfLines={3}>
            {message.content}
          </Text>
          <Text style={styles.orderNumber}>{message.orderNumber}</Text>
          <Text style={styles.orderStatus}>Status: {message.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render delivery message
  const renderDeliveryMessage = (message: DeliveryMessage) => (
    <TouchableOpacity
      key={message.id}
      style={styles.deliveryMessageContainer}
      onPress={() => handleMessagePress(message)}
    >
      <View style={styles.deliveryHeader}>
        <View style={styles.deliveryIconContainer}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
        </View>
        <Text style={styles.deliveryTitle}>{message.title}</Text>
      </View>
      <Text style={styles.messageDate}>{message.date}</Text>
      <View style={styles.deliveryContent}>
        <View style={styles.deliveryImageContainer}>
          <Ionicons name="checkmark-circle-outline" size={40} color="#4CAF50" />
        </View>
        <View style={styles.deliveryTextContainer}>
          <Text style={styles.deliveryText} numberOfLines={2}>
            {message.content}
          </Text>
          <Text style={styles.orderNumber}>{message.orderNumber}</Text>
          <Text style={styles.deliveryStatus}>
            Status: {message.deliveryStatus}
          </Text>
          <Text style={styles.deliveryTime}>
            Delivered: {message.deliveryTime}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Main render view — driven entirely by real orders from the API.
  const renderMessagesView = () => (
    <ScrollView
      style={styles.messagesContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {orderMessages.length > 0 && (
        <View style={styles.lastDaysHeader}>
          <Text style={styles.lastDaysText}>Orders</Text>
        </View>
      )}
      {orderMessages.map(renderOrderMessage)}

      {deliveryMessages.length > 0 && (
        <View style={styles.lastDaysHeader}>
          <Text style={styles.lastDaysText}>Deliveries</Text>
        </View>
      )}
      {deliveryMessages.map(renderDeliveryMessage)}

      {orderMessages.length === 0 && deliveryMessages.length === 0 && (
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="mail-outline" size={60} color="#FF6B35" />
          </View>
          <Text style={styles.emptyStateText}>
            Once you place an order, updates about it will show up here.
          </Text>
          <TouchableOpacity
            style={styles.startShoppingButton}
            onPress={handleStartShopping}
          >
            <Text style={styles.startShoppingText}>START SHOPPING</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={styles.tab} onPress={handleChatPress}>
          <View style={styles.tabIcon}>
            <Ionicons name="chatbubble-outline" size={20} color="#f97316" />
          </View>
          <Text style={styles.tabText}>Chats</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab} onPress={handleOrdersPress}>
          <View style={styles.tabIcon}>
            <Ionicons name="receipt-outline" size={20} color="#f97316" />
          </View>
          <Text style={styles.tabText}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab} onPress={handleVouchersPress}>
          <View style={styles.tabIcon}>
            <Ionicons name="ticket-outline" size={20} color="#f97316" />
          </View>
          <Text style={styles.tabText}>Vouchers</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab} onPress={handlePromosPress}>
          <View style={styles.tabIcon}>
            <Ionicons name="megaphone-outline" size={20} color="#f97316" />
          </View>
          <Text style={styles.tabText}>Promos</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>{renderMessagesView()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#f97316',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'PoppinsBold',
    color: '#ffffff',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  tab: {
    alignItems: 'center',
    flex: 1,
  },
  tabIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    backgroundColor: '#fff7ed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  tabText: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  lastDaysHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
  },
  lastDaysText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    fontFamily: 'PoppinsMedium',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  messageDate: {
    fontSize: 11,
    color: '#9ca3af',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  // Empty states
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 100,
  },
  emptyIconContainer: {
    marginBottom: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff7ed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  startShoppingButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startShoppingText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'PoppinsBold',
  },
  // Order styles
  orderMessageContainer: {
    marginHorizontal: 12,
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    overflow: 'hidden',
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  orderIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fde8d8',
    backgroundColor: '#fff7ed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  orderTitle: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'PoppinsSemiBold',
    color: '#111827',
    flex: 1,
  },
  orderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  orderImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fde8d8',
    backgroundColor: '#fff7ed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderTextContainer: {
    flex: 1,
  },
  orderText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 2,
  },
  orderStatus: {
    fontSize: 12,
    color: '#f97316',
    fontWeight: '600',
    fontFamily: 'PoppinsSemiBold',
  },
  // Delivery styles
  deliveryMessageContainer: {
    marginHorizontal: 12,
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    overflow: 'hidden',
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  deliveryIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1fae5',
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  deliveryTitle: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'PoppinsSemiBold',
    color: '#111827',
    flex: 1,
  },
  deliveryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  deliveryImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1fae5',
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deliveryTextContainer: {
    flex: 1,
  },
  deliveryText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 4,
  },
  deliveryStatus: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '600',
    fontFamily: 'PoppinsSemiBold',
    marginBottom: 2,
  },
  deliveryTime: {
    fontSize: 11,
    color: '#9ca3af',
  },
});

export default Messages;
