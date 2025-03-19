// import { Stack } from 'expo-router';

// import { Container } from '~/components/Container';
// import { ScreenContent } from '~/components/ScreenContent';
// import ProductListScreen from '~/screen/ProductList';

// export default function Home() {
//   return (
//     <>
//       <Stack.Screen options={{ title: 'Tab One' }} />
//       <Container>
//         {/* <ScreenContent path="app/(drawer)/(tabs)/index.tsx" title="Tab One" /> */}
//         <ProductListScreen />
//       </Container>
//     </>
//   );
// }

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '~/store/store';
import { Product, useProductStore } from '~/store/productStore';

const ProductListScreen: React.FC = () => {
  const { products, loading, fetchProducts } = useProductStore();
  const { signOut } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductPress = (id: string) => {
    router.push('/(drawer)/(tabs)/productDetail');
  };

  const handleAddProduct = () => {
    router.push('/(drawer)/(tabs)/productAdd');
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productCard} onPress={() => handleProductPress(item.id)}>
      <Image
        source={{
          uri:
            item.images && item.images.length > 0
              ? item.images[0]
              : 'https://via.placeholder.com/150',
        }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.inventoryContainer}>
          <Text style={styles.inventoryText}>
            {item.inventory > 0 ? `${item.inventory} in stock` : 'Out of stock'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Products</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.logoutButton} onPress={() => signOut()}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search products..." />
      </View>

      {loading && products.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.productList}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchProducts} colors={['#3498db']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products found</Text>
              <TouchableOpacity style={styles.emptyButton} onPress={handleAddProduct}>
                <Text style={styles.emptyButtonText}>Add Your First Product</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#f2f2f2',
  },
  logoutButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productList: {
    padding: 8,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 4,
  },
  inventoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inventoryText: {
    color: '#666',
    fontSize: 12,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default ProductListScreen;
