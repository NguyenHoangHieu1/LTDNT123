import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProductStore } from '../../../store/productStore';

const { width } = Dimensions.get('window');

const ProductDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const { currentProduct, fetchProductById, loading, deleteProduct } = useProductStore();
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProductById(id as string);
    }
  }, [id]);

  const handleEdit = () => {
    router.push('/(drawer)/(tabs)/productEdit');
  };

  const handleDelete = () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteProduct(id as string);
          router.back();
        },
      },
    ]);
  };

  const handleViewImages = () => {
    router.push('/(drawer)/(tabs)/ImageViewing');
  };

  if (loading || !currentProduct) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <TouchableOpacity onPress={handleViewImages}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.imageGallery}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
              setSelectedImageIndex(newIndex);
            }}>
            {currentProduct.images && currentProduct.images.length > 0 ? (
              currentProduct.images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: image }} style={styles.productImage} />
                </View>
              ))
            ) : (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/500' }}
                  style={styles.productImage}
                />
              </View>
            )}
          </ScrollView>
        </TouchableOpacity>

        {/* Image Indicators */}
        {currentProduct.images && currentProduct.images.length > 1 && (
          <View style={styles.indicatorContainer}>
            {currentProduct.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === selectedImageIndex ? styles.activeIndicator : null,
                ]}
              />
            ))}
          </View>
        )}

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{currentProduct.name}</Text>
          <Text style={styles.productPrice}>${currentProduct.price.toFixed(2)}</Text>

          <View style={styles.inventoryContainer}>
            <Text style={styles.inventoryText}>
              {currentProduct.inventory > 0
                ? `${currentProduct.inventory} in stock`
                : 'Out of stock'}
            </Text>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{currentProduct.description}</Text>

          {/* Features */}
          {currentProduct.features && currentProduct.features.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Features</Text>
              <View style={styles.featuresList}>
                {currentProduct.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageGallery: {
    height: width * 0.8,
  },
  imageContainer: {
    width: width,
    height: width * 0.8,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#3498db',
  },
  infoContainer: {
    padding: 16,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 8,
  },
  inventoryContainer: {
    marginBottom: 16,
  },
  inventoryText: {
    color: '#666',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
    marginBottom: 16,
  },
  featuresList: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3498db',
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
  },
  actionBar: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  editButton: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 14,
    marginRight: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductDetailScreen;
