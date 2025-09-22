import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Home = () => {
  const insets = useSafeAreaInsets();

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

      {/* Banner Section */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>9.9 BIRTHDAY CART</Text>
        <Text style={styles.bannerSubText}>Buy More, Save More</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text>Home</Text>
      </View>
    </View>
  );
};

export default Home;

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
  banner: {
    backgroundColor: '#f57c00',
    padding: 20,
    alignItems: 'center',
  },
  bannerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerSubText: {
    color: '#fff',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});