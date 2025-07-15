import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../Common/header/header';
import styles from './style';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BASE_URL } from '../../Common/config/config';
const Assembly = ({ setIsLoggedIn, username }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { shopId } = route.params;

  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/Common/Lines?shopId=${shopId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setLines(data.data);
        } else {
          console.error('Unexpected API response:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching lines:', error);
      })
      .finally(() => setLoading(false));
  }, [shopId]);

  const handleLinePress = (lineName) => {
    navigation.navigate('OEE', { lineName });
  };



  const getLineIcon = (index) => {
    const icons = [
      require('../../Common/assets/oee.jpg'),
      require('../../Common/assets/Downtime.jpg'),
      require('../../Common/assets/dashboard.jpg'),
      require('../../Common/assets/quality.jpg')
    ];
    return icons[index % icons.length];
  };

  return (
    <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={styles.gradient}>
      <Header username={username} setIsLoggedIn={setIsLoggedIn} title='Line Screen' />

      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          lines.map((line, index) => (
            <TouchableOpacity key={line.LineID} style={styles.cardButton} 
            
            onPress={() => handleLinePress(line.LineName)}>
              <Image source={getLineIcon(index)} style={styles.icon} />
              <Text style={styles.cardText}>{line.LineName.trim()}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default Assembly;
