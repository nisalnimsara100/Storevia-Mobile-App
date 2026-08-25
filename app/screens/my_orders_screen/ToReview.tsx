import { ORDER_STATUS_BUCKETS } from '@/app/constants/orderStatus';
import All from './All';

const ToReview = () => (
  <All statusFilter={[...ORDER_STATUS_BUCKETS.delivered]} />
);

export default ToReview;
