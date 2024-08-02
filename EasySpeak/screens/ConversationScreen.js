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

const ConversationScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require("../../EasySpeak/assets/background/background.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.avatarAndSettingsContainer}>
          {/* Avatar Container */}
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("Account")}>
              <MaterialIcons name="circle" size={60} color="white" />
            </TouchableOpacity>
          </View>
          {/* Settings Icon Button */}
          <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
            <MaterialIcons name="settings" size={30} color="white" />
          </TouchableOpacity>
        </View>
        {/* App Name Container */}
        <View style={styles.appNameContainer}>
          <Text style={styles.appNameHeader}>Conversation</Text>
        </View>
        {/* Translation Picker Buttons */}
        <View style={styles.languagesContainer}>
          <TouchableOpacity style={styles.translateLanguageButton}>
            <Text style={styles.languageButtonText}>English </Text>
            <MaterialIcons name="keyboard-arrow-down" color={'white'} size={15} />
          </TouchableOpacity>
          <MaterialIcons name="swap-horiz" size={30} color="white" />
          <TouchableOpacity style={styles.translateLanguageButton}>
            <Text style={styles.languageButtonText}>Spanish</Text>
            <MaterialIcons name="keyboard-arrow-down" color={'white'} size={15} />
          </TouchableOpacity>
        </View>
        {/* Conversation Box Container */}
        <ScrollView style={styles.conversationBoxContainer}>
          <View style={styles.chatCard}>
            <Text style={styles.chatText}>Hi, how are you?</Text>
            <Text style={styles.translationText}>Hola, como estas?</Text>
          </View>
          <View style={[styles.chatCard, styles.chatCardRight]}>
            <Text style={styles.chatText}>I am fine and you?</Text>
            <Text style={styles.translationText}>Yo estoy bien y tu?</Text>
          </View>
          <View style={styles.chatCard}>
            <Text style={styles.chatText}>What time does the movie start?</Text>
            <Text style={styles.translationText}>A que hora comienza la pelicula?</Text>
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
    alignItems: "center",
  },
  avatarAndSettingsContainer: {
    width: "100%",
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
//   avatarContainer: {
//     width: 60,
//     height: 60,
//     borderWidth: 1,
//     borderColor: "#F1F2F2",
//     borderRadius: 30,
//   },
  appNameContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  appNameHeader: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  languagesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 10
  },
  translateLanguageButton: {
    backgroundColor: "#297386",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5, // Add spacing between buttons
    flexDirection: 'row',
    justifyContent: "center",
    gap: 5,
    alignItems: 'center'
  },
  languageButtonText: {
    color: "white",
    fontSize: 16,
  },
  conversationBoxContainer: {
    width: "90%",
    height: 300,
    marginTop: 20,
    flexDirection: "column",
  },
  chatCard: {
    backgroundColor: "rgba(68, 68, 68, 0.25)",
    borderRadius: 20,
    padding: 24,
    marginVertical: 5,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: 'rgba(68, 68, 68, 0.35)'
  },
  chatCardRight: {
    alignSelf: "flex-end",
  },
  chatText: {
    color: "#A7CCD6",
    fontSize: 18,
    marginBottom: 5,
  },
  translationText: {
    color: "#BBBBBB",
    fontSize: 14,
  },
});

export default ConversationScreen;
