import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { ProductCard } from '@/components/ui';

interface ApiProduct {
  product_id?: number | string;
  product_name?: string;
  product_image?: string;
  product_price?: string | number;
  old_price?: number;
  product_discount?: string | number;
  sale_discount?: string | number;
  product_rating?: string | number;
  product_stock?: number;
  [key: string]: any;
}

const FILTER_CHIPS = ['Buy More Save More', 'Mall', 'Free Delivery', 'Gems'];

const SearchResultsScreen = () => {
  const { param } = useLocalSearchParams();
  const router = useRouter();
  const baseUrl = process.env.EXPO_PUBLIC_APP_BASE_URL;

  const [localSearchQuery, setLocalSearchQuery] = useState(
    (param as string) || '',
  );
  const [results, setResults] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('Best Match');

  const fetchResults = useCallback(
    async (keyword: string) => {
      setLoading(true);
      try {
        const res = await fetch(
          `${baseUrl}/api/searched_products/${encodeURIComponent(keyword)}`,
          {
            method: 'GET',
            headers: { Accept: 'application/json' },
          },
        );
        const data = await res.json();
        setResults(
          data?.products && Array.isArray(data.products) ? data.products : [],
        );
      } catch (err) {
        console.error('Error fetching search results:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [baseUrl],
  );

  useEffect(() => {
    if (param) {
      setLocalSearchQuery(param as string);
      fetchResults(param as string);
    } else {
      setLoading(false);
    }
  }, [param, fetchResults]);

  const handleSearch = () => {
    if (localSearchQuery.trim()) {
      router.push(
        `/search?param=${encodeURIComponent(localSearchQuery.trim())}` as any,
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="bg-white border-b border-gray-200">
        {/* Top bar */}
        <View className="flex-row items-center px-3 py-2">
          <TouchableOpacity onPress={() => router.back()} className="pr-2 py-1">
            <Ionicons
              name="chevron-back"
              size={moderateScale(24)}
              color="#111"
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 flex-row items-center bg-white rounded-full px-3 mr-2"
            style={{
              height: verticalScale(38),
              borderWidth: 1.5,
              borderColor: '#f97316',
            }}
            activeOpacity={0.8}
            onPress={() =>
              router.push(
                `/screens/search_screen?param=${encodeURIComponent(localSearchQuery)}` as any,
              )
            }
          >
            <TextInput
              value={localSearchQuery}
              onChangeText={setLocalSearchQuery}
              onSubmitEditing={handleSearch}
              editable={false}
              placeholder="Search products, shops, and more"
              placeholderTextColor="#9ca3af"
              returnKeyType="search"
              className="flex-1 text-gray-800"
              style={{ fontSize: moderateScale(13), height: '100%' }}
            />
            <Ionicons
              name="camera-outline"
              size={moderateScale(20)}
              color="#6b7280"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSearch}
            className="bg-orange-500 rounded-full"
            style={{
              paddingHorizontal: scale(14),
              paddingVertical: verticalScale(8),
            }}
          >
            <Text
              className="text-white font-semibold"
              style={{ fontSize: moderateScale(13) }}
            >
              Search
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sort tabs */}
        <View className="flex-row items-center px-4 py-2 border-b border-gray-100">
          <TouchableOpacity onPress={() => setSelectedTab('Best Match')}>
            <Text
              className={`${selectedTab === 'Best Match' ? 'text-orange-500 font-semibold' : 'text-gray-700'} mr-6 text-sm`}
            >
              Best Match
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedTab('Top Sales')}>
            <Text
              className={`${selectedTab === 'Top Sales' ? 'text-orange-500 font-semibold' : 'text-gray-700'} mr-6 text-sm`}
            >
              Top Sales
            </Text>
          </TouchableOpacity>
          <View className="flex-row items-center">
            <Text className="text-gray-700 mr-1 text-sm">Price</Text>
            <View className="flex-col">
              <TouchableOpacity onPress={() => setSelectedTab('Price Up')}>
                <Ionicons
                  name="chevron-up-outline"
                  size={10}
                  color={selectedTab === 'Price Up' ? '#f97316' : '#6b7280'}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedTab('Price Down')}>
                <Ionicons
                  name="chevron-down-outline"
                  size={10}
                  color={selectedTab === 'Price Down' ? '#f97316' : '#6b7280'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-2 pb-3 pt-2"
        >
          <TouchableOpacity
            onPress={() => setSelectedTab('Filter')}
            className="flex-row items-center border border-gray-200 rounded-sm px-3 py-1.5 mx-1 bg-gray-50"
          >
            <Ionicons
              name="funnel-outline"
              size={14}
              color={selectedTab === 'Filter' ? '#f97316' : '#333'}
              style={{ marginRight: 4 }}
            />
            <Text
              className={`${selectedTab === 'Filter' ? 'text-orange-500' : 'text-gray-700'} text-xs`}
            >
              Filter
            </Text>
          </TouchableOpacity>
          {FILTER_CHIPS.map((tag) => (
            <TouchableOpacity
              key={tag}
              onPress={() => setSelectedTab(tag)}
              className={`rounded-sm px-3 py-1.5 mx-1 border ${selectedTab === tag ? 'bg-orange-50 border-orange-500' : 'bg-gray-100 border-gray-200'}`}
            >
              <Text
                className={`${selectedTab === tag ? 'text-orange-500' : 'text-gray-700'} text-xs`}
              >
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      ) : results.length === 0 ? (
        <View className="flex-1 justify-center items-center px-4">
          <Ionicons name="search-outline" size={64} color="#d1d5db" />
          <Text className="text-gray-500 text-lg mt-4 text-center">
            No products found for &quot;{param}&quot;
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) =>
            item.product_id?.toString() || index.toString()
          }
          numColumns={2}
          contentContainerStyle={{ padding: 8 }}
          renderItem={({ item }) => (
            <ProductCard
              variant="grid"
              product={{
                id: item.product_id ?? '',
                name: item.product_name || 'Unknown Product',
                image: item.product_image
                  ? item.product_image.startsWith('http')
                    ? item.product_image
                    : `${baseUrl}/images/${item.product_image}`
                  : require('../../assets/products/placeholder.jpg'),
                price: parseFloat(String(item.product_price)) || 0,
                oldPrice: item.old_price,
                discount:
                  parseFloat(String(item.product_discount)) ||
                  parseFloat(String(item.sale_discount)) ||
                  0,
                rating: parseFloat(String(item.product_rating)) || 0,
                reviews: 0,
                sold: item.product_stock || 0,
              }}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default SearchResultsScreen;
