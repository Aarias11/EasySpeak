import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import * as AV from 'expo-av';

// Import your screen components
import HomeScreen from './screens/HomeScreen';
import AccountScreen from './screens/AccountScreen';
import SettingsScreen from './screens/SettingsScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import CameraScreen from './screens/CameraScreen';
import ConversationScreen from './screens/ConversationScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function CustomTabBarButton({ children, onPress }) {
  return (
    <TouchableOpacity style={styles.customButtonContainer} onPress={onPress}>
      <View style={styles.customButton}>{children}</View>
    </TouchableOpacity>
  );
}

// Define the HomeStack which includes HomeScreen and SettingsScreen
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Account" component={AccountScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// Define the AuthStack which includes LoginScreen and SignupScreen
function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isRecording, setIsRecording] = useState(false);

  const handleMicPress = async () => {
    if (isRecording) {
      // Stop recording and translate speech to text
      // This is a placeholder for stopping the recording
      // You would need to integrate a speech-to-text service here
      console.log("Stopped recording");
    } else {
      // Request permission and start recording
      const { status } = await AV.Audio.requestPermissionsAsync();
      if (status === 'granted') {
        console.log("Started recording");
        // This is a placeholder for starting the recording
        // You would need to integrate a speech-to-text service here
      }
    }
    setIsRecording(!isRecording);
  };

  return (
    <NavigationContainer>
      {/* Set the status bar style here */}
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="Main">
          {() => (
            <Tab.Navigator
              screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                  position: 'absolute',
                  bottom: -10,
                  backgroundColor: 'rgba(42, 122, 142, 0.1)', // Semi-transparent background
                  borderRadius: 15,
                  width: '100%',
                  height: 90,
                  zIndex: 0,
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(42, 122, 142, 0.5)',
                },
              }}
            >
              <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="home" color={'#297386'} size={30} />
                  ),
                  headerShown: false,
                }}
              />
              <Tab.Screen
                name="Conversation"
                component={ConversationScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="people" color={'#297386'} size={30} />
                  ),
                  headerShown: false,
                }}
              />
              <Tab.Screen
                name="ActionButton"
                component={HomeScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
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
                    handleMicPress();
                  },
                }}
              />
              <Tab.Screen
                name="Camera"
                component={CameraScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="camera-alt" color={'#297386'} size={30} />
                  ),
                  headerShown: false,
                }}
              />
              <Tab.Screen
                name="Favorites"
                component={FavoritesScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="star" color={'#297386'} size={30} />
                  ),
                  headerShown: false,
                }}
              />
            </Tab.Navigator>
          )}
        </Stack.Screen>
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
