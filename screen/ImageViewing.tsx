import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  FlatList,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Mock image data for UI demonstration
const images = [
  {
    id: '1',
    uri: 'https://via.placeholder.com/1000',
    description: 'Front view of the product',
  },
  {
    id: '2',
    uri: 'https://via.placeholder.com/1000',
    description: 'Side view of the product',
  },
  {
    id: '3',
    uri: 'https://via.placeholder.com/1000',
    description: 'Back view of the product',
  },
  {
    id: '4',
    uri: 'https://via.placeholder.com/1000',
    description: 'Close-up of product details',
  },
];

const ImageViewingScreen: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const handleImagePress = () => {
    setShowControls(!showControls);
  };

  const renderImageItem = ({ item, index }: { item: (typeof images)[0]; index: number }) => (
    <TouchableOpacity activeOpacity={1} onPress={handleImagePress} style={styles.imageSlide}>
      <Image source={{ uri: item.uri }} style={styles.fullImage} />
    </TouchableOpacity>
  );

  const renderThumbnail = ({ item, index }: { item: (typeof images)[0]; index: number }) => (
    <TouchableOpacity
      onPress={() => setActiveIndex(index)}
      style={[styles.thumbnailContainer, activeIndex === index && styles.activeThumbnail]}>
      <Image source={{ uri: item.uri }} style={styles.thumbnail} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Main Image Viewer */}
      <FlatList
        data={images}
        renderItem={renderImageItem}
        keyExtractor={(item) => item.id}
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
            <TouchableOpacity style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {activeIndex + 1} / {images.length}
              </Text>
            </View>
            <TouchableOpacity style={styles.shareButton}>
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Bar */}
          <View style={styles.bottomBar}>
            <Text style={styles.imageDescription}>{images[activeIndex].description}</Text>
            <FlatList
              data={images}
              renderItem={renderThumbnail}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbnailList}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  shareButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(52, 152, 219, 0.8)',
  },
  shareButtonText: {
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
