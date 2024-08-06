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
  Image,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { auth, db, doc, getDoc } from "../firebase";
import TopHeaderNav from "../components/TopHeaderNav";

const ChatBubble = ({
  isRight,
  placeholder,
  onSend,
  conversation,
  scrollToInput,
}) => {
  const [text, setText] = useState("");
  const [inputHeight, setInputHeight] = useState(50);
  const inputRef = useRef(null);

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
      setInputHeight(50); // Reset input height after sending
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
          <Text style={styles.chatText}>{conversation.original}</Text>
          <Text style={styles.translationText}>{conversation.translated}</Text>
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
  const [fromLanguage, setFromLanguage] = useState("en"); // Default "from" language is English
  const [toLanguage, setToLanguage] = useState("es"); // Default "to" language is Spanish
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
    // setInputText('')
    // setTranslatedText('');

  }

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
      source={require("../../EasySpeak/assets/background/backgroundone.png")}
      style={styles.backgroundImage}
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
            />
          ))}
          {showUserInput && (
            <ChatBubble
              onSend={(text) => translateText(text, true)}
              placeholder="Type your message here"
              isRight={false}
              scrollToInput={scrollToInput}
            />
          )}
          {showResponderInput && (
            <ChatBubble
              onSend={(text) => translateText(text, false)}
              placeholder="Type response here"
              isRight={true}
              scrollToInput={scrollToInput}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
  appNameContainer: {
    alignItems: "center",
    bottom: 20,
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
    gap: 10,
  },
  translateLanguageButton: {
    backgroundColor: "#297386",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    alignItems: "center",
  },
  languageButtonText: {
    color: "white",
    fontSize: 16,
  },
  conversationBoxContainer: {
    width: "85%",
    marginTop: 20,
    flexDirection: "column",
    gap: 5, // Gap between each card
  },
  chatCard: {
    backgroundColor: "rgba(68, 68, 68, 0.25)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(68, 68, 68, 0.35)",
    width: "80%",
    marginVertical: 3,
  },
  chatCardRight: {
    alignSelf: "flex-end",
    paddingRight: 10,
  },
  chatText: {
    color: "#A7CCD6",
    fontSize: 18,
    marginBottom: 5,
  },
  translatedCard: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 25,
    paddingVertical: 15,
    padding: 10,
  },
  cardInputContainer: {
    width: "100%",
    height: 70, // Set a minimum height
    flexDirection: "row",
    alignItems: "flex-start", // Align items at the start of the container
    justifyContent: "space-between",
  },
  chatInput: {
    color: "#A7CCD6",
    fontSize: 18,
    width: "89%",
    height: '100%',
    marginTop: 10,
    // marginLeft: 10,
    left: 20
  },
  sendButton: {
    width: "15%",
    height: "100%", // Ensuring same height as input card
    backgroundColor: "#2CB5DA",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  translationText: {
    color: "#BBBBBB",
    fontSize: 14,
    marginTop: 5,
  },
  dropdownContainer: {
    maxHeight: 300,
    width: "90%",
    position: "absolute",
    top: 50,
    zIndex: 30,
    backgroundColor: "#0a0f0e",
    borderRadius: 10,
    alignSelf: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0a0f0e",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    padding: 10,
    color: "#ecf0ef",
  },
  dropdown: {
    backgroundColor: "#0a0f0e",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    color: "#ecf0ef",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "white",
  },
});

export default ConversationScreen;









