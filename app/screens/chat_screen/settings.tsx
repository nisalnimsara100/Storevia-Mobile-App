import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import {
    Alert,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const ChatSettings = () => {
  const [muteNotifications, setMuteNotifications] = useState(false)
  const [addToBlacklist, setAddToBlacklist] = useState(false)

  const handleMuteToggle = (value: boolean) => {
    setMuteNotifications(value)
    Alert.alert(
      'Mute Notifications', 
      value ? 'Notifications muted' : 'Notifications enabled'
    )
  }

  const handleBlacklistToggle = (value: boolean) => {
    setAddToBlacklist(value)
    if (value) {
      Alert.alert(
        'Add to Blacklist', 
        'This seller has been added to blacklist. You can no longer send or receive messages.'
      )
    } else {
      Alert.alert(
        'Remove from Blacklist', 
        'This seller has been removed from blacklist.'
      )
    }
  }

  const handleUserProfile = () => {
    Alert.alert('Profile', 'Opening seller profile...')
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* User Profile Section */}
      <TouchableOpacity style={styles.userSection} onPress={handleUserProfile}>
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>🍌</Text>
        </View>
        <Text style={styles.username}>banana3C</Text>
        <Ionicons name="chevron-forward" size={20} color="#999999" />
      </TouchableOpacity>

      {/* Settings Options */}
      <View style={styles.settingsContainer}>
        {/* Mute Notifications */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Mute Notifications</Text>
          <Switch
            value={muteNotifications}
            onValueChange={handleMuteToggle}
            trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
            thumbColor={muteNotifications ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>

        {/* Add to Blacklist */}
        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Add to Blacklist</Text>
            <Text style={styles.settingDescription}>
              When you add this seller to the blacklist, you can neither send or receive any message from this seller
            </Text>
          </View>
          <Switch
            value={addToBlacklist}
            onValueChange={handleBlacklistToggle}
            trackColor={{ false: '#E0E0E0', true: '#F44336' }}
            thumbColor={addToBlacklist ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFE0B2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  userAvatarText: {
    fontSize: 24,
  },
  username: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
})

export default ChatSettings