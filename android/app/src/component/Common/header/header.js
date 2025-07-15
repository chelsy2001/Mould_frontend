import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
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

const Header = ({ username, setIsLoggedIn, title }) => {
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
      {/* Top row: back button + title */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.sideIcon}>
          <Icon name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>

          <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 8 }}>
            <Icon name="logout" size={20} color="#fff" />
          </TouchableOpacity>
        {/* <View style={styles.sideIcon} />   */}
      </View>

      {/* Bottom row: date and username/logout */}
      <View style={styles.bottomRow}>
        <Text style={styles.subTitle}>{getCurrentDate()}</Text>
        <View style={styles.userContainer}>
          <Text
            style={styles.subTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {username}
          </Text>
          {/* <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 8 }}>
            <Icon name="logout" size={20} color="#fff" />
          </TouchableOpacity> */}
        </View>
      </View>
    </LinearGradient>
  );
};

export default Header;
