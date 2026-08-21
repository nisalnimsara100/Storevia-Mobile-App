import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import All from './All';
import ToPay from './ToPay';
import ToReceive from './ToReceive';
import ToReview from './ToReview';
import ToShip from './ToShip';

const tabs = ['All', 'To Pay', 'To Ship', 'To Receive', 'To Review'];

const MyOrdersScreen = () => {
  const [activeTab, setActiveTab] = useState('All');

  const renderContent = () => {
    switch (activeTab) {
      case 'All':
        return <All />;
      case 'To Pay':
        return <ToPay />;
      case 'To Ship':
        return <ToShip />;
      case 'To Receive':
        return <ToReceive />;
      case 'To Review':
        return <ToReview />;
      default:
        return <All />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Search and Filter */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color="#999" />
          <TextInput
            placeholder="Search by seller na..."
            style={styles.searchInput}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="filter-outline" size={20} color="black" />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tabItem, isActive && styles.activeTabItem]}
              >
                <Text
                  style={[styles.tabText, isActive && styles.activeTabText]}
                >
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Content Area - Now White */}
      <View style={styles.contentBox}>{renderContent()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Changed from #F5F5F5
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'PoppinsBold',
    color: '#000',
    marginRight: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0', // Keep search bar slightly grey for contrast
    borderRadius: 4,
    paddingHorizontal: 8,
    height: 36,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 5,
    color: '#000',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  filterText: {
    fontSize: 14,
    marginLeft: 2,
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEEEEE',
  },
  tabItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#f97316',
  },
  tabText: {
    fontSize: 15,
    color: '#666', // Subtle grey for inactive tabs
  },
  activeTabText: {
    color: '#f97316',
    fontWeight: '600',
    fontFamily: 'PoppinsSemiBold',
  },
  contentBox: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Ensure inner content is also white
  },
});

export default MyOrdersScreen;
