import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, Image, ScrollView, 
  ActivityIndicator, Modal, Alert, StyleSheet, PermissionsAndroid, Platform 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../Common/header/header';
import styles from './style';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BASE_URL } from '../../Common/config/config';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';

const Assembly = ({ setIsLoggedIn, username }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { StationID } = route.params;

  const [Equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs camera access to scan QR codes',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setHasPermission(true);
      } else {
        setHasPermission(false);
        Alert.alert('Permission Denied', 'Camera permission is required to scan.');
      }
    } else {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    }
  };

  useEffect(() => {
    requestPermission(); 
  }, []);

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

  const handleScanResult = (code) => {
    if (!code) return;
    setShowScanner(false);

    const matched = Equipment.find(eq => 
      eq.EquipmentCode?.trim() === code.trim() || 
      eq.EquipmentName?.trim() === code.trim() ||
      eq.EquipmentID?.toString().trim() === code.trim()
    );

    if (matched) {
      navigation.navigate('OEE', { 
        equipmentName: matched.EquipmentName.trim(),
        equipmentId: matched.EquipmentID
      });
    } else {
      Alert.alert('Not Found', 'No matching machine found for scanned code.');
    }
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

  const device = useCameraDevice('back');
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && codes[0].value) {
        handleScanResult(codes[0].value);
      }
    },
  });

  return (
    <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={styles.gradient}>
      <Header username={username} setIsLoggedIn={setIsLoggedIn} title='Machine' />

      {/* Scanner Modal */}
      <Modal visible={showScanner} animationType="slide">
        {!hasPermission ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>No camera permission</Text>
            <TouchableOpacity 
              style={[styles.cardButton, { marginTop: 20 }]} 
              onPress={requestPermission}
            >
              <Text style={styles.cardText}>Grant Permission</Text>
            </TouchableOpacity>
          </View>
        ) : device ? (
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={showScanner}
            codeScanner={codeScanner}
          />
        ) : (
          <ActivityIndicator size="large" />
        )}
        <TouchableOpacity 
          style={[styles.scanButton, { position: 'absolute', bottom: 40, alignSelf: 'center' }]} 
          onPress={() => setShowScanner(false)}
        >
          <Text style={styles.scanButtonText}>Close Scanner</Text>
        </TouchableOpacity>
      </Modal>

{/* QR Scanner Button */}
           {/* QR Scanner Button */}
<TouchableOpacity style={styles.scanButton} onPress={() => setShowScanner(true)}>
  <Text style={styles.scanButtonText}>📷 Scan Machine QR</Text>
</TouchableOpacity>



      <ScrollView contentContainerStyle={styles.menuContainer}>

            {/* Existing Machine List */}
            {Equipment.map((eq, index) => (
              <TouchableOpacity 
                key={eq.EquipmentID} 
                style={styles.cardButton} 
                onPress={() => handleLinePress(eq.EquipmentName.trim())}
              >
                {/* <Image source={getLineIcon(index)} style={styles.icon} /> */}
                <Text style={styles.cardText}>{eq.EquipmentName.trim()}</Text>
              </TouchableOpacity>
            ))}
      </ScrollView>
    </LinearGradient>
  );
};

export default Assembly;
