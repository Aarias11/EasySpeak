import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Button, ImageBackground, Animated, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

const CameraScreen = ({ navigation }) => {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [loading, setLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [fromLanguage, setFromLanguage] = useState('en'); // Default "from" language is English
  const [toLanguage, setToLanguage] = useState('es'); // Default "to" language is Spanish
  const translationSlideAnim = useRef(new Animated.Value(0)).current;

  const apiKey = 'AIzaSyCGvCBIX2RNeihtAUD-EcGxXJApmFdESzk'; // Replace with your Google Cloud API key

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef) {
      setLoading(true);
      const photo = await cameraRef.takePictureAsync({ base64: true });
      detectText(photo.base64);
    }
  };

  const uploadDocument = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setLoading(true);
      detectText(result.base64);
    }
  };

  const detectText = async (base64) => {
    const visionUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const visionPayload = {
      requests: [
        {
          image: { content: base64 },
          features: [{ type: 'TEXT_DETECTION', maxResults: 10 }],
        },
      ],
    };

    console.log('Sending payload:', JSON.stringify(visionPayload)); // Log the payload

    try {
      const response = await axios.post(visionUrl, visionPayload);
      console.log('API response:', response.data); // Log the response data
      const detectedText = response.data.responses[0].fullTextAnnotation.text;
      translateText(detectedText);
    } catch (error) {
      setLoading(false);
      console.error('Error detecting text:', error.response ? error.response.data : error.message);
    }
  };

  const translateText = async (text) => {
    const translateUrl = `https://translation.googleapis.com/language/translate/v2`;

    const translatePayload = {
      q: text,
      target: toLanguage, // Use the selected "to" language
      source: fromLanguage, // Use the selected "from" language
      key: apiKey,
    };

    console.log('Sending translate payload:', translatePayload); // Log the translate payload

    try {
      const response = await axios.post(translateUrl, null, { params: translatePayload });
      console.log('Translate API response:', response.data); // Log the response data
      const translation = response.data.data.translations[0].translatedText;
      setTranslatedText(translation);
      slideUpTranslation();
    } catch (error) {
      console.error('Error translating text:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  const slideUpTranslation = () => {
    Animated.timing(translationSlideAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ImageBackground
      source={require("../../EasySpeak/assets/background/background.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          type={facing}
          ref={(ref) => setCameraRef(ref)}
        >
          <View style={styles.captureContainer}>
            <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
              <MaterialIcons name="camera-alt" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </CameraView>
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#2CB5DA" />
          </View>
        )}
        {!loading && translatedText && (
          <Animated.View style={[styles.translationContainer, {
            transform: [
              {
                translateY: translationSlideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [500, 0], // Slide from bottom to top
                }),
              },
            ],
          }]}>
            {/* Languages Container */}
            <View style={styles.languagesContainer}>
              <TouchableOpacity
                style={styles.translateLanguageButton}
                onPress={() => setFromLanguage(fromLanguage === 'en' ? 'es' : 'en')}
              >
                <Text style={styles.languageButtonText}>{fromLanguage === 'en' ? 'English' : 'Spanish'} </Text>
                <MaterialIcons name="keyboard-arrow-down" color={'white'} size={15} />
              </TouchableOpacity>
              <MaterialIcons name="swap-horiz" size={30} color="white" />
              <TouchableOpacity
                style={styles.translateLanguageButton}
                onPress={() => setToLanguage(toLanguage === 'es' ? 'en' : 'es')}
              >
                <Text style={styles.languageButtonText}>{toLanguage === 'es' ? 'Spanish' : 'English'}</Text>
                <MaterialIcons name="keyboard-arrow-down" color={'white'} size={15} />
              </TouchableOpacity>
            </View>
            <Text style={styles.translationTitle}>Translation:</Text>
            <ScrollView>
              <Text style={styles.translatedText}>{translatedText}</Text>
            </ScrollView>
          </Animated.View>
        )}
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
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  captureContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  captureButton: {
    width: 70,
    height: 70,
    flex: 0,
    backgroundColor: '#2CB5DA',
    borderRadius: 50,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    position: 'absolute',
    bottom: 110,
    left: '37%',
    zIndex: 1, // Ensure the button stays in front of other elements
  },
  uploadButton: {
    width: 70,
    height: 70,
    flex: 0,
    backgroundColor: '#2CB5DA',
    borderRadius: 50,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    position: 'absolute',
    bottom: 90,
    left: '5%',
    zIndex: 1, // Ensure the button stays in front of other elements
  },
  loaderContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 2, // Ensure the loader stays in front of other elements
  },
  translationContainer: {
    width: '95%',
    padding: 10,
    borderRadius: 15,
    backgroundColor: 'rgba(10, 10, 10, 0.65)',
    margin: 10,
    position: 'absolute',
    top: 10,
    zIndex: 0,
  },
  translationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F1F2F2'
  },
  translatedText: {
    fontSize: 18,
    color: '#A7CCD6',
    marginTop: 10,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  featureButton: {
    width: 70,
    margin: '1%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 50,
  },

  languagesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
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

export default CameraScreen;
