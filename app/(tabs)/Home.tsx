import { Ionicons } from '@expo/vector-icons';
import * as Icons from 'lucide-react-native';
import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Swiper from 'react-native-swiper';

import { Link } from 'expo-router';

import FlashSaleCard from '../components/FlashSaleCard';
import LargeProductTile from '../components/LargeProductTile';

const BASE_URL = process.env.EXPO_PUBLIC_APP_BASE_URL;
// test2

const { width } = Dimensions.get('window');

const DEFAULT_CATEGORIES = [
  {
    id: 1,
    name: 'Electronics',
    icon: Icons.Smartphone,
    gradient: 'from-blue-500 to-indigo-500',
    bg: 'bg-blue-50',
  },
  {
    id: 2,
    name: 'Fashion',
    icon: Icons.Shirt,
    gradient: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50',
  },
  {
    id: 3,
    name: 'Home & Living',
    icon: Icons.Home,
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
  },
];

const Home = () => {
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    const fetchProducts = async () => {
      console.log('Base URL:', BASE_URL);
      const API_URL = `${BASE_URL}/api/products`;
      const res = await fetch(API_URL);
      const data = await res.json();
      return data.products;
    };

    const loadProducts = async () => {
      try {
        const apiProducts = await fetchProducts();
        const mappedProducts = apiProducts.map(mapProductFromApi);
        setProducts(mappedProducts);
      } catch (e) {
        console.log('Failed to load products', e);
      }
    };

    loadProducts();
  }, []);

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result?.data?.length) {
        const mappedCategories = result.data.map(
          (category: any, index: number) => ({
            id: category.category_id,
            name: category.category_name,
            icon:
              // eslint-disable-next-line import/namespace
              Icons[category.category_icon as keyof typeof Icons] ||
              Icons.Smartphone, // safe fallback
            gradient:
              DEFAULT_CATEGORIES[index % DEFAULT_CATEGORIES.length]?.gradient ||
              'from-blue-500 to-indigo-500',
            bg:
              DEFAULT_CATEGORIES[index % DEFAULT_CATEGORIES.length]?.bg ||
              'bg-blue-50',
          }),
        );

        setCategories(mappedCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const banners = [
    { id: 1, image: require('../../assets/banners/banner1.jpg') },
    { id: 2, image: require('../../assets/banners/banner2.jpg') },
  ];

  // Use the shared products data
  const flashSaleItems = products.slice(0, 3);

  const mapProductFromApi = (item: any) => {
    const mainImage = item.product_image ? { uri: item.product_image } : null;

    const extraImages = Array.isArray(item.images)
      ? item.images
          .map((img: any) => img.image_path)
          .filter(
            (url: string) =>
              typeof url === 'string' && url.startsWith('https://'),
          )
          .map((url: string) => ({ uri: url }))
      : [];

    const images = mainImage ? [mainImage, ...extraImages] : extraImages;

    const originalPrice = parseFloat(item.product_price) || 0;
    const discountPercent = parseFloat(item.product_discount) || 0;
    const discountedPrice =
      originalPrice - (discountPercent * originalPrice) / 100;

    return {
      id: item.product_id,
      name: item.product_name,
      image: mainImage,
      images,
      price:
        discountPercent > 0
          ? Math.round(discountedPrice * 100) / 100
          : originalPrice,
      oldPrice: originalPrice,
      discount: discountPercent,
      stock: item.product_stock ?? 0,
      rating: parseFloat(item.product_rating) ?? 0,
      reviews: 0,
      sold: 0,
      // badges: item.is_on_sale ? ['On Sale'] : [],
      description: item.product_description ?? '',
      product_cod: item.product_cod ?? 0,
      store_name: item.store?.store_name ?? 'Unknown Store',
      store_id: item.store?.store_id ?? 0,
      category: item.product_category ?? '',
    };
  };

  // Create data items for the main list
  const listData = [
    { type: 'header' },
    { type: 'banner' },
    { type: 'bannerSwiper' },
    { type: 'content' },
    { type: 'middleBanner' },
    { type: 'flashSale' },
    { type: 'products' },
  ];

  const renderItem: ListRenderItem<{ type: string }> = ({ item }) => {
    switch (item.type) {
      case 'header':
        return (
          <View
            style={[
              styles.header,
              { paddingTop: insets.top + moderateScale(5) },
            ]}
          >
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
            <Link href={'/screen_navigation' as any} asChild>
              <TouchableOpacity style={styles.payButton}>
                <Text style={styles.payText}>Pay</Text>
              </TouchableOpacity>
            </Link>
          </View>
        );

      case 'banner':
        return (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>9.9 BIRTHDAY CART</Text>
            <Text style={styles.bannerSubText}>Buy More, Save More</Text>
          </View>
        );

      case 'bannerSwiper':
        return (
          <View style={styles.bannerSection}>
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
        );

      case 'content':
        return (
          <View style={styles.content}>
            <Text className="text-lg font-bold text-gray-700">Shop by Categories</Text>
            <View className="flex-row justify-between items-center mb-4">
              
              <TouchableOpacity
                style={{ width: scale(140), height: verticalScale(90) }}
                className="rounded-xl bg-yellow-100 p-3 justify-between"
              >
                {/* Top Row */}
                <View className="flex-row items-center rounded-lg">
                  <Image
                    source={require('../../assets/icons/icon1.png')}
                    style={{ width: scale(40), height: scale(40) }}
                    className="mr-3 rounded-md"
                    resizeMode="contain"
                  />
                  <View className="flex-col ml-2">
                    <Text className="text-lg font-bold text-black">60%</Text>
                    <Text className="text-lg font-bold text-black">OFF</Text>
                  </View>
                </View>

                {/* Bottom Row */}
                <View className="flex-row justify-between items-center bg-yellow-100">
                  <Text className="text-purple-600 font-semibold">
                    shop now
                  </Text>
                  <Text className="text-purple-600 text-lg">›</Text>
                </View>
              </TouchableOpacity>

              <View className="mt-4">
                <FlatList
                  data={categories}
                  renderItem={({ item }) => {
                    const IconComponent = item.icon;
                    return (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => console.log(`${item.name} clicked`)}
                        className="items-center mx-3"
                      >
                        <View
                          style={{ width: scale(70), height: scale(70) }}
                          className="bg-white p-4 rounded-2xl shadow-md flex items-center justify-center"
                        >
                          <IconComponent
                            width={scale(35)}
                            height={scale(35)}
                            color="#666"
                            strokeWidth={1.5}
                          />
                        </View>
                        <Text
                          style={{ fontSize: moderateScale(11) }}
                          className="font-semibold text-gray-700 mt-2 text-center"
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            </View>
          </View>
        );

      case 'middleBanner':
        return (
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
        );

      case 'flashSale':
        return (
          <View style={styles.saleContent}>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-700">
                Best Selling
              </Text>
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
        );

      case 'products':
        return (
          <View className="bg-white py-2" style={styles.productContent}>
            <FlatList
              data={products}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              renderItem={({ item }) => <LargeProductTile item={item} />}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false} // Disable scrolling for nested FlatList
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
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
    paddingHorizontal: moderateScale(10),
    paddingBottom: moderateScale(8),
  },
  iconButton: {
    padding: moderateScale(10),
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(10),
    height: verticalScale(35),
    marginHorizontal: scale(8),
  },
  searchBar: {
    flex: 1,
    fontSize: moderateScale(14),
    color: '#333',
    height: '100%',
  },
  searchButton: {
    backgroundColor: '#f57c00',
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(8),
    marginLeft: scale(8),
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: moderateScale(12),
  },
  payButton: {
    backgroundColor: '#4caf50',
    borderRadius: moderateScale(5),
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(8),
  },
  payText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: moderateScale(12),
  },
  swiperWrapper: {
    height: verticalScale(180),
    borderRadius: moderateScale(12),
    marginHorizontal: scale(8),
    overflow: 'hidden',
  },
  bannerSection: {
    alignItems: 'center',
    backgroundColor: '#FC8107FF',
    paddingVertical: verticalScale(10),
  },
  slide: {
    width,
    height: verticalScale(180),
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: {
    width,
    height: verticalScale(180),
  },
  overlay: {
    position: 'absolute',
    top: verticalScale(20),
    left: scale(20),
  },
  bannerText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  bannerSubText: {
    color: '#fff',
    fontSize: moderateScale(12),
    marginTop: verticalScale(5),
  },
  content: {
    flex: 1,
    padding: moderateScale(10),
    backgroundColor: '#fff',
  },
  saleContent: {
    flex: 1,
    padding: moderateScale(10),
    backgroundColor: '#fff',
    marginBottom: verticalScale(30),
  },
  productContent: {
    flex: 1,
    padding: moderateScale(10),
    backgroundColor: '#fff',
    marginBottom: verticalScale(80),
  },
  banner: {
    backgroundColor: '#FC8107FF',
    padding: moderateScale(5),
    alignItems: 'center',
  },
  categoryItem: {
    width: scale(80),
    alignItems: 'center',
    marginHorizontal: scale(6),
  },
});
