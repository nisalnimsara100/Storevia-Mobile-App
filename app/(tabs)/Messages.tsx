import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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

// Import JSON data directly
import messagesData from '../../data/messagesData.json';

// Type definitions
interface PromotionMessage {
  id: number;
  type: 'promo';
  title: string;
  date: string;
  content: string;
  actionText: string;
  backgroundColor: string;
  footerText: string;
  isNew: boolean;
}

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
  deliveredBy: string;
  deliveryTime: string;
}

interface CustomerData {
  isNewCustomer: boolean;
  promotions: PromotionMessage[];
  orders: OrderMessage[];
  deliveries: DeliveryMessage[];
}

type Message = PromotionMessage | OrderMessage | DeliveryMessage;

const Messages: React.FC = () => {
  const [isNewCustomer] = useState<boolean>(false);
  const [promotionMessages, setPromotionMessages] = useState<
    PromotionMessage[]
  >([]);
  const [orderMessages, setOrderMessages] = useState<OrderMessage[]>([]);
  const [deliveryMessages, setDeliveryMessages] = useState<DeliveryMessage[]>(
    [],
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const autoUpdateInterval = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const insets = useSafeAreaInsets();

  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getCurrentDate = useCallback((): string => {
    return formatDate(new Date());
  }, []);

  const generateRandomPromotion = useCallback((): PromotionMessage => {
    const templates = (messagesData as any).promotionTemplates;
    const template = templates[Math.floor(Math.random() * templates.length)];

    return {
      id: Date.now() + Math.random(),
      type: 'promo' as const,
      title: template.title,
      date: getCurrentDate(),
      content: template.content,
      actionText: template.actionText,
      backgroundColor: template.backgroundColor,
      footerText: template.footerText,
      isNew: true,
    };
  }, [getCurrentDate]);

  const startAutoUpdates = useCallback((): void => {
    if (autoUpdateInterval.current) {
      clearInterval(autoUpdateInterval.current);
    }

    autoUpdateInterval.current = setInterval(() => {
      if (Math.random() < 0.25) {
        const newPromotion = generateRandomPromotion();
        setPromotionMessages((prev) => {
          // Keep only last 4 promotions
          const updated = [newPromotion, ...prev].slice(0, 4);
          return updated.map((msg, index) => ({ ...msg, isNew: index === 0 }));
        });
      }
    }, 45000); // Every 45 seconds
  }, [generateRandomPromotion]);

  const stopAutoUpdates = useCallback((): void => {
    if (autoUpdateInterval.current) {
      clearInterval(autoUpdateInterval.current);
      autoUpdateInterval.current = null;
    }
  }, []);

  const loadMessagesFromJSON = useCallback(async (): Promise<void> => {
    try {
      setRefreshing(true);

      const data = messagesData as any;

      const customerData: CustomerData = isNewCustomer
        ? data.newCustomer
        : data.existingCustomer;

      // Load promotions (available for both customer types)
      setPromotionMessages(customerData.promotions || []);

      // Load orders and deliveries only for existing customers
      if (!customerData.isNewCustomer) {
        setOrderMessages(customerData.orders || []);
        setDeliveryMessages(customerData.deliveries || []);
      } else {
        setOrderMessages([]);
        setDeliveryMessages([]);
      }
    } catch (error) {
      console.error('Error loading messages from JSON:', error);
      Alert.alert('Error', 'Failed to load messages. Please try again.');
    } finally {
      setRefreshing(false);
    }
  }, [isNewCustomer]);

  // Load messages from JSON data
  useEffect(() => {
    loadMessagesFromJSON();
    startAutoUpdates();

    return () => {
      stopAutoUpdates();
    };
  }, [loadMessagesFromJSON, startAutoUpdates, stopAutoUpdates]);

  // Event handlers
  const onRefresh = (): void => {
    loadMessagesFromJSON();
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

  const handleMarkAllAsRead = (): void => {
    setPromotionMessages((prev) =>
      prev.map((msg) => ({ ...msg, isNew: false })),
    );
    Alert.alert('Success', 'All messages marked as read');
  };

  // Action handlers
  const getActionHandler = (actionText: string): (() => void) => {
    const handlers: Record<string, () => void> = {
      'Play Now': () => Alert.alert('Game', 'Starting candy game...'),
      'Shop Now': () => Alert.alert('Shop', 'Opening shop...'),
      'Claim Now': () => Alert.alert('Claim', 'Claiming offer...'),
      'Order Now': () => Alert.alert('Order', 'Placing order...'),
    };
    return handlers[actionText] || handlers['Shop Now'];
  };

  // Render promotion message
  const renderPromotionMessage = (message: PromotionMessage) => (
    <TouchableOpacity
      key={message.id}
      style={[
        styles.promoMessageContainer,
        message.isNew && styles.newMessageContainer,
      ]}
      onPress={() => handleMessagePress(message)}
    >
      <View style={styles.promoHeader}>
        <View style={styles.promoIconContainer}>
          <Ionicons name="megaphone" size={20} color="#FF1744" />
        </View>
        <Text style={styles.promoTitle} numberOfLines={2}>
          {message.title}
        </Text>
        {message.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
      </View>
      <Text style={styles.messageDate}>{message.date}</Text>
      <View
        style={[
          styles.promoImageContainer,
          { backgroundColor: message.backgroundColor },
        ]}
      >
        <Text style={styles.promoContent}>{message.content}</Text>
        <TouchableOpacity
          style={styles.playButton}
          onPress={getActionHandler(message.actionText)}
        >
          <Text style={styles.playButtonText}>{message.actionText}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.promoFooter}>{message.footerText}</Text>
    </TouchableOpacity>
  );

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
            Delivered by: {message.deliveredBy}
          </Text>
          <Text style={styles.deliveryTime}>Time: {message.deliveryTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Main render views
  const renderNewCustomerView = () => (
    <ScrollView
      style={styles.messagesContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {promotionMessages.length > 0 && (
        <View style={styles.lastDaysHeader}>
          <Text style={styles.lastDaysText}>Special Offers</Text>
        </View>
      )}
      {promotionMessages.map(renderPromotionMessage)}

      {promotionMessages.length === 0 && (
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="mail-outline" size={60} color="#FF6B35" />
          </View>
          <Text style={styles.emptyStateText}>
            Once you receive any personalized messages, you&apos;ll see them
            listed here.
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

  const renderExistingCustomerView = () => (
    <ScrollView
      style={styles.messagesContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.lastDaysHeader}>
        <Text style={styles.lastDaysText}>Last 7 days</Text>
      </View>

      {promotionMessages.map(renderPromotionMessage)}
      {orderMessages.length > 0 && orderMessages.map(renderOrderMessage)}
      {deliveryMessages.length > 0 &&
        deliveryMessages.map(renderDeliveryMessage)}

      {promotionMessages.length === 0 &&
        orderMessages.length === 0 &&
        deliveryMessages.length === 0 && (
          <View style={styles.noMessagesContainer}>
            <Text style={styles.noMessagesText}>No messages available</Text>
          </View>
        )}
    </ScrollView>
  );

  const hasMessages =
    promotionMessages.length > 0 ||
    orderMessages.length > 0 ||
    deliveryMessages.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <StatusBar style="light" />
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Messages</Text>
        {hasMessages && (
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <Text style={styles.markAsReadText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
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
            {promotionMessages.length > 0 && (
              <View style={styles.notificationDot} />
            )}
          </View>
          <Text style={styles.tabText}>Promos</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {isNewCustomer ? renderNewCustomerView() : renderExistingCustomerView()}
      </View>
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
    color: '#ffffff',
  },
  markAsReadText: {
    fontSize: 13,
    color: '#fff7ed',
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
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
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
  },
  noMessagesContainer: {
    padding: 32,
    alignItems: 'center',
  },
  noMessagesText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  newMessageContainer: {
    borderLeftWidth: 3,
    borderLeftColor: '#f97316',
  },
  newBadge: {
    backgroundColor: '#f97316',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  // Promotion styles
  promoMessageContainer: {
    marginHorizontal: 12,
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    overflow: 'hidden',
  },
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  promoIconContainer: {
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
  promoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  promoImageContainer: {
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 8,
    padding: 14,
  },
  promoContent: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 10,
  },
  playButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  playButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  promoFooter: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    fontSize: 12,
    color: '#6b7280',
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
    marginBottom: 2,
  },
  deliveryTime: {
    fontSize: 11,
    color: '#9ca3af',
  },
});

export default Messages;
