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
  const { StationID } = route.params;

  const [Equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/Common/Equipment?StationID=${StationID}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setEquipment(data.data);
        } else {
          console.error('Unexpected API response:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching Equipment:', error);
      })
      .finally(() => setLoading(false));
  }, [StationID]);

  const handleLinePress = (equipmentName) => {
    navigation.navigate('OEE', { equipmentName });
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
      <Header username={username} setIsLoggedIn={setIsLoggedIn} title='Machine' />

      <ScrollView contentContainerStyle={styles.menuContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          Equipment.map((Equipment, index) => (
            <TouchableOpacity key={Equipment.EquipmentID} style={styles.cardButton} 
            
onPress={() => handleLinePress(Equipment.EquipmentName.trim())}
>
              <Image source={getLineIcon(index)} style={styles.icon} />
              <Text style={styles.cardText}>{Equipment.EquipmentName.trim()}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default Assembly;
