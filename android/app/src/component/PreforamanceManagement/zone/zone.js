import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import zoneStyles from './zoneStyle'; 
import { BASE_URL } from '../../Common/config/config';
import Header from '../../Common/header/header';
import LinearGradient from 'react-native-linear-gradient';

const ZoneScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { shopId } = route.params;

  const [zone, setZone] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/Common/zone?ShopID=${shopId}`)
      .then(res => res.json())
      .then(data => setZone(data.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [shopId]);

   // For assigning images based on index (optional - you can also map ShopID to specific icons)
  const zoneIcons = [
    require('../../Common/assets/oee.jpg'),
    require('../../Common/assets/Downtime.jpg'),
    require('../../Common/assets/dashboard.jpg'),
    require('../../Common/assets/quality.jpg'),
    require('../../Common/assets/quality.jpg'),
    require('../../Common/assets/quality.jpg')
  ];

  return (
     <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={zoneStyles.gradient}>
          <Header  title="Zone " />
    
          <ScrollView contentContainerStyle={zoneStyles.menuContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              zone.map((zone, index) => (
                <TouchableOpacity
                  key={zone.ZoneID}
                  style={zoneStyles.menuItem}
                  onPress={() => navigation.navigate('Station', { ZoneID: zone.ZoneID })}
                >
                  {/* <Image
                    source={zoneIcons[index % zoneIcons.length]} // Rotate icons if more shops than icons
                    style={zoneStyles.icon}
                  /> */}
                  <Text style={zoneStyles.menuText}>{zone.ZoneName}</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </LinearGradient>
  );
};

export default ZoneScreen;
