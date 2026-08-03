import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { s, vs } from 'react-native-size-matters';
import { useAuthStore } from '../../stores/useAuthStore';

const BASE_URL = process.env.EXPO_PUBLIC_APP_BASE_URL;

interface Voucher {
  id: string | number;
  voucherCode: string;
  voucherDescription?: string;
  voucherDiscountType: 'flat' | 'percentage';
  voucherDiscountRate: number;
  voucherDiscountPrice: number;
  voucherExpiryDate?: string;
  voucher_minimumSpend: number;
  voucher_count: number;
  voucherStoreID?: number;
  voucher_created_by: 'seller' | 'admin';
  voucher_type: 'product' | 'shipping';
  created_at?: string;
  updated_at?: string;
  amount: string;
  condition: string;
  bgColor: string;
  accentColor: string;
}
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
  voucherStoreID?: number;
  voucher_created_by: 'seller' | 'admin';
  voucher_type: 'product' | 'shipping';
  created_at?: string;
  updated_at?: string;
}

interface VouchersResponse {
  message: string;
  data: {
    seller_vouchers: {
      product?: VoucherAPIResponse[];
      shipping?: VoucherAPIResponse[];
    };
    admin_vouchers:
      | VoucherAPIResponse[]
      | {
          product?: VoucherAPIResponse[];
          shipping?: VoucherAPIResponse[];
        };
  };
}

interface VoucherCarouselProps {
  storeID: number | string;
}

const VoucherCarousel = ({ storeID }: VoucherCarouselProps) => {
  const { user } = useAuthStore();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [collectedVoucherIds, setCollectedVoucherIds] = useState<Set<string>>(
    new Set(),
  );

  const USER_EMAIL = user?.email;

  const parseVoucher = (
    apiVoucher: VoucherAPIResponse,
    voucherType: 'product' | 'shipping',
  ): Voucher => {
    const minSpend = parseFloat(apiVoucher.voucher_minimumSpend) || 0;
    const discountRate = parseFloat(apiVoucher.voucherDiscountRate) || 0;
    const discountPrice = parseFloat(apiVoucher.voucherDiscountPrice) || 0;

    // Format amount based on discount type
    let amount = '';
    if (apiVoucher.voucherDiscountType === 'flat') {
      if (discountPrice > 0) {
        amount = `Rs.${Math.floor(discountPrice)} OFF`;
      } else if (discountRate > 0) {
        amount = `${discountRate}% OFF`;
      } else {
        amount = 'Free';
      }
    } else {
      amount = discountRate > 0 ? `${discountRate}% OFF` : 'Discount';
    }

    // Determine colors based on type
    const isProduct = voucherType === 'product';
    const bgColor = isProduct ? '#E8F9F8' : '#FFF8EC';
    const accentColor = isProduct ? '#00B8A9' : '#FF9800';

    // Extract expiry date
    const expiryDate = apiVoucher.voucherExpiryDate || '';

    return {
      id: apiVoucher.voucherID,
      voucherCode: apiVoucher.voucherCode,
      voucherDescription: apiVoucher.voucherDescription,
      voucherDiscountType: apiVoucher.voucherDiscountType as
        'flat' | 'percentage',
      voucherDiscountRate: discountRate,
      voucherDiscountPrice: discountPrice,
      voucherExpiryDate: expiryDate,
      voucher_minimumSpend: minSpend,
      voucher_count: apiVoucher.voucher_count,
      voucherStoreID: apiVoucher.voucherStoreID,
      voucher_created_by: apiVoucher.voucher_created_by as 'seller' | 'admin',
      voucher_type: voucherType,
      created_at: apiVoucher.created_at,
      updated_at: apiVoucher.updated_at,
      amount,
      condition: `Min.Spend Rs. ${Math.floor(minSpend)}`,
      bgColor,
      accentColor,
    };
  };

  useEffect(() => {
    const fetchVouchers = async (storeId: number) => {
      const userEmail = USER_EMAIL;
      try {
        const response = await fetch(`${BASE_URL}/api/get_vouchers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ store_id: storeId, user_email: userEmail }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch vouchers');
        }

        const result: VouchersResponse = await response.json();

        const sellerVouchers = result.data?.seller_vouchers || {};

        // Collect admin vouchers (may be an array or object with product/shipping keys)
        const adminVouchersRaw = result.data?.admin_vouchers;
        const adminProductVouchers: VoucherAPIResponse[] = Array.isArray(
          adminVouchersRaw,
        )
          ? (adminVouchersRaw as VoucherAPIResponse[])
          : (adminVouchersRaw as { product?: VoucherAPIResponse[] })?.product ||
            [];
        const adminShippingVouchers: VoucherAPIResponse[] = Array.isArray(
          adminVouchersRaw,
        )
          ? []
          : (adminVouchersRaw as { shipping?: VoucherAPIResponse[] })
              ?.shipping || [];

        const parsedProductVouchers = [
          ...(sellerVouchers.product || []),
          ...adminProductVouchers,
        ].map((v) => parseVoucher(v, 'product'));

        const parsedShippingVouchers = [
          ...(sellerVouchers.shipping || []),
          ...adminShippingVouchers,
        ].map((v) => parseVoucher(v, 'shipping'));

        const allVouchers = [
          ...parsedProductVouchers,
          ...parsedShippingVouchers,
        ];
        setVouchers(allVouchers);
      } catch (error) {
        console.error('Error fetching vouchers:', error);
      }
    };

    fetchVouchers(storeID as number);
  }, [storeID, USER_EMAIL]);

  const collectVoucher = async (voucherCode: string, storeId: number) => {
    // if (!user) {
    //   redirectToLoginWithMemory();
    //   return;
    // }

    const userEmail = USER_EMAIL;

    try {
      const response = await fetch(`${BASE_URL}/api/seller/collect_voucher`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voucher_code: voucherCode,
          user_email: userEmail,
          store_id: storeId,
        }),
      });

      // console.log('Collect Voucher Response:', response);

      if (!response.ok) {
        throw new Error('Failed to collect voucher');
      }

      setCollectedVoucherIds((prev) => new Set([...prev, voucherCode]));
      Alert.alert('Success', 'Voucher collected successfully!');
    } catch (error) {
      console.error('Error collecting voucher:', error);
      Alert.alert('Error', 'Failed to collect voucher');
    }
  };

  const renderTicketNotch = (
    position: 'top' | 'bottom',
    bgColor: string,
    borderColor: string,
  ) => {
    return (
      <View
        style={[
          styles.notch,
          position === 'top' ? styles.notchTop : styles.notchBottom,
        ]}
      >
        <Svg height="12" width="12">
          <Circle
            cx="6"
            cy={position === 'top' ? '0' : '12'}
            r="6"
            fill={bgColor}
          />
          <Circle
            cx="6"
            cy={position === 'top' ? '0' : '12'}
            r="6"
            fill="none"
            stroke={borderColor}
            strokeWidth="1.5"
          />
        </Svg>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Vouchers</Text>
        <TouchableOpacity
          style={styles.arrowContainer}
          onPress={() => Alert.alert('All vouchers')}
        >
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Section */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {vouchers.length === 0 ? (
          <Text style={{ paddingLeft: 20, color: '#888' }}>
            No vouchers available
          </Text>
        ) : (
          vouchers.map((item) => (
            <View key={item.id} style={styles.ticketWrapper}>
              <View
                style={[
                  styles.ticketCard,
                  {
                    backgroundColor: item.bgColor,
                    borderColor: item.accentColor,
                  },
                ]}
              >
                {/* Left Section */}
                <View style={styles.leftSection}>
                  <Text style={[styles.amount, { color: item.accentColor }]}>
                    {item.amount}
                  </Text>
                  <View
                    style={[
                      styles.codeBadge,
                      { borderColor: item.accentColor },
                    ]}
                  >
                    <Text
                      style={[styles.codeText, { color: item.accentColor }]}
                    >
                      {item.voucherCode}
                    </Text>
                  </View>
                  <Text style={styles.condition}>{item.condition}</Text>
                  <Text style={styles.dateRange}>
                    Till {item.voucherExpiryDate}
                  </Text>
                </View>

                {/* Middle Section */}
                <View style={styles.dividerContainer}>
                  {renderTicketNotch('top', '#F5F5F5', item.accentColor)}

                  {[...Array(12)].map((_, i) => (
                    <View key={i} style={styles.dashSegment} />
                  ))}

                  {renderTicketNotch('bottom', '#F5F5F5', item.accentColor)}
                </View>

                {/* Right Section */}
                <View style={styles.rightSection}>
                  <TouchableOpacity
                    style={[
                      styles.collectBtn,
                      { backgroundColor: item.accentColor },
                    ]}
                    disabled={collectedVoucherIds.has(item.voucherCode)}
                    onPress={() => {
                      collectVoucher(
                        item.voucherCode,
                        item.voucherStoreID || (storeID as number),
                      );
                    }}
                  >
                    <Text style={styles.collectText}>
                      {collectedVoucherIds.has(item.voucherCode)
                        ? 'Collected'
                        : 'Collect'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default VoucherCarousel;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingLeft: 16,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingRight: 16,
    paddingLeft: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    paddingLeft: 14,
  },
  arrowContainer: {
    padding: 5,
    paddingRight: 20,
  },
  arrow: {
    fontSize: 28,
    fontWeight: '500',
    marginTop: -6,
    color: '#666',
  },
  ticketWrapper: {
    marginRight: 12,
    paddingLeft: s(20),
  },
  ticketCard: {
    width: s(240),
    height: vs(80),
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    overflow: 'visible',
  },
  leftSection: {
    flex: 2,
    justifyContent: 'center',
    paddingLeft: 16,
    paddingVertical: 12,
  },
  labelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  labelText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  amount: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  codeBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 5,
  },
  codeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  condition: {
    fontSize: 11,
    color: '#555',
    fontWeight: '500',
    marginBottom: 4,
  },
  dateRange: {
    fontSize: 9,
    color: '#888',
    fontWeight: '400',
  },

  /* --- DIVIDER & NOTCH LOGIC --- */

  dividerContainer: {
    width: 2,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
    zIndex: 10,
  },

  dashSegment: {
    width: 2,
    height: 3,
    backgroundColor: '#AAA',
    marginVertical: 1.5,
  },

  notch: {
    position: 'absolute',
    width: 12,
    height: 12,
    zIndex: 99,
    left: -5,
  },

  notchTop: {
    top: -3,
  },

  notchBottom: {
    bottom: -3,
  },

  rightSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  collectBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  collectText: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 12,
  },
});
