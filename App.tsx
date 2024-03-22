import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GalleryScreen = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s'
      );
      setPhotos(response.data.photos.photo);
      // Cache the response
      await AsyncStorage.setItem('cachedPhotos', JSON.stringify(response.data.photos.photo));
    } catch (error) {
      console.error('Error fetching data:', error);
      // Try to fetch cached data
      const cachedData = await AsyncStorage.getItem('cachedPhotos');
      if (cachedData) {
        setPhotos(JSON.parse(cachedData));
      }
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Image source={{ uri: item.url_s }} style={styles.image} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    margin: 10,
  },
});

export default GalleryScreen;
