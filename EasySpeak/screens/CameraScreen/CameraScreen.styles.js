import { StyleSheet } from 'react-native';


export default StyleSheet.create({
    
    container: {
      flex: 1,
      alignItems: 'center',
    },
    camera: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '100%',
      backgroundColor: 'transparent',
    },
    captureContainer: {
      flex: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    captureButton: {
      width: 70,
      height: 70,
      flex: 0,
      backgroundColor: '#2CB5DA',
      borderRadius: 50,
      padding: 15,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 20,
      position: 'absolute',
      bottom: 110,
      left: '37%',
      zIndex: 1, // Ensure the button stays in front of other elements
    },
    uploadButton: {
      width: 70,
      height: 70,
      flex: 0,
      backgroundColor: '#2CB5DA',
      borderRadius: 50,
      padding: 15,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 20,
      position: 'absolute',
      bottom: 90,
      left: '5%',
      zIndex: 1, // Ensure the button stays in front of other elements
    },
    loaderContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -25 }, { translateY: -25 }],
      zIndex: 2, // Ensure the loader stays in front of other elements
    },
    translationContainer: {
      width: '95%',
      height: 500,
      padding: 10,
      borderRadius: 15,
      backgroundColor: 'rgba(10, 10, 10, 0.65)',
      margin: 10,
      position: 'absolute',
      top: 150,
      zIndex: 0,
    },
    translationTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#F1F2F2',
    },
    translatedText: {
      fontSize: 18,
      color: '#A7CCD6',
      marginTop: 10,
    },
    featuresContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      paddingBottom: 10,
    },
    featureButton: {
      width: 70,
      margin: '1%',
      height: 70,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#007AFF',
      borderRadius: 50,
    },
    languagesContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 10,
      gap: 10,
      zIndex: 20, // Ensure the dropdown stays in front of the translation container
    },
    languagesTopContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 10,
      gap: 10,
      zIndex: 20, // Ensure the dropdown stays in front of the translation container
      position: 'absolute',
      top: 100,
      width: '100%',
      paddingHorizontal: 10,
    },
    translateLanguageButton: {
      backgroundColor: '#297386',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginHorizontal: 5, // Add spacing between buttons
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 5,
      alignItems: 'center',
      zIndex: 10, // Ensure it stays in front of other elements
      
    },
    translateTopLanguageButton: {
      backgroundColor: '#297386',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginHorizontal: 5, // Add spacing between buttons
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 5,
      alignItems: 'center',
      height:45

    },
    languageButtonText: {
      color: 'white',
      fontSize: 16,
    },
    languageTopButtonText: {
      color: 'white',
      fontSize: 16,
    },
    dropdownContainer: {
      maxHeight: 300, // Limit the height of the dropdown
      width: '100%',
      position: 'absolute',
      top: 50,
      zIndex: 30,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#0a0f0e',
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    searchInput: {
      marginLeft: 10,
      flex: 1,
      padding: 15,
      color: '#ecf0ef',
      fontSize: 16
    },
    dropdown: {
      backgroundColor: '#0a0f0e',
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
    },
    dropdownItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      color: '#ecf0ef',
      fontSize: 16

    },
    permissionContainer: {
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    permission: {
      color: 'white',
    },
    permissionButton: {},
  });