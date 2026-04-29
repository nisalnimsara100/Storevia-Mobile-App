import React, { createContext, ReactNode, useState } from 'react';
import Toast from 'react-native-toast-message';

export interface CartItem {
  id: string | number;
  [key: string]: any;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

interface CartProviderProps {
  children: ReactNode;
}

const BASE_URL = process.env.EXPO_PUBLIC_APP_BASE_URL;

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const currentloggedInEmail = 'janaka@gmail.com'; // Replace with actual user email from auth context

  const addToCart = async (item: CartItem) => {
    console.log('Adding to cart:', item.name);
    setCartItems((prevItems) => [...prevItems, item]);
    await addCartItemToDatabase(item);
  };

  // Save single item to database
  const addCartItemToDatabase = async (item: any) => {
    if (!item || !currentloggedInEmail) return;

    console.log('Saving item to DB:');
    console.log(JSON.stringify({ item, email: currentloggedInEmail }, null, 2));

    try {
      const response = await fetch(`${BASE_URL}/api/save_cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentloggedInEmail,
          product_id: item.id,
          product_name: item.name,
          product_image: item.image.uri,
          product_price: item.price,
          product_cod: item.product_cod_price,
          product_original_price: item.originalPrice,
          product_quantity: item.quantity,
          stock_available: item.stock,
          product_category: item.category,
          product_discount: item.discount,
          product_store_name: item.store_name,
          product_store_id: item.store_id,
          product_selected_color: item.selectedColor,
          product_selected_size: item.selectedSize,
        }),
      });

      const data = await response.json();
      console.log('Save Cart Response:', data);

      if (!response.ok) {
        console.error('Server Error:', data);
      } else {
        Toast.show({
          type: 'success',
          text1: 'Product Added to Cart!',
          text2: '🛒🛍️',
          position: 'bottom',
        });
        console.log('Saved item to DB:', data);
      }
    } catch (err) {
      console.error('Error saving item:', err);
    }
  };

  const removeFromCart = (item: CartItem) => {
    console.log('Removing from cart:', item);
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
