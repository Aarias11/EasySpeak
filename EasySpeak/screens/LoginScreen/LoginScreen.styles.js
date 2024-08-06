import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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