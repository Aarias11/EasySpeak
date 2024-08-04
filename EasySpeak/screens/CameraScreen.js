import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Button, ImageBackground, Animated, ScrollView, TextInput, PanResponder } from 'react-native';
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
  const [fromLanguageName, setFromLanguageName] = useState('English');
  const [toLanguageName, setToLanguageName] = useState('Spanish');
  const [languages, setLanguages] = useState([]);
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [searchFromLanguage, setSearchFromLanguage] = useState('');
  const [searchToLanguage, setSearchToLanguage] = useState('');
  const translationSlideAnim = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.ValueXY()).current;

  const apiKey = 'AIzaSyCGvCBIX2RNeihtAUD-EcGxXJApmFdESzk'; // Replace with your Google Cloud API key

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    setFilteredLanguages(languages);
  }, [languages]);

  const fetchLanguages = async () => {
    const url = `https://translation.googleapis.com/language/translate/v2/languages?key=${apiKey}&target=en`;
    try {
      const response = await axios.get(url);
      setLanguages(response.data.data.languages);
    } catch (error) {
      console.error('Error fetching languages:', error.response ? error.response.data : error.message);
    }
  };

  const handleSearchFromLanguage = (text) => {
    setSearchFromLanguage(text);
    if (text === '') {
      setFilteredLanguages(languages);
    } else {
      const filtered = languages.filter((lang) => lang.name.toLowerCase().includes(text.toLowerCase()));
      setFilteredLanguages(filtered);
    }
  };

  const handleSearchToLanguage = (text) => {
    setSearchToLanguage(text);
    if (text === '') {
      setFilteredLanguages(languages);
    } else {
      const filtered = languages.filter((lang) => lang.name.toLowerCase().includes(text.toLowerCase()));
      setFilteredLanguages(filtered);
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.permission}>We need your permission to show the camera</Text>
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
    pan.setValue({ x: 0, y: 0 });
    Animated.timing(translationSlideAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const slideDownTranslation = () => {
    Animated.timing(translationSlideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setTranslatedText(''); // Reset translated text after sliding down
    });
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // Enable pan responder only if user swipes left or right
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
    },
    onPanResponderMove: Animated.event([null, { dx: pan.x }], { useNativeDriver: false }),
    onPanResponderRelease: (evt, gestureState) => {
      if (Math.abs(gestureState.dx) > 100) {
        // If swipe distance is greater than 100, slide down the translation
        slideDownTranslation();
      } else {
        // Reset position if swipe distance is less than 100
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const getLanguageName = (code) => {
    const language = languages.find(lang => lang.language === code);
    return language ? language.name : 'Unknown';
  };

  return (
    <ImageBackground
      source={require("../../EasySpeak/assets/background/background.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.languagesTopContainer}>
          <TouchableOpacity
            style={styles.translateTopLanguageButton}
            onPress={() => setShowFromDropdown(!showFromDropdown)}
          >
            <Text style={styles.languageTopButtonText}>{getLanguageName(fromLanguage)}</Text>
            <MaterialIcons name="keyboard-arrow-down" color={'white'} size={15} />
          </TouchableOpacity>
          {showFromDropdown && (
            <View style={styles.dropdownContainer}>
              <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={20} color="#ccc" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search language"
                  placeholderTextColor="#ecf0ef"
                  value={searchFromLanguage}
                  onChangeText={handleSearchFromLanguage}
                />
              </View>
              <ScrollView style={styles.dropdown}>
                {filteredLanguages.map(item => (
                  <TouchableOpacity key={item.language} onPress={() => { setFromLanguage(item.language); setShowFromDropdown(false); }}>
                    <Text style={styles.dropdownItem}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
          <MaterialIcons name="swap-horiz" size={30} color="white" />
          <TouchableOpacity
            style={styles.translateTopLanguageButton}
            onPress={() => setShowToDropdown(!showToDropdown)}
          >
            <Text style={styles.languageTopButtonText}>{getLanguageName(toLanguage)}</Text>
            <MaterialIcons name="keyboard-arrow-down" color={'white'} size={15} />
          </TouchableOpacity>
          {showToDropdown && (
            <View style={styles.dropdownContainer}>
              <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={20} color="#ecf0ef" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search language"
                  placeholderTextColor="#ecf0ef"
                  value={searchToLanguage}
                  onChangeText={handleSearchToLanguage}
                />
              </View>
              <ScrollView style={styles.dropdown}>
                {filteredLanguages.map(item => (
                  <TouchableOpacity key={item.language} onPress={() => { setToLanguage(item.language); setShowToDropdown(false); }}>
                    <Text style={styles.dropdownItem}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
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
          <Animated.View
            {...panResponder.panHandlers}
            style={[styles.translationContainer, {
              transform: [
                { translateY: translationSlideAnim.interpolate({ inputRange: [0, 1], outputRange: [500, 0] }) },
                { translateX: pan.x }
              ],
            }]}
          >
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
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
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
    height: 500,
    padding: 10,
    borderRadius: 15,
    backgroundColor: 'rgba(10, 10, 10, 0.65)',
    margin: 10,
    position: 'absolute',
    top: 150,
    zIndex: 0,
  },
  translationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F1F2F2',
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    gap: 10,
    zIndex: 20, // Ensure the dropdown stays in front of the translation container
  },
  languagesTopContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    gap: 10,
    zIndex: 20, // Ensure the dropdown stays in front of the translation container
    position: 'absolute',
    top: 100,
    width: '100%',
    paddingHorizontal: 10,
  },
  translateLanguageButton: {
    backgroundColor: '#297386',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5, // Add spacing between buttons
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    alignItems: 'center',
    zIndex: 10, // Ensure it stays in front of other elements
  },
  translateTopLanguageButton: {
    backgroundColor: '#297386',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5, // Add spacing between buttons
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    alignItems: 'center',
  },
  languageButtonText: {
    color: 'white',
    fontSize: 16,
  },
  languageTopButtonText: {
    color: 'white',
    fontSize: 16,
  },
  dropdownContainer: {
    maxHeight: 300, // Limit the height of the dropdown
    width: '100%',
    position: 'absolute',
    top: 50,
    zIndex: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0f0e',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    padding: 15,
    color: '#ecf0ef',
  },
  dropdown: {
    backgroundColor: '#0a0f0e',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#ecf0ef',
  },
});

export default CameraScreen;
