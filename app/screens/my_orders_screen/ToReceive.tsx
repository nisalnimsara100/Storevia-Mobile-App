import { ORDER_STATUS_BUCKETS } from '@/app/constants/orderStatus';
import All from './All';

const ToReceive = () => <All statusFilter={[...ORDER_STATUS_BUCKETS.toReceive]} />;

export default ToReceive;
