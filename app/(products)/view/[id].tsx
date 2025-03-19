import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import { Container } from '~/components/Container';
import { useProductStore } from '~/store/productStore';

const { width, height } = Dimensions.get('window');

const ImageViewingScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const { currentProduct, fetchProductById, loading } = useProductStore();
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState(0);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProductById(id as string);
    }
  }, [id]);

  const handleImagePress = () => {
    setShowControls(!showControls);
  };

  const handleBack = () => {
    router.back();
  };

  const renderImageItem = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity activeOpacity={1} onPress={handleImagePress} style={styles.imageSlide}>
      <Image source={{ uri: item }} style={styles.fullImage} />
    </TouchableOpacity>
  );

  const renderThumbnail = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      onPress={() => setActiveIndex(index)}
      style={[styles.thumbnailContainer, activeIndex === index && styles.activeThumbnail]}>
      <Image source={{ uri: item }} style={styles.thumbnail} />
    </TouchableOpacity>
  );

  if (loading || !currentProduct) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  // Use placeholder if no images
  const images =
    currentProduct.images && currentProduct.images.length > 0
      ? currentProduct.images
      : ['https://via.placeholder.com/1000'];

  return (
    <>
      <Stack.Screen options={{ title: 'Viewing' }} />
      <Container>
        <View style={styles.container}>
          <StatusBar hidden />

          {/* Main Image Viewer */}
          <FlatList
            data={images}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => `image-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={activeIndex}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.floor(event.nativeEvent.contentOffset.x / width);
              setActiveIndex(newIndex);
            }}
          />

          {/* Controls Overlay */}
          {showControls && (
            <>
              {/* Top Bar */}
              <View style={styles.topBar}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                  <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <View style={styles.imageCounter}>
                  <Text style={styles.imageCounterText}>
                    {activeIndex + 1} / {images.length}
                  </Text>
                </View>
              </View>

              {/* Bottom Bar */}
              <View style={styles.bottomBar}>
                <Text style={styles.imageDescription}>{currentProduct.name}</Text>
                {images.length > 1 && (
                  <FlatList
                    data={images}
                    renderItem={renderThumbnail}
                    keyExtractor={(item, index) => `thumb-${index}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.thumbnailList}
                  />
                )}
              </View>
            </>
          )}
        </View>
      </Container>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  imageSlide: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width,
    height: height * 0.8,
    resizeMode: 'contain',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  imageCounter: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 14,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  imageDescription: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  thumbnailList: {
    paddingVertical: 8,
  },
  thumbnailContainer: {
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  activeThumbnail: {
    borderColor: '#3498db',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
});

export default ImageViewingScreen;
