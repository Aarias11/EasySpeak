import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // 
import { BlurView } from 'expo-blur';


const HomeScreen = ({ navigation }) => {
    return (
        <ImageBackground
            source={require('../../EasySpeak/assets/background/background.png')} 
            style={styles.backgroundImage}
        >
            {/* Container */}
            <View style={styles.container}>
            {/* Avatar and Settings Container */}
                <View style={styles.avatarAndSettingsContainer}>
                {/* Avatar Container */}
                    <View style={styles.avatarContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('Account')}>
                            <MaterialIcons name="circle" size={60} color="white" />
                        </TouchableOpacity>
                    </View>
                    {/* Settings Icon Button */}
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                        <MaterialIcons name="settings" size={30} color="white" />
                    </TouchableOpacity>
                </View>
                {/* App Name Container */}
                <View style={styles.appNameContainer}>
                    <Text style={styles.appNameHeader}>EasySpeak</Text>
                </View>
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
                    {/* <TouchableOpacity style={styles.translateLanguageButton}>
                        <Text style={styles.translationFromButtonText}>English</Text>
                    </TouchableOpacity> */}
                    {/* Blur */}
                    <BlurView intensity={15} style={styles.blur}>
                        <TextInput
                        style={styles.inputTranslation}
                        placeholder="Type or Push Mic to Translate"
                        placeholderTextColor="#A7CCD6" />
                    </BlurView>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        marginTop: 50
        // Optional overlay
    },
    avatarAndSettingsContainer: {
        width: '100%',
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 17,
    },
    // avatarContainer: {
    //     width: 60,
    //     height: 60,
    //     borderWidth: 1,
    //     borderColor: '#F1F2F2',
    //     borderRadius: 30,
    // },
    appNameContainer: {
        width: '100%',
        alignItems: 'center',
        bottom: 20
    },
    appNameHeader: {
        color: 'white',
        fontSize: 32,
        fontWeight: '700',
    },
    translationBox: {
        width: '100%',
        height: 590,
        borderWidth: 0.2,
        borderColor: '#F1F2F2',
        borderRadius: 25,
        marginTop: 12,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        zIndex: 50,
        opacity: 0.4,
        position: 'relative',
        
    },
    blur: {
        width: '100%',
        height: '100%',
        borderRadius: 25,
        overflow: 'hidden',
        
       
    },
    inputTranslation: {
        color: '#A7CCD6',
        fontSize: 20,
        top: 40,
        left: 30,
        fontWeight: '600'
    
    },
    translateLanguageButton: {
        width: 100,
        height: 40,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#2CB5DA',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: -20,
        left: 20,
        zIndex: 10
    },
    translationFromButtonText: {
        color: '#F1F2F2',
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
});

export default HomeScreen;
