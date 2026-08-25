import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  User,
  updateProfile,
} from 'firebase/auth';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { auth } from '../../firebaseConfig';
import { useAuthStore } from '../stores/useAuthStore';

// Replace with your actual backend API URL
const BASE_API_URL =
  process.env.EXPO_PUBLIC_APP_BASE_URL || 'http://localhost:3000';

interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
  ) => Promise<AuthResult>;
  signInWithGoogle: (idToken: string) => Promise<AuthResult>;
  signInWithApple: (idToken: string, rawNonce: string) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Fetch initial user data (cart count, followed stores, etc.)
  const fetchInitialUserData = async (email: string, _token: string) => {
    if (!email) return;

    try {
      const res = await fetch(
        `${BASE_API_URL}/api/user/initial_data?email=${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!res.ok) throw new Error(`fetch_initial_data failed: ${res.status}`);

      const result = await res.json();

      if (result.success && result.data) {
        const cartCount = Number(result.data.cart_count) || 0;

        useAuthStore.getState().setCartCount(cartCount);

        if (Array.isArray(result.data.followed_stores)) {
          useAuthStore
            .getState()
            .setFollowedStoreIds(result.data.followed_stores);
        }
      } else {
        useAuthStore.getState().setCartCount(0);
      }
    } catch (error) {
      console.warn(
        '⚠️ Error fetching initial user data (API may be offline):',
        error,
      );
      // Set default values if API is unavailable
      useAuthStore.getState().setCartCount(0);
    }
  };

  // 🔐 Listen to Firebase Auth State
  useEffect(() => {
    if (!auth) {
      // Firebase failed to initialize (see firebaseConfig.ts) — most likely
      // missing/invalid EXPO_PUBLIC_FIREBASE_* env vars in this build.
      // Degrade to a logged-out state instead of crashing on a null `auth`.
      console.error(
        '❌ Firebase auth is unavailable — check EXPO_PUBLIC_FIREBASE_* env vars for this build.',
      );
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setFirebaseUser(user);

          // 🕐 Check if session has expired (3 weeks)
          if (useAuthStore.getState().isSessionExpired()) {
            await signOut(auth);
            setFirebaseUser(null);
            useAuthStore.getState().logOut();
            setLoading(false);
            return;
          }

          const token = await user.getIdToken(true);

          // Store token in Zustand
          useAuthStore.getState().setAuthToken(token);

          // Try to authenticate with backend (optional)
          try {
            const res = await fetch(`${BASE_API_URL}/api/firebase-login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            });

            if (res.ok) {
              const data = await res.json();
              // Ensure name is properly set from response or Firebase
              const userData = data?.user || {};
              const userName = userData.name || user.displayName || 'User';
              useAuthStore.getState().setUser({
                ...data,
                user: {
                  id: user.uid,
                  email: user.email || '',
                  ...userData,
                  name: userName, // Ensure name is not 'unknown user'
                },
              });
            } else {
              throw new Error('Backend authentication failed');
            }
          } catch (backendError) {
            console.warn(
              '⚠️ Backend unavailable, using Firebase auth only:',
              backendError,
            );
            // Set user data from Firebase if backend is down
            const displayName = user.displayName || 'User';
            useAuthStore.getState().setUser({
              user: {
                id: user.uid,
                email: user.email || '',
                name: displayName,
                role: 'user',
                profile_picture: user.photoURL || undefined,
              },
            });
          }

          // Fetch additional user data
          if (user.email) {
            await fetchInitialUserData(user.email, token);
          }
        } else {
          setFirebaseUser(null);
          useAuthStore.getState().logOut();
        }
      } catch (error) {
        console.error('❌ Auth state error:', error);
        setFirebaseUser(null);
        useAuthStore.getState().logOut();
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // 🔐 Email/Password Login
  const signIn = async (
    email: string,
    password: string,
  ): Promise<AuthResult> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken(true);

      // 🕐 Set session start time (now) - will stay for 3 weeks
      const sessionStartTime = Date.now();
      useAuthStore.getState().setSessionStartTime(sessionStartTime);

      // Try to authenticate with backend (optional)
      try {
        const res = await fetch(`${BASE_API_URL}/api/firebase-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          // Ensure name is properly set from response, fallback to displayName if needed
          const userData = data?.user || {};
          const userName = userData.name || result.user.displayName || 'User';
          useAuthStore.getState().setUser({
            ...data,
            user: {
              id: result.user.uid,
              email: result.user.email || '',
              ...userData,
              name: userName, // Ensure name is not empty or 'unknown user'
            },
          });
          useAuthStore.getState().setAuthToken(token);
        } else {
          throw new Error('Backend authentication failed');
        }
      } catch (backendError) {
        console.warn(
          '⚠️ Backend unavailable, using Firebase auth only:',
          backendError,
        );
        // Use Firebase data if backend is down
        const displayName = result.user.displayName || 'User';
        useAuthStore.getState().setUser({
          user: {
            id: result.user.uid,
            email: result.user.email || '',
            name: displayName,
            role: 'user',
            profile_picture: result.user.photoURL || undefined,
          },
        });
        useAuthStore.getState().setAuthToken(token);
      }

      // Fetch initial user data
      if (result.user.email) {
        await fetchInitialUserData(result.user.email, token);
      }

      return { success: true, user: result.user, token };
    } catch (error: any) {
      console.error('❌ Login error:', error.message);
      return { success: false, error: error.message };
    }
  };

  // 📝 Email/Password Sign Up
  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    _phone: string,
  ): Promise<AuthResult> => {
    try {
      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();
      const fullName = `${trimmedFirstName} ${trimmedLastName}`.trim();

      if (!trimmedFirstName || !trimmedLastName) {
        throw new Error('First and last names are required');
      }

      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await updateProfile(result.user, {
        displayName: fullName,
      });

      const token = await result.user.getIdToken(true);

      // 🕐 Set session start time (now) - will stay for 3 weeks
      const sessionStartTime = Date.now();
      useAuthStore.getState().setSessionStartTime(sessionStartTime);

      // Try to authenticate with backend (optional)
      try {
        const res = await fetch(`${BASE_API_URL}/api/firebase-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          // Ensure name is properly set from response or Firebase
          const userData = data?.user || {};
          const userName = userData.name || fullName;
          useAuthStore.getState().setUser({
            ...data,
            user: {
              id: result.user.uid,
              email: result.user.email || '',
              ...userData,
              name: userName, // Use constructed full name
            },
          });
          useAuthStore.getState().setAuthToken(token);
        } else {
          throw new Error('Backend authentication failed');
        }
      } catch (backendError) {
        console.warn(
          '⚠️ Backend unavailable, using Firebase auth only:',
          backendError,
        );
        // Use Firebase data if backend is down - use the full name we created
        useAuthStore.getState().setUser({
          user: {
            id: result.user.uid,
            email: result.user.email || '',
            name: fullName, // Use constructed full name
            role: 'user',
            profile_picture: result.user.photoURL || undefined,
          },
        });
        useAuthStore.getState().setAuthToken(token);
      }

      // Fetch initial user data
      if (result.user.email) {
        await fetchInitialUserData(result.user.email, token);
      }

      return { success: true, user: result.user, token };
    } catch (error: any) {
      console.error('❌ Sign up error:', error.message);
      return { success: false, error: error.message };
    }
  };

  // 🔵 Google Sign In
  const signInWithGoogle = async (idToken: string): Promise<AuthResult> => {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);
      const token = await result.user.getIdToken(true);

      // 🕐 Set session start time (now) - will stay for 3 weeks
      const sessionStartTime = Date.now();
      useAuthStore.getState().setSessionStartTime(sessionStartTime);

      let displayName = result.user.displayName;
      if (!displayName && result.user.email) {
        displayName = result.user.email.split('@')[0];
      }
      displayName = displayName || 'User';

      try {
        const res = await fetch(`${BASE_API_URL}/api/firebase-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          // Ensure name is properly set from response
          const userData = data?.user || {};
          const userName = userData.name || displayName;
          useAuthStore.getState().setUser({
            ...data,
            user: {
              id: result.user.uid,
              email: result.user.email || '',
              ...userData,
              name: userName, // Ensure name is not 'unknown user'
            },
          });
          useAuthStore.getState().setAuthToken(token);
        } else {
          throw new Error('Backend authentication failed');
        }
      } catch (backendError) {
        console.warn(
          '⚠️ Backend unavailable, using Firebase auth only:',
          backendError,
        );
        // Use Firebase data if backend is down
        useAuthStore.getState().setUser({
          user: {
            id: result.user.uid,
            email: result.user.email || '',
            name: displayName, // Use constructed or Firebase displayName
            role: 'user',
            profile_picture: result.user.photoURL || undefined,
          },
        });
        useAuthStore.getState().setAuthToken(token);
      }

      // Fetch initial user data
      if (result.user.email) {
        await fetchInitialUserData(result.user.email, token);
      }

      return { success: true, user: result.user, token };
    } catch (error: any) {
      console.error('❌ Google Login error:', error.message);
      return { success: false, error: error.message };
    }
  };

  // 🍎 Apple Sign In
  const signInWithApple = async (
    idToken: string,
    rawNonce: string,
  ): Promise<AuthResult> => {
    try {
      const provider = new OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: idToken,
        rawNonce: rawNonce,
      });
      const result = await signInWithCredential(auth, credential);
      const token = await result.user.getIdToken(true);

      // 🕐 Set session start time (now) - will stay for 3 weeks
      const sessionStartTime = Date.now();
      useAuthStore.getState().setSessionStartTime(sessionStartTime);

      // Construct name from Firebase user data or email
      let displayName = result.user.displayName;
      if (!displayName && result.user.email) {
        // Extract name from email if displayName is not available
        displayName = result.user.email.split('@')[0];
      }
      displayName = displayName || 'User';

      // Try to authenticate with backend (optional)
      try {
        const res = await fetch(`${BASE_API_URL}/api/firebase-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          // Ensure name is properly set from response
          const userData = data?.user || {};
          const userName = userData.name || displayName;
          useAuthStore.getState().setUser({
            ...data,
            user: {
              id: result.user.uid,
              email: result.user.email || '',
              ...userData,
              name: userName, // Ensure name is not 'unknown user'
            },
          });
          useAuthStore.getState().setAuthToken(token);
        } else {
          throw new Error('Backend authentication failed');
        }
      } catch (backendError) {
        console.warn(
          '⚠️ Backend unavailable, using Firebase auth only:',
          backendError,
        );
        // Use Firebase data if backend is down
        useAuthStore.getState().setUser({
          user: {
            id: result.user.uid,
            email: result.user.email || '',
            name: displayName, // Use constructed or Firebase displayName
            role: 'user',
            profile_picture: result.user.photoURL || undefined,
          },
        });
        useAuthStore.getState().setAuthToken(token);
      }

      // Fetch initial user data
      if (result.user.email) {
        await fetchInitialUserData(result.user.email, token);
      }

      return { success: true, user: result.user, token };
    } catch (error: any) {
      console.error('❌ Apple Login error:', error.message);
      return { success: false, error: error.message };
    }
  };

  // 🔑 Send a Firebase password-reset email.
  //
  // Firebase returns `auth/user-not-found` for an unregistered address, which
  // would let anyone probe which emails have accounts. We swallow that one code
  // and report success, so the caller's message is the same either way.
  const resetPassword = async (email: string): Promise<AuthResult> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      if (error?.code === 'auth/user-not-found') {
        return { success: true };
      }
      console.error('❌ Password reset error:', error.message);
      return { success: false, error: error.message };
    }
  };

  // 🚪 Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setFirebaseUser(null);
      useAuthStore.getState().logOut();
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user: firebaseUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
