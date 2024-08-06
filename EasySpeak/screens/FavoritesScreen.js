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
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { auth, db } from "../firebase"; // Adjust the import as per your project structure
import TopHeaderNav from "../components/TopHeaderNav";

const FavoritesScreen = ({ navigation, route }) => {
  const [favorites, setFavorites] = useState([]);

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

  return (
    <ImageBackground
      source={require("../../EasySpeak/assets/background/backgroundone.png")}
      style={styles.backgroundImage}
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
                  <Text style={styles.favoritesText}>{favorite.originalText}</Text>
                  <Text style={styles.translatedText}>{favorite.translatedText}</Text>
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

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    marginTop: 50,
  },
  appNameContainer: {
    width: "100%",
    alignItems: "center",
    bottom: 20,
  },
  appNameHeader: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  favoritesContainer: {
    width: "100%",
    marginTop: 20,
    padding: 10,
    gap: 10,
  },
  favoritesCard: {
    width: "100%",
    borderColor: "rgba(68, 68, 68, 0.35)",
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "rgba(68, 68, 68, 0.15)",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  favoriteContent: {
    width: '100%',
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: 'space-between',
    padding: 5
  },
  favoritesText: {
    color: "#A7CCD6",
    fontSize: 18,
    opacity: 0.7
  },
  favoriteIcon: {
    marginLeft: 10,
  },
  translatedText: {
    color: "#A7CCD6",
    fontSize: 16,
    marginTop: 5,
  },
  favoriteTextContainer: {
    width: '85%',
    flexDirection: 'column'
  }
});

export default FavoritesScreen;
