import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';

// Mock data for UI demonstration
const PRODUCTS = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 129.99,
    image: 'https://via.placeholder.com/150',
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    image: 'https://via.placeholder.com/150',
    rating: 4.2,
  },
  {
    id: '3',
    name: 'Bluetooth Speaker',
    price: 79.99,
    image: 'https://via.placeholder.com/150',
    rating: 4.0,
  },
  {
    id: '4',
    name: 'Laptop Stand',
    price: 49.99,
    image: 'https://via.placeholder.com/150',
    rating: 4.8,
  },
  {
    id: '5',
    name: 'Wireless Charger',
    price: 39.99,
    image: 'https://via.placeholder.com/150',
    rating: 3.9,
  },
  {
    id: '6',
    name: 'USB-C Hub',
    price: 59.99,
    image: 'https://via.placeholder.com/150',
    rating: 4.3,
  },
];

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
};

const ProductListScreen: React.FC = () => {
  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>★ {item.rating.toFixed(1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Products</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search products..." />
      </View>

      <View style={styles.filterContainer}>
        <ScrollableChips />
      </View>

      <FlatList
        data={PRODUCTS}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
};

// Horizontal scrollable filter chips
const ScrollableChips: React.FC = () => {
  const filters = ['All', 'Electronics', 'Accessories', 'New', 'Popular', 'On Sale'];

  return (
    <FlatList
      horizontal
      data={filters}
      renderItem={({ item, index }) => (
        <TouchableOpacity style={[styles.filterChip, index === 0 ? styles.activeFilterChip : null]}>
          <Text style={[styles.filterChipText, index === 0 ? styles.activeFilterChipText : null]}>
            {item}
          </Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterChipList}
    />
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
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterChipList: {
    paddingHorizontal: 16,
  },
  filterChip: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: '#3498db',
  },
  filterChipText: {
    color: '#666',
  },
  activeFilterChipText: {
    color: '#fff',
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#f39c12',
    fontSize: 12,
  },
});

export default ProductListScreen;
