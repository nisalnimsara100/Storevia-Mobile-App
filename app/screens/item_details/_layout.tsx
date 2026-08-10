import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ItemDetailsLayout = () => {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        header: () => (
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.searchBar} activeOpacity={0.8}>
              <Ionicons name="search" size={18} color="#999" />
              <Text style={styles.searchText}>Search in Storevia</Text>
            </TouchableOpacity>

            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="share-social-outline" size={20} color="#333" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="cart-outline" size={20} color="#333" />
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>1</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="ellipsis-vertical" size={20} color="#333" />
              </TouchableOpacity>
            </View>
          </View>
        ),
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Item Details' }} />
    </Stack>
  );
};

export default ItemDetailsLayout;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#fc8107',
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 12,
    marginRight: 5,
  },
  searchText: {
    marginLeft: 8,
    color: '#000',
    opacity: 0.8,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 0,
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ff5a00',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
