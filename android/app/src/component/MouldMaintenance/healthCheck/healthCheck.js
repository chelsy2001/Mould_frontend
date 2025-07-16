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

const HealthCheck = ({ username,setIsLoggedIn }) => {
  const navigation = useNavigation();
  const [mouldid, setMouldid] = useState(''); 
  const [mouldData, setMouldData] = useState(null);
  const [error, setError] = useState(''); 
  const MouldScan = useRef(null);
  const [imageUri, setImageUri] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

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

 const uploadImage = async () => {
      if (!imageUri || !mouldid) {
        console.log("No image or mould ID to upload.");
        return;
      }
    
      const fileName = `${mouldid}_photo.jpg`;
    
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: fileName,
      });
      console.log('test',formData)
    
      try {
        console.log("📤 Uploading to:", `${BASE_URL}/image/upload-image/${mouldid}`);
        const response = await fetch(`${BASE_URL}/image/upload-image/${mouldid}`, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    
        if (response.ok) {
          console.log("✅ Image uploaded successfully.");
        } else {
          const errorText = await response.text();
          console.error("❌ Image upload failed:", errorText);
          Alert.alert("Upload Failed", "Unable to upload image to server.");
        }
      } catch (error) {
        console.error("❌ Error uploading image:", error);
        Alert.alert("Error", "Image upload error.");
      }
    };


  useEffect(() => {
    // Focus on the Mould scan input when the screen loads
    if (MouldScan.current) {
      MouldScan.current.focus();
    }
    
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
  }, []);

  // Function to fetch mould details based on mouldid
  const fetchMouldData = (id) => {
    const apiUrl = `${BASE_URL}/mould/details/${id}`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.status === 200 && data.data.length > 0) {
          const mouldDetail = data.data[0]; // Get the first mould detail object
          setMouldData(mouldDetail); // Set the mould data to display
          setError(''); // Clear any previous error

          // Check if the mouldHealthStatus is already in status 
          if (mouldDetail.MouldHealthStatus === 4) {
            Alert.alert('Info', 'In this mould health check is already started.');
            return; // Exit if this condition is met
          }

          if (mouldDetail.MouldHealthStatus === 1) {
                      Alert.alert('Info', 'We Can not start HC beacuse HC is not in warring or alarm ');
                      return;
                    }
          // if (mouldDetail.MouldStatus !== 1 || mouldDetail.MouldStatus !== 3 ) {
          //   Alert.alert('Info', 'To start Health Check, the mould needs to be in the "Mould  UnLoading and in preventive mantinace" status.');
          //   return; // Exit if this condition is met
          // }
        } else {
          setError('No mould data found.');
          setMouldData(null); // Clear previous data
        }
      })
      .catch(err => {
        console.log('API fetch error:', err);
        setError('Failed to fetch data from the server.');
        setMouldData(null); // Clear previous data
      });
  };

  // Function to handle the Confirm button click and update the mould status
const handleConfirm = async () => {
  if (!mouldData || !mouldid) {
    Alert.alert('Error', 'Please fetch mould data before confirming.');
    return;
  }

  // Prevent updating if the status is already 4 (in health check confirmation)
  if (mouldData.MouldHealthStatus === 4) {
    Alert.alert('Info', 'This mould is already in health check confirmation.');
    return;
  }

  // Ensure the mould is either in status 1 or 3 to start Health Check
  if (mouldData.MouldStatus === 3) {
    Alert.alert('Info', 'Mould is in preventive mantinenace we can not start helath check for this mould');
    return;
  }

  const data = {
    MouldID: mouldid,
    MouldHealthStatus: 4, // Updating the status to 4 (in progress)
  };

  try {
    const response = await axios.patch(`${BASE_URL}/hc/update`, data);
    if (response.status === 200) {
      console.log("✅ Mould loaded successfully. Now uploading image...");
             
                       await uploadImage(); 
                       Alert.alert('Success', 'Machine ready to operate', [
                         { text: 'OK', onPress: () => navigation.navigate('Home') },
                       ]);
      setMouldData((prev) => ({ ...prev, MouldHealthStatus: 4 })); // Update local state
    } else {
      Alert.alert('Error', 'Failed to start Health Check.');
    }
  } catch (error) {
    console.error('Error updating mould status:', error);
    Alert.alert('Error', 'Error updating Health Check status. Please try again.');
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
       } else {
         return true;
       }
     };
   
     const openCamera = async () => {
       const hasPermission = await requestCameraPermission();
       if (!hasPermission) {
         Alert.alert('Permission Denied', 'Camera permission is required');
         return;
       }
     
       const options = {
         mediaType: 'photo',
         quality: 0.7,
         saveToPhotos: true,
       };
     
       launchCamera(options, (response) => {
         if (response.didCancel) {
           console.log('Camera cancelled');
         } else if (response.errorCode) {
           console.error('Camera error: ', response.errorMessage);
         } else {
           const uri = response.assets[0].uri;
           const name = response.assets[0].fileName;
   const type = response.assets[0].type;
           setImageUri(uri,name,type);
         }
       });
     };
     
     
     const openGallery = () => {
       const options = {
         mediaType: 'photo',
         quality: 0.7,
       };
     
       launchImageLibrary(options, (response) => {
         if (response.didCancel) {
           console.log('Gallery cancelled');
         } else if (response.errorCode) {
           console.error('Gallery error: ', response.errorMessage);
         } else {
           const uri = response.assets[0].uri;
           const name = response.assets[0].fileName;
   const type = response.assets[0].type;
           setImageUri(uri,name,type);
         }
       });
     }; 

  // useEffect to fetch data whenever mouldid changes
  useEffect(() => {
    if (mouldid) {
      fetchMouldData(mouldid); // Fetch data only if mouldid is not empty
    } else {
      setMouldData(null); // Clear mould data if input is empty
    }
  }, [mouldid]);

  return (
    <View style={styles.container}>
      <Header username={username} title = 'Health Check Screen' />

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

      <ScrollView contentContainerStyle={{ paddingBottom: 30 ,paddingRight:30,paddingLeft:30}} showsVerticalScrollIndicator={false}>


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
          
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Status</Text>
              <Text style={styles.dataValue}>{getMouldStatusText(mouldData.MouldStatus)}</Text>
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
              <Text style={styles.confirmText}>CONFIRM</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={openCamera}>
              <Icon name="camera" size={24} color="white" />
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.iconButton} onPress={openGallery}>
              <Icon name="image" size={24} color="white" />
            </TouchableOpacity> */}
          </View>
           </ScrollView>
        </Animated.View>
     
    </View>
  );
};

export default HealthCheck;
