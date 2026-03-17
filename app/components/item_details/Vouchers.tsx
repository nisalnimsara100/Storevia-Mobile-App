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
    product: VoucherAPIResponse[];
    shipping: VoucherAPIResponse[];
  };
}

interface VoucherCarouselProps {
  storeID: number | string;
}

const VoucherCarousel = ({ storeID }: VoucherCarouselProps) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [productVouchers, setProductVouchers] = useState<Voucher[]>([]);
  const [freeShippingVouchers, setFreeShippingVouchers] = useState<Voucher[]>(
    [],
  );
  const [collectedVoucherIds, setCollectedVoucherIds] = useState<Set<string>>(
    new Set(),
  );

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
        amount = `Rs.${Math.floor(discountPrice)}`;
      } else if (discountRate > 0) {
        amount = `${discountRate}%`;
      } else {
        amount = 'Free';
      }
    } else {
      amount = discountRate > 0 ? `${discountRate}%` : 'Discount';
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
        | 'flat'
        | 'percentage',
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
      const userEmail = 'namal@gmail.com';
      console.log(
        'Fetching vouchers for store ID:',
        storeId,
        'and user email:',
        userEmail,
      );
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
        console.log('Voucher API Data:', result);

        const parsedProductVouchers = (result.data?.product || []).map((v) =>
          parseVoucher(v, 'product'),
        );
        const parsedShippingVouchers = (result.data?.shipping || []).map((v) =>
          parseVoucher(v, 'shipping'),
        );

        const allVouchers = [
          ...parsedProductVouchers,
          ...parsedShippingVouchers,
        ];
        setVouchers(allVouchers);
        setProductVouchers(parsedProductVouchers);
        setFreeShippingVouchers(parsedShippingVouchers);
      } catch (error) {
        console.error('Error fetching vouchers:', error);
      }
    };

    fetchVouchers(storeID as number);
  }, [storeID]);

  const collectVoucher = async (voucherCode: string, storeId: number) => {
    // if (!user) {
    //   redirectToLoginWithMemory();
    //   return;
    // }

    const userEmail = 'namal@gmail.com';

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
        {vouchers.map((item) => (
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
                  {item.voucherCode}
                </Text>
                <Text style={styles.condition}>{item.condition}</Text>
                <Text style={styles.dateRange}>
                  Till {item.voucherExpiryDate}
                </Text>
              </View>

              {/* Middle Section (Divider + Notches) */}
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
        ))}
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
    paddingLeft: 20,
  },
  ticketCard: {
    width: 280,
    height: 110,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    overflow: 'visible',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
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
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 2,
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
    fontWeight: '700',
    fontSize: 13,
  },
});
