// Single source of truth for how raw `order_status` strings from
// /api/orders/user_orders map onto the tabs and badges the user sees.
//
// The backend is not consistent about which wording it sends for a given
// stage (e.g. an unshipped order can come back as "Placed" or "Processing"),
// so each bucket lists every spelling we've seen. Everything is compared
// lower-cased.
export const ORDER_STATUS_BUCKETS = {
  toPay: ['pending payment', 'to pay', 'unpaid'],
  toShip: ['to ship', 'processing', 'placed'],
  toReceive: ['to receive', 'in transit', 'out for delivery', 'shipped'],
  delivered: ['delivered', 'to review'],
  returns: ['returned', 'refunded', 'return requested', 'return', 'refund'],
} as const;

export type OrderStatusBucket = keyof typeof ORDER_STATUS_BUCKETS;

export const matchesBucket = (status: string, bucket: OrderStatusBucket) =>
  (ORDER_STATUS_BUCKETS[bucket] as readonly string[]).includes(
    status.trim().toLowerCase(),
  );
