import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
  Alert,
  ActivityIndicator,
} from 'react-native';

import { Container } from '~/components/Container';
import { useProductStore } from '~/store/productStore';

export default function EditProductScreen() {
  const { id } = useLocalSearchParams();
  const { currentProduct, fetchProductById, updateProduct, uploadImage, loading } =
    useProductStore();
  const router = useRouter();

  const [tensanpham, settensanpham] = useState('');
  const [gia, setgia] = useState('');
  const [loaisp, setloaisp] = useState('');
  const [hinhanh, sethinhanh] = useState<string>('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        await fetchProductById(id as string);
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    if (currentProduct) {
      settensanpham(currentProduct.tensanpham);
      setgia(currentProduct.gia.toString());
      setloaisp(currentProduct.loaisp || '');
      sethinhanh(currentProduct.hinhanh || '');
      setIsLoading(false);
    }
  }, [currentProduct]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permission to upload images');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      sethinhanh(selectedImage.uri);
    }
  };

  const removeImage = () => {
    sethinhanh('');
  };

  const handleSave = async () => {
    // Validate required fields
    if (!tensanpham || !gia || !loaisp) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setUploadingImages(true);

      // Upload new images to Supabase storage
      let imageUrl = '';
      const fileName = hinhanh.split('/').pop() || 'image.jpg';
      const url = await uploadImage(hinhanh);
      if (url) {
        imageUrl = url;
      }

      setUploadingImages(false);

      // Update product in Supabase
      await updateProduct(id as string, {
        tensanpham,
        gia: parseFloat(gia),
        loaisp,
        hinhanh: imageUrl,
      });

      Alert.alert('Success', 'Product updated successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      setUploadingImages(false);
      Alert.alert('Error', 'Failed to update product');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Edit this product' }} />
      <Container>
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
                <View style={styles.imageContainer}>
                  <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                    {hinhanh ? (
                      <Image source={{ uri: hinhanh }} style={styles.productImage} />
                    ) : (
                      <>
                        <Text style={styles.addImageButtonText}>+</Text>
                        <Text style={styles.addImageLabel}>Add Image</Text>
                      </>
                    )}
                  </TouchableOpacity>
                  {hinhanh && (
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage()}>
                      <Text style={styles.removeImageButtonText}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>

            {/* Basic Information */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Basic Information</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Product Name*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter product name"
                  value={tensanpham}
                  onChangeText={settensanpham}
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Price*</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    value={gia}
                    onChangeText={setgia}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Category*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter category"
                  value={loaisp}
                  onChangeText={setloaisp}
                />
              </View>
            </View>

            {/* Inventory */}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => router.back()}
                disabled={loading || uploadingImages}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={loading || uploadingImages}>
                {loading || uploadingImages ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  cancelButton: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 14,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
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
