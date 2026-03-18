import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');
const scale = (size: number) => (screenWidth / 375) * size;

interface Props {
  onLogin: () => void;
}

const LoginSignup = ({ onLogin }: Props) => {
  const [loginVisible, setLoginVisible] = useState(false);
  const [signUpVisible, setSignUpVisible] = useState(false);

  // This function is called when the user clicks the ORANGE button inside the popups
  const handleAuthSuccess = () => {
    setLoginVisible(false);
    setSignUpVisible(false);
    onLogin(); // This tells Account.tsx that the user is now logged in
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
            <TouchableOpacity style={styles.loginBtn} onPress={() => setLoginVisible(true)}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signUpBtn} onPress={() => setSignUpVisible(true)}>
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
            <Image source={{ uri: 'https://img.icons8.com/fluency/96/diamond.png' }} style={styles.promoPlaceholder} />
            <TouchableOpacity style={styles.collectBtn}><Text style={styles.btnText}>Collect</Text></TouchableOpacity>
          </View>

          <View style={styles.promoCard}>
            <View style={styles.promoHeader}>
              <Ionicons name="gift" size={14} color="#FFD700" />
              <Text style={styles.promoTitle}> Storevia Freebie</Text>
            </View>
            <Image source={{ uri: 'https://img.icons8.com/fluency/96/gift.png' }} style={styles.promoPlaceholder} />
            <TouchableOpacity style={styles.playBtn}><Text style={styles.btnText}>Play Now</Text></TouchableOpacity>
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
          <GridItem icon="game-controller" color="#3b5998" label="Storevia Candy" />
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
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.authPopupCard}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setLoginVisible(false)}>
                <Ionicons name="close" size={24} color="#999" />
              </TouchableOpacity>
              
              <Text style={styles.popupTitle}>Welcome Back</Text>
              <Text style={styles.popupSubtitle}>Log in to your Storevia account</Text>

              <Text style={styles.inputLabel}>Email</Text>
              <TextInput style={styles.textInput} placeholder="store" placeholderTextColor="#999" />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                <Text style={styles.inputLabel}>Password</Text>
                <TouchableOpacity><Text style={{ color: '#f36d21', fontSize: 12 }}>Forgot?</Text></TouchableOpacity>
              </View>
              <View style={styles.passInputWrapper}>
                <TextInput style={styles.textInput} secureTextEntry value="password123" />
                <Ionicons name="eye-outline" size={18} color="#800" style={styles.eyeIcon} />
              </View>

              <TouchableOpacity style={styles.orangeActionBtn} onPress={handleAuthSuccess}>
                <Text style={styles.orangeActionText}>LOGIN</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.googleCircleBtn}>
                 <Image source={{ uri: 'https://img.icons8.com/color/48/google-logo.png' }} style={{ width: 24, height: 24 }} />
              </TouchableOpacity>

              <View style={styles.popupFooter}>
                <Text style={styles.footerGray}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => { setLoginVisible(false); setSignUpVisible(true); }}>
                  <Text style={{ color: '#f36d21', fontWeight: 'bold' }}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* --- SIGN UP POPUP MODAL --- */}
      <Modal visible={signUpVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={[styles.authPopupCard, { maxHeight: '90%' }]}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setSignUpVisible(false)}>
                  <Ionicons name="close" size={24} color="#999" />
                </TouchableOpacity>
                
                <Text style={styles.popupTitle}>Join Storevia</Text>
                <Text style={styles.popupSubtitle}>Create your account to start shopping</Text>

                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput style={styles.textInput} placeholder="Nimal" />

                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput style={styles.textInput} placeholder="Doe" />

                <Text style={styles.inputLabel}>Email</Text>
                <TextInput style={styles.textInput} placeholder="nimal.silva@gmail.com" />

                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput style={styles.textInput} placeholder="store" />

                <Text style={styles.inputLabel}>Password</Text>
                <TextInput style={styles.textInput} secureTextEntry value="........" />

                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput style={styles.textInput} secureTextEntry value="........" />

                <TouchableOpacity style={styles.orangeActionBtn} onPress={handleAuthSuccess}>
                  <Text style={styles.orangeActionText}>SIGN UP</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.googleCircleBtn}>
                  <Image source={{ uri: 'https://img.icons8.com/color/48/google-logo.png' }} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>

                <View style={styles.popupFooter}>
                  <Text style={styles.footerGray}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => { setSignUpVisible(false); setLoginVisible(true); }}>
                    <Text style={{ color: '#f36d21', fontWeight: 'bold' }}>Log In</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
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
    elevation: 5,
  },
  settingsIcon: { alignSelf: 'flex-end', position: 'absolute', top: scale(15), right: scale(20) },
  welcomeText: { fontSize: 15, color: '#666', marginBottom: 20, fontWeight: '500' },
  btnRow: { flexDirection: 'row', gap: scale(15) },
  loginBtn: { backgroundColor: '#f36d21', paddingVertical: scale(12), width: (screenWidth / 2) - scale(35), borderRadius: 8, alignItems: 'center' },
  signUpBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', paddingVertical: scale(12), width: (screenWidth / 2) - scale(35), borderRadius: 8, alignItems: 'center' },
  loginText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  signUpText: { color: '#f36d21', fontWeight: 'bold', fontSize: 15 },
  promoRow: { flexDirection: 'row', padding: scale(10), justifyContent: 'space-between' },
  promoCard: { backgroundColor: '#fff', width: '48%', borderRadius: 10, padding: 10, alignItems: 'center' },
  promoHeader: { flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', marginBottom: 5 },
  promoTitle: { fontSize: 11, fontWeight: 'bold', color: '#333' },
  promoPlaceholder: { width: 50, height: 50, marginVertical: 5 },
  collectBtn: { backgroundColor: '#f36d21', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20 },
  playBtn: { backgroundColor: '#f36d21', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20 },
  btnText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  sectionCard: { backgroundColor: '#fff', margin: scale(10), borderRadius: 10, padding: 15 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#1a1c1e' },
  viewAllText: { fontSize: 11, color: '#999' },
  orderIconsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  orderItem: { alignItems: 'center', width: '20%' },
  orderLabel: { fontSize: 9, color: '#444', marginTop: 8, textAlign: 'center' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#fff', marginHorizontal: scale(10), borderRadius: 10, paddingVertical: 15 },
  gridItem: { width: '25%', alignItems: 'center', marginBottom: 20 },
  gridIconCircle: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  gridLabel: { fontSize: 10, color: '#333', textAlign: 'center' },

  // POPUP STYLES
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  authPopupCard: { backgroundColor: '#fff', width: screenWidth * 0.9, borderRadius: 20, padding: 20, elevation: 10 },
  closeBtn: { alignSelf: 'flex-end' },
  popupTitle: { fontSize: 24, fontWeight: 'bold', color: '#1a1c1e' },
  popupSubtitle: { fontSize: 13, color: '#777', marginTop: 5, marginBottom: 20 },
  inputLabel: { fontSize: 12, fontWeight: 'bold', color: '#555', marginBottom: 5 },
  textInput: { backgroundColor: '#f0f4f8', borderRadius: 10, padding: 12, fontSize: 14, color: '#333', marginBottom: 10 },
  passInputWrapper: { position: 'relative' },
  eyeIcon: { position: 'absolute', right: 15, top: 15 },
  orangeActionBtn: { backgroundColor: '#ff6600', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  orangeActionText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  googleCircleBtn: { alignSelf: 'center', marginTop: 20, width: 45, height: 45, borderRadius: 25, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 3, borderWidth: 1, borderColor: '#eee' },
  popupFooter: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerGray: { color: '#888', fontSize: 13 }
});

export default LoginSignup;