import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import stationStyles from './stationStyle'; 
import { BASE_URL } from '../../Common/config/config';
import Header from '../../Common/header/header';
import LinearGradient from 'react-native-linear-gradient';

const StationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { ZoneID } = route.params;

  const [station, setStation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/Common/station?ZoneID=${ZoneID}`)
      .then(res => res.json())
      .then(data => setStation(data.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [ZoneID]);

  const stationIcons = [
    require('../../Common/assets/oee.jpg'),
    require('../../Common/assets/Downtime.jpg'),
    require('../../Common/assets/dashboard.jpg'),
    require('../../Common/assets/quality.jpg'),
    require('../../Common/assets/quality.jpg'),
    require('../../Common/assets/quality.jpg')
  ];

  return (
     <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={stationStyles.gradient}>
              <Header  title="Station " />
        
              <ScrollView contentContainerStyle={stationStyles.menuContainer}>
                {loading ? (
                  <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                  station.map((station, index) => (
                    <TouchableOpacity
                      key={station.StationID}
                      style={stationStyles.menuItem}
                      onPress={() => navigation.navigate('Assembly', { StationID: station.StationID })}
                    >
                      {/* <Image
                        source={stationIcons[index % stationIcons.length]} // Rotate icons if more shops than icons
                        style={stationStyles.icon}
                      /> */}
                      <Text style={stationStyles.menuText}>{station.StationName}</Text>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </LinearGradient>
  );
};

export default StationScreen;
