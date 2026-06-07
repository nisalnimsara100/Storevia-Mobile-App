import React from 'react';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './authContext';
import { CartProvider } from './cartContext';

export const CartProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <Toast />
      </CartProvider>
    </AuthProvider>
  );
};
