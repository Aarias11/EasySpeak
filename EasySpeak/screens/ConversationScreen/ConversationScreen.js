import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { Audio } from "expo-av";
import { auth, db, doc, getDoc } from "../../firebase";
import TopHeaderNav from "../../components/TopHeaderNav";
import styles from './ConversationScreen.styles';

const ChatBubble = ({
  isRight,
  placeholder,
  onSend,
  conversation,
  scrollToInput,
  fromLanguage,
  toLanguage,
  fromLanguageCode,
  toLanguageCode,
}) => {
  const [text, setText] = useState("");
  const [inputHeight, setInputHeight] = useState(50);
  const inputRef = useRef(null);
  const apiKey = 'AIzaSyCGvCBIX2RNeihtAUD-EcGxXJApmFdESzk'; // Replace with your actual Google Cloud API key

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
      setInputHeight(50); // Reset input height after sending
    }
  };

  const speakTranslation = async (text, languageCode) => {
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
        await sound.playAsync();
      } catch (error) {
        console.error('Error synthesizing speech:', error.response ? error.response.data : error.message);
        Alert.alert("Error", "An error occurred while synthesizing speech.");
      }
    } else {
      Alert.alert('Error', 'No translation available to speak');
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        if (inputRef.current) {
          scrollToInput(inputRef);
        }
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }}
      style={[styles.chatCard, isRight && styles.chatCardRight]}
    >
      {conversation ? (
        <View style={styles.translatedCard}>
          {isRight ? (
            <>
              <View style={styles.chatTextContainer}>
                <TouchableOpacity onPress={() => speakTranslation(conversation.original, toLanguageCode)}>
                  <MaterialIcons name="volume-up" size={24} color="#A7CCD6" style={styles.voiceIconRight} />
                </TouchableOpacity>
                <Text style={styles.chatText}>{conversation.original}</Text>
              </View>
              <View style={styles.chatTextContainer}>
                <TouchableOpacity onPress={() => speakTranslation(conversation.translated, fromLanguageCode)}>
                  <MaterialIcons name="volume-up" size={24} color="#A7CCD6" style={styles.voiceIconRight} />
                </TouchableOpacity>
                <Text style={styles.translationText}>{conversation.translated}</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.chatTextContainer}>
                <TouchableOpacity onPress={() => speakTranslation(conversation.original, fromLanguageCode)}>
                  <MaterialIcons name="volume-up" size={24} color="#A7CCD6" style={styles.voiceIconLeft} />
                </TouchableOpacity>
                <Text style={styles.chatText}>{conversation.original}</Text>
              </View>
              <View style={styles.chatTextContainer}>
                <TouchableOpacity onPress={() => speakTranslation(conversation.translated, toLanguageCode)}>
                  <MaterialIcons name="volume-up" size={24} color="#A7CCD6" style={styles.voiceIconLeft} />
                </TouchableOpacity>
                <Text style={styles.translationText}>{conversation.translated}</Text>
              </View>
            </>
          )}
        </View>
      ) : (
        <View style={styles.cardInputContainer}>
          <TextInput
            ref={inputRef}
            style={[styles.chatInput, { height: inputHeight }]}
            placeholder={placeholder}
            placeholderTextColor="#A7CCD6"
            value={text}
            onChangeText={setText}
            onContentSizeChange={(event) =>
              setInputHeight(event.nativeEvent.contentSize.height)
            }
            multiline
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <MaterialIcons name="send" color="white" size={20} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const ConversationScreen = ({ navigation }) => {
  const [fromLanguage, setFromLanguage] = useState("en-US"); // Default "from" language is English
  const [toLanguage, setToLanguage] = useState("es-ES"); // Default "to" language is Spanish
  const [languages, setLanguages] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [searchFromLanguage, setSearchFromLanguage] = useState("");
  const [searchToLanguage, setSearchToLanguage] = useState("");
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [showUserInput, setShowUserInput] = useState(true); // State to control user input visibility
  const [showResponderInput, setShowResponderInput] = useState(false); // State to control responder input visibility
  const [avatar, setAvatar] = useState(null);
  const scrollViewRef = useRef(null); // Ref for ScrollView
  const apiKey = "AIzaSyCGvCBIX2RNeihtAUD-EcGxXJApmFdESzk"; // Replace with your Google Cloud API key

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
      console.error(
        "Error fetching languages:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const fetchUserProfile = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setAvatar(userData.avatar || null);
      }
    } catch (error) {
      console.error("Error fetching user profile: ", error);
    }
  };

  const handleSearchFromLanguage = (text) => {
    setSearchFromLanguage(text);
    if (text === "") {
      setFilteredLanguages(languages);
    } else {
      const filtered = languages.filter((lang) =>
        lang.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredLanguages(filtered);
    }
  };

  const handleSearchToLanguage = (text) => {
    setSearchToLanguage(text);
    if (text === "") {
      setFilteredLanguages(languages);
    } else {
      const filtered = languages.filter((lang) =>
        lang.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredLanguages(filtered);
    }
  };

  const getLanguageName = (code) => {
    const language = languages.find((lang) => lang.language === code);
    return language ? language.name : "Unknown";
  };

  const translateText = async (text, isUser) => {
    const translateUrl = `https://translation.googleapis.com/language/translate/v2`;
    const sourceLang = isUser ? fromLanguage : toLanguage;
    const targetLang = isUser ? toLanguage : fromLanguage;

    const translatePayload = {
      q: text,
      target: targetLang,
      source: sourceLang,
      key: apiKey,
    };

    try {
      const response = await axios.post(translateUrl, null, {
        params: translatePayload,
      });
      const translation = response.data.data.translations[0].translatedText;
      setConversations([
        ...conversations,
        { original: text, translated: translation, isUser },
      ]);

      if (isUser) {
        setShowUserInput(false);
        setShowResponderInput(true);
      } else {
        setShowResponderInput(false);
        setShowUserInput(true);
      }
    } catch (error) {
      console.error(
        "Error translating text:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const swapLanguages = () => {
    setFromLanguage(toLanguage);
    setToLanguage(fromLanguage);
  };

  const scrollToInput = (inputRef) => {
    inputRef.current.measureLayout(
      scrollViewRef.current.getScrollResponder(),
      (x, y) => {
        scrollViewRef.current.scrollTo({ x: 0, y: y, animated: true });
      }
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/background/backgroundone.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80} // Adjust this value based on your UI
      >
        <TopHeaderNav />
        <View style={styles.appNameContainer}>
          <Text style={styles.appNameHeader}>Conversation</Text>
        </View>
        <View style={styles.languagesContainer}>
          <TouchableOpacity
            style={styles.translateLanguageButton}
            onPress={() => setShowFromDropdown(!showFromDropdown)}
          >
            <Text style={styles.languageButtonText}>
              {getLanguageName(fromLanguage)}
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              color={"white"}
              size={15}
            />
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
                {filteredLanguages.map((item) => (
                  <TouchableOpacity
                    key={item.language}
                    onPress={() => {
                      setFromLanguage(item.language);
                      setShowFromDropdown(false);
                    }}
                  >
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
            <Text style={styles.languageButtonText}>
              {getLanguageName(toLanguage)}
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              color={"white"}
              size={15}
            />
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
                {filteredLanguages.map((item) => (
                  <TouchableOpacity
                    key={item.language}
                    onPress={() => {
                      setToLanguage(item.language);
                      setShowToDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItem}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        <ScrollView style={styles.conversationBoxContainer} ref={scrollViewRef}>
          {conversations.map((conversation, index) => (
            <ChatBubble
              key={index}
              conversation={conversation}
              isRight={!conversation.isUser}
              scrollToInput={scrollToInput}
              fromLanguage={getLanguageName(fromLanguage)}
              toLanguage={getLanguageName(toLanguage)}
              fromLanguageCode={fromLanguage}
              toLanguageCode={toLanguage}
            />
          ))}
          {showUserInput && (
            <ChatBubble
              onSend={(text) => translateText(text, true)}
              placeholder="Type your message here"
              isRight={false}
              scrollToInput={scrollToInput}
              fromLanguage={getLanguageName(fromLanguage)}
              toLanguage={getLanguageName(toLanguage)}
              fromLanguageCode={fromLanguage}
              toLanguageCode={toLanguage}
            />
          )}
          {showResponderInput && (
            <ChatBubble
              onSend={(text) => translateText(text, false)}
              placeholder="Type response here"
              isRight={true}
              scrollToInput={scrollToInput}
              fromLanguage={getLanguageName(fromLanguage)}
              toLanguage={getLanguageName(toLanguage)}
              fromLanguageCode={fromLanguage}
              toLanguageCode={toLanguage}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default ConversationScreen;