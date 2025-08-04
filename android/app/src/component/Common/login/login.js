import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Alert, TouchableOpacity, KeyboardAvoidingView, Platform ,Image} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import axios from 'axios';
import { IconButton, Button } from 'react-native-paper';
import styles from './loginstyles';
import LinearGradient from 'react-native-linear-gradient';
import { BASE_URL } from '../config/config';

const LoginScreen = ({ navigation, setIsLoggedIn, setUsername }) => {
  const [localUsername, setLocalUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    const fetchUsernames = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/login/users`);
        
        if (response.data && Array.isArray(response.data.data)) {
          setUserData(response.data.data.map(user => ({ key: user.UserName, value: user.UserName })));
        } else {
          Alert.alert('Error', 'Unexpected response format');
        }
      } catch (error) {
        Alert.alert('Error', 'Could not fetch usernames');
      } finally {
        setLoading(false);
      }
    };
    fetchUsernames();
  }, []);

  const handleLogin = async () => {
    if (!localUsername || !password) {
      Alert.alert('Error', 'Please select a username and enter a password');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        name: localUsername,
        pass: password,
      });

      if (response.data.message === 'success') {
        setUsername(localUsername);
        setIsLoggedIn(true);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        Alert.alert('Error', response.data.message || 'Login failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to log in. Please check your credentials and try again.');
    }
  };

  return (
    <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={styles.gradient}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.header}> Lumax Industries </Text>
          <Image
  source={require('../assets/login.png')} // Adjust path if needed
  style={styles.logo}
/>

          <Text style={styles.label}>Username</Text>
          <View style={styles.dropdownContainer}>
            <SelectList
              setSelected={(val) => setLocalUsername(val)}
              data={userData}
              save="value"
              placeholder={loading ? 'Loading...' : 'Select username'}
              boxStyles={styles.dropdownBox}
              inputStyles={styles.dropdownText}
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
              placeholder="Enter Password"
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <IconButton
                icon={isPasswordVisible ? 'eye' : 'eye-off'}
                size={20}
                iconColor="#666"
              />
            </TouchableOpacity>
          </View>

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.loginButton}
            labelStyle={{ fontSize: 16 }}
            buttonColor="#4b7bec"
          >
            Login
          </Button>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default LoginScreen;
