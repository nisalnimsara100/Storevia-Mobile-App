import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/useAuthStore';

const BASE_URL = process.env.EXPO_PUBLIC_APP_BASE_URL;

type Theme = 'pink' | 'teal';

interface VoucherAPIResponse {
  voucherID: number;
  voucherCode: string;
  voucherDescription?: string;
  voucherDiscountType: 'flat' | 'percentage';
  voucherDiscountRate: string;
  voucherDiscountPrice: string;
  voucherExpiryDate?: string;
  voucher_minimumSpend: string;
  voucher_count: number;
  voucherStoreID?: number | null;
  voucher_created_by: 'seller' | 'admin';
  voucher_type: 'product' | 'shipping';
  created_at?: string;
  updated_at?: string;
}

interface Voucher {
  id: number;
  voucherCode: string;
  voucherDescription?: string;
  voucherDiscountType: 'flat' | 'percentage';
  discountPrice: number;
  discountRate: number;
  expiryDate: string;
  minSpend: number;
  voucherCount: number;
  storeID?: number | null;
  createdBy: 'seller' | 'admin';
  voucherType: 'product' | 'shipping';
  theme: Theme;
  amountLabel: string;
}

const THEME: Record<
  Theme,
  { accent: string; soft: string; watermark: string }
> = {
  pink: { accent: '#ec4899', soft: '#fdf2f8', watermark: '#fce7f3' },
  teal: { accent: '#0d9488', soft: '#f0fdfa', watermark: '#cffafe' },
};

const parseVoucher = (raw: VoucherAPIResponse): Voucher => {
  const discountPrice = parseFloat(raw.voucherDiscountPrice) || 0;
  const discountRate = parseFloat(raw.voucherDiscountRate) || 0;
  const minSpend = parseFloat(raw.voucher_minimumSpend) || 0;

  let amountLabel = '';
  if (raw.voucherDiscountType === 'flat') {
    if (discountPrice > 0) amountLabel = `Rs.${Math.floor(discountPrice)} OFF`;
    else if (discountRate > 0) amountLabel = `${discountRate}% OFF`;
    else amountLabel = 'Free';
  } else {
    amountLabel = discountRate > 0 ? `${discountRate}% OFF` : 'Discount';
  }

  const theme: Theme = raw.voucher_type === 'shipping' ? 'teal' : 'pink';

  return {
    id: raw.voucherID,
    voucherCode: raw.voucherCode,
    voucherDescription: raw.voucherDescription,
    voucherDiscountType: raw.voucherDiscountType,
    discountPrice,
    discountRate,
    expiryDate: raw.voucherExpiryDate || '',
    minSpend,
    voucherCount: raw.voucher_count,
    storeID: raw.voucherStoreID,
    createdBy: raw.voucher_created_by,
    voucherType: raw.voucher_type,
    theme,
    amountLabel,
  };
};

const VoucherScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  const [savingVouchers, setSavingVouchers] = useState<Voucher[]>([]);
  const [shippingVouchers, setShippingVouchers] = useState<Voucher[]>([]);
  const [collectedCodes, setCollectedCodes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVouchers = async () => {
      const email = user?.email;
      if (!email) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `${BASE_URL}/api/user/uncollected_vouchers/${encodeURIComponent(email)}`,
          { method: 'GET', headers: { Accept: 'application/json' } },
        );
        if (!response.ok) throw new Error('Failed to fetch vouchers');

        const result = await response.json();
        if (!result.success) throw new Error('API returned failure');

        const sellerVouchers = result.vouchers?.seller_vouchers ?? {};
        const adminVouchers = result.vouchers?.admin_vouchers ?? {};

        // shipping: seller + admin shipping arrays
        const sellerShipping: VoucherAPIResponse[] =
          sellerVouchers.shipping ?? [];
        const adminShipping: VoucherAPIResponse[] =
          adminVouchers.shipping ?? [];

        // product/saving: seller + admin product + admin_all + admin_selected arrays
        const sellerProduct: VoucherAPIResponse[] =
          sellerVouchers.product ?? [];
        const adminProduct: VoucherAPIResponse[] = adminVouchers.product ?? [];
        const adminAll: VoucherAPIResponse[] = adminVouchers.admin_all ?? [];
        const adminSelected: VoucherAPIResponse[] =
          adminVouchers.admin_selected ?? [];

        setShippingVouchers(
          [...sellerShipping, ...adminShipping].map(parseVoucher),
        );
        setSavingVouchers(
          [
            ...sellerProduct,
            ...adminProduct,
            ...adminAll,
            ...adminSelected,
          ].map(parseVoucher),
        );
      } catch (error) {
        console.error('Error fetching vouchers:', error);
        Alert.alert('Error', 'Failed to load vouchers');
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [user?.email]);

  const collectVoucher = async (
    voucherCode: string,
    storeId: number | null | undefined,
  ) => {
    const userEmail = user?.email;
    if (!userEmail) {
      Alert.alert('Error', 'Please log in to collect vouchers');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/seller/collect_voucher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voucher_code: voucherCode,
          user_email: userEmail,
          store_id: storeId ?? null,
        }),
      });

      if (!response.ok) throw new Error('Failed to collect voucher');

      setCollectedCodes((prev) => new Set([...prev, voucherCode]));
      Alert.alert('Success', 'Voucher collected successfully!');
    } catch (error) {
      console.error('Error collecting voucher:', error);
      Alert.alert('Error', 'Failed to collect voucher');
    }
  };

  const VoucherCard = ({ voucher }: { voucher: Voucher }) => {
    const t = THEME[voucher.theme];
    const isCollected = collectedCodes.has(voucher.voucherCode);
    const accent = t.accent;

    return (
      <View
        className="mx-4 mb-3 rounded-2xl bg-white overflow-hidden"
        style={{ borderWidth: 1, borderColor: '#f1f1f1' }}
      >
        {/* Watermark */}
        <Text
          numberOfLines={1}
          style={{ color: t.watermark }}
          className="absolute top-3 right-2 text-3xl font-poppinsBold"
        >
          {voucher.voucherType === 'shipping'
            ? 'FREE SHIPPING'
            : 'STOREVIA VOUCHER'}
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
            <View className="flex-row items-baseline">
              <Text
                className="text-2xl font-poppinsBold"
                style={{ color: accent }}
              >
                {voucher.amountLabel}
              </Text>
            </View>
            <Text className="text-[11px] text-gray-500 mt-1">
              Min. Spend{' '}
              <Text className="font-poppinsBold text-gray-700">
                Rs.{Math.floor(voucher.minSpend)}
              </Text>
            </Text>
          </View>

          {/* Right content block */}
          <View className="flex-1 p-3">
            <View className="flex-row justify-between items-start">
              <View className="flex-1 pr-2">
                <Text
                  className="text-base font-poppinsBold"
                  style={{ color: '#1f2937' }}
                  numberOfLines={2}
                >
                  {voucher.voucherDescription || voucher.voucherCode}
                </Text>
                <Text className="text-[11px] text-gray-400 mt-0.5">
                  Code: {voucher.voucherCode}
                </Text>
              </View>
              <Text className="text-[11px]" style={{ color: accent }}>
                T&C
              </Text>
            </View>

            <View className="flex-row justify-between items-end mt-3">
              <Text className="text-[11px] text-gray-500 flex-1">
                {voucher.expiryDate ? `Expires: ${voucher.expiryDate}` : ''}
              </Text>

              {isCollected ? (
                <View
                  className="px-4 py-2 rounded-lg flex-row items-center"
                  style={{ borderWidth: 1, borderColor: accent }}
                >
                  <Ionicons
                    name="checkmark"
                    size={14}
                    color={accent}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    className="font-poppinsBold text-sm"
                    style={{ color: accent }}
                  >
                    Collected
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() =>
                    collectVoucher(voucher.voucherCode, voucher.storeID)
                  }
                  className="px-5 py-2 rounded-lg"
                  style={{ backgroundColor: accent }}
                >
                  <Text className="font-poppinsBold text-sm text-white">
                    Collect
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
    accent,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    accent: string;
  }) => (
    <View className="flex-row items-center px-4 mt-5 mb-2">
      <View
        className="w-7 h-7 rounded-full items-center justify-center mr-2"
        style={{ backgroundColor: accent }}
      >
        <Ionicons name={icon} size={16} color="#fff" />
      </View>
      <Text className="text-lg font-poppinsBold text-gray-900">{title}</Text>
    </View>
  );

  return (
    <SafeAreaView edges={[]} className="flex-1 bg-slate-100">
      {/* Header — top-inset padding baked in so the gradient extends behind the status bar */}
      <LinearGradient colors={['#fde047', '#facc15']}>
        <View
          className="flex-row items-center justify-between px-4 py-3"
          style={{ paddingTop: insets.top + 12 }}
        >
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="pr-2">
              <Ionicons name="chevron-back" size={26} color="#111827" />
            </TouchableOpacity>
            <Text className="text-xl font-poppinsBold text-gray-900">
              Voucher Center
            </Text>
          </View>
          <Ionicons name="ticket-outline" size={26} color="#111827" />
        </View>
      </LinearGradient>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ec4899" />
          <Text className="mt-3 text-gray-500 text-sm">Loading vouchers…</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Saving Vouchers (product) */}
          <SectionHeader
            icon="pricetag"
            title="Saving Vouchers"
            accent={THEME.pink.accent}
          />
          {savingVouchers.length === 0 ? (
            <Text className="px-4 mb-2 text-sm text-gray-400">
              No saving vouchers available
            </Text>
          ) : (
            savingVouchers.map((v) => <VoucherCard key={v.id} voucher={v} />)
          )}

          {/* Free Shipping Vouchers (shipping) */}
          <SectionHeader
            icon="car"
            title="Free Shipping Vouchers"
            accent={THEME.teal.accent}
          />
          {shippingVouchers.length === 0 ? (
            <Text className="px-4 mb-2 text-sm text-gray-400">
              No shipping vouchers available
            </Text>
          ) : (
            shippingVouchers.map((v) => <VoucherCard key={v.id} voucher={v} />)
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default VoucherScreen;
