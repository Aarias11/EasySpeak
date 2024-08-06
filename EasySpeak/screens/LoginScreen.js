import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';

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
      source={require("../../EasySpeak/assets/background/backgroundone.png")}
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
  headerText: {
    fontSize: 32,
    color: 'white',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(68, 68, 68, 0.25)',
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    color: '#A7CCD6',
  },
  icon: {
    padding: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#2CB5DA',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  signupTextContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signupText: {
    color: '#A7CCD6',
  },
  signupLink: {
    color: '#2CB5DA',
    marginLeft: 5,
  },
  logoHeader: {
    top: -40,
    color: '#A7CCD6',
    fontSize: 42,
    fontWeight: '700'
  }
});

export default LoginScreen;
