import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

// Import your screen components
import HomeScreen from './screens/HomeScreen';
import AccountScreen from './screens/AccountScreen';
import SettingsScreen from './screens/SettingsScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import CameraScreen from './screens/CameraScreen';
import ConversationScreen from './screens/ConversationScreen';

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

export default function App() {
  return (
    <NavigationContainer>
      {/* Set the status bar style here */}
      <StatusBar barStyle="light-content" backgroundColor="#000" />
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
          component={ConversationScreen}
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