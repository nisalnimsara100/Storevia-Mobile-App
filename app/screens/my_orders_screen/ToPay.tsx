import { ORDER_STATUS_BUCKETS } from '@/app/constants/orderStatus';
import All from './All';

const ToPay = () => <All statusFilter={[...ORDER_STATUS_BUCKETS.toPay]} />;

export default ToPay;
