import React, { useState } from 'react';
import { View, FlatList, Image, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import ImageViewer from 'react-native-image-zoom-viewer';

type PhotoItem = {
  id: string;
  image: any;
  caption: string;
};

const photos: PhotoItem[] = [
  {
    id: '1',
    image: require('../../assets/champs/Monday/Mon_12_01_25.png'),
    caption: 'December 1st, 2025\n Team: Justin\n Record: 6-4',
    
  },
  {
    id: '2',
    image: require('../../assets/champs/Monday/Mon_09_08_25.png'),
    caption: 'September 8th, 2025\n Team: Justin\n Record: 9-1',
  },
  {
    id: '3',
    image: require('../../assets/champs/Monday/Mon_06_02_25.png'),
    caption: 'June 2nd, 2025\n Team: Gross\n Record: 6-2',
  },
  {
    id: '4',
    image: require('../../assets/champs/Monday/Mon_03_03_25.png'),
    caption: 'March 3rd, 2025\n Team: Gross\n Record: 7-1',
  },
];

export default function Monday() {
  const router = useRouter();

  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // ImageViewer URLs
  const imageUrls = photos.map((photo) => ({
    url: '',
    props: { source: photo.image },
  }));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Monday PM.Berlin {"\n"}   Champs 2025</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* Photo Feed */}
      <FlatList<PhotoItem>
        data={photos}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setActiveIndex(index);
                setVisible(true);
              }}
            >
              <Image source={item.image} style={styles.image} />
            </TouchableOpacity>

            {/* Caption ONLY in feed */}
            <Text style={styles.caption}>{item.caption}</Text>
          </View>
        )}
      />

      {/* Full-screen zoom modal */}
      <Modal visible={visible} transparent={false}>
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          {/* Zoomable image */}
          <ImageViewer
            imageUrls={imageUrls}
            index={activeIndex}
            enableSwipeDown
            onSwipeDown={() => setVisible(false)}
            onCancel={() => setVisible(false)}
            renderHeader={() => (
              <TouchableOpacity
                onPress={() => setVisible(false)}
                style={styles.closeBtn}
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  backText: {
    fontSize: 20,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  card: {
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  caption: {
    paddingHorizontal: 16,
    paddingTop: 8,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center', // centered under the image
    color: '#333',
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  closeText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
});










