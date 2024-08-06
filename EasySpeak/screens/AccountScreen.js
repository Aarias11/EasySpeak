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
import { storage, db, auth, doc, getDoc, updateDoc, setDoc } from '../firebase';

// Importing the modal content components
import EditProfileComponent from "../components/EditProfileComponent";
import AppSettingsComponent from "../components/AppSettingsComponent";
import PrivacyPolicyComponent from "../components/PrivacyPolicyComponent";
import TermsOfServiceComponent from "../components/TermsofServiceComponent";

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
      source={require("../../EasySpeak/assets/background/backgroundone.png")}
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
          <TouchableOpacity style={styles.logoutButton}>
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

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    marginTop: 100,
  },
  accountNameContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 30,
  },
  accountNameHeader: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  avatarContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 21,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(41, 115, 134, 0.44)",
  },
  emailContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 21,
  },
  emailHeader: {
    color: "#F1F2F2",
    fontSize: 16,
    fontWeight: "700",
  },
  editProfileContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 21,
  },
  editProfileButton: {
    width: 136,
    height: 41,
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: "rgba(41, 115, 134, 0.44)",
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  editProfileText: {
    color: "#F1F2F2",
    fontSize: 16,
  },
  appSettings: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F2F2",
    paddingBottom: 10,
  },
  settingsTab: {
    paddingHorizontal: 10,
    marginVertical: 50,
    flexDirection: "column",
    gap: 16,
  },
  appSettingsButton: {
    paddingHorizontal: 30,
  },
  appSettingsText: {
    color: "#F1F2F2",
    fontSize: 20,
  },
  iconSettings: {
    paddingHorizontal: 30,
  },
  logoutContainer: {
    paddingHorizontal: 30,
  },
  logoutButton: {
    width: 136,
    height: 41,
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    backgroundColor: "rgba(41, 115, 134, 0.44)",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  logoutText: {
    color: "#F1F2F2",
    fontSize: 16,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    height: "70%",
    backgroundColor: "#0A0E0F",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
});

export default AccountScreen;
