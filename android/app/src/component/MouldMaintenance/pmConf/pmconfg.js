import React, { useState, useEffect ,useRef} from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Animated, Easing } from 'react-native';
import Header from '../../Common/header/header';
import axios from 'axios'; 
import styles from './style';
import { BASE_URL } from '../../Common/config/config';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Image} from 'react-native';
import { PermissionsAndroid, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PmConfig = ({ username ,setIsLoggedIn}) => {
  const navigation = useNavigation();
  const [mouldid, setMouldid] = useState('');
  const [mouldData, setMouldData] = useState(null);
  const [error, setError] = useState('');
  const MouldScan = useRef(null);
  const [imageUri, setImageUri] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (MouldScan.current) MouldScan.current.focus();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  const getMouldStatusText = (status) => {
    switch (status) {
      case 1:
        return 'Normal';
      case 2:
        return 'Mould Loading';
      case 3:
        return 'Preventive Maintenance Start';
      case 4:
        return 'Breakdown';
      case 5:
        return 'Mould in Health Check';
      case 6:
        return 'Not in Use';
      default:
        return 'Unknown Status';
    }
  };

  const getPMStatusText = (pmStatus) => {
    switch (pmStatus) {
      case 1:
        return 'PM Not Started';
      case 2:
        return 'PM Warring';
      case 3:
        return 'PM Alarm';
      case 4:
        return 'PM in Prepration';
      case 5:
        return 'PM in MainExcution';
      case 6:
        return 'waiting for approval';
        case 7:
          return 'Approived';
      case 8:
        return 'PM Due';
      default:
        return 'Unknown Status';
    }
  };

  const getHCStatusText = (hcStatus) => {
    switch (hcStatus) {
      case 1:
        return 'HC Not Started';
      case 2:
        return 'HC Warring';
      case 3:
        return 'HC Alarm';
      case 4:
        return 'HC in Prepration';
      case 5:
        return 'waiting for approval';
      case 6:
        return 'Approived';
      case 7:
        return 'HC Due';
      default:
        return 'Unknown Status';
    }
  };

  const fetchMouldData = (id) => {
    const apiUrl = `${BASE_URL}/mould/details/${id}`;

    fetch(apiUrl)
      .then(response => response.ok ? response.json() : Promise.reject('Fetch failed'))
      .then(data => {
        if (data.status === 200 && data.data.length > 0) {
          const mouldDetail = data.data[0];
          setMouldData(mouldDetail);
          setError('');
          if (mouldDetail.MouldStatus === 3) {
            Alert.alert('Info', 'This mould is already in Preventive Maintenance.');
            return;
          }
          if (mouldDetail.MouldStatus !== 1) {
            Alert.alert('Info', 'To start preventive maintenance, the mould must be "Mould UnLoaded".');
            return;
          }
          if (mouldDetail.MouldPMStatus === 1) {
            Alert.alert('Info', 'We Can not start pm beacuse Pm is not in warring ,alarm or Due state.'); 
            return;
          }
        } else {
          setError('No mould data found.');
          setMouldData(null);
        }
      })
      .catch(err => {
        console.error('API fetch error:', err);
        setError('Failed to fetch data from the server.');
        setMouldData(null);
      });
  };

  const uploadImage = async () => {
    if (!imageUri || !mouldid) return;

    const fileName = `${mouldid}_photo.jpg`;
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: fileName,
    });

    try {
      const response = await fetch(`${BASE_URL}/image/upload-image/${mouldid}`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!response.ok) throw new Error(await response.text());
    } catch (error) {
      Alert.alert("Upload Failed", error.message);
    }
  };

  const handleConfirm = async () => {
    if (!mouldData || !mouldid) {
      Alert.alert('Error', 'Please fetch mould data first.');
      return;
    }

    if (mouldData.MouldStatus === 3) {
      Alert.alert('Info', 'This mould is already in Preventive Maintenance.');
      return;
    }

    if (mouldData.MouldStatus !== 1) {
      Alert.alert('Info', 'Mould must be in Unloading state  to start PM.');
      return;
    }

    const data = { MouldID: mouldid, MouldStatus: 3 };

    try {
      const response = await axios.patch(`${BASE_URL}/pm/update`, data);
      if (response.status === 200) {
        await uploadImage();
        Alert.alert('Success', 'Machine ready for operation.', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]);
        setMouldData(prev => ({ ...prev, MouldStatus: 3 ,}));
      } else {
        Alert.alert('Error', 'Failed to update mould status.');
      }
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Could not update mould status.');
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };
  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    launchCamera({ mediaType: 'photo', quality: 0.7, saveToPhotos: true }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  useEffect(() => {
    if (mouldid) fetchMouldData(mouldid);
    else setMouldData(null);
  }, [mouldid]);

  return (
    <View style={styles.container}>
      <Header username={username} title="Preventive Maintenance Screen" setIsLoggedIn={setIsLoggedIn}/>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 ,paddingRight:30,paddingLeft:30}} showsVerticalScrollIndicator={false}>

        <Animated.View style={{ flex:1 ,opacity: fadeAnim }}>
          <View style={styles.inputContainer}>
          <View style={{flexDirection:'row'}}>
        <Text style={styles.label}>Mould Scan</Text>
        <Icon name="qrcode-scan" size={20} color="#666" style={styles.icon} />
        </View>
            <TextInput
              style={styles.input}
              ref={MouldScan}
              placeholder="Enter Mould ID"
              value={mouldid}
              onChangeText={setMouldid}
              returnKeyType="done"
              onSubmitEditing={() => MouldScan.current.blur()}
              blurOnSubmit={false}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {mouldData && (
            <View style={styles.mouldData}>
            <Text style={styles.label}>🛠️ Mould Details</Text>
          
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>ID</Text>
              <Text style={styles.dataValue}>{mouldData.MouldID}</Text>
            </View>
            <View style={styles.separator} />
          
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Name</Text>
              <Text style={styles.dataValue}>{mouldData.MouldName}</Text>
            </View>
            <View style={styles.separator} />
          
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Description</Text>
              <Text style={styles.dataValue}>{mouldData.MouldDesc}</Text>
            </View>
            <View style={styles.separator} />

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Life</Text>
              <Text style={styles.dataValue}>{mouldData.MouldLife}</Text>
            </View>
            <View style={styles.separator} />
          
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Actual Life</Text>
              <Text style={styles.dataValue}>{mouldData.MouldActualLife}</Text>
            </View>
            <View style={styles.separator} />
          
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Storage</Text>
              <Text style={styles.dataValue}>{mouldData.MouldStorageLoc}</Text>
            </View>
            <View style={styles.separator} />
          
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Machine ID</Text>
              <Text style={styles.dataValue}>{mouldData.MachineID}</Text>
            </View>
            <View style={styles.separator} />
          
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Next PM</Text>
              <Text style={styles.dataValue}>{mouldData.NextPMDue}</Text>
            </View>
            <View style={styles.separator} />
          
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>HC Threshold</Text>
              <Text style={styles.dataValue}>{mouldData.HealthCheckThreshold}</Text>
            </View>
            <View style={styles.separator} />
          
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Mould Status</Text>
              <Text style={styles.dataValue}>{getMouldStatusText(mouldData.MouldStatus)}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Mould PMStatus</Text>
              <Text style={styles.dataValue}>{getPMStatusText(mouldData.MouldPMStatus)}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Mould Health Status</Text>
              <Text style={styles.dataValue}>{getHCStatusText(mouldData.MouldHealthStatus)}</Text>
            </View>
            {/* <Text style={{color:'black'}}>Status: {getMouldStatusText(mouldData.MouldStatus)}</Text> */}
          
            {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}
          </View>
          
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[
    styles.confirmButton,
    { backgroundColor: imageUri ? '#2980b9' : '#888' } // Disable-style when no image
  ]}
  onPress={handleConfirm}
  disabled={!imageUri}>
              <Icon name="check-circle" size={24} color="#fff" />
              <Text style={styles.confirmText} >CONFIRM</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={openCamera}>
              <Icon name="camera" size={24} color="white" />
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.iconButton} onPress={openGallery}>
              <Icon name="image" size={24} color="white" />
            </TouchableOpacity> */}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default PmConfig;
