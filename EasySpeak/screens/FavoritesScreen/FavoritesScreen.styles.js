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
      width: "100%",
      alignItems: "center",
      bottom: 20,
    },
    appNameHeader: {
      color: "white",
      fontSize: 24,
      fontWeight: "700",
    },
    favoritesContainer: {
      width: "100%",
      marginTop: 20,
      padding: 10,
      gap: 10,
    },
    favoritesCard: {
      width: "100%",
      borderColor: "rgba(68, 68, 68, 0.35)",
      borderWidth: 1,
      borderRadius: 20,
      backgroundColor: "rgba(68, 68, 68, 0.15)",
      padding: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    favoriteContent: {
      width: '100%',
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: 'space-between',
      padding: 5
    },
    favoritesText: {
      color: "#A7CCD6",
      fontSize: 18,
      opacity: 0.7
    },
    favoriteIcon: {
      marginLeft: 10,
    },
    translatedText: {
      color: "#A7CCD6",
      fontSize: 16,
      marginTop: 5,
    },
    favoriteTextContainer: {
      width: '85%',
      flexDirection: 'column'
    }
  });