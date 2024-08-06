import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './LoginScreen.styles'

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigate to the main app screen after successful login
      navigation.navigate('Main');
    } catch (error) {
      console.error('Error logging in: ', error);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/background/backgroundone.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.logoHeader}>EasySpeak</Text>
        <Text style={styles.headerText}>Login</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={24} color="#A7CCD6" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#A7CCD6"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color="#A7CCD6" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#A7CCD6"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.icon}>
            <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={24} color="#A7CCD6" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.signupTextContainer}>
          <Text style={styles.signupText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};



export default LoginScreen;
