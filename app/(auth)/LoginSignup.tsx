import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import Constants, { AppOwnership } from 'expo-constants';
import * as Crypto from 'expo-crypto';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, ProductCard } from '@/components/ui';
import { scale } from '@/theme';
import { useAuth } from '../context/authContext';

WebBrowser.maybeCompleteAuthSession();

const { width: screenWidth } = Dimensions.get('window');
// Single shared gap used between every section on this page, so spacing
// stays consistent throughout instead of each section picking its own value.
const SECTION_GAP = scale(6);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  onLogin: () => void;
}

const LoginSignup = ({ onLogin }: Props) => {
  const {
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    resetPassword,
  } = useAuth();

  const [loginVisible, setLoginVisible] = useState(false);
  const [signUpVisible, setSignUpVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign up form state
  const [signUpFirstName, setSignUpFirstName] = useState('');
  const [signUpLastName, setSignUpLastName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');

  // Forgot password state
  const [forgotVisible, setForgotVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // OTP Verification state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const baseUrl = process.env.EXPO_PUBLIC_APP_BASE_URL;

  const [topRatedProducts, setTopRatedProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchTopRatedProducts = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/top-rated`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
        const data = await response.json();
        const raw =
          data?.products || data?.data?.products || data?.data || data || [];
        if (Array.isArray(raw)) {
          const transformed = raw.map((p: any) => {
            const price = parseFloat(p.product_price ?? p.price ?? '0');
            const originalPrice = parseFloat(
              p.originalPrice ?? p.product_originalPrice ?? '0',
            );
            return {
              ...p,
              product_image: p.product_image || p.image,
              price: price,
              originalPrice: originalPrice > price ? originalPrice : undefined,
            };
          });
          const inStockProducts = transformed.filter(
            (p: any) =>
              p.product_stock === undefined || Number(p.product_stock) > 0,
          );
          setTopRatedProducts(inStockProducts.slice(0, 6));
        }
      } catch (error) {
        console.error('Failed to fetch top-rated products:', error);
      }
    };

    fetchTopRatedProducts();
  }, [baseUrl]);

  // 🔑 Open the reset sheet, pre-filled with whatever is already typed in the
  // login form so the common case is one tap.
  const openForgotPassword = () => {
    setForgotEmail(loginEmail);
    setResetSent(false);
    setLoginVisible(false);
    setForgotVisible(true);
  };

  const closeForgotPassword = () => {
    setForgotVisible(false);
    setLoginVisible(true);
  };

  const handleForgotPassword = async () => {
    const email = forgotEmail.trim();
    if (!EMAIL_PATTERN.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    setIsSendingReset(true);
    try {
      const result = await resetPassword(email);
      if (result.success) {
        setResetSent(true);
      } else {
        alert(`❌ Could not send reset email: ${result.error}`);
      }
    } finally {
      setIsSendingReset(false);
    }
  };

  // 🔐 Handle Email/Password Login
  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      alert('Please fill in all login fields.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn(loginEmail, loginPassword);
      if (result.success) {
        setLoginVisible(false);
        setSignUpVisible(false);
        setLoginEmail('');
        setLoginPassword('');
        alert('✅ Login successful!');
        onLogin();
      } else {
        alert(`❌ Login Error: ${result.error}`);
      }
    } catch (error: any) {
      alert(`❌ Login Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 📝 Step 1: Handle Email/Password Sign Up - Send OTP
  const handleSignUp = async () => {
    if (
      !signUpEmail ||
      !signUpPassword ||
      !signUpConfirmPassword ||
      !signUpFirstName ||
      !signUpLastName
    ) {
      alert('Please fill in all required sign-up fields.');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (signUpPassword.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }

    // Step 1: Validate and send OTP
    setIsSendingOtp(true);
    try {
      const res = await fetch(`${baseUrl}/api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signUpEmail }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(
          `❌ OTP Failed: ${data?.message || 'Failed to send OTP. Please try again.'}`,
        );
        return;
      }

      setOtp('');
      setSignUpVisible(false); // Close signup modal
      setShowOtpModal(true); // Show OTP modal
    } catch {
      alert(
        `❌ Network Error: Could not reach verification server. Please try again.`,
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  // 📝 Step 2: Verify OTP then complete Firebase registration
  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      alert('Please enter the OTP sent to your email');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const verifyRes = await fetch(`${baseUrl}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signUpEmail, otp }),
      });

      const verifyData = await verifyRes.json().catch(() => ({}));

      if (
        !verifyRes.ok ||
        verifyData?.message !== 'OTP verified successfully'
      ) {
        alert(
          `❌ Invalid OTP: ${verifyData?.message || 'OTP verification failed. Please try again.'}`,
        );
        return;
      }

      // OTP verified — proceed with Firebase signup
      setIsLoading(true);
      const result = await signUp(
        signUpEmail,
        signUpPassword,
        signUpFirstName,
        signUpLastName,
        signUpPhone,
      );

      if (result.success) {
        setShowOtpModal(false);
        setLoginVisible(false);
        setSignUpVisible(false);
        // Clear form
        setSignUpFirstName('');
        setSignUpLastName('');
        setSignUpEmail('');
        setSignUpPhone('');
        setSignUpPassword('');
        setSignUpConfirmPassword('');
        setOtp('');
        alert('✅ Sign up successful! Welcome to Storevia!');
        onLogin();
      } else {
        alert(
          `❌ Registration Failed: ${result.error || 'Something went wrong'}`,
        );
      }
    } catch (error: any) {
      alert(
        `❌ Error: ${error.message || 'Something went wrong. Please try again.'}`,
      );
    } finally {
      setIsLoading(false);
      setIsVerifyingOtp(false);
    }
  };

  // 🔵 Google Auth Setup
  const isExpoGo =
    Constants.appOwnership === 'expo' ||
    Constants.appOwnership === AppOwnership.Expo;
  const iosRedirectUri =
    'com.googleusercontent.apps.259108551499-tom35p3qv65mqp5ghcl5bhupvpmefacj:/oauth2redirect';
  const androidRedirectUri =
    'com.googleusercontent.apps.259108551499-u5m4hktopeo0igsofo8hjrlm8gtinkfa:/oauth2redirect';

  const customRedirectUri =
    Platform.OS === 'ios'
      ? iosRedirectUri
      : Platform.OS === 'android'
        ? androidRedirectUri
        : undefined;

  const [, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
      'your-web-client-id.apps.googleusercontent.com',
    iosClientId:
      process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ||
      'your-ios-client-id.apps.googleusercontent.com',
    androidClientId:
      process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ||
      'your-android-client-id.apps.googleusercontent.com',
    redirectUri: isExpoGo ? undefined : customRedirectUri,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      signInWithGoogle(id_token)
        .then((result) => {
          if (result.success) {
            setLoginVisible(false);
            setSignUpVisible(false);
            onLogin();
          } else {
            alert(`❌ Google Login Error: ${result.error}`);
          }
        })
        .catch((error) => {
          alert(`❌ Google Login Error: ${error.message}`);
        });
    }
  }, [response, onLogin, signInWithGoogle]);

  // 🍎 Apple Auth Setup
  const handleAppleLogin = async () => {
    try {
      const nonce = Math.random().toString(36).substring(2, 10);
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        nonce,
      );

      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      const { identityToken } = appleCredential;
      if (identityToken) {
        const result = await signInWithApple(identityToken, nonce);
        if (result.success) {
          setLoginVisible(false);
          setSignUpVisible(false);
          onLogin();
        } else {
          alert(`❌ Apple Login Error: ${result.error}`);
        }
      }
    } catch (error: any) {
      if (error.code !== 'ERR_REQUEST_CANCELED') {
        alert(`❌ Apple Login Error: ${error.message}`);
      }
    }
  };

  return (
    // Only the top edge is inset: this screen renders inside the tab navigator,
    // which already reserves space for the tab bar. Applying the bottom inset too
    // left a white strip of `container` padding showing above the tab bar.
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        {/* --- HEADER (Original UI) --- */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.settingsIcon}
            onPress={() => router.push('/screens/settings_screen')}
          >
            <Ionicons name="settings-outline" size={scale(22)} color="#333" />
          </TouchableOpacity>

          <Text style={styles.welcomeText}>Hello, Welcome to Storevia !</Text>

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => setLoginVisible(true)}
              disabled={isLoading}
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.signUpBtn}
              onPress={() => setSignUpVisible(true)}
              disabled={isLoading}
            >
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- PROMO SECTION (hidden for now) --- */}
        {/*
        <View style={styles.promoRow}>
          <View style={[styles.promoCard, styles.promoCardDivider]}>
            <View style={styles.promoHeader}>
              <Ionicons name="diamond-sharp" size={14} color="#C71585" />
              <Text style={styles.promoTitle}> Storevia Gems</Text>
            </View>
            <Text style={styles.promoTitle}>Enjoy 99% Off with Gems</Text>
            <Image
              source={{ uri: 'https://img.icons8.com/fluency/96/diamond.png' }}
              style={styles.promoPlaceholder}
            />
            <TouchableOpacity style={styles.collectBtn}>
              <Text style={styles.btnText}>Use Now</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.promoCard}>
            <View style={styles.promoHeader}>
              <Ionicons name="gift" size={14} color="#FFD700" />
              <Text style={styles.promoTitle}> Storevia Freebie</Text>
            </View>
            <Text style={styles.promoTitle}>Invite & Win iPhone...</Text>
            <Image
              source={{ uri: 'https://img.icons8.com/fluency/96/gift.png' }}
              style={styles.promoPlaceholder}
            />
            <TouchableOpacity style={styles.playBtn}>
              <Text style={styles.btnText}>Play Now</Text>
            </TouchableOpacity>
          </View>
        </View>
        */}

        {/* --- MY ORDERS SECTION (hidden for now) --- */}
        {/*
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Orders</Text>
            <Text style={styles.viewAllText}>View All Orders {'>'}</Text>
          </View>
          <View style={styles.orderIconsRow}>
            <OrderIcon icon="wallet-outline" label="To Pay" />
            <OrderIcon icon="archive-outline" label="To Ship" />
            <OrderIcon icon="bus-outline" label="To Receive" />
            <OrderIcon icon="chatbox-ellipses-outline" label="To Review" />
            <OrderIcon icon="refresh-circle-outline" label="Returns & Cancellations" />
          </View>
        </View>
        */}

        {/* --- RECENTLY VIEWED --- */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Rated Products</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {topRatedProducts.length > 0 ? (
              topRatedProducts.map((p, index) => {
                return (
                  <View key={index} style={{ width: 150 }}>
                    <ProductCard
                      variant="grid"
                      product={{
                        id: p.id || p.product_id || index,
                        image: p.product_image
                          ? { uri: p.product_image }
                          : require('../../assets/products/watch.jpg'),
                        name: p.product_name || p.name || 'Product',
                        price: p.price,
                        oldPrice: p.originalPrice,
                        discount: p.product_discount,
                      }}
                    />
                  </View>
                );
              })
            ) : (
              <>
                <View style={{ width: 150 }}>
                  <ProductCard
                    variant="grid"
                    product={{
                      id: 1,
                      image: require('../../assets/products/watch.jpg'),
                      name: 'Luxury Watch',
                      price: 4274,
                      oldPrice: 17096,
                      discount: 75,
                    }}
                  />
                </View>
                <View style={{ width: 150 }}>
                  <ProductCard
                    variant="grid"
                    product={{
                      id: 2,
                      image: require('../../assets/products/wallet.png'),
                      name: 'Leather Wallet',
                      price: 1650,
                      oldPrice: 3000,
                      discount: 30,
                    }}
                  />
                </View>
                <View style={{ width: 150 }}>
                  <ProductCard
                    variant="grid"
                    product={{
                      id: 3,
                      image: require('../../assets/products/laptop.jpg'),
                      name: 'Gaming Laptop',
                      price: 145455,
                      oldPrice: 180000,
                      discount: 5,
                    }}
                  />
                </View>
              </>
            )}
          </ScrollView>
        </View>

        {/* --- TOOLS GRID (hidden for now) ---
        <View style={styles.gridContainer}>
          <GridItem icon="tree" color="#4CAF50" label="Storevia Land" />
          <GridItem
            icon="game-controller"
            color="#3b5998"
            label="Storevia Candy"
          />
          <GridItem icon="flash" color="#ff9800" label="Pay Utilities" />
          <GridItem icon="pricetag" color="#9c27b0" label="Vouchers" />
          <GridItem icon="location" color="#f97316" label="Pickup Points" />
          <GridItem icon="card" color="#2ecc71" label="PayLater" />
          <GridItem icon="basket" color="#f1c40f" label="Choice" />
          <GridItem icon="mail" color="#2196F3" label="Messages" />
        </View>
        */}
        {/* <View style={{ height: 40 }} /> */}
      </ScrollView>

      {/* --- LOGIN POPUP MODAL --- */}
      <Modal visible={loginVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            style={styles.modalKeyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.authPopupCard}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.authPopupScrollBody}
              >
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setLoginVisible(false)}
                  disabled={isLoading}
                >
                  <Ionicons name="close" size={24} color="#999" />
                </TouchableOpacity>

                <Text style={styles.popupTitle}>Welcome Back</Text>
                <Text style={styles.popupSubtitle}>
                  Log in to your Storevia account
                </Text>

                <Input
                  variant="filled"
                  containerStyle={styles.fieldGroup}
                  label="Email"
                  placeholder="Enter your email"
                  value={loginEmail}
                  onChangeText={setLoginEmail}
                  editable={!isLoading}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="next"
                />

                <Input
                  variant="filled"
                  containerStyle={styles.fieldGroup}
                  label="Password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChangeText={setLoginPassword}
                  editable={!isLoading}
                  secureToggle
                  autoCapitalize="none"
                  autoComplete="password"
                  returnKeyType="go"
                  onSubmitEditing={handleLogin}
                  labelAccessory={
                    <TouchableOpacity
                      onPress={openForgotPassword}
                      disabled={isLoading}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Text style={styles.forgotText}>Forgot?</Text>
                    </TouchableOpacity>
                  }
                />

                <TouchableOpacity
                  style={[
                    styles.orangeActionBtn,
                    isLoading && styles.disabledBtn,
                  ]}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.orangeActionText}>LOGIN</Text>
                  )}
                </TouchableOpacity>

                {/* Social Login Options */}
                <View style={styles.socialBtnsRow}>
                  <TouchableOpacity
                    style={styles.socialCircleBtn}
                    onPress={() => promptAsync()}
                    disabled={isLoading}
                  >
                    <Image
                      source={{
                        uri: 'https://img.icons8.com/color/48/google-logo.png',
                      }}
                      style={{ width: 24, height: 24 }}
                    />
                  </TouchableOpacity>

                  {Platform.OS === 'ios' && (
                    <TouchableOpacity
                      style={styles.socialCircleBtn}
                      onPress={handleAppleLogin}
                      disabled={isLoading}
                    >
                      <Ionicons name="logo-apple" size={24} color="#000" />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.popupFooter}>
                  <Text style={styles.footerGray}>
                    Don&lsquo;t have an account?{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setLoginVisible(false);
                      setSignUpVisible(true);
                    }}
                    disabled={isLoading}
                  >
                    <Text
                      style={{
                        color: '#f97316',
                        fontFamily: 'PoppinsBold',
                        fontWeight: 'bold',
                      }}
                    >
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* --- SIGN UP POPUP MODAL --- */}
      <Modal visible={signUpVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            style={styles.modalKeyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.authPopupCard}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.authPopupScrollBody}
              >
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setSignUpVisible(false)}
                  disabled={isLoading}
                >
                  <Ionicons name="close" size={24} color="#999" />
                </TouchableOpacity>

                <Text style={styles.popupTitle}>Join Storevia</Text>
                <Text style={styles.popupSubtitle}>
                  Create your account to start shopping
                </Text>

                <View style={styles.nameRow}>
                  <Input
                    variant="filled"
                    containerStyle={styles.nameField}
                    label="First Name"
                    placeholder="First name"
                    value={signUpFirstName}
                    onChangeText={setSignUpFirstName}
                    editable={!isLoading}
                    autoCapitalize="words"
                    autoComplete="given-name"
                    returnKeyType="next"
                  />
                  <Input
                    variant="filled"
                    containerStyle={styles.nameField}
                    label="Last Name"
                    placeholder="Last name"
                    value={signUpLastName}
                    onChangeText={setSignUpLastName}
                    editable={!isLoading}
                    autoCapitalize="words"
                    autoComplete="family-name"
                    returnKeyType="next"
                  />
                </View>

                <Input
                  variant="filled"
                  containerStyle={styles.fieldGroup}
                  label="Email"
                  placeholder="Enter your email address"
                  value={signUpEmail}
                  onChangeText={setSignUpEmail}
                  editable={!isLoading}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="next"
                />

                <Input
                  variant="filled"
                  containerStyle={styles.fieldGroup}
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={signUpPhone}
                  onChangeText={setSignUpPhone}
                  editable={!isLoading}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  returnKeyType="next"
                />

                <Input
                  variant="filled"
                  containerStyle={styles.fieldGroup}
                  label="Password"
                  placeholder="Create a password (min 6 chars)"
                  value={signUpPassword}
                  onChangeText={setSignUpPassword}
                  editable={!isLoading}
                  secureToggle
                  autoCapitalize="none"
                  autoComplete="password-new"
                  returnKeyType="next"
                />

                <Input
                  variant="filled"
                  containerStyle={styles.fieldGroup}
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={signUpConfirmPassword}
                  onChangeText={setSignUpConfirmPassword}
                  editable={!isLoading}
                  secureToggle
                  autoCapitalize="none"
                  autoComplete="password-new"
                  returnKeyType="go"
                  onSubmitEditing={handleSignUp}
                />

                <TouchableOpacity
                  style={[
                    styles.orangeActionBtn,
                    (isLoading || isSendingOtp) && styles.disabledBtn,
                  ]}
                  onPress={handleSignUp}
                  disabled={isLoading || isSendingOtp}
                >
                  {isLoading || isSendingOtp ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.orangeActionText}>SIGN UP</Text>
                  )}
                </TouchableOpacity>

                {/* Social Signup Options */}
                <View style={styles.socialBtnsRow}>
                  <TouchableOpacity
                    style={styles.socialCircleBtn}
                    onPress={() => promptAsync()}
                    disabled={isLoading}
                  >
                    <Image
                      source={{
                        uri: 'https://img.icons8.com/color/48/google-logo.png',
                      }}
                      style={{ width: 24, height: 24 }}
                    />
                  </TouchableOpacity>

                  {Platform.OS === 'ios' && (
                    <TouchableOpacity
                      style={styles.socialCircleBtn}
                      onPress={handleAppleLogin}
                      disabled={isLoading}
                    >
                      <Ionicons name="logo-apple" size={24} color="#000" />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.popupFooter}>
                  <Text style={styles.footerGray}>
                    Already have an account?{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSignUpVisible(false);
                      setLoginVisible(true);
                    }}
                    disabled={isLoading}
                  >
                    <Text
                      style={{
                        color: '#f97316',
                        fontFamily: 'PoppinsBold',
                        fontWeight: 'bold',
                      }}
                    >
                      Log In
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* --- FORGOT PASSWORD MODAL --- */}
      <Modal visible={forgotVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            style={styles.modalKeyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.authPopupCard}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.authPopupScrollBody}
              >
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={closeForgotPassword}
                  disabled={isSendingReset}
                >
                  <Ionicons name="close" size={24} color="#999" />
                </TouchableOpacity>

                {resetSent ? (
                  <>
                    <View style={styles.resetSuccessIcon}>
                      <Ionicons
                        name="mail-open-outline"
                        size={40}
                        color="#f97316"
                      />
                    </View>
                    <Text style={styles.popupTitle}>Check Your Inbox</Text>
                    <Text style={styles.popupSubtitle}>
                      If an account exists for{' '}
                      <Text style={styles.resetEmailHighlight}>
                        {forgotEmail.trim()}
                      </Text>
                      , we&lsquo;ve sent a link to reset your password. It may
                      take a minute to arrive — remember to check spam.
                    </Text>

                    <TouchableOpacity
                      style={styles.orangeActionBtn}
                      onPress={closeForgotPassword}
                    >
                      <Text style={styles.orangeActionText}>
                        BACK TO LOGIN
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.popupFooter}>
                      <Text style={styles.footerGray}>Didn&lsquo;t get it? </Text>
                      <TouchableOpacity
                        onPress={handleForgotPassword}
                        disabled={isSendingReset}
                      >
                        <Text style={styles.resendText}>
                          {isSendingReset ? 'Sending...' : 'Resend email'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.popupTitle}>Reset Password</Text>
                    <Text style={styles.popupSubtitle}>
                      Enter the email on your account and we&lsquo;ll send you a
                      link to set a new password.
                    </Text>

                    <Input
                      variant="filled"
                      containerStyle={styles.fieldGroup}
                      label="Email"
                      placeholder="Enter your email"
                      value={forgotEmail}
                      onChangeText={setForgotEmail}
                      editable={!isSendingReset}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      returnKeyType="go"
                      onSubmitEditing={handleForgotPassword}
                    />

                    <TouchableOpacity
                      style={[
                        styles.orangeActionBtn,
                        isSendingReset && styles.disabledBtn,
                      ]}
                      onPress={handleForgotPassword}
                      disabled={isSendingReset}
                    >
                      {isSendingReset ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.orangeActionText}>
                          SEND RESET LINK
                        </Text>
                      )}
                    </TouchableOpacity>

                    <View style={styles.popupFooter}>
                      <Text style={styles.footerGray}>
                        Remembered your password?{' '}
                      </Text>
                      <TouchableOpacity
                        onPress={closeForgotPassword}
                        disabled={isSendingReset}
                      >
                        <Text style={styles.footerLink}>Log In</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* --- OTP VERIFICATION MODAL --- */}
      <Modal visible={showOtpModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            style={styles.modalKeyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.otpModalCard}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => {
                  if (!isVerifyingOtp && !isSendingOtp) {
                    setShowOtpModal(false);
                    setSignUpVisible(true); // Show signup modal to try again
                  }
                }}
                disabled={isVerifyingOtp || isSendingOtp}
              >
                <Ionicons name="close" size={24} color="#999" />
              </TouchableOpacity>

              <View style={styles.otpHeader}>
                <Ionicons name="mail" size={50} color="#f97316" />
              </View>

              <Text style={styles.otpTitle}>Verify Your Email</Text>
              <Text style={styles.otpSubtitle}>
                We&lsquo;ve sent a verification code to {'\n'}
                <Text style={{ fontFamily: 'PoppinsBold', fontWeight: 'bold' }}>
                  {signUpEmail}
                </Text>
              </Text>

              <Input
                variant="filled"
                containerStyle={styles.otpField}
                label="Enter OTP"
                placeholder="6-digit code"
                value={otp}
                onChangeText={setOtp}
                editable={!isVerifyingOtp}
                keyboardType="number-pad"
                maxLength={6}
                textAlign="center"
                autoComplete="sms-otp"
                returnKeyType="go"
                onSubmitEditing={handleVerifyOtp}
                inputStyle={styles.otpInput}
                fieldStyle={styles.otpInputWrapper}
              />

              <TouchableOpacity
                style={[
                  styles.orangeActionBtn,
                  (isVerifyingOtp || isSendingOtp) && styles.disabledBtn,
                ]}
                onPress={handleVerifyOtp}
                disabled={isVerifyingOtp || isSendingOtp}
              >
                {isVerifyingOtp ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.orangeActionText}>VERIFY</Text>
                )}
              </TouchableOpacity>

              <View style={styles.otpFooter}>
                <Text style={styles.otpFooterText}>
                  Didn&lsquo;t receive the code?
                </Text>
                <TouchableOpacity
                  onPress={handleSignUp}
                  disabled={isVerifyingOtp || isSendingOtp}
                >
                  <Text
                    style={[
                      styles.resendText,
                      (isVerifyingOtp || isSendingOtp) && { opacity: 0.5 },
                    ]}
                  >
                    {isSendingOtp ? 'Sending...' : 'Resend OTP'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// --- SUB-COMPONENTS ---

const OrderIcon = ({ icon, label }: any) => (
  <View style={styles.orderItem}>
    <Ionicons name={icon} size={scale(24)} color="#f97316" />
    <Text style={styles.orderLabel}>{label}</Text>
  </View>
);

const GridItem = ({ icon, color, label }: any) => (
  <View style={styles.gridItem}>
    <View style={[styles.gridIconCircle, { backgroundColor: `${color}15` }]}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <Text style={styles.gridLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  // White to match the header, which sits flush against the top of the
  // screen (square top corners) — the page's gray lives on `scrollBody`.
  container: { flex: 1, backgroundColor: '#fff' },
  scrollBody: { flex: 1, backgroundColor: '#F1F2F4' },
  header: {
    padding: scale(20),
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: scale(40),
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    // elevation: 5,
  },
  settingsIcon: {
    alignSelf: 'flex-end',
    position: 'absolute',
    top: scale(15),
    right: scale(20),
  },
  welcomeText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
    fontWeight: '500',
    fontFamily: 'PoppinsMedium',
  },
  btnRow: { flexDirection: 'row', gap: scale(15) },
  loginBtn: {
    backgroundColor: '#f97316',
    paddingVertical: scale(12),
    width: screenWidth / 2 - scale(35),
    borderRadius: 8,
    alignItems: 'center',
  },
  signUpBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: scale(12),
    width: screenWidth / 2 - scale(35),
    borderRadius: 8,
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontFamily: 'PoppinsBold',
    fontWeight: 'bold',
    fontSize: 15,
  },
  signUpText: {
    color: '#f97316',
    fontFamily: 'PoppinsBold',
    fontWeight: 'bold',
    fontSize: 15,
  },
  promoRow: {
    flexDirection: 'row',
    paddingTop: SECTION_GAP,
  },
  promoCard: {
    backgroundColor: '#fff',
    width: '50%',
    padding: 10,
    alignItems: 'center',
  },
  promoCardDivider: {
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  promoHeader: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginBottom: 5,
  },
  promoTitle: {
    fontSize: 11,
    fontFamily: 'PoppinsBold',
    fontWeight: 'bold',
    color: '#333',
  },
  promoPlaceholder: { width: 50, height: 50, marginVertical: 5 },
  collectBtn: {
    backgroundColor: '#f97316',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  playBtn: {
    backgroundColor: '#f97316',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  btnText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'PoppinsBold',
    fontWeight: 'bold',
  },
  sectionCard: {
    backgroundColor: '#fff',
    marginTop: SECTION_GAP,
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'PoppinsBold',
    fontWeight: 'bold',
    color: '#1a1c1e',
  },
  viewAllText: { fontSize: 11, color: '#999' },
  orderIconsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  orderItem: { alignItems: 'center', width: '20%' },
  orderLabel: {
    fontSize: 10,
    color: '#444',
    marginTop: 8,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    marginHorizontal: scale(10),
    borderRadius: 10,
    paddingVertical: 15,
  },
  gridItem: { width: '25%', alignItems: 'center', marginBottom: 20 },
  gridIconCircle: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridLabel: { fontSize: 10, color: '#333', textAlign: 'center' },

  // POPUP STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // The card's maxHeight is a percentage, so its parent needs a resolved
  // height — without flex:1 here the percentage collapses and the card's
  // ScrollView is clipped instead of scrolling (social buttons cut off).
  modalKeyboardView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authPopupCard: {
    backgroundColor: '#fff',
    width: screenWidth * 0.9,
    maxHeight: '90%',
    borderRadius: 20,
    elevation: 10,
  },
  // Padding lives on the scroll content, not the card, so the last row can
  // scroll clear of the rounded bottom edge.
  authPopupScrollBody: { padding: 20 },
  closeBtn: { alignSelf: 'flex-end' },
  popupTitle: {
    fontSize: 24,
    fontFamily: 'PoppinsBold',
    fontWeight: 'bold',
    color: '#1a1c1e',
  },
  popupSubtitle: {
    fontSize: 13,
    fontFamily: 'PoppinsRegular',
    color: '#777',
    marginTop: 5,
    marginBottom: 20,
  },
  fieldGroup: { marginBottom: 14 },
  forgotText: {
    fontSize: 12,
    color: '#f97316',
    fontFamily: 'PoppinsSemiBold',
    fontWeight: '600',
  },
  nameRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  nameField: { flex: 1 },
  orangeActionBtn: {
    backgroundColor: '#ff6600',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    minHeight: 50,
    // Fields already carry their own bottom margin; this only tops it up.
    marginTop: 8,
  },
  disabledBtn: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  orangeActionText: {
    color: '#fff',
    fontFamily: 'PoppinsBold',
    fontWeight: 'bold',
    fontSize: 14,
  },
  socialBtnsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  socialCircleBtn: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  popupFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerGray: { color: '#888', fontSize: 13, fontFamily: 'PoppinsRegular' },
  footerLink: {
    color: '#f97316',
    fontSize: 13,
    fontFamily: 'PoppinsBold',
    fontWeight: 'bold',
  },
  resetSuccessIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff3e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  resetEmailHighlight: {
    color: '#333',
    fontFamily: 'PoppinsBold',
    fontWeight: 'bold',
  },

  // OTP MODAL STYLES
  otpModalCard: {
    backgroundColor: '#fff',
    width: screenWidth * 0.85,
    borderRadius: 20,
    padding: 25,
    elevation: 10,
    alignItems: 'center',
  },
  otpHeader: {
    marginVertical: 15,
    backgroundColor: '#fff3e0',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'PoppinsBold',
    color: '#1a1c1e',
    marginTop: 15,
  },
  otpSubtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
  otpField: { alignSelf: 'stretch', marginBottom: 14 },
  otpInputWrapper: { backgroundColor: '#f5f5f5' },
  otpInput: {
    letterSpacing: 5,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'PoppinsSemiBold',
  },
  otpFooter: {
    marginTop: 20,
    alignItems: 'center',
    gap: 5,
  },
  otpFooterText: {
    fontSize: 12,
    color: '#999',
  },
  resendText: {
    fontSize: 13,
    color: '#f97316',
    fontWeight: '600',
    fontFamily: 'PoppinsSemiBold',
  },
});

export default LoginSignup;
