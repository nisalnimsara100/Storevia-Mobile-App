import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useOrderCounts } from '@/app/hooks/useOrderCounts';
import { useAuthStore } from '@/app/stores/useAuthStore';
import { reviewKey, useReviewsStore } from '@/app/stores/useReviewsStore';

// useFocusEffect needs a navigation container; the hook only uses it to decide
// *when* to fetch, so run the callback once on mount like a real focus would.
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback: () => void) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useEffect } = require('react');
    useEffect(callback, [callback]);
  },
}));

const order = (
  id: number,
  status: string,
  productIds: number[] = [],
) => ({
  id,
  order_status: status,
  order_items: productIds.map((product_id) => ({ product_id })),
});

const mockOrders = (orders: unknown[]) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ orders }),
  }) as unknown as typeof fetch;
};

const signIn = (email: string | null) => {
  useAuthStore.setState({
    user: email
      ? { id: '1', email, name: 'Test', role: 'user' }
      : null,
  });
};

beforeEach(() => {
  jest.clearAllMocks();
  useReviewsStore.setState({ submittedReviews: [] });
  signIn('shopper@storevia.test');
});

describe('useOrderCounts', () => {
  it('counts each status bucket independently', async () => {
    mockOrders([
      order(1, 'Unpaid'),
      order(2, 'Placed'),
      order(3, 'Processing'),
      order(4, 'Shipped'),
      order(5, 'Returned'),
    ]);

    const { result } = renderHook(() => useOrderCounts());

    await waitFor(() => expect(result.current.counts.toPay).toBe(1));
    expect(result.current.counts.toShip).toBe(2);
    expect(result.current.counts.toReceive).toBe(1);
    expect(result.current.counts.returns).toBe(1);
  });

  it('counts delivered ITEMS for review, not delivered orders', async () => {
    mockOrders([order(1, 'Delivered', [10, 11, 12])]);

    const { result } = renderHook(() => useOrderCounts());

    await waitFor(() => expect(result.current.counts.toReview).toBe(3));
  });

  it('excludes items the user has already reviewed', async () => {
    mockOrders([order(1, 'Delivered', [10, 11])]);
    useReviewsStore.setState({
      submittedReviews: [
        {
          key: reviewKey(1, 10),
          orderId: 1,
          productId: 10,
          productName: 'Reviewed',
          productImage: '',
          rating: 5,
          comment: '',
          images: [],
          anonymous: false,
          gemsEarned: 0,
          createdAt: new Date().toISOString(),
        },
      ],
    });

    const { result } = renderHook(() => useOrderCounts());

    await waitFor(() => expect(result.current.counts.toReview).toBe(1));
  });

  it('drops to zero once every delivered item is reviewed', async () => {
    mockOrders([order(1, 'Delivered', [10])]);

    const { result } = renderHook(() => useOrderCounts());
    await waitFor(() => expect(result.current.counts.toReview).toBe(1));

    // Submitting a review must move the badge without a refetch.
    act(() => {
      useReviewsStore.getState().addSubmittedReview({
        key: reviewKey(1, 10),
        orderId: 1,
        productId: 10,
        productName: 'Just reviewed',
        productImage: '',
        rating: 4,
        comment: 'good',
        images: [],
        anonymous: false,
        gemsEarned: 5,
        createdAt: new Date().toISOString(),
      });
    });

    await waitFor(() => expect(result.current.counts.toReview).toBe(0));
  });

  it('reports zero for every bucket when the request fails', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 500 }) as unknown as typeof fetch;
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() => useOrderCounts());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.counts).toEqual({
      toPay: 0,
      toShip: 0,
      toReceive: 0,
      toReview: 0,
      returns: 0,
    });
  });

  it('does not call the API when nobody is signed in', async () => {
    mockOrders([order(1, 'Delivered', [10])]);
    signIn(null);

    const { result } = renderHook(() => useOrderCounts());

    await waitFor(() => expect(result.current.counts.toReview).toBe(0));
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('never invents a count for an unrecognised status', async () => {
    mockOrders([order(1, 'Awaiting Warehouse'), order(2, 'Cancelled')]);

    const { result } = renderHook(() => useOrderCounts());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(Object.values(result.current.counts).every((n) => n === 0)).toBe(
      true,
    );
  });
});
