<<<<<<< Updated upstream
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

const Messages = () => {
  return (
    <View style={[styles.container, {  }]}> {/* Added safe area padding */}
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="scan" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Storevia"
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.payButton}>
          <Text style={styles.payText}>Pay</Text>
        </TouchableOpacity>
      </View>
      {/* Main Content */}
      <View style={styles.content}>
        <Text>Message</Text>
      </View>
    </View>
  );
=======
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

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
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f57c00',
    padding: 10,
  },
  iconButton: {
    padding: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    marginHorizontal: 10,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#f57c00',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: '#4caf50',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  payText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
});
=======
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
  const [isNewCustomer, setIsNewCustomer] = useState<boolean>(false);
  const [promotionMessages, setPromotionMessages] = useState<PromotionMessage[]>([]);
  const [orderMessages, setOrderMessages] = useState<OrderMessage[]>([]);
  const [deliveryMessages, setDeliveryMessages] = useState<DeliveryMessage[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  const autoUpdateInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  
  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getCurrentDate = (): string => {
    return formatDate(new Date());
  };

  const generateRandomPromotion = (): PromotionMessage => {
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
  };

  
  const startAutoUpdates = (): void => {
    if (autoUpdateInterval.current) {
      clearInterval(autoUpdateInterval.current);
    }
    
    autoUpdateInterval.current = setInterval(() => {
      
      if (Math.random() < 0.25) {
        const newPromotion = generateRandomPromotion();
        setPromotionMessages(prev => {
          // Keep only last 4 promotions
          const updated = [newPromotion, ...prev].slice(0, 4);
          return updated.map((msg, index) => ({ ...msg, isNew: index === 0 }));
        });
      }
    }, 45000); // Every 45 seconds
  };

  const stopAutoUpdates = (): void => {
    if (autoUpdateInterval.current) {
      clearInterval(autoUpdateInterval.current);
      autoUpdateInterval.current = null;
    }
  };

  // Load messages from JSON data
  useEffect(() => {
    loadMessagesFromJSON();
    startAutoUpdates();

    return () => {
      stopAutoUpdates();
    };
  }, [isNewCustomer]);

  const loadMessagesFromJSON = async (): Promise<void> => {
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
  };

  // Event handlers
  const onRefresh = (): void => {
    loadMessagesFromJSON();
  };

  const handleChatPress = (): void => {
    Alert.alert('Chat', 'Opening chat functionality...');
  };

  const handleOrdersPress = (): void => {
    Alert.alert('Orders', 'Opening orders screen...');
  };

  const handleActivitiesPress = (): void => {
    Alert.alert('Activities', 'Opening activities screen...');
  };

  const handlePromosPress = (): void => {
    Alert.alert('Promos', 'Opening promotions screen...');
  };

  const handleStartShopping = (): void => {
    Alert.alert('Shopping', 'Redirecting to shopping...');
  };

  const handleMessagePress = (message: Message): void => {
    if (!message || !message.title) {
      Alert.alert('Error', 'Invalid message data');
      return;
    }
    Alert.alert('Message Details', `Type: ${message.type}\nTitle: ${message.title}\nDate: ${message.date}`);
  };

  const handleMarkAllAsRead = (): void => {
    setPromotionMessages(prev => prev.map(msg => ({ ...msg, isNew: false })));
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
      style={[styles.promoMessageContainer, message.isNew && styles.newMessageContainer]}
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
      <View style={[styles.promoImageContainer, { backgroundColor: message.backgroundColor }]}>
        <Text style={styles.promoContent}>{message.content}</Text>
        <TouchableOpacity style={styles.playButton} onPress={getActionHandler(message.actionText)}>
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
        <Text style={styles.orderTitle} numberOfLines={2}>{message.title}</Text>
      </View>
      <Text style={styles.messageDate}>{message.date}</Text>
      <View style={styles.orderContent}>
        <View style={styles.orderImageContainer}>
          <Ionicons name="bag-outline" size={40} color="#FF6B35" />
        </View>
        <View style={styles.orderTextContainer}>
          <Text style={styles.orderText} numberOfLines={3}>{message.content}</Text>
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
          <Text style={styles.deliveryText} numberOfLines={2}>{message.content}</Text>
          <Text style={styles.orderNumber}>{message.orderNumber}</Text>
          <Text style={styles.deliveryStatus}>Delivered by: {message.deliveredBy}</Text>
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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
            Once you receive any personalized messages, you'll see them listed here.
          </Text>
          <TouchableOpacity style={styles.startShoppingButton} onPress={handleStartShopping}>
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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.lastDaysHeader}>
        <Text style={styles.lastDaysText}>Last 7 days</Text>
      </View>

      {promotionMessages.map(renderPromotionMessage)}
      {orderMessages.length > 0 && orderMessages.map(renderOrderMessage)}
      {deliveryMessages.length > 0 && deliveryMessages.map(renderDeliveryMessage)}

      {promotionMessages.length === 0 && orderMessages.length === 0 && deliveryMessages.length === 0 && (
        <View style={styles.noMessagesContainer}>
          <Text style={styles.noMessagesText}>No messages available</Text>
        </View>
      )}
    </ScrollView>
  );

  const hasMessages = promotionMessages.length > 0 || orderMessages.length > 0 || deliveryMessages.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        {hasMessages && (
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <Text style={styles.markAsReadText}>📖 Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={styles.tab} onPress={handleChatPress}>
          <View style={[styles.tabIcon, { backgroundColor: '#4CAF50' }]}>
            <Ionicons name="chatbubble" size={20} color="white" />
          </View>
          <Text style={styles.tabText}>Chats</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab} onPress={handleOrdersPress}>
          <View style={[styles.tabIcon, { backgroundColor: '#2196F3' }]}>
            <Ionicons name="receipt" size={20} color="white" />
          </View>
          <Text style={styles.tabText}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab} onPress={handleActivitiesPress}>
          <View style={[styles.tabIcon, { backgroundColor: '#FF9800' }]}>
            <Ionicons name="notifications" size={20} color="white" />
          </View>
          <Text style={styles.tabText}>Activities</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab} onPress={handlePromosPress}>
          <View style={[styles.tabIcon, { backgroundColor: '#E91E63' }]}>
            <Ionicons name="megaphone" size={20} color="white" />
            {promotionMessages.length > 0 && <View style={styles.notificationDot} />}
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  markAsReadText: {
    fontSize: 14,
    color: '#666666',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: '#FAFAFA',
  },
  tab: {
    alignItems: 'center',
    flex: 1,
  },
  tabIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF1744',
  },
  tabText: {
    fontSize: 12,
    color: '#666666',
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
    backgroundColor: '#F5F5F5',
  },
  lastDaysText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  messageDate: {
    fontSize: 12,
    color: '#999999',
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
    marginBottom: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  startShoppingButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
  },
  startShoppingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noMessagesContainer: {
    padding: 32,
    alignItems: 'center',
  },
  noMessagesText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
  },
  newMessageContainer: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF1744',
  },
  newBadge: {
    backgroundColor: '#FF1744',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Promotion styles
  promoMessageContainer: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  promoIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  promoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    flex: 1,
  },
  promoImageContainer: {
    margin: 12,
    borderRadius: 8,
    padding: 16,
  },
  promoContent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  playButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  promoFooter: {
    padding: 12,
    fontSize: 12,
    color: '#666666',
  },
  // Order styles
  orderMessageContainer: {
    margin: 16,
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  orderIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    flex: 1,
  },
  orderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingTop: 0,
  },
  orderImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderTextContainer: {
    flex: 1,
  },
  orderText: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 2,
  },
  orderStatus: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '500',
  },
  // Delivery styles
  deliveryMessageContainer: {
    margin: 16,
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  deliveryIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  deliveryTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    flex: 1,
  },
  deliveryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingTop: 0,
  },
  deliveryImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deliveryTextContainer: {
    flex: 1,
  },
  deliveryText: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
    marginBottom: 4,
  },
  deliveryStatus: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
    marginBottom: 2,
  },
  deliveryTime: {
    fontSize: 12,
    color: '#999999',
  },
});

export default Messages;
>>>>>>> Stashed changes
