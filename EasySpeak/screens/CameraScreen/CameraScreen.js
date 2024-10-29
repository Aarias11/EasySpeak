import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Button, ImageBackground, Animated, ScrollView, TextInput, PanResponder } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { Audio } from 'expo-av';
import styles from './CameraScreen.styles';

const CameraScreen = ({ navigation }) => {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
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
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef(null);

  const apiKey = process.env.GOOGLE_API_KEY; // Replace with your actual Google Cloud API key

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    setFilteredLanguages(languages);
  }, [languages]);

  useEffect(() => {
    if (permission?.granted) {
      setPermissionsGranted(true);
    }
  }, [permission]);

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
      <View style={styles.permissionContainer}>
        <Text style={styles.permission}>We need your permission to show the camera</Text>
        <Button style={styles.permissionButton} onPress={requestPermission} title="grant permission" />
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

    if (!result.canceled) {
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


  const swapLanguages = () => {
    setFromLanguage(toLanguage);
    setToLanguage(fromLanguage);
    setTranslatedText('');
  }

  const speakTranslation = async (text, languageCode) => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
      setIsPlaying(false);
      return;
    }

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
        soundRef.current = sound;
        await sound.playAsync();
        setIsPlaying(true);

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsPlaying(false);
            soundRef.current = null;
          }
        });
      } catch (error) {
        console.error('Error synthesizing speech:', error.response ? error.response.data : error.message);
        Alert.alert("Error", "An error occurred while synthesizing speech.");
      }
    } else {
      Alert.alert('Error', 'No translation available to speak');
    }
  };

  return (
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
        <TouchableOpacity onPress={swapLanguages}>
          <MaterialIcons name="swap-horiz" size={30} color="white" />
        </TouchableOpacity>
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
      {permissionsGranted && (
        <>
          {!cameraReady && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#2CB5DA" />
            </View>
          )}
          <CameraView
            style={styles.camera}
            type={facing}
            ref={(ref) => setCameraRef(ref)}
            onCameraReady={() => setCameraReady(true)}
          >
            <View style={styles.captureContainer}>
              <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
                <MaterialIcons name="camera-alt" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          </CameraView>
        </>
      )}
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
          <View style={styles.translationHeader}>
            <Text style={styles.translationTitle}>Translation:</Text>
            <TouchableOpacity onPress={() => speakTranslation(translatedText, toLanguage)}>
              <MaterialIcons name={isPlaying ? "pause" : "volume-up"} size={24} color="#A7CCD6" />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <Text style={styles.translatedText}>{translatedText}</Text>
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
};

export default CameraScreen;