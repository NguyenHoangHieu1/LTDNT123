import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

// Mock product data for UI demonstration
const product = {
  id: '1',
  name: 'Wireless Noise Cancelling Headphones',
  price: 299.99,
  discount: 10,
  category: 'Electronics',
  sku: 'WH-1000XM4',
  quantity: 45,
  description:
    'Premium wireless headphones with industry-leading noise cancellation, exceptional sound quality, and up to 30 hours of battery life. Features touch controls, voice assistant support, and comfortable over-ear design.',
  images: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  features: ['Active Noise Cancellation', '30-hour Battery Life', 'Bluetooth 5.0'],
};

const EditProductScreen: React.FC = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Edit Product</Text>
        </View>

        {/* Image Upload Section */}
        <View style={styles.imageUploadSection}>
          <Text style={styles.sectionTitle}>Product Images</Text>
          <View style={styles.imageRow}>
            {product.images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.productImage} />
                <TouchableOpacity style={styles.removeImageButton}>
                  <Text style={styles.removeImageButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addImageButton}>
              <Text style={styles.addImageButtonText}>+</Text>
              <Text style={styles.addImageLabel}>Add Image</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Basic Information */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Product Name*</Text>
            <TextInput style={styles.input} defaultValue={product.name} />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Price*</Text>
              <TextInput
                style={styles.input}
                defaultValue={product.price.toString()}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Discount</Text>
              <TextInput
                style={styles.input}
                defaultValue={`${product.discount}%`}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Category*</Text>
            <TouchableOpacity style={styles.selectInput}>
              <Text>{product.category}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Inventory */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Inventory</Text>

          <View style={styles.rowInputs}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>SKU</Text>
              <TextInput style={styles.input} defaultValue={product.sku} />
            </View>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Quantity</Text>
              <TextInput
                style={styles.input}
                defaultValue={product.quantity.toString()}
                keyboardType="number-pad"
              />
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Description</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Product Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              defaultValue={product.description}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Features */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Features</Text>

          <View style={styles.featuresList}>
            {product.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <TextInput style={styles.featureInput} defaultValue={feature} />
                <TouchableOpacity style={styles.removeFeatureButton}>
                  <Text style={styles.removeFeatureButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={styles.addFeatureButton}>
              <Text style={styles.addFeatureButtonText}>+ Add Another Feature</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  imageUploadSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  addImageButtonText: {
    fontSize: 24,
    color: '#3498db',
  },
  addImageLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
  },
  rowInputs: {
    flexDirection: 'row',
  },
  selectInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  featuresList: {
    marginBottom: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginRight: 8,
  },
  removeFeatureButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeFeatureButtonText: {
    fontSize: 20,
    color: '#666',
  },
  addFeatureButton: {
    padding: 8,
  },
  addFeatureButtonText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 30,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    padding: 14,
    marginRight: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProductScreen;
