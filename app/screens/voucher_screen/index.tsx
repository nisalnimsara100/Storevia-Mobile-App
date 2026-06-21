import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Theme = 'pink' | 'teal';

interface Voucher {
  id: string;
  badge?: string;
  amountPrefix?: string;
  amountValue: string;
  amountSuffix?: string;
  minSpend: string;
  title: string;
  dateRange: string;
  theme: Theme;
  multiplier?: number;
  ranOut?: boolean;
}

const THEME: Record<Theme, { accent: string; soft: string; watermark: string }> = {
  pink: { accent: '#ec4899', soft: '#fdf2f8', watermark: '#fce7f3' },
  teal: { accent: '#0d9488', soft: '#f0fdfa', watermark: '#cffafe' },
};

const fashionVouchers: Voucher[] = [
  {
    id: 'f1',
    badge: 'Voucher Max',
    amountValue: '10',
    amountSuffix: '% OFF',
    minSpend: 'Rs. 499',
    title: 'Upto Rs.350 Off',
    dateRange: '20/06/2026-21/06/2026',
    theme: 'pink',
  },
];

const megaVouchers: Voucher[] = [
  {
    id: 'm1',
    badge: 'Voucher Max',
    amountValue: '10',
    amountSuffix: '% OFF',
    minSpend: 'Rs. 499',
    title: 'Upto Rs.350 Off',
    dateRange: '20/06/2026-21/06/2026',
    theme: 'pink',
  },
];

const freeShippingVouchers: Voucher[] = [
  {
    id: 's1',
    amountPrefix: 'Rs.',
    amountValue: '285',
    minSpend: 'Rs. 899',
    title: 'Selected Sellers',
    dateRange: '01/06/2026-30/06/2026',
    theme: 'teal',
  },
  {
    id: 's2',
    amountPrefix: 'Rs.',
    amountValue: '350',
    minSpend: 'Rs. 999',
    title: 'Selected Sellers',
    dateRange: '16/06/2026-30/06/2026',
    theme: 'teal',
    multiplier: 2,
  },
  {
    id: 's3',
    amountPrefix: 'Rs.',
    amountValue: '310',
    minSpend: 'Rs. 899',
    title: 'Fashion',
    dateRange: '01/06/2026-30/06/2026',
    theme: 'teal',
    ranOut: true,
  },
];

const VoucherScreen = () => {
  const router = useRouter();
  const [collected, setCollected] = useState<Record<string, boolean>>({});

  const toggleCollect = (id: string) => {
    setCollected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const collectAll = (vouchers: Voucher[]) => {
    setCollected((prev) => {
      const next = { ...prev };
      vouchers.forEach((v) => {
        if (!v.ranOut) next[v.id] = true;
      });
      return next;
    });
  };

  const VoucherCard = ({ voucher }: { voucher: Voucher }) => {
    const t = THEME[voucher.theme];
    const isCollected = collected[voucher.id];
    const disabled = voucher.ranOut;
    const accent = disabled ? '#9ca3af' : t.accent;

    return (
      <View
        className="mx-4 mb-3 rounded-2xl bg-white overflow-hidden"
        style={{ borderWidth: 1, borderColor: '#f1f1f1' }}
      >
        {/* Watermark */}
        <Text
          numberOfLines={1}
          style={{ color: disabled ? '#f3f4f6' : t.watermark }}
          className="absolute top-3 right-2 text-3xl font-extrabold"
        >
          {voucher.theme === 'teal' ? 'FREE SHIPPING' : 'STOREVIA VOUCHER'}
        </Text>

        <View className="flex-row">
          {/* Left amount block */}
          <View
            className="items-center justify-center py-4 px-2"
            style={{
              width: 118,
              borderRightWidth: 1,
              borderStyle: 'dashed',
              borderColor: '#e5e7eb',
            }}
          >
            {voucher.badge && (
              <View
                className="px-2 py-0.5 rounded-md mb-1"
                style={{ backgroundColor: disabled ? '#9ca3af' : '#fb923c' }}
              >
                <Text className="text-white text-[10px] font-bold">
                  {voucher.badge}
                </Text>
              </View>
            )}
            <View className="flex-row items-baseline">
              {voucher.amountPrefix && (
                <Text
                  className="text-lg font-extrabold"
                  style={{ color: accent }}
                >
                  {voucher.amountPrefix}
                </Text>
              )}
              <Text className="text-3xl font-extrabold" style={{ color: accent }}>
                {voucher.amountValue}
              </Text>
              {voucher.amountSuffix && (
                <Text
                  className="text-sm font-extrabold ml-0.5"
                  style={{ color: accent }}
                >
                  {voucher.amountSuffix}
                </Text>
              )}
            </View>
            <Text className="text-[11px] text-gray-500 mt-1">
              Min. Spend{' '}
              <Text className="font-bold text-gray-700">{voucher.minSpend}</Text>
            </Text>
          </View>

          {/* Right content block */}
          <View className="flex-1 p-3">
            <View className="flex-row justify-between items-start">
              <Text
                className="text-base font-bold flex-1 pr-2"
                style={{ color: disabled ? '#9ca3af' : '#1f2937' }}
                numberOfLines={2}
              >
                {voucher.title}
              </Text>
              <Text className="text-[11px]" style={{ color: accent }}>
                T&C
              </Text>
            </View>

            <View className="flex-row justify-between items-end mt-4">
              <Text className="text-[11px] text-gray-500 flex-1">
                {voucher.dateRange}
              </Text>

              {disabled ? (
                <View
                  className="px-4 py-2 rounded-lg border"
                  style={{ borderColor: '#d1d5db' }}
                >
                  <Text className="text-gray-400 font-bold text-xs">
                    Ran Out
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => toggleCollect(voucher.id)}
                  className="px-5 py-2 rounded-lg flex-row items-center"
                  style={{
                    backgroundColor: isCollected ? '#fff' : accent,
                    borderWidth: isCollected ? 1 : 0,
                    borderColor: accent,
                  }}
                >
                  {isCollected && (
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={accent}
                      style={{ marginRight: 4 }}
                    />
                  )}
                  <Text
                    className="font-bold text-sm"
                    style={{ color: isCollected ? accent : '#fff' }}
                  >
                    {isCollected
                      ? 'Collected'
                      : voucher.multiplier
                        ? `Collect x${voucher.multiplier}`
                        : 'Collect'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const SectionHeader = ({
    icon,
    title,
    onCollectAll,
    accent,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    onCollectAll: () => void;
    accent: string;
  }) => (
    <View className="flex-row items-center justify-between px-4 mt-5 mb-2">
      <View className="flex-row items-center flex-1">
        <View
          className="w-7 h-7 rounded-full items-center justify-center mr-2"
          style={{ backgroundColor: accent }}
        >
          <Ionicons name={icon} size={16} color="#fff" />
        </View>
        <Text className="text-lg font-bold text-gray-900">{title}</Text>
      </View>
      <TouchableOpacity
        onPress={onCollectAll}
        className="px-3 py-1.5 rounded-lg border"
        style={{ borderColor: accent }}
      >
        <Text className="font-bold text-xs" style={{ color: accent }}>
          Collect all
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-slate-100">
      {/* Header */}
      <LinearGradient colors={['#fde047', '#facc15']}>
        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="pr-2">
              <Ionicons name="chevron-back" size={26} color="#111827" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900">
              Voucher Center
            </Text>
          </View>
          <Ionicons name="ticket-outline" size={26} color="#111827" />
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Fashion category banner */}
        <LinearGradient
          colors={['#f43f5e', '#ec4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginBottom: 12,
          }}
        >
          <Text className="text-white text-lg font-bold">
            Fashion Category Vouchers
          </Text>
          <View className="bg-white px-3 py-1 rounded-full">
            <Text className="text-pink-600 font-bold text-xs">Swipe ‹‹</Text>
          </View>
        </LinearGradient>

        {fashionVouchers.map((v) => (
          <VoucherCard key={v.id} voucher={v} />
        ))}

        {/* Mega Saving */}
        <SectionHeader
          icon="pricetag"
          title="Mega Saving Vouchers"
          accent={THEME.pink.accent}
          onCollectAll={() => collectAll(megaVouchers)}
        />
        <Text className="px-4 mb-2 text-sm font-semibold text-gray-700">
          Platform Wide Storevia Vouchers
        </Text>
        {megaVouchers.map((v) => (
          <VoucherCard key={v.id} voucher={v} />
        ))}

        {/* Free shipping */}
        <SectionHeader
          icon="car"
          title="Free shipping vouchers"
          accent={THEME.teal.accent}
          onCollectAll={() => collectAll(freeShippingVouchers)}
        />
        {freeShippingVouchers.map((v) => (
          <VoucherCard key={v.id} voucher={v} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default VoucherScreen;
