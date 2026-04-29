import React from 'react';

import All from './All';

const ToShip = () => (
  <All statusFilter={['To Ship', 'Processing', 'Placed']} />
);

export default ToShip;