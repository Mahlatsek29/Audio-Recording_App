import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation, username, onLogout }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Home Screen, {username}!</Text>
      <View style={styles.buttonContainer}>
        <Button title="Logout" onPress={onLogout} color="limegreen" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
  },
});

export default HomeScreen;
