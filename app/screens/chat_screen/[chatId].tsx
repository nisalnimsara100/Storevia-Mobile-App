import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import React, { useRef, useState } from 'react'
import {
    Alert,
    Animated,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// Demo messages
const demoMessages = [
  {
    id: '1',
    text: 'Hi',
    sender: 'user',
    timestamp: '10:15 AM',
  },
  {
    id: '2', 
    text: 'Hi how are you',
    sender: 'seller',
    timestamp: '10:16 AM',
  },
]

// Emoji data from the image
const emojiData = [
  ['😊', '😌', '😃', '😂', '😎', '😬', '😋'],
  ['😛', '😍', '😂', '😴', '😤', '😒', '😱'],
  ['😬', '😡', '👿', '😢', '😭', '😨', '😰'],
  ['😐', '😑', '😕', '😟', '😰', '❤️', '💩'],
  ['💀']
]

const attachmentOptions = [
  { id: 'camera', icon: 'camera', label: 'Camera', color: '#4FC3F7' },
  { id: 'photos', icon: 'images', label: 'Photos', color: '#F44336' },
  { id: 'products', icon: 'cube', label: 'Products', color: '#FF9800' },
  { id: 'orders', icon: 'receipt', label: 'Orders', color: '#4CAF50' },
]

const ChatConversation = () => {
  const { chatId } = useLocalSearchParams()
  const [messages, setMessages] = useState(demoMessages)
  const [inputText, setInputText] = useState('')
  const [showAttachments, setShowAttachments] = useState(false)
  const [showEmojis, setShowEmojis] = useState(false)
  const slideAnim = useRef(new Animated.Value(0)).current

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: inputText.trim(),
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages([...messages, newMessage])
      setInputText('')
    }
  }

  const toggleAttachments = () => {
    setShowEmojis(false)
    setShowAttachments(!showAttachments)
    Animated.timing(slideAnim, {
      toValue: showAttachments ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }

  const toggleEmojis = () => {
    setShowAttachments(false)
    setShowEmojis(!showEmojis)
    Animated.timing(slideAnim, {
      toValue: showEmojis ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }

  const handleEmojiPress = (emoji: string) => {
    setInputText(inputText + emoji)
  }

  const handleAttachmentPress = (option: typeof attachmentOptions[0]) => {
    setShowAttachments(false)
    Alert.alert(option.label, `${option.label} functionality coming soon!`)
  }

  const renderMessage = ({ item }: { item: typeof demoMessages[0] }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessageContainer : styles.sellerMessageContainer
    ]}>
      <View style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.sellerBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.sender === 'user' ? styles.userMessageText : styles.sellerMessageText
        ]}>
          {item.text}
        </Text>
      </View>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
  )

  const renderAttachmentMenu = () => (
    <Animated.View style={[
      styles.attachmentMenu,
      {
        transform: [{
          translateY: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [200, 0],
          })
        }]
      }
    ]}>
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
  )

  const renderEmojiPicker = () => (
    <Animated.View style={[
      styles.emojiPicker,
      {
        transform: [{
          translateY: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [300, 0],
          })
        }]
      }
    ]}>
      <View style={styles.emojiHeader}>
        <TouchableOpacity onPress={toggleEmojis} style={styles.emojiCloseButton}>
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
  )

  const dismissKeyboardAndMenus = () => {
    Keyboard.dismiss()
    setShowAttachments(false)
    setShowEmojis(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
        enabled={true}
      >
        {/* Messages List */}
        <TouchableWithoutFeedback onPress={dismissKeyboardAndMenus}>
          <View style={styles.chatArea}>
            <FlatList
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              style={styles.messagesList}
              contentContainerStyle={styles.messagesContent}
              onScrollBeginDrag={() => {
                setShowAttachments(false)
                setShowEmojis(false)
              }}
            />
          </View>
        </TouchableWithoutFeedback>

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
            style={[styles.inputButton, showAttachments && styles.inputButtonActive]}
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
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />

          <TouchableOpacity 
            style={[styles.inputButton, showEmojis && styles.inputButtonActive]}
            onPress={toggleEmojis}
          >
            <Text style={styles.emojiButtonText}>😊</Text>
          </TouchableOpacity>
        </View>

          {/* Menus render AFTER input so input stays on top */}
          {showAttachments && renderAttachmentMenu()}
          {showEmojis && renderEmojiPicker()}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  chatArea: {
    flex: 1,
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
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  sellerMessageText: {
    color: '#333333',
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
})

export default ChatConversation