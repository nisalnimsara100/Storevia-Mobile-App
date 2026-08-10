import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const promos = [
  {
    id: '1',
    title: '75% දැක්වූ සුපිරි Grocery Deals',
    time: '10:00 AM',
    image: require('../../../assets/banners/banner1.jpg'),
    desc: 'අද තමයි දවම ❗👇',
  },
  {
    id: '2',
    title: 'HOT DEALS ❗👇',
    time: 'Yesterday',
    image: require('../../../assets/banners/banner2.jpg'),
    desc: '80% දක්වා වට්ටම්! Fashion, Electronics සහ තවත් දේවල්!',
  },
];

const PromoCard = ({ item }: { item: any }) => {
  return (
    <View className="px-4">
      <TouchableOpacity
        activeOpacity={0.95}
        style={{ borderWidth: 1, borderColor: '#e8e8e8' }}
        className="bg-white rounded-2xl overflow-hidden my-3"
      >
        <View className="flex-row items-center p-4">
          <View className="w-12 h-12 bg-pink-400 rounded-lg items-center justify-center mr-3 relative">
            <Ionicons name="megaphone" size={18} color="white" />
            <View className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
          </View>
          <View className="flex-1">
            <Text className="font-bold text-lg">{item.title}</Text>
            <Text className="text-sm text-gray-500 mt-1">{item.time}</Text>
          </View>
        </View>

        <View className="px-4">
          <View className="w-full h-40 rounded-lg overflow-hidden bg-gray-100">
            <Image
              source={item.image}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </View>

        <View className="p-4 pt-3 pb-6">
          <Text className="text-gray-700">{item.desc} 🍪🍰👇</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const PromosScreen = () => {
  return (
    // Keep the top safe area white so status bar and header appear on white
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      {/* Header stays on the white safe area to match the design */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <TouchableOpacity className="p-1">
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Text className="text-lg font-semibold">Promos</Text>

        <TouchableOpacity className="p-1">
          <Ionicons name="settings-outline" size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Content area uses a light gray background; cards remain white */}
      <View className="flex-1 bg-slate-100">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 48 }}
        >
          {promos.map((p) => (
            <PromoCard key={p.id} item={p} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PromosScreen;
