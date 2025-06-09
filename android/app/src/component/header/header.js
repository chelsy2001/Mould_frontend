import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import styles from './headerStyle';

const getCurrentDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const Header = ({ username, setIsLoggedIn ,title }) => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "YES",
        onPress: async () => {
          await AsyncStorage.removeItem('userToken');
          setIsLoggedIn(false);
          navigation.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }],
          });
        },
      },
    ]);
  };

  return (
    <LinearGradient
      colors={['#003366', '#0059b3']}
      style={styles.header}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      {/* Back Button */}
      
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.sideIcon}>
        <Icon name="arrow-left" size={26} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.subTitle}> {getCurrentDate()}</Text>
      {/* Centered Content */}
      <View style={styles.centerContent}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Logout Icon */}
      {/* <Text style={styles.title}>👤 {username}</Text> */}
      <Text style={styles.title}> {username}</Text>
      <TouchableOpacity onPress={handleLogout} style={styles.sideIcon}>
        <Icon name="logout" size={26} color="#fff" />
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default Header;
