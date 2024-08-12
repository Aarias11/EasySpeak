import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { auth } from '../firebase'; // Adjust the import as per your project structure
import { updateEmail, sendEmailVerification, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const EditProfileComponent = () => {
  const [email, setEmail] = useState(auth.currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleUpdate = async () => {
    try {
      // Re-authenticate the user before making changes
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);

      if (email !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, email);
        await sendEmailVerification(auth.currentUser);
        Alert.alert('Success', 'Verification email sent to new email address. Please verify it before logging in.');
      }

      if (password) {
        await updatePassword(auth.currentUser, password);
        Alert.alert('Success', 'Password updated successfully');
      }
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        Alert.alert('Error', 'You need to re-authenticate before updating your profile.');
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <MaterialIcons name="email" size={24} color="#F1F2F2" />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          placeholderTextColor="#ccc"
          secureTextEntry={!passwordVisible}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <MaterialIcons name={passwordVisible ? "visibility-off" : "visibility"} size={24} color="#F1F2F2" />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#ccc"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <MaterialIcons name={passwordVisible ? "visibility-off" : "visibility"} size={24} color="#F1F2F2" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    color: 'white',
    fontSize: 24,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(68, 68, 68, 0.25)',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    color: '#F1F2F2'
  },
  updateButton: {
    backgroundColor: '#297386',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default EditProfileComponent;
