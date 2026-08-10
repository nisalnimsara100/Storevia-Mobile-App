import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  profilePicture?: string;
}

interface ApiResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    profile_picture?: string;
  };
  cart_count?: number;
  followed_store_ids?: number[];
}

interface AuthState {
  user: UserData | null;
  cartCount: number;
  followedStoreIds: number[];
  authToken: string | null;
  sessionStartTime: number | null; // 🕐 Track when user logged in (timestamp in ms)
  setUser: (data: ApiResponse) => void;
  setCartCount: (count: number) => void;
  setFollowedStoreIds: (storeIds: number[]) => void;
  setAuthToken: (token: string) => void;
  setSessionStartTime: (time: number | null) => void;
  isSessionExpired: () => boolean; // Check if 3 weeks (21 days) have passed
  logOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      cartCount: 0,
      followedStoreIds: [],
      authToken: null,
      sessionStartTime: null, // 🕐 Track session start time

      setUser: (data) => {
        const userData = data?.user
          ? {
              id: data.user.id,
              email: data.user.email,
              // Ensure name is never 'unknown user' or empty
              name:
                data.user.name && data.user.name !== 'unknown user'
                  ? data.user.name
                  : 'User',
              role: data.user.role || 'user',
              profilePicture: data.user.profile_picture,
            }
          : null;

        return set((state) => ({
          user: userData,
          cartCount:
            data?.cart_count !== undefined ? data.cart_count : state.cartCount,
          followedStoreIds:
            data?.followed_store_ids !== undefined
              ? data.followed_store_ids
              : state.followedStoreIds,
        }));
      },

      setCartCount: (count) =>
        set((state) => ({
          ...state,
          cartCount: count,
        })),

      setFollowedStoreIds: (storeIds) =>
        set((state) => ({
          ...state,
          followedStoreIds: storeIds,
        })),

      setAuthToken: (token) =>
        set((state) => ({
          ...state,
          authToken: token,
        })),

      setSessionStartTime: (time) =>
        set((state) => ({
          ...state,
          sessionStartTime: time,
        })),

      // 🕐 Check if session has expired (3 weeks = 21 days)
      isSessionExpired: () => {
        const { sessionStartTime } = get();
        if (!sessionStartTime) return false;

        const THREE_WEEKS_MS = 21 * 24 * 60 * 60 * 1000; // 21 days in milliseconds
        const currentTime = Date.now();
        const elapsed = currentTime - sessionStartTime;

        return elapsed > THREE_WEEKS_MS;
      },

      logOut: () => {
        return set({
          user: null,
          cartCount: 0,
          followedStoreIds: [],
          authToken: null,
          sessionStartTime: null, // 🕐 Clear session time on logout
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
