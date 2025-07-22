import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import styles from './perhomestyle';
import Header from '../../Common/header/header';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { BASE_URL } from '../../Common/config/config';
const PerformanceScreen = ({ setIsLoggedIn, username }) => {
  const navigation = useNavigation();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/Common/Shops`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setShops(data.data);
        } else {
          console.error('Invalid data format from API:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching shops:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  // For assigning images based on index (optional - you can also map ShopID to specific icons)
  const shopIcons = [
    require('../../Common/assets/oee.jpg'),
    require('../../Common/assets/Downtime.jpg'),
    require('../../Common/assets/dashboard.jpg'),
    require('../../Common/assets/quality.jpg'),
    require('../../Common/assets/quality.jpg'),
    require('../../Common/assets/quality.jpg')
  ];

  return (
    <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={styles.gradient}>
      <Header username={username} setIsLoggedIn={setIsLoggedIn} title="Shop Screen" />

      <ScrollView contentContainerStyle={styles.menuContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          shops.map((shop, index) => (
            <TouchableOpacity
              key={shop.ShopID}
              style={styles.menuItem}
              onPress={() => navigation.navigate('Zone', { shopId: shop.ShopID })}
            >
              <Image
                source={shopIcons[index % shopIcons.length]} // Rotate icons if more shops than icons
                style={styles.icon}
              />
              <Text style={styles.menuText}>{shop.ShopName.trim()}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default PerformanceScreen;
