import { ORDER_STATUS_BUCKETS } from '@/app/constants/orderStatus';
import All from './All';

const ToShip = () => <All statusFilter={[...ORDER_STATUS_BUCKETS.toShip]} />;

export default ToShip;
