import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const SUGGESTIONS = [
  'iphone 16 pro back cover',
  'iphone 16 back cover',
  '11 pro max back cover',
];

const DISCOVERY_ITEMS = [
  '12 pro back cover',
  '15 pro max back cover',
  '15 pro back cover',
  '11 back cover',
];

const SearchScreen = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<string[]>(['14 pro back cover']);
  const [activeTab, setActiveTab] = useState<'history' | 'image'>('history');
  const [discoveryVisible, setDiscoveryVisible] = useState(true);

  const runSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setHistory((prev) => [trimmed, ...prev.filter((h) => h !== trimmed)]);
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
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => runSearch(query)}
            placeholder="Search products, shops, and more"
            placeholderTextColor="#9ca3af"
            autoFocus
            returnKeyType="search"
            className="flex-1 text-gray-800"
            style={{ fontSize: moderateScale(13), height: '100%' }}
          />
          <TouchableOpacity className="pl-2">
            <Ionicons name="camera-outline" size={moderateScale(20)} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => runSearch(query)}
          className="bg-orange-500 rounded-full"
          style={{ paddingHorizontal: scale(14), paddingVertical: verticalScale(8) }}
        >
          <Text className="text-white font-semibold" style={{ fontSize: moderateScale(13) }}>
            Search
          </Text>
        </TouchableOpacity>
      </View>

      {/* Autocomplete suggestions */}
      {query.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 pb-2"
        >
          {SUGGESTIONS.map((s, i) => (
            <TouchableOpacity
              key={s}
              onPress={() => runSearch(s)}
              className="flex-row items-center"
            >
              <Text className="text-gray-500" style={{ fontSize: moderateScale(12) }}>
                {s}
              </Text>
              {i < SUGGESTIONS.length - 1 && (
                <View className="w-px h-3 bg-gray-300 mx-3" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4 pt-2">
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
            <TouchableOpacity onPress={() => setActiveTab('image')} className="ml-4">
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
              onPress={() => setHistory([])}
              className="flex-row items-center"
            >
              <Text className="text-gray-400 mr-1" style={{ fontSize: moderateScale(12) }}>
                Clear All
              </Text>
              <Ionicons name="trash-outline" size={moderateScale(15)} color="#9ca3af" />
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
              {history.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => runSearch(item)}
                  className="bg-gray-100 rounded-lg mr-2 mb-2"
                  style={{
                    paddingHorizontal: scale(12),
                    paddingVertical: verticalScale(8),
                  }}
                >
                  <Text className="text-gray-700" style={{ fontSize: moderateScale(12) }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )
        ) : (
          <View className="items-center justify-center py-10 mb-5">
            <Ionicons name="image-outline" size={moderateScale(32)} color="#d1d5db" />
            <Text className="text-gray-400 mt-2" style={{ fontSize: moderateScale(12) }}>
              No image search history yet
            </Text>
          </View>
        )}

        {/* Search discovery */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-black font-bold" style={{ fontSize: moderateScale(14) }}>
            Search Discovery
          </Text>
          <TouchableOpacity
            onPress={() => setDiscoveryVisible((v) => !v)}
            className="flex-row items-center"
          >
            <Text className="text-gray-400 mr-1" style={{ fontSize: moderateScale(12) }}>
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
                onPress={() => runSearch(item)}
                className="bg-gray-100 rounded-lg mb-3"
                style={{
                  paddingHorizontal: scale(12),
                  paddingVertical: verticalScale(10),
                  width: '48%',
                }}
              >
                <Text className="text-gray-700" style={{ fontSize: moderateScale(12) }}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
