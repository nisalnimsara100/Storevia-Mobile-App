import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ChatSender = 'user' | 'seller' | 'system';

interface ChatMessage {
  id: string;
  text: string;
  sender: ChatSender;
  timestamp: Date;
}

interface ChatMessageApi {
  message_id: number | string;
  message: string;
  sender: ChatSender;
  created_at?: string | null;
}

const BASE_URL = process.env.EXPO_PUBLIC_APP_BASE_URL;
const USER_EMAIL = process.env.EXPO_PUBLIC_APP_EMAIL;

// Emoji data from the image
const emojiData = [
  ['😊', '😌', '😃', '😂', '😎', '😬', '😋'],
  ['😛', '😍', '😂', '😴', '😤', '😒', '😱'],
  ['😬', '😡', '👿', '😢', '😭', '😨', '😰'],
  ['😐', '😑', '😕', '😟', '😰', '❤️', '💩'],
  ['💀'],
];
//test
const attachmentOptions = [
  { id: 'camera', icon: 'camera', label: 'Camera', color: '#4FC3F7' },
  { id: 'photos', icon: 'images', label: 'Photos', color: '#F44336' },
  { id: 'products', icon: 'cube', label: 'Products', color: '#FF9800' },
  { id: 'orders', icon: 'receipt', label: 'Orders', color: '#4CAF50' },
];

const ChatConversation = () => {
  const { chatId, storeId, storeName, productName, productImage, productId } =
    useLocalSearchParams();
  const chatMeta = useMemo(() => {
    const resolvedStore =
      typeof storeName === 'string' && storeName.trim().length > 0
        ? storeName.trim()
        : 'Store';
    const resolvedProduct =
      typeof productName === 'string' && productName.trim().length > 0
        ? productName.trim()
        : 'Product';
    const resolvedStoreId =
      typeof storeId === 'string' && storeId.trim().length > 0
        ? Number(storeId)
        : undefined;
    const resolvedProductId =
      typeof productId === 'string' && productId.trim().length > 0
        ? Number(productId)
        : undefined;
    const resolvedImage =
      typeof productImage === 'string' && productImage.trim().length > 0
        ? productImage.trim()
        : undefined;
    return {
      store: resolvedStore,
      product: resolvedProduct,
      chatId,
      storeId: resolvedStoreId,
      productId: resolvedProductId,
      productImage: resolvedImage,
    };
  }, [storeName, productName, productImage, productId, storeId, chatId]);

  const initialMessages: ChatMessage[] = useMemo(
    () => [
      {
        id: 'welcome-1',
        text: `Welcome to ${chatMeta.store}! Ask us anything about ${chatMeta.product}.`,
        sender: 'system',
        timestamp: new Date(),
      },
      {
        id: 'welcome-2',
        text: `Hi! Thanks for your interest in ${chatMeta.product}. How can we help?`,
        sender: 'seller',
        timestamp: new Date(),
      },
    ],
    [chatMeta.product, chatMeta.store],
  );

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [chatInput, setChatInput] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const normalizeChatMessage = (msg: ChatMessageApi): ChatMessage => {
    const rawTime = msg.created_at ?? new Date().toISOString();

    return {
      id: String(msg.message_id),
      text: msg.message,
      sender: msg.sender,
      timestamp: new Date(rawTime),
    };
  };

  const fetchChatMessages = useCallback(
    async (nextProductId?: number, nextStoreId?: number) => {
      if (!BASE_URL || !nextProductId || !nextStoreId) return;

      const userEmail = USER_EMAIL ?? '';
      try {
        const response = await fetch(`${BASE_URL}/api/messages/get_messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_id: nextProductId,
            store_id: nextStoreId,
            user_email: userEmail,
            from: 'product_page',
            sender: 'user',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to load chat messages');
        }

        const result = await response.json();
        const items: ChatMessageApi[] = result.messages || [];
        const mapped = items.map(normalizeChatMessage);

        setMessages(() => {
          const merged = [...initialMessages, ...mapped];
          const seen = new Set<string>();
          return merged.filter((msg) => {
            if (seen.has(msg.id)) return false;
            seen.add(msg.id);
            return true;
          });
        });
      } catch (error) {
        console.error('Error loading chat messages:', error);
      }
    },
    [initialMessages],
  );

  const sendChatMessage = async (text: string) => {
    if (!BASE_URL || !chatMeta.productId || !chatMeta.storeId) return;
    const userEmail = USER_EMAIL ?? '';

    const optimistic: ChatMessage = {
      id: `msg-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, optimistic]);
    setChatInput('');

    try {
      const response = await fetch(`${BASE_URL}/api/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: chatMeta.productId,
          store_id: chatMeta.storeId,
          from: 'product_page',
          sender: 'user',
          user_email: userEmail,
          message: text,
        }),
      });

      const result = await response.json();
      console.log('Send message response:', result?.status ?? result);

      if (!response.ok) {
        throw new Error('Failed to send chat message');
      }
    } catch (error) {
      console.error('Error sending chat message:', error);
    }
  };

  const handleSendChat = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    await sendChatMessage(trimmed);
  };

  useEffect(() => {
    fetchChatMessages(chatMeta.productId, chatMeta.storeId);

    const intervalId = setInterval(() => {
      fetchChatMessages(chatMeta.productId, chatMeta.storeId);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [chatMeta.productId, chatMeta.storeId, fetchChatMessages]);

  const toggleAttachments = () => {
    setShowEmojis(false);
    setShowAttachments(!showAttachments);
    Animated.timing(slideAnim, {
      toValue: showAttachments ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const toggleEmojis = () => {
    setShowAttachments(false);
    setShowEmojis(!showEmojis);
    Animated.timing(slideAnim, {
      toValue: showEmojis ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleEmojiPress = (emoji: string) => {
    setChatInput(chatInput + emoji);
  };

  const handleAttachmentPress = (option: (typeof attachmentOptions)[0]) => {
    setShowAttachments(false);
    Alert.alert(option.label, `${option.label} functionality coming soon!`);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user'
          ? styles.userMessageContainer
          : styles.sellerMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.sender === 'user'
            ? styles.userBubble
            : item.sender === 'system'
              ? styles.systemBubble
              : styles.sellerBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.sender === 'user'
              ? styles.userMessageText
              : item.sender === 'system'
                ? styles.systemMessageText
                : styles.sellerMessageText,
          ]}
        >
          {item.text}
        </Text>
      </View>
      <Text style={styles.timestamp}>
        {item.timestamp.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );

  const renderAttachmentMenu = () => (
    <Animated.View
      style={[
        styles.attachmentMenu,
        {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [200, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.attachmentGrid}>
        {attachmentOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.attachmentOption, { backgroundColor: option.color }]}
            onPress={() => handleAttachmentPress(option)}
          >
            <Ionicons name={option.icon as any} size={24} color="#FFFFFF" />
            <Text style={styles.attachmentLabel}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderEmojiPicker = () => (
    <Animated.View
      style={[
        styles.emojiPicker,
        {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [300, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.emojiHeader}>
        <TouchableOpacity
          onPress={toggleEmojis}
          style={styles.emojiCloseButton}
        >
          <Ionicons name="close" size={24} color="#666666" />
        </TouchableOpacity>
      </View>
      <View style={styles.emojiGrid}>
        {emojiData.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.emojiRow}>
            {row.map((emoji, emojiIndex) => (
              <TouchableOpacity
                key={emojiIndex}
                style={styles.emojiButton}
                onPress={() => handleEmojiPress(emoji)}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 90}
        enabled={true}
      >
        {/* Messages List */}
        <View style={styles.chatArea}>
          {chatMeta.productImage ? (
            <View style={styles.productPreview}>
              <Image
                source={{ uri: chatMeta.productImage }}
                style={styles.productImage}
                resizeMode="cover"
              />
              <View style={styles.productPreviewText}>
                <Text style={styles.productPreviewTitle} numberOfLines={1}>
                  {chatMeta.product}
                </Text>
                <Text style={styles.productPreviewStore} numberOfLines={1}>
                  {chatMeta.store}
                </Text>
              </View>
            </View>
          ) : null}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            onLayout={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            onScrollBeginDrag={() => {
              setShowAttachments(false);
              setShowEmojis(false);
            }}
          />
        </View>

        {/* Bottom Section - Contains Rate Service and Input */}
        <View style={styles.bottomFixedSection}>
          {/* Rate Service Banner */}
          <View style={styles.rateServiceBanner}>
            <Text style={styles.rateServiceIcon}>⭐</Text>
            <Text style={styles.rateServiceText}>Rate Service</Text>
          </View>

          {/* Input Area - This stays on top of menus */}
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={[
                styles.inputButton,
                showAttachments && styles.inputButtonActive,
              ]}
              onPress={toggleAttachments}
            >
              {showAttachments ? (
                <Ionicons name="close" size={20} color="#FFFFFF" />
              ) : (
                <Ionicons name="add" size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>

            <TextInput
              style={styles.textInput}
              placeholder="Type your message..."
              value={chatInput}
              onChangeText={setChatInput}
              multiline
              maxLength={500}
            />

            <TouchableOpacity
              style={[
                styles.inputButton,
                showEmojis && styles.inputButtonActive,
              ]}
              onPress={toggleEmojis}
            >
              <Text style={styles.emojiButtonText}>😊</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendChat}
            >
              <Ionicons name="send" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Menus render AFTER input so input stays on top */}
          {showAttachments && renderAttachmentMenu()}
          {showEmojis && renderEmojiPicker()}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  chatArea: {
    flex: 1,
  },
  productPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  productPreviewText: {
    marginLeft: 10,
    flex: 1,
  },
  productPreviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  productPreviewStore: {
    marginTop: 2,
    fontSize: 12,
    color: '#777777',
  },
  bottomFixedSection: {
    backgroundColor: '#FFFFFF',
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    marginVertical: 4,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  sellerMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    marginBottom: 2,
  },
  userBubble: {
    backgroundColor: '#007AFF',
  },
  sellerBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  systemBubble: {
    backgroundColor: '#FFF7E6',
    borderWidth: 1,
    borderColor: '#FFE2B3',
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  sellerMessageText: {
    color: '#333333',
  },
  systemMessageText: {
    color: '#8A5A00',
  },
  timestamp: {
    fontSize: 12,
    color: '#999999',
    marginHorizontal: 16,
  },
  rateServiceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  rateServiceIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  rateServiceText: {
    fontSize: 16,
    color: '#333333',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    zIndex: 10000,
    elevation: 10000,
  },

  inputButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  inputButtonActive: {
    backgroundColor: '#FF6666',
  },
  emojiButtonText: {
    fontSize: 20,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    backgroundColor: '#F8F8F8',
    marginHorizontal: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f97316',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  attachmentMenu: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: -1,
    elevation: 1000,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  attachmentGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  attachmentOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  attachmentLabel: {
    fontSize: 12,
    color: '#333333',
    textAlign: 'center',
    marginTop: 4,
  },
  emojiPicker: {
    height: 250,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -1,
    elevation: 1000,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emojiHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  emojiCloseButton: {
    padding: 8,
  },
  emojiGrid: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 4,
  },
  emojiButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  emojiText: {
    fontSize: 24,
  },
});

export default ChatConversation;
