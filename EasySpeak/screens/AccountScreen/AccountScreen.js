import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage, db, auth, doc, getDoc, updateDoc, setDoc } from '../../firebase';
import { signOut } from 'firebase/auth'; // Ensure you import signOut from 'firebase/auth'
import styles from './AccountScreen.styles'; 

// Importing the modal content components
import EditProfileComponent from "../../components/EditProfileComponent";
import AppSettingsComponent from "../../components/AppSettingsComponent";
import PrivacyPolicyComponent from "../../components/PrivacyPolicyComponent";
import TermsOfServiceComponent from "../../components/TermsofServiceComponent";

const AccountScreen = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setAvatar(userData.avatar || null);
      }
    } catch (error) {
      console.error('Error fetching user profile: ', error);
    }
  };

  const toggleModal = (content) => {
    setModalContent(content);
    setModalVisible(!isModalVisible);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      await uploadImage(result.assets[0].uri);
    } else {
      Alert.alert('Cancelled', 'No image selected');
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Error', 'User not logged in');
        return;
      }

      const storageRef = ref(storage, `avatars/${user.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      setUploading(true);

      uploadTask.on('state_changed',
        (snapshot) => {
          // Progress function ...
        },
        (error) => {
          setUploading(false);
          Alert.alert('Error', 'Error uploading image: ' + error.message);
        },
        async () => {
          setUploading(false);
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setAvatar(downloadURL);
          await updateProfilePicture(downloadURL);
        }
      );
    } catch (error) {
      setUploading(false);
      Alert.alert('Error', 'Error uploading image: ' + error.message);
    }
  };

  const updateProfilePicture = async (downloadURL) => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        await updateDoc(userDocRef, { avatar: downloadURL });
      } else {
        await setDoc(userDocRef, { avatar: downloadURL });
      }
    } catch (error) {
      Alert.alert('Error updating profile', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out...'); // Debugging: check if the function is being called
      await signOut(auth);
      console.log('Logged out successfully'); // Debugging: check if signOut is successful
      navigation.replace('Login'); // Navigate to the login screen after successful logout
    } catch (error) {
      Alert.alert('Error', 'Error logging out: ' + error.message);
    }
  };

  const renderModalContent = () => {
    switch (modalContent) {
      case "Edit Profile":
        return <EditProfileComponent />;
      case "App Settings":
        return <AppSettingsComponent />;
      case "Privacy Policy":
        return <PrivacyPolicyComponent />;
      case "Terms of Services":
        return <TermsOfServiceComponent />;
      default:
        return null;
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/background/backgroundone.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.accountNameContainer}>
          <Text style={styles.accountNameHeader}>Account</Text>
        </View>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={pickImage}>
            {uploading ? (
              <ActivityIndicator size="large" color="#2CB5DA" />
            ) : (
              avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatar} />
              ) : (
                <MaterialIcons name="account-circle" size={100} color="white" />
              )
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.emailContainer}>
          <Text style={styles.emailHeader}>johndoe11@example.com</Text>
        </View>
        <View style={styles.editProfileContainer}>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => toggleModal("Edit Profile")}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.settingsTab}>
          <View style={styles.appSettings}>
            <TouchableOpacity
              style={styles.appSettingsButton}
              onPress={() => toggleModal("App Settings")}
            >
              <Text style={styles.appSettingsText}>App Settings</Text>
            </TouchableOpacity>
            <MaterialIcons
              style={styles.iconSettings}
              name="tune"
              size={30}
              color="#F1F2F2"
            />
          </View>
          <View style={styles.appSettings}>
            <TouchableOpacity
              style={styles.appSettingsButton}
              onPress={() => toggleModal("Privacy Policy")}
            >
              <Text style={styles.appSettingsText}>Privacy Policy</Text>
            </TouchableOpacity>
            <MaterialIcons
              style={styles.iconSettings}
              name="privacy-tip"
              size={30}
              color="#F1F2F2"
            />
          </View>
          <View style={styles.appSettings}>
            <TouchableOpacity
              style={styles.appSettingsButton}
              onPress={() => toggleModal("Terms of Services")}
            >
              <Text style={styles.appSettingsText}>Terms of Services</Text>
            </TouchableOpacity>
            <MaterialIcons
              style={styles.iconSettings}
              name="description"
              size={30}
              color="#F1F2F2"
            />
          </View>
        </View>
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
            <MaterialIcons name="logout" size={20} color="#F1F2F2" />
          </TouchableOpacity>
        </View>

        {/* Modal */}
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setModalVisible(false)}
          style={styles.modal}
        >
          <View style={styles.modalContent}>
            {renderModalContent()}
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};





export default AccountScreen;
