import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const ChatScreen = () => {
  const { storeName, productName } = useLocalSearchParams();
  const resolvedStoreName =
    typeof storeName === 'string' && storeName.trim().length > 0
      ? storeName.trim()
      : 'Store';
  const resolvedProductName =
    typeof productName === 'string' && productName.trim().length > 0
      ? productName.trim()
      : 'Product';

  // Mock chat data
  const mockChats = [
    {
      id: '1',
      username: resolvedStoreName,
      date: '01/02/2025',
      message: `Chat about ${resolvedProductName}`,
      avatar: '🏪',
      isNew: true,
    },
  ];
  // State to control whether to show chats or empty state
  const [hasChats, setHasChats] = useState(true); // Set to true to show chat list, false for empty state
  const [chats] = useState(mockChats);

  const handleStartShopping = () => {
    Alert.alert('Shopping', 'Redirecting to shopping...');
  };

  const handleChatPress = (chatId: string) => {
    router.push({
      pathname: '/screens/chat_screen/[chatId]',
      params: {
        chatId,
        storeName: resolvedStoreName,
        productName: resolvedProductName,
      },
    });
  };

  // Toggle for testing - you can remove this in production
  const toggleChatState = () => {
    setHasChats(!hasChats);
  };

  // Render chat list item
  const renderChatItem = ({ item }: { item: (typeof mockChats)[0] }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => handleChatPress(item.id)}
    >
      <View style={styles.chatTopRow}>
        <View style={styles.chatAvatar}>
          <Text style={styles.chatAvatarText}>{item.avatar}</Text>
        </View>
        <View style={styles.chatContent}>
          <Text style={styles.chatUsername}>{item.username}</Text>
          <Text style={styles.chatDate}>{item.date}</Text>
        </View>
      </View>
      <View style={styles.chatMessageContainer}>
        <Text style={styles.chatMessageIcon}>💬</Text>
        <Text style={styles.chatMessage} numberOfLines={1}>
          {item.message}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Empty state component
  const renderEmptyState = () => (
    <View style={styles.content}>
      {/* Empty State Illustration */}
      <View style={styles.illustrationContainer}>
        {/* Phone with question marks */}
        <View style={styles.phoneContainer}>
          <View style={styles.phone}>
            <View style={styles.phoneScreen}>
              <View style={styles.phoneHeader} />
              <View style={styles.phoneBody} />
            </View>
          </View>

          {/* Question marks around phone */}
          <View style={[styles.questionMark, styles.questionMark1]}>
            <Text style={styles.questionMarkText}>?</Text>
          </View>
          <View style={[styles.questionMark, styles.questionMark2]}>
            <Text style={styles.questionMarkText}>?</Text>
          </View>
          <View style={[styles.questionMark, styles.questionMark3]}>
            <Text style={styles.questionMarkText}>?</Text>
          </View>
        </View>

        {/* Mascot Character */}
        <View style={styles.mascotContainer}>
          <View style={styles.mascotBody}>
            {/* Mascot head */}
            <View style={styles.mascotHead}>
              <View style={styles.mascotHair} />
              <View style={styles.mascotFace}>
                <View style={styles.mascotEye} />
                <View style={styles.mascotEye} />
                <View style={styles.mascotMouth} />
              </View>
            </View>
            {/* Mascot shirt */}
            <View style={styles.mascotShirt}>
              <View style={styles.mascotLogo}>
                <Text style={styles.mascotLogoText}>$</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text style={styles.mainText}>
          Once you receive a new message, you&apos;ll see it listed here
        </Text>
      </View>

      {/* Start Shopping Button */}
      <TouchableOpacity
        style={styles.startShoppingButton}
        onPress={handleStartShopping}
      >
        <Text style={styles.startShoppingText}>START SHOPPING</Text>
      </TouchableOpacity>

      {/* Toggle button for testing - remove in production */}
      <TouchableOpacity style={styles.toggleButton} onPress={toggleChatState}>
        <Text style={styles.toggleButtonText}>Show Chats (Test)</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {hasChats ? (
        <View style={styles.chatListContainer}>
          <FlatList
            data={chats}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id}
            style={styles.chatList}
            showsVerticalScrollIndicator={false}
          />
          {/* Toggle button for testing - remove in production */}
          <TouchableOpacity
            style={styles.toggleButtonFixed}
            onPress={toggleChatState}
          >
            <Text style={styles.toggleButtonText}>Show Empty (Test)</Text>
          </TouchableOpacity>
        </View>
      ) : (
        renderEmptyState()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 60,
    position: 'relative',
    width: 280,
    height: 200,
  },
  phoneContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phone: {
    width: 120,
    height: 200,
    backgroundColor: '#fff7ed',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
  },
  phoneHeader: {
    width: '100%',
    height: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    marginBottom: 8,
  },
  phoneBody: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
  },
  questionMark: {
    position: 'absolute',
    width: 32,
    height: 32,
    backgroundColor: '#fff7ed',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionMark1: {
    top: 20,
    left: -40,
  },
  questionMark2: {
    top: 10,
    right: -30,
  },
  questionMark3: {
    bottom: 40,
    right: -50,
  },
  questionMarkText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f97316',
  },
  mascotContainer: {
    position: 'absolute',
    bottom: -20,
    right: -30,
  },
  mascotBody: {
    alignItems: 'center',
  },
  mascotHead: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF3E0',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 5,
  },
  mascotHair: {
    position: 'absolute',
    top: -8,
    width: 40,
    height: 15,
    backgroundColor: '#f97316',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  mascotFace: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotEye: {
    width: 4,
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    marginBottom: 8,
  },
  mascotMouth: {
    width: 12,
    height: 6,
    backgroundColor: '#333333',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  mascotShirt: {
    width: 50,
    height: 40,
    backgroundColor: '#f97316',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mascotLogo: {
    width: 24,
    height: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mascotLogoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f97316',
  },
  textContainer: {
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  mainText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'system',
  },
  startShoppingButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startShoppingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Chat List Styles
  chatListContainer: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    marginTop: -1, // Pull content up slightly but give more space from header
  },
  chatList: {
    flex: 1,
    paddingTop: 0,
  },
  chatItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginTop: 0,
    marginBottom: 1,
    borderRadius: 0,
    padding: 12,
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  chatTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE0B2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f97316',
  },
  chatAvatarText: {
    fontSize: 16,
  },
  chatContent: {
    marginLeft: 12,
    flex: 1,
  },
  chatUsername: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  chatDate: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 8,
  },
  chatMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
  },
  chatMessageIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  chatMessage: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  // Toggle buttons for testing - remove in production
  toggleButton: {
    marginTop: 20,
    backgroundColor: '#f97316',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  toggleButtonFixed: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#f97316',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  toggleButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ChatScreen;
