// SplashScreen.js
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';

const SplashScreen = () => {
  return (
    <ImageBackground
      source={require("../../EasySpeak/assets/background/backgroundone.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.logoHeader}>EasySpeak</Text>
        <ActivityIndicator size="large" color="#2CB5DA" />
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoHeader: {
    color: '#A7CCD6',
    fontSize: 42,
    fontWeight: '700',
    marginBottom: 20,
  },
});

export default SplashScreen;
