import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Alert
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { collection, getDocs, deleteDoc, doc, query } from "firebase/firestore";
import { Audio } from "expo-av";
import axios from "axios";
import { auth, db } from "../../firebase"; // Adjust the import as per your project structure
import TopHeaderNav from "../../components/TopHeaderNav";
import styles from './FavoritesScreen.styles';

const FavoritesScreen = ({ navigation, route }) => {
  const [favorites, setFavorites] = useState([]);
  const apiKey = 'AIzaSyCGvCBIX2RNeihtAUD-EcGxXJApmFdESzk'; // Replace with your actual Google Cloud API key

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    if (route.params?.newFavorite) {
      setFavorites((prevFavorites) => [...prevFavorites, route.params.newFavorite]);
    }
  }, [route.params?.newFavorite]);

  const fetchFavorites = async () => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, `users/${user.uid}/favorites`));
      const querySnapshot = await getDocs(q);
      const fetchedFavorites = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setFavorites(fetchedFavorites);
    }
  };

  const removeFavorite = async (id) => {
    try {
      await deleteDoc(doc(db, `users/${auth.currentUser.uid}/favorites`, id));
      setFavorites(favorites.filter(favorite => favorite.id !== id));
      Alert.alert('Success', 'Favorite removed');
    } catch (error) {
      console.error("Error removing favorite: ", error);
      Alert.alert('Error', 'Failed to remove favorite');
    }
  };

  const speakTranslation = async (text, languageCode) => {
    if (text) {
      const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
      const body = {
        input: { text },
        voice: { languageCode },
        audioConfig: { audioEncoding: 'MP3' },
      };

      try {
        const response = await axios.post(url, body);
        const audioContent = response.data.audioContent;
        const { sound } = await Audio.Sound.createAsync({ uri: `data:audio/mp3;base64,${audioContent}` });
        await sound.playAsync();
      } catch (error) {
        console.error('Error synthesizing speech:', error.response ? error.response.data : error.message);
        Alert.alert("Error", "An error occurred while synthesizing speech.");
      }
    } else {
      Alert.alert('Error', 'No translation available to speak');
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/background/backgroundone.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <TopHeaderNav />
        <View style={styles.appNameContainer}>
          <Text style={styles.appNameHeader}>Favorites</Text>
        </View>
        <ScrollView contentContainerStyle={styles.favoritesContainer}>
          {favorites.map((favorite) => (
            <View key={favorite.id} style={styles.favoritesCard}>
              <View style={styles.favoriteContent}>
                <View style={styles.favoriteTextContainer}>
                  <View style={styles.textWithIcon}>
                    <TouchableOpacity onPress={() => speakTranslation(favorite.originalText, 'en-US')}>
                      <MaterialIcons name="volume-up" size={24} color="#A7CCD6" style={styles.voiceIcon} />
                    </TouchableOpacity>
                    <Text style={styles.favoritesText}>{favorite.originalText}</Text>
                  </View>
                  <View style={styles.textWithIcon}>
                    <TouchableOpacity onPress={() => speakTranslation(favorite.translatedText, 'es-ES')}>
                      <MaterialIcons name="volume-up" size={24} color="#A7CCD6" style={styles.voiceIcon} />
                    </TouchableOpacity>
                    <Text style={styles.translatedText}>{favorite.translatedText}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => removeFavorite(favorite.id)}>
                  <MaterialIcons name="star" color={"#297386"} size={24} style={styles.favoriteIcon} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default FavoritesScreen;