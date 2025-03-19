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

const AddProductScreen: React.FC = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add New Product</Text>
        </View>

        {/* Image Upload Section */}
        <View style={styles.imageUploadSection}>
          <Text style={styles.sectionTitle}>Product Images</Text>
          <View style={styles.imageRow}>
            <TouchableOpacity style={styles.addImageButton}>
              <Text style={styles.addImageButtonText}>+</Text>
              <Text style={styles.addImageLabel}>Add Image</Text>
            </TouchableOpacity>
            {/* Placeholder for additional images */}
            <View style={styles.imagePlaceholder} />
            <View style={styles.imagePlaceholder} />
            <View style={styles.imagePlaceholder} />
          </View>
        </View>

        {/* Basic Information */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Product Name*</Text>
            <TextInput style={styles.input} placeholder="Enter product name" />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Price*</Text>
              <TextInput style={styles.input} placeholder="0.00" keyboardType="decimal-pad" />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Category*</Text>
            <TouchableOpacity style={styles.selectInput}>
              <Text style={styles.selectPlaceholder}>Select category</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Product</Text>
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
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginRight: 10,
    marginBottom: 10,
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
  selectPlaceholder: {
    color: '#999',
    fontSize: 16,
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

export default AddProductScreen;
