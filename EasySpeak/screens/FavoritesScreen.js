import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import TopHeaderNav from "../components/TopHeaderNav";

const FavoritesScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require("../../EasySpeak/assets/background/background.png")}
      style={styles.backgroundImage}
    >
      {/* Container */}
      <View style={styles.container}>
        {/* Avatar and Settings Container */}
        <TopHeaderNav />
        {/* App Name Container */}
        <View style={styles.appNameContainer}>
          <Text style={styles.appNameHeader}>Favorites</Text>
        </View>
        {/* Favorites Container */}
        <ScrollView contentContainerStyle={styles.favoritesContainer}>
            
          <View style={styles.favoritesCard}>
            <View style={styles.FavoriteIconContainer}>
              <MaterialIcons name="star" color={"#297386"} size={30} />
            </View>
            <Text style={styles.favoritesText}>Hola, Como estas?</Text>
          </View>

          <View style={styles.favoritesCard}>
            <View style={styles.FavoriteIconContainer}>
              <MaterialIcons name="star" color={"#297386"} size={30} />
            </View>
            <Text style={styles.favoritesText}>Hola, Como estas?</Text>
          </View>

          <View style={styles.favoritesCard}>
            <View style={styles.FavoriteIconContainer}>
              <MaterialIcons name="star" color={"#297386"} size={30} />
            </View>
            <Text style={styles.favoritesText}>Hola, Como estas?</Text>
          </View>

          

          
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
  avatarAndSettingsContainer: {
    width: "100%",
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 17,
  },
//   avatarContainer: {
//     width: 60,
//     height: 60,
//     borderWidth: 1,
//     borderColor: "#F1F2F2",
//     borderRadius: 30,
//   },
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
    flexDirection: "column",
    justifyContent: "space-evenly",
    padding: 10,
    gap: 10,
  },
  favoritesCard: {
    width: "100%",
    height: 100,
    borderColor: "rgba(68, 68, 68, 0.35)",
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "rgba(68, 68, 68, 0.15)",
    padding: 10,
  },
  favoritesText: {
    color: "#A7CCD6",
    fontSize: 18,
  },
  FavoriteIconContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});

export default FavoritesScreen;
