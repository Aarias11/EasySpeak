import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";

// Importing the modal content components
import EditProfileComponent from "../components/EditProfileComponent";
import AppSettingsComponent from "../components/AppSettingsComponent";
import PrivacyPolicyComponent from "../components/PrivacyPolicyComponent";
import TermsOfServiceComponent from "../components/TermsofServiceComponent";

const AccountScreen = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const toggleModal = (content) => {
    setModalContent(content);
    setModalVisible(!isModalVisible);
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
      source={require("../../EasySpeak/assets/background/background.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.accountNameContainer}>
          <Text style={styles.accountNameHeader}>Account</Text>
        </View>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar} />
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
    borderColor: "white",
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
