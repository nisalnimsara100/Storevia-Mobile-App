import {
  matchesBucket,
  ORDER_STATUS_BUCKETS,
} from '@/app/constants/orderStatus';

describe('order status buckets', () => {
  it('matches case-insensitively and ignores surrounding whitespace', () => {
    expect(matchesBucket('DELIVERED', 'delivered')).toBe(true);
    expect(matchesBucket('  Delivered  ', 'delivered')).toBe(true);
    expect(matchesBucket('delivered', 'delivered')).toBe(true);
  });

  it('routes each backend spelling to exactly one bucket', () => {
    const seen = new Map<string, string>();

    for (const [bucket, statuses] of Object.entries(ORDER_STATUS_BUCKETS)) {
      for (const status of statuses) {
        expect(seen.has(status)).toBe(false);
        seen.set(status, bucket);
      }
    }
  });

  it('covers the wording variants the API is known to send', () => {
    expect(matchesBucket('Placed', 'toShip')).toBe(true);
    expect(matchesBucket('Processing', 'toShip')).toBe(true);
    expect(matchesBucket('Shipped', 'toReceive')).toBe(true);
    expect(matchesBucket('Out for Delivery', 'toReceive')).toBe(true);
    expect(matchesBucket('Unpaid', 'toPay')).toBe(true);
  });

  it('does not put an unshipped order in the delivered bucket', () => {
    expect(matchesBucket('Placed', 'delivered')).toBe(false);
    expect(matchesBucket('Cancelled', 'delivered')).toBe(false);
  });

  it('treats an unknown status as belonging to no bucket', () => {
    const buckets = Object.keys(ORDER_STATUS_BUCKETS) as (keyof typeof ORDER_STATUS_BUCKETS)[];
    expect(buckets.some((b) => matchesBucket('Awaiting Warehouse', b))).toBe(
      false,
    );
  });
});
