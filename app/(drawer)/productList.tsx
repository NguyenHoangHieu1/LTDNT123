import { Link, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
  TextInput,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product, useProductStore } from '../../store/productStore';
import { useAuthStore } from '~/store/store';
import { debounce } from 'lodash';

// Define sort options
type SortOption = {
  label: string;
  value: string;
  icon: string;
};

const sortOptions: SortOption[] = [
  { label: 'Name (A-Z)', value: 'name_asc', icon: 'text' },
  { label: 'Name (Z-A)', value: 'name_desc', icon: 'text' },
  { label: 'Price (Low to High)', value: 'price_asc', icon: 'pricetag' },
  { label: 'Price (High to Low)', value: 'price_desc', icon: 'pricetag' },
];

const ProductListScreen: React.FC = () => {
  const { products, fetchProducts, loading, error } = useProductStore();
  const { user, signOut } = useAuthStore();
  const router = useRouter();
  const [isGridView, setIsGridView] = useState(false);

  // Add this function to your component
  const toggleViewMode = () => {
    setIsGridView(!isGridView);
  };

  // State for search and sort
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortOption>(sortOptions[0]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  // Apply filtering and sorting whenever products, search query, or sort option changes
  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, currentSort]);

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

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((text: string) => {
      setSearchQuery(text);
    }, 300),
    []
  );

  const handleSearchChange = (text: string) => {
    debouncedSearch(text);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const filterAndSortProducts = () => {
    // First filter products based on search query
    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.tensanpham.toLowerCase().includes(query) ||
          product.loaisp.toLowerCase().includes(query)
      );
    }

    // Then sort the filtered products
    switch (currentSort.value) {
      case 'name_asc':
        result.sort((a, b) => a.tensanpham.localeCompare(b.tensanpham));
        break;
      case 'name_desc':
        result.sort((a, b) => b.tensanpham.localeCompare(a.tensanpham));
        break;
      case 'price_asc':
        result.sort((a, b) => a.gia - b.gia);
        break;
      case 'price_desc':
        result.sort((a, b) => b.gia - a.gia);
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  };

  const handleSortSelect = (option: SortOption) => {
    setCurrentSort(option);
    setSortModalVisible(false);
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  const renderProductItem = ({ item }: { item: any }) => {
    if (isGridView) {
      return (
        <Link href={{ pathname: `/(products)/detail/[id]`, params: { id: item.idsanpham } }}>
          <View style={styles.gridProductCard}>
            <Image
              source={{
                uri: item.hinhanh || 'https://via.placeholder.com/100',
              }}
              style={styles.gridProductImage}
            />
            <View style={styles.gridProductInfo}>
              <Text style={styles.gridProductName} numberOfLines={1}>
                {item.tensanpham}
              </Text>
              <Text style={styles.gridProductCategory} numberOfLines={1}>
                {item.loaisp}
              </Text>
              <Text style={styles.gridProductPrice}>${item.gia.toFixed(2)}</Text>
            </View>
          </View>
        </Link>
      );
    }

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

  const renderSortModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={sortModalVisible}
      onRequestClose={() => setSortModalVisible(false)}>
      <Pressable style={styles.modalOverlay} onPress={() => setSortModalVisible(false)}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sort Products</Text>
            <TouchableOpacity onPress={() => setSortModalVisible(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.sortOptionsList}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.sortOption,
                  currentSort.value === option.value && styles.selectedSortOption,
                ]}
                onPress={() => handleSortSelect(option)}>
                <View style={styles.sortOptionContent}>
                  <Ionicons
                    name={option.icon as any}
                    size={20}
                    color={currentSort.value === option.value ? '#3498db' : '#333'}
                    style={styles.sortOptionIcon}
                  />
                  <Text
                    style={[
                      styles.sortOptionText,
                      {
                        color: currentSort.value === option.value ? '#3498db' : '#333',
                      },
                    ]}>
                    {option.label}
                  </Text>
                </View>
                {currentSort.value === option.value && (
                  <Ionicons name="checkmark" size={20} color="#3498db" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );

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

      {/* Search and Sort Bar */}
      <View style={styles.searchSortContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#999"
            onChangeText={handleSearchChange}
            defaultValue={searchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity style={styles.sortButton} onPress={() => setSortModalVisible(true)}>
          <Ionicons name="options-outline" size={20} color="#333" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.viewModeButton} onPress={toggleViewMode}>
        <Ionicons name={isGridView ? 'list-outline' : 'grid-outline'} size={20} color="#333" />
      </TouchableOpacity>

      {/* Sort Indicator */}
      <View style={styles.sortIndicator}>
        <Text style={styles.sortIndicatorText}>
          <Text style={styles.sortLabel}>Sorted by: </Text>
          {currentSort.label}
        </Text>
        {searchQuery ? (
          <View style={styles.searchResultsInfo}>
            <Text style={styles.searchResultsText}>
              {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}
            </Text>
            <TouchableOpacity onPress={clearSearch}>
              <Text style={styles.clearSearchText}>Clear</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {loading && !refreshing && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      )}

      {!loading && filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          {searchQuery ? (
            <>
              <Text style={styles.emptyText}>No products found</Text>
              <Text style={styles.emptySubtext}>
                Try a different search term or clear the search
              </Text>
              <TouchableOpacity style={styles.emptyAddButton} onPress={clearSearch}>
                <Text style={styles.emptyAddButtonText}>Clear Search</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.emptyText}>No products found</Text>
              <Text style={styles.emptySubtext}>Add your first product to get started</Text>
              <TouchableOpacity style={styles.emptyAddButton} onPress={handleAddProduct}>
                <Text style={styles.emptyAddButtonText}>+ Add Product</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.idsanpham}
          contentContainerStyle={styles.productList}
          numColumns={isGridView ? 2 : 1}
          key={isGridView ? 'grid' : 'list'} // Important for re-rendering when switching views
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      {renderSortModal()}
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
  // Search and Sort styles
  searchSortContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  sortButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  sortIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
  },
  sortIndicatorText: {
    fontSize: 14,
    color: '#666',
  },
  sortLabel: {
    fontWeight: '500',
    color: '#333',
  },
  searchResultsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchResultsText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  clearSearchText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3498db',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sortOptionsList: {
    marginBottom: 16,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedSortOption: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
  },
  sortOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortOptionIcon: {
    marginRight: 12,
  },
  sortOptionText: {
    fontSize: 16,
  },
  // Product list styles
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
  viewModeButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    marginLeft: 8,
  },
  gridProductCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    // width: '100%',
    maxWidth: '47%',
  },
  gridProductImage: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    backgroundColor: '#f2f2f2',
    marginBottom: 8,
  },
  gridProductInfo: {
    padding: 4,
  },
  gridProductName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  gridProductCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  gridProductPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3498db',
  },
});

export default ProductListScreen;
