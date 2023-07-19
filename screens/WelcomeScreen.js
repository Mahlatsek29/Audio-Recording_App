import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>EchoNotes</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signupBtn}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.signupText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  
  },
  title: {
    fontSize: 24,
    marginBottom: 32,
   
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 32,
  },
  loginBtn: {
    backgroundColor: '#FF1493',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 75,
  },
  loginText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  signupBtn: {
    backgroundColor: '#FFC0CB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 75,
  },
  signupText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default WelcomeScreen;
