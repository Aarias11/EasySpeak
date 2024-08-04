import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground, TextInput, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
  const [fromLanguage, setFromLanguage] = useState('en'); // Default "from" language is English
  const [toLanguage, setToLanguage] = useState('es'); // Default "to" language is Spanish
  const [languages, setLanguages] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [searchFromLanguage, setSearchFromLanguage] = useState('');
  const [searchToLanguage, setSearchToLanguage] = useState('');
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
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

  return (
    <ImageBackground
      source={require('../../EasySpeak/assets/background/background.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.avatarAndSettingsContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Account')}>
            <MaterialIcons name="circle" size={60} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <MaterialIcons name="settings" size={30} color="white" />
          </TouchableOpacity>
        </View>
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
          <MaterialIcons name="swap-horiz" size={30} color="white" />
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
            <TextInput
              style={styles.inputTranslation}
              placeholder="Type or Push Mic to Translate"
              placeholderTextColor="#A7CCD6"
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity onPress={translateText} style={styles.translateButton}>
              <Text style={styles.translateButtonText}>Translate</Text>
            </TouchableOpacity>
            {translatedText ? (
              <View style={styles.translatedTextContainer}>
                <Text style={styles.translatedText}>{translatedText}</Text>
              </View>
            ) : null}
          </BlurView>
        </View>
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
    marginTop: 50,
  },
  avatarAndSettingsContainer: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 17,
  },
  appNameContainer: {
    width: '100%',
    alignItems: 'center',
    bottom: 20,
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
    borderColor: 'rgba(60, 60, 60, 0.4)',
    borderRadius: 25,
    marginTop: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    position: 'relative',
    zIndex: 1,
  },
  blur: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  inputTranslation: {
    color: '#A7CCD6',
    fontSize: 20,
    fontWeight: '600',
    width: '100%',
    top: -220
  },
  translateButton: {
    marginTop: 20,
    backgroundColor: '#2CB5DA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  translateButtonText: {
    color: 'white',
    fontSize: 16,
  },
  translatedTextContainer: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 10,
  },
  translatedText: {
    color: '#A7CCD6',
    fontSize: 18,
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
    alignItems: 'center',
    zIndex: 30, // Ensure the button stays in front
  },
  languageButtonText: {
    color: "white",
    fontSize: 16,
  },
  dropdownContainer: {
    maxHeight: 300, // Limit the height of the dropdown
    width: '90%',
    position: 'absolute',
    top: 50,
    zIndex: 30,
    backgroundColor: '#0a0f0e', // Ensure it stays in front
    borderRadius: 10,
    alignSelf: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0f0e',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    padding: 10,
    color: '#ecf0ef'
  },
  dropdown: {
    backgroundColor: '#0a0f0e',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#ecf0ef'
  },
  languagesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
    zIndex: 20,
  },
  languagesTopContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    gap: 10,
    zIndex: 20,
    position: 'absolute',
    top: 100,
    width: '100%',
    paddingHorizontal: 10,
  },
  languageTopButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default HomeScreen;
