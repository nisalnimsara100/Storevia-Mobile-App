import React from 'react';
import Toast from 'react-native-toast-message';
import { CartProvider } from './cartContext';

export const CartProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <CartProvider>
      {children}
      <Toast />
    </CartProvider>
  );
};
