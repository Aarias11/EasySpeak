import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginTop: 50,
  },
  appNameContainer: {
    width: '100%',
    alignItems: 'center',
    bottom: 20,
  },
  appNameHeader: {
    color: 'white',
    fontSize: 32,
    fontWeight: '700',
  },
  languagesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
    zIndex: 20,
  },
  translateLanguageButton: {
    backgroundColor: "#297386",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    flexDirection: 'row',
    justifyContent: "center",
    gap: 5,
    alignItems: 'center',
    zIndex: 30,
    height: 45,
  },
  languageButtonText: {
    color: "white",
    fontSize: 16,
  },
  dropdownContainer: {
    maxHeight: 300,
    width: '90%',
    position: 'absolute',
    top: 50,
    zIndex: 30,
    backgroundColor: '#0a0f0e',
    borderRadius: 10,
    alignSelf: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0f0e',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    padding: 10,
    color: '#ecf0ef',
    fontSize: 16

  },
  dropdown: {
    backgroundColor: '#0a0f0e',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#ecf0ef',
    fontSize: 16

  },
  translationBox: {
    width: '100%',
    height: 490,
    borderWidth: 0.2,
    borderColor: 'rgba(60, 60, 60, 0.4)',
    borderRadius: 25,
    marginTop: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    position: 'relative',
    zIndex: 1,
  },
  translationContentContainer: {
    width: '100%',
    flexDirection: 'column',
    paddingTop: 100
  },
  blur: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  inputTranslation: {
    color: '#A7CCD6',
    fontSize: 28,
    fontWeight: '600',
    width: '100%',
    top: -160,
  },
  translateButton: {
    width: 120,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#2CB5DA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    top: -160,

  },
  translateButtonText: {
    color: 'white',
    fontSize: 16,
  },
  translatedTextContainer: {
    top: -140,
  },
  translatedText: {
    color: '#A7CCD6',
    fontSize: 18,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#297386',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  favoriteButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  speakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#2CB5DA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  speakButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  tabsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 5,
    padding: 20
  },
  tabsText: {
    color: '#ecf0ef',
    fontSize: 20,
  },
  activeTabText: {
    textDecorationLine: 'underline', // Underline for active tab
    fontWeight: 'bold', // Optional: To make the active tab stand out more
  },
  inactiveTab: {
    opacity: 0.7, // 70% opacity for inactive tabs
  },
});