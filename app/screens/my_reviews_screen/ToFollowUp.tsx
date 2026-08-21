import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

const ToFollowUp = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="chatbubbles-outline" size={40} color="#ccc" />
      <Text style={styles.text}>No items need a follow-up right now.</Text>
      <Text style={styles.subText}>
        If a seller replies to your review, you can add a follow-up comment
        here.
      </Text>
    </View>
  );
};

export default ToFollowUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  text: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'PoppinsSemiBold',
    color: '#555',
    textAlign: 'center',
  },
  subText: {
    marginTop: 6,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});
