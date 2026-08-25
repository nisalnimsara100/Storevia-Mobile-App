import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import {
  matchesBucket,
  ORDER_STATUS_BUCKETS,
} from '@/app/constants/orderStatus';
import { useAuthStore } from '@/app/stores/useAuthStore';
import { reviewKey, useReviewsStore } from '@/app/stores/useReviewsStore';

const BASE_URL = process.env.EXPO_PUBLIC_APP_BASE_URL;

interface OrderItemSummary {
  product_id: number;
}

interface OrderSummary {
  id: number;
  order_status: string;
  order_items: OrderItemSummary[];
}

export interface OrderCounts {
  toPay: number;
  toShip: number;
  toReceive: number;
  /** Delivered items the user hasn't reviewed yet — not delivered *orders*. */
  toReview: number;
  returns: number;
}

const EMPTY_COUNTS: OrderCounts = {
  toPay: 0,
  toShip: 0,
  toReceive: 0,
  toReview: 0,
  returns: 0,
};

/**
 * Real order-status counts for the badges on the Account screen.
 *
 * `toReview` deliberately counts *items*, not orders, and subtracts anything
 * already in the reviews store — the same rule the My Reviews "To Review" tab
 * applies, so the badge and that screen can never disagree.
 */
export const useOrderCounts = () => {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const email = useAuthStore((state) => state.user?.email);
  const submittedReviews = useReviewsStore((state) => state.submittedReviews);

  const fetchOrders = useCallback(async () => {
    if (!BASE_URL || !email) {
      setOrders([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/orders/user_orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error(`user_orders failed: ${response.status}`);

      const data = await response.json();
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
    } catch (err) {
      // Badges are decoration: on failure show none rather than a stale or
      // invented number.
      console.warn('Could not load order counts:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [email]);

  // Refetch on focus: the Account tab stays mounted, so a mount-only fetch
  // would keep showing counts from whenever the app was first opened.
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders]),
  );

  const counts = useMemo<OrderCounts>(() => {
    if (orders.length === 0) return EMPTY_COUNTS;

    const reviewedKeys = new Set(submittedReviews.map((review) => review.key));

    return orders.reduce<OrderCounts>(
      (acc, order) => {
        const status = order.order_status ?? '';

        if (matchesBucket(status, 'toPay')) acc.toPay += 1;
        if (matchesBucket(status, 'toShip')) acc.toShip += 1;
        if (matchesBucket(status, 'toReceive')) acc.toReceive += 1;
        if (matchesBucket(status, 'returns')) acc.returns += 1;

        if (matchesBucket(status, 'delivered')) {
          acc.toReview += (order.order_items ?? []).filter(
            (item) => !reviewedKeys.has(reviewKey(order.id, item.product_id)),
          ).length;
        }

        return acc;
      },
      { ...EMPTY_COUNTS },
    );
  }, [orders, submittedReviews]);

  return { counts, loading, refresh: fetchOrders };
};

export { ORDER_STATUS_BUCKETS };
