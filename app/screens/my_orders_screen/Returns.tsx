import { ORDER_STATUS_BUCKETS } from '@/app/constants/orderStatus';
import All from './All';

const Returns = () => <All statusFilter={[...ORDER_STATUS_BUCKETS.returns]} />;

export default Returns;
