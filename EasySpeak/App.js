import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import axios from 'axios';
import { Buffer } from 'buffer';
import { auth } from './firebase'; // Ensure you have this import

// Import your screen components
import HomeScreen from './screens/HomeScreen/HomeScreen';
import AccountScreen from './screens/AccountScreen/AccountScreen';
import SettingsScreen from './screens/SettingsScreen/SettingsScreen';
import FavoritesScreen from './screens/FavoritesScreen/FavoritesScreen';
import CameraScreen from './screens/CameraScreen/CameraScreen';
import ConversationScreen from './screens/ConversationScreen/ConversationScreen';
import LoginScreen from './screens/LoginScreen/LoginScreen';
import SignupScreen from './screens/SignupScreen/SignupScreen';
import SplashScreen from './screens/SplashScreen/SplashScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function CustomTabBarButton({ children, onPress }) {
  return (
    <TouchableOpacity style={styles.customButtonContainer} onPress={onPress}>
      <View style={styles.customButton}>{children}</View>
    </TouchableOpacity>
  );
}

const stackScreenOptions = {
  headerShown: false,
  cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
  cardStyle: { backgroundColor: 'black' },
};

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
    </Stack.Navigator>
  );
}

function ConversationStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Conversation" component={ConversationScreen} />
    </Stack.Navigator>
  );
}

function CameraStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Camera" component={CameraScreen} />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

const handleMicPress = async (isRecording, setIsRecording, recordingRef) => {
  if (isRecording) {
    await stopRecording(recordingRef, setIsRecording);
  } else {
    const { status } = await Audio.requestPermissionsAsync();
    if (status === 'granted') {
      await startRecording(recordingRef, setIsRecording);
    } else {
      Alert.alert('Permission denied', 'You need to grant microphone permission to use this feature.');
    }
  }
  setIsRecording(!isRecording);
};

const startRecording = async (recordingRef, setIsRecording) => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
    await recording.startAsync();
    recordingRef.current = recording;
    console.log("Recording started:", recordingRef.current);
  } catch (error) {
    console.error("Error starting recording:", error);
  }
};

const stopRecording = async (recordingRef, setIsRecording) => {
  const recording = recordingRef.current;
  if (!recording) {
    console.error("No recording object available.");
    return;
  }

  try {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log("Recording URI:", uri);

    const base64 = await fetch(uri).then(res => res.arrayBuffer()).then(buf => Buffer.from(buf).toString('base64'));
    console.log("Base64 audio data:", base64);

    await sendAudioToGoogle(base64);
  } catch (error) {
    console.error("Error stopping recording:", error);
  }
};

const sendAudioToGoogle = async (base64) => {
  const apiKey = 'AIzaSyCGvCBIX2RNeihtAUD-EcGxXJApmFdESzk';
  const url = `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`;

  const body = {
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    },
    audio: {
      content: base64,
    },
  };

  try {
    const response = await axios.post(url, body);
    const { data } = response;
    console.log("Google API response:", JSON.stringify(data, null, 2));

    if (data.results && data.results.length > 0 && data.results[0].alternatives && data.results[0].alternatives.length > 0) {
      const transcript = data.results[0].alternatives[0].transcript;
      Alert.alert('Transcription', transcript);
    } else {
      console.log("No transcription alternatives found");
      Alert.alert('Error', 'No transcription received');
    }
  } catch (error) {
    console.error("Error sending audio to Google:", error);
    Alert.alert('Error', 'Error sending audio to Google');
  }
};

function MainTabNavigator({ handleMicPress, isRecording, setIsRecording, recordingRef }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: -10,
          backgroundColor: 'rgba(42, 122, 142, 0.1)',
          borderRadius: 15,
          width: '100%',
          height: 90,
          zIndex: 0,
          borderTopWidth: 1,
          borderTopColor: 'rgba(42, 122, 142, 0.5)',
        },
        tabBarIconStyle: { size: 30 },
        ...TransitionPresets.SlideFromRightIOS, // Apply the transition preset for tab screens
      })}
      sceneContainerStyle={{ backgroundColor: 'black' }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" color={'#297386'} size={30} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ConversationTab"
        component={ConversationStack}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="people" color={'#297386'} size={30} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ActionButton"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="mic" color="white" size={30} />
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton {...props}>
              <MaterialIcons name="mic" color="white" size={30} />
            </CustomTabBarButton>
          ),
          headerShown: false,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleMicPress(isRecording, setIsRecording, recordingRef);
          },
        }}
      />
      <Tab.Screen
        name="CameraTab"
        component={CameraStack}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="camera-alt" color={'#297386'} size={30} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesStack}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="star" color={'#297386'} size={30} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const recordingRef = useRef(null);
  const [appLoaded, setAppLoaded] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadApp = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAppLoaded(true);
    };

    const authStateChanged = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    loadApp();

    return () => authStateChanged();
  }, []);

  if (!appLoaded) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: 'black' } }}>
        {user ? (
          <Stack.Screen name="Main">
            {(props) => (
              <MainTabNavigator
                {...props}
                handleMicPress={handleMicPress}
                isRecording={isRecording}
                setIsRecording={setIsRecording}
                recordingRef={recordingRef}
              />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  customButtonContainer: {
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  customButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(42, 122, 142, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
});
