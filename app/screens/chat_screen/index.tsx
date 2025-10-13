import React from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const ChatScreen = () => {
  const handleStartShopping = () => {
    Alert.alert('Shopping', 'Redirecting to shopping...')
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Main Content */}
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
        <TouchableOpacity style={styles.startShoppingButton} onPress={handleStartShopping}>
          <Text style={styles.startShoppingText}>START SHOPPING</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

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
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    color: '#2196F3',
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
    backgroundColor: '#FF9800',
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
    backgroundColor: '#FF6B35',
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
    color: '#FF6B35',
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
    backgroundColor: '#4FC3F7',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startShoppingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

export default ChatScreen

