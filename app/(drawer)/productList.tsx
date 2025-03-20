import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';

import { useProductStore } from '../../store/productStore';

import { useAuthStore } from '~/store/store';

const ProductListScreen: React.FC = () => {
  const { products, fetchProducts, loading, error } = useProductStore();
  const { user, signOut } = useAuthStore();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const loadProducts = async () => {
    try {
      await fetchProducts();
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const handleAddProduct = () => {
    router.push('/(products)/productAdd');
  };

  const handleProductPress = (productId: string) => {
    // router.push(`/(product)/(detail)/${productId}`);
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  const renderProductItem = ({ item }: { item: any }) => {
    console.log('item:', item);
    return (
      <Link href={{ pathname: `/(products)/detail/[id]`, params: { id: item.idsanpham } }}>
        <View style={styles.productCard}>
          <Image
            source={{
              uri: item.hinhanh || 'https://via.placeholder.com/100',
            }}
            style={styles.productImage}
          />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.tensanpham}</Text>
            <Text style={styles.productCategory}>{item.loaisp}</Text>
            <Text style={styles.productPrice}>${item.gia.toFixed(2)}</Text>
          </View>
        </View>
      </Link>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Products</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Welcome, {user.fullName}</Text>
        </View>
      )}

      {loading && !refreshing && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      )}

      {!loading && products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products found</Text>
          <Text style={styles.emptySubtext}>Add your first product to get started</Text>
          <TouchableOpacity style={styles.emptyAddButton} onPress={handleAddProduct}>
            <Text style={styles.emptyAddButtonText}>+ Add Product</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.idsanpham}
          contentContainerStyle={styles.productList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Styles remain the same
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
  headerActions: {
    flexDirection: 'row',
  },
  addButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: '#333',
  },
  userInfo: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  productList: {
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    backgroundColor: '#f2f2f2',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3498db',
    marginBottom: 4,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productSku: {
    fontSize: 12,
    color: '#999',
  },
  productInventory: {
    fontSize: 12,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyAddButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyAddButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ProductListScreen;
