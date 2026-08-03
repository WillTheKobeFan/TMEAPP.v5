import React, { useState } from 'react';
import { View, FlatList, Image, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import SubScreenLayout from 'src/components/SubScreenLayout';
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
    image: require('../../assets/champs/Wednesday/Wed_2_25_26.png'),
    caption: 'February 25, 2026\n Team: Edwards\n Record: 9-1',
  },
  {
    id: '2',
    image: require('../../assets/champs/Wednesday/Wed_11_12_25.png'),
    caption: 'November 12th, 2025\n Team: Gross\n Record: 8-2',
  },
  {
    id: '3',
    image: require('../../assets/champs/Wednesday/Wed_07_30_25.jpg'),
    caption: 'July 30th, 2025\n Team: Edwards\n Record: 10-0',
  },
  {
    id: '4',
    image: require('../../assets/champs/Wednesday/Wed_5_7_25.jpg'),
    caption: 'May 7th, 2025\n Team: Gross\n Record: 8-0',
  },
  {
   id: '5',
    image: require('../../assets/champs/Wednesday/Wed_01_29_25.png'),
    caption: 'January 29th, 2025\n Team: Chris\n Record: 6-2', 
  },
];

export default function WednesdayPMChamps() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const imageUrls = photos.map((photo) => ({
    url: '',
    props: { source: photo.image },
  }));

  return (
    <SubScreenLayout
      title={"Wednesday.PM Berlin\nChamps 2025-26"}
      backRoute={'/champs' as const} // adjust to your Champs index route
    >
      <FlatList<PhotoItem>
        data={photos}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
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
            <Text style={styles.caption}>{item.caption}</Text>
          </View>
        )}
      />

      {/* Full-screen zoom modal */}
      <Modal visible={visible} transparent={false}>
        <View style={{ flex: 1, backgroundColor: '#000' }}>
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
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
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
    textAlign: 'center',
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