import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginTop: 50,
    alignItems: "center",
  },
  appNameContainer: {
    alignItems: "center",
    bottom: 20,
  },
  appNameHeader: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  languagesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
    zIndex: 20, // Ensure the languages container is above other elements
  },
  translateLanguageButton: {
    backgroundColor: "#297386",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    alignItems: "center",
    height: 45,
    zIndex: 30, // Ensure the language buttons are above other elements
  },
  languageButtonText: {
    color: "white",
    fontSize: 16,
  },
  conversationBoxContainer: {
    width: "85%",
    marginTop: 20,
    flexDirection: "column",
    gap: 5, // Gap between each card
    zIndex: 10, // Ensure the conversation box is below the dropdowns
  },
  chatCard: {
    backgroundColor: "rgba(68, 68, 68, 0.25)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(68, 68, 68, 0.35)",
    width: "85%",
    marginVertical: 3,
    flexWrap: 'wrap',
    padding: 15
  },
  chatCardRight: {
    alignSelf: "flex-end",
    paddingRight: 10,
  },
  chatText: {
    color: "#A7CCD6",
    fontSize: 18,
    marginBottom: 5,
  },
  chatTextContainerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    // width: '100%'
  },
  voiceIconRight: {
    marginLeft: 10,
  },
  voiceIconLeft: {
    marginRight: 10,
  },
  translatedCard: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 25,
    paddingVertical: 15,
    padding: 10,
  },
  cardInputContainerLeft: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center", // Align items at the start of the container
    justifyContent: "space-between",
  },
  chatInput: {
    color: "#A7CCD6",
    fontSize: 18,
    width: "85%",

    flexWrap: 'wrap',
    overflow: 'scroll',
  },
  sendButtonLeft: {
    width: "15%",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    left: 70


  },
  chatTextContainerRight: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  cardInputContainerRight: {
    width: "100%",
    flexDirection: "row-reverse",
    alignItems: "center", // Align items at the start of the container
    justifyContent: "space-between",
  },
  
  sendButtonRight: {
    width: "15%",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    left: 60


  },
  
  translationText: {
    color: "#BBBBBB",
    fontSize: 14,
    marginTop: 5,
  },
  dropdownContainer: {
    maxHeight: 300,
    width: "90%",
    position: "absolute",
    top: 50,
    zIndex: 50, // Ensure the dropdowns are above all other elements
    backgroundColor: "black",
    borderRadius: 10,
    alignSelf: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0a0f0e",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    padding: 10,
    color: "#ecf0ef",
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: "#0a0f0e",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    fontSize: 16,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    color: "#ecf0ef",
    fontSize: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "white",
  },
});
