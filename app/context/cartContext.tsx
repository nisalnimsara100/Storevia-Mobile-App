import { useRouter } from 'expo-router';
import { createContext, ReactNode, useState } from 'react';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '@/app/stores/useAuthStore';

export interface CartItem {
  id: string | number;
  product_id?: string | number;
  [key: string]: any;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartItem, qty?: number) => Promise<void>;
  cartCount: number;
  setCartCount: (count: number) => void;
  currentloggedInEmail: string | null;
  user: any;
  loadCartDetails: () => Promise<void>;
  logoutCartClear: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

interface CartProviderProps {
  children: ReactNode;
}

const BASE_URL = process.env.EXPO_PUBLIC_APP_BASE_URL;

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user, cartCount, setCartCount } = useAuthStore();
  const currentloggedInEmail = user?.email || null;
  const router = useRouter();

  // Load cart details from server
  const loadCartDetails = async () => {
    try {
      const email = currentloggedInEmail || '';

      if (!email) return;

      const response = await fetch(`${BASE_URL}/api/get_cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: email }),
      });

      const data = await response.json();

      if (Array.isArray(data.cart_items)) {
        setCart(data.cart_items);
        const count = data.cart_items.length;
        setCartCount(count);
      }
    } catch (err) {
      console.error('Error loading cart details:', err);
    }
  };

  // Clear cart on logout
  const logoutCartClear = () => {
    setCart([]);
    setCartCount(0);
  };

  // Add to cart
  const addToCart = async (product: CartItem, qty = 1) => {
    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'You need to login first..!',
        position: 'bottom',
      });
      router.push('/(auth)/LoginSignup');
      return;
    }

    const cartItem = { ...product, quantity: qty };
    const productId = cartItem.product_id || cartItem.id;
    const existingIndex = cart.findIndex(
      (item) => (item.product_id || item.id) === productId,
    );

    const newCart = [...cart];

    if (existingIndex !== -1) {
      newCart[existingIndex].quantity =
        (newCart[existingIndex].quantity || 1) + qty;
      setCart(newCart);
    } else {
      newCart.push(cartItem);
      setCart(newCart);

      const updatedCount = cartCount + 1;
      setCartCount(updatedCount);
    }

    await addCartItemToDatabase(cartItem);
  };

  // Save single item to database
  const addCartItemToDatabase = async (item: any) => {
    if (!item || !currentloggedInEmail) return;

    try {
      const response = await fetch(`${BASE_URL}/api/save_cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentloggedInEmail,
          product_id: item.id || item.product_id,
          product_name: item.name,
          product_image: item.image?.uri || item.image,
          product_price: item.price,
          product_cod: item.product_cod_price || item.product_cod,
          product_original_price:
            item.originalPrice || item.product_original_price,
          product_quantity: item.quantity,
          stock_available: item.stock || item.stock_available,
          product_category: item.category || item.product_category,
          product_discount: item.discount || item.product_discount,
          product_store_name:
            item.store || item.store_name || item.product_store_name,
          product_store_id: item.store_id || item.product_store_id,
          product_selected_color:
            item.selectedColor || item.product_selected_color,
          product_selected_size:
            item.selectedSize || item.product_selected_size,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server Error:', data);
      } else {
        Toast.show({
          type: 'success',
          text1: 'Added to Cart!',
          text2: '🛒🛍️',
          position: 'bottom',
        });
      }
    } catch (err) {
      console.error('Error saving item:', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        cartCount,
        setCartCount,
        currentloggedInEmail,
        user,
        loadCartDetails,
        logoutCartClear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
