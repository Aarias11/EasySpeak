import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PrivacyPolicyComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Privacy Policy</Text>
      <Text style={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    color: 'white',
    fontSize: 24,
    marginBottom: 10,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});

export default PrivacyPolicyComponent;
