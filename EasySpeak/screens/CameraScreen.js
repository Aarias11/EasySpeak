import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  TextInput
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from 'expo-blur';


export default CameraScreen = ({ navigation }) => {
    return(
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
          <Text style={styles.appNameHeader}>Camera</Text>
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
        {/* Translation Box */}
        <View style={styles.translationBox}>
                    
                    {/* Blur */}
                    <BlurView intensity={15} style={styles.blur}>
                        
                    </BlurView>
                </View>
        {/* Upload and Camera Shoot Button Container */}
        <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="file-upload" size={30} color="white" />
            
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="photo-camera" size={30} color="white" />
            
          </TouchableOpacity>
        </View>
        </View>
        </ImageBackground>
    )
}



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
    // avatarContainer: {
    //   width: 60,
    //   height: 60,
    //   borderWidth: 1,
    //   borderColor: "#F1F2F2",
    //   borderRadius: 30,
    // },
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
    translationBox: {
        width: '100%',
        height: 500,
        borderWidth: 0.2,
        borderColor: '#F1F2F2',
        borderRadius: 25,
        marginTop: 12,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        zIndex: 50,
        opacity: 0.4,
    },
    
    translationText: {
      color: "#BBBBBB",
      fontSize: 14,
    },
    iconContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20
    },
    iconButton: {
        borderWidth: 1,
        borderColor: '#A7CCD6',
        borderRadius: 50,
        padding: 15
    }
   
  });
  