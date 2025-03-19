import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

// Mock product data for UI demonstration
const product = {
  id: '1',
  name: 'Wireless Noise Cancelling Headphones',
  price: 299.99,
  rating: 4.8,
  reviewCount: 256,
  description:
    'Premium wireless headphones with industry-leading noise cancellation, exceptional sound quality, and up to 30 hours of battery life. Features touch controls, voice assistant support, and comfortable over-ear design.',
  images: [
    'https://via.placeholder.com/500',
    'https://via.placeholder.com/500',
    'https://via.placeholder.com/500',
  ],
  colors: ['#000', '#3498db', '#e74c3c'],
  features: [
    'Active Noise Cancellation',
    '30-hour Battery Life',
    'Bluetooth 5.0',
    'Touch Controls',
    'Voice Assistant Support',
  ],
};

const ProductDetailScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.imageGallery}>
          {product.images.map((image, index) => (
            <TouchableOpacity key={index} style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.productImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Image Indicators */}
        <View style={styles.indicatorContainer}>
          {product.images.map((_, index) => (
            <View
              key={index}
              style={[styles.indicator, index === 0 ? styles.activeIndicator : null]}
            />
          ))}
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>

          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>★ {product.rating}</Text>
            <Text style={styles.reviewCount}>({product.reviewCount} reviews)</Text>
          </View>

          {/* Color Options */}
          <Text style={styles.sectionTitle}>Colors</Text>
          <View style={styles.colorContainer}>
            {product.colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  index === 0 ? styles.selectedColorOption : null,
                ]}
              />
            ))}
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Features */}
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresList}>
            {product.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartButtonText}>Add to Cart</Text>
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    color: '#f39c12',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  reviewCount: {
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
  colorContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedColorOption: {
    borderWidth: 2,
    borderColor: '#3498db',
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
  addToCartButton: {
    flex: 2,
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductDetailScreen;
