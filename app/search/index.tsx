import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '../components/ProductCard';

export default function SearchResultsScreen() {
  const { param } = useLocalSearchParams();
  const router = useRouter();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.EXPO_PUBLIC_APP_BASE_URL;

  useEffect(() => {
    if (param) {
      fetchResults(param as string);
    } else {
      setLoading(false);
    }
  }, [param]);

  const fetchResults = async (keyword: string) => {
    console.log("Keyword: ", keyword);
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/searched_products/${encodeURIComponent(keyword)}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });
      const data = await res.json();
      setResults(data?.products && Array.isArray(data.products) ? data.products : []);
    } catch (err) {
      console.error('Error fetching search results:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
      <TouchableOpacity onPress={() => router.back()} className="mr-4">
        <Ionicons name="arrow-back" size={24} color="#111" />
      </TouchableOpacity>
      <Text className="text-lg font-bold flex-1" numberOfLines={1}>
        Results for "{param}"
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom']}>
      {renderHeader()}
      
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      ) : results.length === 0 ? (
        <View className="flex-1 justify-center items-center px-4">
          <Ionicons name="search-outline" size={64} color="#d1d5db" />
          <Text className="text-gray-500 text-lg mt-4 text-center">
            No products found for "{param}"
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => item.product_id?.toString() || index.toString()}
          numColumns={2}
          contentContainerStyle={{ padding: 8 }}
          renderItem={({ item }) => (
            <ProductCard
              item={{
                id: item.product_id,
                name: item.product_name || 'Unknown Product',
                image: item.product_image
                  ? (item.product_image.startsWith('http') ? item.product_image : `${baseUrl}/images/${item.product_image}`)
                  : 'https://via.placeholder.com/150',
                price: parseFloat(item.product_price) || 0,
                oldPrice: item.old_price,
                discount: parseFloat(item.product_discount) || parseFloat(item.sale_discount) || 0,
                rating: parseFloat(item.product_rating) || 0,
                reviews: 0,
                sold: item.product_stock || 0,
              }}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
