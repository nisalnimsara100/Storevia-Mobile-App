import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { useState, useCallback, useEffect, useRef } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useAuthStore } from '../../stores/useAuthStore';

interface Suggestion {
  product_id?: number;
  product_name?: string;
  product_image?: string;
  name?: string;
  [key: string]: any;
}

const DISCOVERY_ITEMS = [
  '12 pro back cover',
  '15 pro max back cover',
  '15 pro back cover',
  '11 back cover',
];

const SearchScreen = () => {
  const { param } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [localSearchQuery, setLocalSearchQuery] = useState(
    (param as string) || '',
  );
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'history' | 'image'>('history');
  const [discoveryVisible, setDiscoveryVisible] = useState(true);
  const baseUrl = process.env.EXPO_PUBLIC_APP_BASE_URL;

  const fetchSearchedHistory = useCallback(async () => {
    const userEmail = user?.email || '';
    if (!userEmail) {
      setHistory([]);
      return;
    }
    try {
      const response = await fetch(
        `${baseUrl}/api/search_history/${encodeURIComponent(userEmail)}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        },
      );
      const data = await response.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch {}
  }, [user?.email, baseUrl]);

  useEffect(() => {
    fetchSearchedHistory();
  }, [fetchSearchedHistory]);

  useEffect(() => {
    if (param) {
      setLocalSearchQuery(param as string);
    }
  }, [param]);

  const saveSearchKeyword = async (keyword: string) => {
    const userEmail = user?.email || '';
    const formData = new FormData();
    formData.append('user_email', userEmail);
    formData.append('keyword', keyword);

    try {
      await fetch(`${baseUrl}/api/save_search_keywords`, {
        method: 'POST',
        body: formData,
      });
    } catch {}
  };

  const clearSearchHistory = async () => {
    const userEmail = user?.email || '';
    const formData = new FormData();
    formData.append('user_email', userEmail);

    try {
      const res = await fetch(`${baseUrl}/api/clear_search_history`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.status === 'success') {
        setHistory([]);
      }
    } catch {}
  };

  const handleSearch = () => {
    if (localSearchQuery.trim()) {
      saveSearchKeyword(localSearchQuery);
      router.push(`/search?param=${encodeURIComponent(localSearchQuery)}`);
      setHistory((prev) => [
        localSearchQuery.trim(),
        ...prev.filter((h) => h !== localSearchQuery.trim()),
      ]);
    }
  };

  const fetchSuggestions = async (keyword: string) => {
    if (keyword.trim().length < 1) {
      setSuggestions([]);
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
      setSuggestions(Array.isArray(data) ? data : []);
    } catch {}
  };

  const handleInputChange = (value: string) => {
    setLocalSearchQuery(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    const term = suggestion.product_name || suggestion.name || '';
    if (term) {
      setLocalSearchQuery(term);
      saveSearchKeyword(term);
      setHistory((prev) => [term, ...prev.filter((h) => h !== term)]);
      router.push(`/search?param=${encodeURIComponent(term)}`);
    }
  };

  const handleHistoryItemClick = (item: string) => {
    setLocalSearchQuery(item);
    saveSearchKeyword(item);
    router.push(`/search?param=${encodeURIComponent(item)}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      {/* Header */}
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
            placeholder="Search products, shops, and more"
            placeholderTextColor="#9ca3af"
            autoFocus
            returnKeyType="search"
            className="flex-1 text-gray-800"
            style={{ fontSize: moderateScale(13), height: '100%' }}
          />
          <TouchableOpacity className="pl-2">
            <Ionicons
              name="camera-outline"
              size={moderateScale(20)}
              color="#6b7280"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => handleSearch()}
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

      {localSearchQuery.length > 0 && suggestions.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-4 pt-2"
        >
          {suggestions.map((s, i) => (
            <TouchableOpacity
              key={s.product_id?.toString() || s.name || i.toString()}
              onPress={() => handleSuggestionClick(s)}
              className="flex-row items-center py-3 border-b border-gray-100"
            >
              {s.product_image ? (
                <Image
                  source={{
                    uri: s.product_image.startsWith('http')
                      ? s.product_image
                      : `${baseUrl}/images/${s.product_image}`,
                  }}
                  style={{
                    width: scale(40),
                    height: scale(40),
                    borderRadius: scale(6),
                    marginRight: scale(12),
                  }}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={{
                    width: scale(40),
                    height: scale(40),
                    borderRadius: scale(6),
                    marginRight: scale(12),
                    backgroundColor: '#d1d5db',
                  }}
                />
              )}
              <Text
                className="text-gray-700 font-medium flex-1"
                style={{ fontSize: moderateScale(14) }}
                numberOfLines={2}
              >
                {s.product_name || s.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-4 pt-2"
        >
          {/* Search / Image history tabs */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => setActiveTab('history')}>
                <Text
                  className={
                    activeTab === 'history'
                      ? 'text-black font-bold'
                      : 'text-gray-400 font-semibold'
                  }
                  style={{ fontSize: moderateScale(14) }}
                >
                  Search History
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab('image')}
                className="ml-4"
              >
                <Text
                  className={
                    activeTab === 'image'
                      ? 'text-black font-bold'
                      : 'text-gray-400 font-semibold'
                  }
                  style={{ fontSize: moderateScale(14) }}
                >
                  Image History
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === 'history' && history.length > 0 && (
              <TouchableOpacity
                onPress={clearSearchHistory}
                className="flex-row items-center"
              >
                <Text
                  className="text-gray-400 mr-1"
                  style={{ fontSize: moderateScale(12) }}
                >
                  Clear All
                </Text>
                <Ionicons
                  name="trash-outline"
                  size={moderateScale(15)}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            )}
          </View>

          {activeTab === 'history' ? (
            history.length === 0 ? (
              <Text
                className="text-gray-400 mb-5"
                style={{ fontSize: moderateScale(12) }}
              >
                No search history yet
              </Text>
            ) : (
              <View className="flex-row flex-wrap mb-5">
                {history.map((item, index) => {
                  const keyword =
                    typeof item === 'string'
                      ? item
                      : item.search_keyword_name || item.keyword || '';
                  if (!keyword) return null;
                  return (
                    <TouchableOpacity
                      key={
                        typeof item === 'object' && item.search_id
                          ? item.search_id.toString()
                          : keyword + index
                      }
                      onPress={() => handleHistoryItemClick(keyword)}
                      className="bg-gray-100 rounded-lg mr-2 mb-2"
                      style={{
                        paddingHorizontal: scale(12),
                        paddingVertical: verticalScale(8),
                      }}
                    >
                      <Text
                        className="text-gray-700"
                        style={{ fontSize: moderateScale(12) }}
                      >
                        {keyword}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )
          ) : (
            <View className="items-center justify-center py-10 mb-5">
              <Ionicons
                name="image-outline"
                size={moderateScale(32)}
                color="#d1d5db"
              />
              <Text
                className="text-gray-400 mt-2"
                style={{ fontSize: moderateScale(12) }}
              >
                No image search history yet
              </Text>
            </View>
          )}

          {/* Search discovery */}
          <View className="flex-row items-center justify-between mb-3">
            <Text
              className="text-black font-bold"
              style={{ fontSize: moderateScale(14) }}
            >
              Search Discovery
            </Text>
            <TouchableOpacity
              onPress={() => setDiscoveryVisible((v) => !v)}
              className="flex-row items-center"
            >
              <Text
                className="text-gray-400 mr-1"
                style={{ fontSize: moderateScale(12) }}
              >
                {discoveryVisible ? 'Hide' : 'Show'}
              </Text>
              <Ionicons
                name={discoveryVisible ? 'eye-outline' : 'eye-off-outline'}
                size={moderateScale(15)}
                color="#9ca3af"
              />
            </TouchableOpacity>
          </View>

          {discoveryVisible && (
            <View className="flex-row flex-wrap justify-between mb-8">
              {DISCOVERY_ITEMS.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => handleHistoryItemClick(item)}
                  className="bg-gray-100 rounded-lg mb-3"
                  style={{
                    paddingHorizontal: scale(12),
                    paddingVertical: verticalScale(10),
                    width: '48%',
                  }}
                >
                  <Text
                    className="text-gray-700"
                    style={{ fontSize: moderateScale(12) }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;
