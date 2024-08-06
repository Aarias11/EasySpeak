import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import styles from './SettingsScreen.styles';

export default function SettingsScreen() {
    return (
        <ImageBackground
            source={require('../../assets/background/backgroundone.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <Text style={styles.text}>Settings Screen</Text>
            </View>
        </ImageBackground>
    );
}
