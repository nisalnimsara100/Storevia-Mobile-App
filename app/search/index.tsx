import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '../components/ProductCard';

export default function SearchResultsScreen() {
  const { param } = useLocalSearchParams();
  const router = useRouter();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('Best Match');
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
    <View className="bg-white border-b border-gray-200">
      {/* Top Bar */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="chevron-back-outline" size={28} color="#111" />
        </TouchableOpacity>
        <View className="flex-1 flex-row items-center h-12 border border-orange-500 rounded-lg px-3 bg-white">
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput 
            className="flex-1 ml-2 text-base h-full"
            defaultValue={param as string}
            placeholder="Search..."
          />
          <TouchableOpacity>
            <Ionicons name="camera-outline" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Primary Nav */}
      <View className="flex-row items-center px-4 py-2 border-b border-gray-100">
        <TouchableOpacity onPress={() => setSelectedTab('Best Match')}>
            <Text className={`${selectedTab === 'Best Match' ? 'text-orange-500 font-semibold' : 'text-gray-700'} mr-6 text-sm`}>Best Match</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('Top Sales')}>
            <Text className={`${selectedTab === 'Top Sales' ? 'text-orange-500 font-semibold' : 'text-gray-700'} mr-6 text-sm`}>Top Sales</Text>
        </TouchableOpacity>
        <View className="flex-row items-center">
          <Text className="text-gray-700 mr-1 text-sm">Price</Text>
          <View className="flex-col">
            <TouchableOpacity onPress={() => setSelectedTab('Price Up')}>
              <Ionicons name="chevron-up-outline" size={10} color={selectedTab === 'Price Up' ? '#f97316' : '#6b7280'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedTab('Price Down')}>
              <Ionicons name="chevron-down-outline" size={10} color={selectedTab === 'Price Down' ? '#f97316' : '#6b7280'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Secondary Nav: Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-2 pb-3 pt-2">
        <TouchableOpacity onPress={() => setSelectedTab('Filter')} className="flex-row items-center border border-gray-200 rounded-sm px-3 py-1.5 mx-1 bg-gray-50">
          <Ionicons name="funnel-outline" size={14} color={selectedTab === 'Filter' ? '#f97316' : '#333'} className="mr-1" />
          <Text className={`${selectedTab === 'Filter' ? 'text-orange-500' : 'text-gray-700'} text-xs`}>Filter</Text>
        </TouchableOpacity>
        {['Buy More Save More', 'Mall', 'Free Delivery', 'Gems'].map((tag) => (
          <TouchableOpacity key={tag} onPress={() => setSelectedTab(tag)} className={`rounded-sm px-3 py-1.5 mx-1 border ${selectedTab === tag ? 'bg-orange-50 border-orange-500' : 'bg-gray-100 border-gray-200'}`}>
            <Text className={`${selectedTab === tag ? 'text-orange-500' : 'text-gray-700'} text-xs`}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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