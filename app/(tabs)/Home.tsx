import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';

import { Link } from 'expo-router';
import FlashSaleCard from '../components/FlashSaleCard';
import ProductCard from '../components/ProductCard';

const { width } = Dimensions.get('window');

const Home = () => {
  const insets = useSafeAreaInsets();

  const banners = [
    { id: 1, image: require('../../assets/banners/banner1.jpg') },
    { id: 2, image: require('../../assets/banners/banner2.jpg') },
  ];

  const categories = [
    {
      id: 1,
      title: 'Fashion',
      icon: require('../../assets/icons/icon (1).png'),
    },
    {
      id: 2,
      title: 'Grab the Deals!',
      icon: require('../../assets/icons/icon (2).png'),
    },
    {
      id: 3,
      title: 'Beauty',
      icon: require('../../assets/icons/icon (3).png'),
    },
    {
      id: 4,
      title: 'Buy More & Save',
      icon: require('../../assets/icons/icon (4).png'),
    },
    {
      id: 5,
      title: 'Shop Anywhere',
      icon: require('../../assets/icons/icon (5).png'),
    },
  ];

  const flashSaleItems = [
    {
      id: 1,
      name: 'Cow & Gate',
      image: require('../../assets/products/watch.jpg'),
      price: 1730,
      oldPrice: 2000,
      discount: 14,
      stock: 2,
    },
    {
      id: 2,
      name: 'Windows 11 Pro',
      image: require('../../assets/products/laptop.jpg'),
      price: 99,
      oldPrice: 999,
      discount: 90,
      stock: 1,
    },
    {
      id: 3,
      name: 'Trinkle Razors',
      image: require('../../assets/products/tab.jpg'),
      price: 145,
      oldPrice: 520,
      discount: 72,
      stock: 5,
    },
  ];
  const products = [
    {
      id: 1,
      name: 'Cow & Gate',
      image: require('../../assets/products/watch.jpg'),
      price: 1730,
      oldPrice: 2000,
      discount: 14,
      stock: 2,
      rating: 4,
      reviews: 220,
      sold: 100,
      badges: ['Bestseller', 'Free Shipping'],
    },
    {
      id: 2,
      name: 'Windows 11 Pro',
      image: require('../../assets/products/laptop.jpg'),
      price: 99,
      oldPrice: 999,
      discount: 90,
      stock: 1,
      rating: 4,
      reviews: 220,
      sold: 100,
      badges: ['Bestseller', 'Free Shipping'],
    },
    {
      id: 3,
      name: 'Trinkle Razors',
      image: require('../../assets/products/tab.jpg'),
      price: 145,
      oldPrice: 520,
      discount: 72,
      stock: 5,
      rating: 4.5,
      reviews: 120,
      sold: 300,
      badges: ['Bestseller', 'Free Shipping'],
    },
    {
      id: 4,
      name: 'Cow & Gate',
      image: require('../../assets/products/watch.jpg'),
      price: 1730,
      oldPrice: 2000,
      discount: 14,
      stock: 2,
      rating: 4.5,
      reviews: 120,
      sold: 300,
      badges: ['Bestseller', 'Free Shipping'],
    },
    {
      id: 5,
      name: 'Windows 11 Pro',
      image: require('../../assets/products/laptop.jpg'),
      price: 99,
      oldPrice: 999,
      discount: 90,
      stock: 1,
      rating: 4,
      reviews: 220,
      sold: 100,
      badges: ['Bestseller', 'Free Shipping'],
    },
    {
      id: 6,
      name: 'Trinkle Razors',
      image: require('../../assets/products/tab.jpg'),
      price: 185,
      oldPrice: 520,
      discount: 72,
      stock: 5,
      rating: 4,
      reviews: 220,
      sold: 100,
      badges: ['Bestseller', 'Free Shipping'],
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
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
        <Link href={"/screen_navigation" as any} asChild>
          <TouchableOpacity style={styles.payButton}>
            <Text style={styles.payText}>Pay</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>9.9 BIRTHDAY CART</Text>
        <Text style={styles.bannerSubText}>Buy More, Save More</Text>
      </View>

      <View style={styles.bannerSection}>
        {/* Banner Swiper Section */}
        <View style={styles.swiperWrapper}>
          <Swiper autoplay autoplayTimeout={3} showsPagination>
            {banners.map((banner) => (
              <View key={banner.id} style={styles.slide}>
                <Image
                  source={banner.image}
                  style={styles.slideImage}
                  resizeMode="cover"
                />
              </View>
            ))}
          </Swiper>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity className="w-36 h-24 rounded-xl bg-yellow-100 p-3 justify-between">
            {/* Top Row */}
            <View className="flex-row items-center rounded-lg">
              <Image
                source={require('../../assets/icons/icon1.png')}
                className="w-10 h-10 mr-3 rounded-md"
                resizeMode="contain"
              />
              <View className="flex-col ml-2">
                <Text className="text-lg font-bold text-black">60%</Text>
                <Text className="text-lg font-bold text-black">OFF</Text>
              </View>
            </View>

            {/* Bottom Row */}
            <View className="flex-row justify-between items-center bg-yellow-100">
              <Text className="text-purple-600 font-semibold">shop now</Text>
              <Text className="text-purple-600 text-lg">›</Text>
            </View>
          </TouchableOpacity>

          <View className="mt-4">
            <FlatList
              data={categories}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => console.log(`${item.title} clicked`)} // handle click
                  className="items-center mx-3"
                >
                  <View className="bg-orange-200 p-4 rounded-2xl shadow-md w-20 h-20 flex items-center justify-center">
                    <Image
                      source={item.icon}
                      className="w-10 h-10"
                      resizeMode="contain"
                    />
                  </View>
                  <Text className="text-sm font-semibold text-gray-700 mt-2 text-center">
                    {item.title}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
      </View>

      {/* middle Banner Swiper Section */}
      <View style={styles.swiperWrapper} className="mb-4">
        <Swiper autoplay autoplayTimeout={3} showsPagination>
          {banners.map((banner) => (
            <View key={banner.id} style={styles.slide}>
              <Image
                source={banner.image}
                style={styles.slideImage}
                resizeMode="cover"
              />
            </View>
          ))}
        </Swiper>
      </View>

      <View style={styles.saleContent}>
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-gray-700">Best Selling</Text>
          <Text className="text-sm text-orange-500">Shop More ›</Text>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={flashSaleItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <FlashSaleCard item={item} />}
        />
      </View>

      <View className="bg-white py-2" style={styles.productContent}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => <ProductCard item={item} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FC8107FF',
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
  swiperWrapper: {
    height: 180,
    borderRadius: 12,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  bannerSection: {
    alignItems: 'center',
    backgroundColor: '#FC8107FF',
    paddingVertical: 10,
  },
  slide: {
    width,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: {
    width,
    height: 180,
  },
  overlay: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  bannerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerSubText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFF4EAFF',
  },
  saleContent: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFF4EAFF',
    marginBottom: 30,
  },
  productContent: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFF4EAFF',
    marginBottom: 80,
  },
  banner: {
    backgroundColor: '#FC8107FF',
    padding: 5,
    alignItems: 'center',
  },
  categoryItem: {
    width: 80,
    alignItems: 'center',
    marginHorizontal: 6,
  },
});
