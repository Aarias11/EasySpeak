import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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
