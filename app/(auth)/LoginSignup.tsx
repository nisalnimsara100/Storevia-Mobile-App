import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import Constants, { AppOwnership } from 'expo-constants';
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
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
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/authContext';
import { useAuthStore } from '../stores/useAuthStore';

WebBrowser.maybeCompleteAuthSession();

const { width: screenWidth } = Dimensions.get('window');
const scale = (size: number) => (screenWidth / 375) * size;

interface Props {
  onLogin: () => void;
}

const LoginSignup = ({ onLogin }: Props) => {
  const { signIn, signUp, signInWithGoogle, signInWithApple, loading } =
    useAuth();
  const { user } = useAuthStore();

  const [loginVisible, setLoginVisible] = useState(false);
  const [signUpVisible, setSignUpVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);

  // Sign up form state
  const [signUpFirstName, setSignUpFirstName] = useState('');
  const [signUpLastName, setSignUpLastName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpPasswordVisible, setSignUpPasswordVisible] = useState(false);
  const [signUpConfirmPasswordVisible, setSignUpConfirmPasswordVisible] =
    useState(false);

  // OTP Verification state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const baseUrl = process.env.EXPO_PUBLIC_APP_BASE_URL;

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
    } catch (error: any) {
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

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
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
    if (request) {
      console.log('=== GOOGLE AUTH URL ===');
      console.log(request.url);
      console.log('=======================');
    }
  }, [request]);

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
  }, [response]);

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
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* --- HEADER (Original UI) --- */}
        <View style={styles.header}>
          <View style={styles.settingsIcon}>
            <Ionicons name="settings-outline" size={scale(22)} color="#333" />
          </View>

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

        {/* --- PROMO SECTION (Original UI) --- */}
        <View style={styles.promoRow}>
          <View style={styles.promoCard}>
            <View style={styles.promoHeader}>
              <Ionicons name="diamond-sharp" size={14} color="#C71585" />
              <Text style={styles.promoTitle}> Storevia Gems</Text>
            </View>
            <Image
              source={{ uri: 'https://img.icons8.com/fluency/96/diamond.png' }}
              style={styles.promoPlaceholder}
            />
            <TouchableOpacity style={styles.collectBtn}>
              <Text style={styles.btnText}>Collect</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.promoCard}>
            <View style={styles.promoHeader}>
              <Ionicons name="gift" size={14} color="#FFD700" />
              <Text style={styles.promoTitle}> Storevia Freebie</Text>
            </View>
            <Image
              source={{ uri: 'https://img.icons8.com/fluency/96/gift.png' }}
              style={styles.promoPlaceholder}
            />
            <TouchableOpacity style={styles.playBtn}>
              <Text style={styles.btnText}>Play Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- MY ORDERS SECTION (Original UI) --- */}
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
            <OrderIcon icon="refresh-circle-outline" label="Returns" />
          </View>
        </View>

        {/* --- TOOLS GRID (Original UI) --- */}
        <View style={styles.gridContainer}>
          <GridItem icon="help-circle" color="#ff4d4f" label="Help Center" />
          <GridItem
            icon="game-controller"
            color="#3b5998"
            label="Storevia Candy"
          />
          <GridItem icon="location" color="#f36d21" label="Pickup Points" />
          <GridItem icon="card" color="#2ecc71" label="Payment Options" />
          <GridItem icon="headset" color="#9b59b6" label="Customer Care" />
          <GridItem icon="basket" color="#f1c40f" label="Buy Any 3" />
          <GridItem icon="star" color="#1abc9c" label="My Reviews" />
          <GridItem icon="people" color="#e67e22" label="My Affiliates" />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* --- LOGIN POPUP MODAL --- */}
      <Modal visible={loginVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.authPopupCard}>
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

              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={loginEmail}
                onChangeText={setLoginEmail}
                editable={!isLoading}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 15,
                }}
              >
                <Text style={styles.inputLabel}>Password</Text>
                <TouchableOpacity disabled={isLoading}>
                  <Text style={{ color: '#f36d21', fontSize: 12 }}>
                    Forgot?
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.passInputWrapper}>
                <TextInput
                  style={styles.textInput}
                  secureTextEntry={!loginPasswordVisible}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  value={loginPassword}
                  onChangeText={setLoginPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setLoginPasswordVisible(!loginPasswordVisible)}
                  disabled={isLoading}
                >
                  <Ionicons
                    name={loginPasswordVisible ? 'eye' : 'eye-off-outline'}
                    size={18}
                    color="#800"
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>

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
                  <Text style={{ color: '#f36d21', fontWeight: 'bold' }}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* --- SIGN UP POPUP MODAL --- */}
      <Modal visible={signUpVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={[styles.authPopupCard, { maxHeight: '90%' }]}>
              <ScrollView showsVerticalScrollIndicator={false}>
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

                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your first name"
                  placeholderTextColor="#999"
                  value={signUpFirstName}
                  onChangeText={setSignUpFirstName}
                  editable={!isLoading}
                />

                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your last name"
                  placeholderTextColor="#999"
                  value={signUpLastName}
                  onChangeText={setSignUpLastName}
                  editable={!isLoading}
                />

                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email address"
                  placeholderTextColor="#999"
                  value={signUpEmail}
                  onChangeText={setSignUpEmail}
                  keyboardType="email-address"
                  editable={!isLoading}
                  autoCapitalize="none"
                />

                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#999"
                  value={signUpPhone}
                  onChangeText={setSignUpPhone}
                  keyboardType="phone-pad"
                  editable={!isLoading}
                />

                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passInputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    secureTextEntry={!signUpPasswordVisible}
                    placeholder="Create a password (min 6 chars)"
                    placeholderTextColor="#999"
                    value={signUpPassword}
                    onChangeText={setSignUpPassword}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setSignUpPasswordVisible(!signUpPasswordVisible)
                    }
                    disabled={isLoading}
                  >
                    <Ionicons
                      name={signUpPasswordVisible ? 'eye' : 'eye-off-outline'}
                      size={18}
                      color="#800"
                      style={styles.eyeIcon}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.passInputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    secureTextEntry={!signUpConfirmPasswordVisible}
                    placeholder="Confirm your password"
                    placeholderTextColor="#999"
                    value={signUpConfirmPassword}
                    onChangeText={setSignUpConfirmPassword}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setSignUpConfirmPasswordVisible(
                        !signUpConfirmPasswordVisible,
                      )
                    }
                    disabled={isLoading}
                  >
                    <Ionicons
                      name={
                        signUpConfirmPasswordVisible ? 'eye' : 'eye-off-outline'
                      }
                      size={18}
                      color="#800"
                      style={styles.eyeIcon}
                    />
                  </TouchableOpacity>
                </View>

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
                    <Text style={{ color: '#f36d21', fontWeight: 'bold' }}>
                      Log In
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* --- OTP VERIFICATION MODAL --- */}
      <Modal visible={showOtpModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
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
              <Ionicons name="mail" size={50} color="#f36d21" />
            </View>

            <Text style={styles.otpTitle}>Verify Your Email</Text>
            <Text style={styles.otpSubtitle}>
              We&lsquo;ve sent a verification code to {'\n'}
              <Text style={{ fontWeight: 'bold' }}>{signUpEmail}</Text>
            </Text>

            <Text style={styles.inputLabel}>Enter OTP</Text>
            <TextInput
              style={[styles.textInput, styles.otpInput]}
              placeholder="Enter 6-digit OTP"
              placeholderTextColor="#999"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              editable={!isVerifyingOtp}
              textAlign="center"
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
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// --- SUB-COMPONENTS ---
const OrderIcon = ({ icon, label }: any) => (
  <View style={styles.orderItem}>
    <Ionicons name={icon} size={scale(24)} color="#f36d21" />
    <Text style={styles.orderLabel}>{label}</Text>
  </View>
);

const GridItem = ({ icon, color, label }: any) => (
  <View style={styles.gridItem}>
    <View style={[styles.gridIconCircle, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <Text style={styles.gridLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F2F4' },
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
  },
  btnRow: { flexDirection: 'row', gap: scale(15) },
  loginBtn: {
    backgroundColor: '#f36d21',
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
  loginText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  signUpText: { color: '#f36d21', fontWeight: 'bold', fontSize: 15 },
  promoRow: {
    flexDirection: 'row',
    padding: scale(10),
    justifyContent: 'space-between',
  },
  promoCard: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  promoHeader: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginBottom: 5,
  },
  promoTitle: { fontSize: 11, fontWeight: 'bold', color: '#333' },
  promoPlaceholder: { width: 50, height: 50, marginVertical: 5 },
  collectBtn: {
    backgroundColor: '#f36d21',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  playBtn: {
    backgroundColor: '#f36d21',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  btnText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  sectionCard: {
    backgroundColor: '#fff',
    margin: scale(10),
    borderRadius: 10,
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#1a1c1e' },
  viewAllText: { fontSize: 11, color: '#999' },
  orderIconsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  orderItem: { alignItems: 'center', width: '20%' },
  orderLabel: { fontSize: 9, color: '#444', marginTop: 8, textAlign: 'center' },
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
  authPopupCard: {
    backgroundColor: '#fff',
    width: screenWidth * 0.9,
    borderRadius: 20,
    padding: 20,
    elevation: 10,
  },
  closeBtn: { alignSelf: 'flex-end' },
  popupTitle: { fontSize: 24, fontWeight: 'bold', color: '#1a1c1e' },
  popupSubtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 5,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: '#f0f4f8',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  passInputWrapper: {
    position: 'relative',
    marginBottom: 10,
    backgroundColor: '#f0f4f8',
    borderRadius: 10,
    paddingRight: 10,
  },
  eyeIcon: { position: 'absolute', right: 12, top: 12 },
  orangeActionBtn: {
    backgroundColor: '#ff6600',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledBtn: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  orangeActionText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
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
  footerGray: { color: '#888', fontSize: 13 },

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
    fontSize: 22,
    fontWeight: 'bold',
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
  otpInput: {
    letterSpacing: 5,
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: '#f5f5f5',
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
    color: '#f36d21',
    fontWeight: '600',
  },
});

export default LoginSignup;
