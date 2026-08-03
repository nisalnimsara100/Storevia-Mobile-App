import React from 'react';

import All from './All';

const ToReceive = () => (
  <All
    statusFilter={['To Receive', 'In Transit', 'Out for Delivery', 'Shipped']}
  />
);

export default ToReceive;
