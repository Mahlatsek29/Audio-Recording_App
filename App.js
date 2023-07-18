import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SignUpScreen from './screens/SignUpScreen';
import AudioScreen from './screens/AudioScreen';

const Stack = createStackNavigator();

const App = () => {
  const [username, setUsername] = useState('');
  const handleLogin = (username) => {
    setUsername(username);
  };
  const handleLogout = () => {
    setUsername('');
  };

  return (
    <LinearGradient colors={['#0A84FF', '#003CFF']} style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          {username ? (
            <>
              <Stack.Screen name="Home" options={{ title: 'Home' }}>
                {(props) => (
                  <HomeScreen {...props} username={username} onLogout={handleLogout} />
                )}
              </Stack.Screen>
              <Stack.Screen name="Audio" component={AudioScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" options={{ title: 'Login' }}>
                {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
              </Stack.Screen>
              <Stack.Screen name="SignUp" component={SignUpScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </LinearGradient>
  );
};

export default App;
