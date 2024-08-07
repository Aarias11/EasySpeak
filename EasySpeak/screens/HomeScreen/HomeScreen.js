import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, TextInput, ScrollView, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import axios from 'axios';
import { Audio } from 'expo-av'; // Make sure this import is present
import { auth, db, collection, addDoc, doc, getDoc } from '../../firebase';
import TopHeaderNav from '../../components/TopHeaderNav';
import styles from './HomeScreen.styles';

const HomeScreen = ({ navigation }) => {
  const [fromLanguage, setFromLanguage] = useState('en');
  const [toLanguage, setToLanguage] = useState('es');
  const [languages, setLanguages] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [searchFromLanguage, setSearchFromLanguage] = useState('');
  const [searchToLanguage, setSearchToLanguage] = useState('');
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [avatar, setAvatar] = useState(null);
  const apiKey = 'AIzaSyCGvCBIX2RNeihtAUD-EcGxXJApmFdESzk'; // Replace with your actual Google Cloud API key

  useEffect(() => {
    fetchLanguages();
    fetchUserProfile();
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

  const fetchUserProfile = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setAvatar(userData.avatar || null);
      }
    } catch (error) {
      console.error('Error fetching user profile: ', error);
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

  const getLanguageName = (code) => {
    const language = languages.find(lang => lang.language === code);
    return language ? language.name : 'Unknown';
  };

  const translateText = async () => {
    const translateUrl = `https://translation.googleapis.com/language/translate/v2`;

    const translatePayload = {
      q: inputText,
      target: toLanguage,
      source: fromLanguage,
      key: apiKey,
    };

    try {
      const response = await axios.post(translateUrl, null, { params: translatePayload });
      const translation = response.data.data.translations[0].translatedText;
      setTranslatedText(translation);
    } catch (error) {
      console.error('Error translating text:', error.response ? error.response.data : error.message);
    }
  };

  const addToFavorites = async () => {
    if (translatedText) {
      const user = auth.currentUser;
      if (user) {
        const favorite = {
          originalText: inputText,
          translatedText: translatedText,
          userId: user.uid,
        };
        try {
          await addDoc(collection(db, `users/${user.uid}/favorites`), favorite);
          Alert.alert('Success', 'Translation added to favorites');
        } catch (error) {
          console.error("Error adding favorite: ", error);
          Alert.alert('Error', 'Failed to add favorite');
        }
      } else {
        Alert.alert('Error', 'User not logged in');
      }
    } else {
      Alert.alert('Error', 'No translation available to add to favorites');
    }
  };

  const swapLanguages = () => {
    setFromLanguage(toLanguage);
    setToLanguage(fromLanguage);
    setInputText('');
    setTranslatedText('');
  };

  const speakTranslation = async () => {
    if (translatedText) {
      const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
      const body = {
        input: { text: translatedText },
        voice: { languageCode: toLanguage },
        audioConfig: { audioEncoding: 'MP3' },
      };

      try {
        const response = await axios.post(url, body);
        const audioContent = response.data.audioContent;

        const { sound } = await Audio.Sound.createAsync({ uri: `data:audio/mp3;base64,${audioContent}` });
        await sound.playAsync();
      } catch (error) {
        console.error('Error synthesizing speech:', error.response ? error.response.data : error.message);
      }
    } else {
      Alert.alert('Error', 'No translation available to speak');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require('../../assets/background/backgroundone.png')}
        style={styles.backgroundImage}
        resizeMode='cover'
      >
        <View style={styles.container}>
          <TopHeaderNav />
          <View style={styles.appNameContainer}>
            <Text style={styles.appNameHeader}>EasySpeak</Text>
          </View>
          <View style={styles.languagesContainer}>
            <TouchableOpacity
              style={styles.translateLanguageButton}
              onPress={() => setShowFromDropdown(!showFromDropdown)}
            >
              <Text style={styles.languageButtonText}>{getLanguageName(fromLanguage)}</Text>
              <MaterialIcons name="keyboard-arrow-down" color={'white'} size={15} />
            </TouchableOpacity>
            {showFromDropdown && (
              <View style={styles.dropdownContainer}>
                <View style={styles.searchContainer}>
                  <MaterialIcons name="search" size={20} color="#ccc" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search language"
                    placeholderTextColor="#ccc"
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
              style={styles.translateLanguageButton}
              onPress={() => setShowToDropdown(!showToDropdown)}
            >
              <Text style={styles.languageButtonText}>{getLanguageName(toLanguage)}</Text>
              <MaterialIcons name="keyboard-arrow-down" color={'white'} size={15} />
            </TouchableOpacity>
            {showToDropdown && (
              <View style={styles.dropdownContainer}>
                <View style={styles.searchContainer}>
                  <MaterialIcons name="search" size={20} color="#ccc" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search language"
                    placeholderTextColor="#ccc"
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
          <View style={styles.translationBox}>
            <BlurView intensity={15} style={styles.blur}>
              <View style={styles.translationContentContainer}>
                <TextInput
                  style={styles.inputTranslation}
                  placeholder="Type or Push Mic to Translate"
                  placeholderTextColor="#A7CCD6"
                  value={inputText}
                  onChangeText={setInputText}
                  multiline={true}
                />
                <TouchableOpacity onPress={translateText} style={styles.translateButton}>
                  <Text style={styles.translateButtonText}>Translate</Text>
                </TouchableOpacity>
              </View>
              {translatedText ? (
                <View style={styles.translatedTextContainer}>
                  <Text style={styles.translatedText}>{translatedText}</Text>
                  <TouchableOpacity onPress={addToFavorites} style={styles.favoriteButton}>
                    <MaterialIcons name="star" color="white" size={24} />
                    <Text style={styles.favoriteButtonText}>Favorite</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={speakTranslation} style={styles.speakButton}>
                    <MaterialIcons name="volume-up" color="white" size={24} />
                    <Text style={styles.speakButtonText}>Speak</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </BlurView>
          </View>
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

export default HomeScreen;


