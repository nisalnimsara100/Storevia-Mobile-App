import React from 'react';

import All from './All';

const ToPay = () => (
  <All statusFilter={['Pending Payment', 'To Pay', 'Unpaid']} />
);

export default ToPay;