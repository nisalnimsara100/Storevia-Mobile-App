import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '../components/ProductCard';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

import { useAuthStore } from '../stores/useAuthStore';


  interface Suggestion {
  product_id?: number;
  product_name?: string;
  product_image?: string;
  name?: string;
  [key: string]: any;
}

interface SearchResult {
  [key: string]: any;
}

export default function SearchResultsScreen() {
  const { param } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('Best Match');
  const baseUrl = process.env.EXPO_PUBLIC_APP_BASE_URL;

  useEffect(() => {
    if (param) {
      setLocalSearchQuery(param as string);
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



    const [localSearchQuery, setLocalSearchQuery] = useState((param as string) || '');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
      const [isSearchHistoryOpen, setIsSearchHistoryOpen] = useState(true);
      const [history, setHistory] = useState<any[]>([]);

      const saveSearchKeyword = async (keyword: string) => {
    const userEmail = user?.email || '';
    const formData = new FormData();
    formData.append('user_email', userEmail);
    formData.append('keyword', keyword);
    console.log("User Email: ", userEmail);
    console.log("Keyword: ", keyword);
    console.log("Base URL: ", baseUrl);

    try {
      const res = await fetch(`${baseUrl}/api/save_search_keywords`, {
        method: 'POST',
        body: formData,
      });
      // await res.json();
      const data = res.json();
      console.log("Save Keywords: ", data);
    } catch(e) {
      console.log(e);
    }
  };
      

    const fetchSuggestions = async (keyword: string) => {
    if (keyword.trim().length < 1) {
      setSuggestions([]);
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/api/search_keywords/${keyword}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });
      const data = await res.json();
      console.log("data", data)
      setSuggestions(Array.isArray(data) ? data : []);

      const productRes = await fetch(`${baseUrl}/api/searched_products/${keyword}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });
      const productData = await productRes.json();
      setSearchResults(Array.isArray(productData) ? productData : []);
    } catch {}
  };

  const handleInputChange = (value: string) => {
    setLocalSearchQuery(value);
    setIsSearchHistoryOpen(true);
    fetchSuggestions(value);
  };

    const handleSearch = () => {
    if (localSearchQuery.trim()) {
      saveSearchKeyword(localSearchQuery);
      router.push(`/search?param=${encodeURIComponent(localSearchQuery)}`);
      setIsSearchHistoryOpen(false);
      setHistory((prev) => [localSearchQuery.trim(), ...prev.filter((h) => h !== localSearchQuery.trim())]);
    }
  };



  const renderHeader = () => (
    <View className="bg-white border-b border-gray-200">
      {/* Top Bar */}
      <View className="flex-row items-center px-3 py-2">
              <TouchableOpacity onPress={() => router.back()} className="pr-2 py-1">
                <Ionicons name="chevron-back" size={moderateScale(24)} color="#111" />
              </TouchableOpacity>
      
              <View
                className="flex-1 flex-row items-center bg-white rounded-full px-3 mr-2"
                style={{
                  height: verticalScale(38),
                  borderWidth: 1.5,
                  borderColor: '#f97316',
                }}
              >
                <TextInput
                
                  value={localSearchQuery}
                  onChangeText={handleInputChange}
                  onSubmitEditing={() => handleSearch()}
                  onFocus={() => router.push(`/screens/search_screen?param=${encodeURIComponent(localSearchQuery)}` as any)}
                  placeholder="Search products, shops, and more"
                  placeholderTextColor="#9ca3af"
                  returnKeyType="search"
                  className="flex-1 text-gray-800"
                  style={{ fontSize: moderateScale(13), height: '100%' }}
                />
                <TouchableOpacity className="pl-2">
                  <Ionicons name="camera-outline" size={moderateScale(20)} color="#6b7280" />
                </TouchableOpacity>
              </View>
      
              <TouchableOpacity
                onPress={() => handleSearch()}
                className="bg-orange-500 rounded-full"
                style={{ paddingHorizontal: scale(14), paddingVertical: verticalScale(8) }}
              >
                <Text className="text-white font-semibold" style={{ fontSize: moderateScale(13) }}>
                  Search
                </Text>
              </TouchableOpacity>
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