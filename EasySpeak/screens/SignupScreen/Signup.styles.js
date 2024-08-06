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
    input: {
      width: '100%',
      backgroundColor: 'rgba(68, 68, 68, 0.25)',
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      color: '#A7CCD6',
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
    loginTextContainer: {
      flexDirection: 'row',
      marginTop: 20,
    },
    loginText: {
      color: '#A7CCD6',
    },
    loginLink: {
      color: '#2CB5DA',
      marginLeft: 5,
    },
  });