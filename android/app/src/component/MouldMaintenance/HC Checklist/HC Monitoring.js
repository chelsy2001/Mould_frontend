import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  PermissionsAndroid,
  Image
} from 'react-native';
import Header from '../../Common/header/header';
import styles from './hcMonitoringStyle';
import { BASE_URL } from '../../Common/config/config';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera } from 'react-native-image-picker';
import axios from 'axios';

const HCMonitoring = ({ username, setIsLoggedIn }) => {

  const [checklistData, setChecklistData] = useState([]);
  const navigation = useNavigation();


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

  //integrate the checklist api
  useEffect(() => {
    fetch(`${BASE_URL}/HCMouldMonitoring/HCChecklist`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          setChecklistData(data.data);
        } else {
          console.log('Error:', data.message);
        }
      })
      .catch(error => console.error('API fetch error:', error));
  }, []);


  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const openCamera = async (checkpoint) => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    launchCamera({ mediaType: 'photo', quality: 0.7, saveToPhotos: true }, async (response) => {
      if (!response.didCancel && !response.errorCode && response.assets?.[0]?.uri) {
        const uri = response.assets[0].uri;
        setImageUri(uri);
        setCurrentCheckpoint(checkpoint);

        const fileName = `${checkpoint.CheckListID}.jpg`; // ✅ Only using CheckListID now

        const formData = new FormData();
        formData.append('image', {
          uri,
          type: 'image/jpeg',
          name: fileName,
        });

        try {
          const uploadResponse = await axios.post(
            `${BASE_URL}/PMMouldMonitoring/upload-image-to-checklist/${checkpoint.CheckListID}`, // ✅ Updated endpoint
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          if (uploadResponse.status === 200 && uploadResponse.data.status === 200) {
            Alert.alert('✅ Image uploaded successfully');
          } else {
            Alert.alert('❌ Upload failed', uploadResponse.data.message || 'Unknown error');
          }
        } catch (error) {
          console.error('Upload error:', error.response?.data || error.message);
          Alert.alert('❌ Error uploading image');
        }
      }
    });
  };


  return (
    <View style={styles.container}>
      <Header username={username} title="HC Mould Monitoring" />
      <ScrollView
        nestedScrollEnabled={true}
        style={{ maxHeight: 700, marginBottom: 30, marginTop: 20 }}
      >
        {checklistData.map((item, index) => (
          <View>
            <View key={item.UID} style={[
              styles.Container1,
              item.HCStatus === 4 && { backgroundColor: '#00b050', borderColor: '#28a745', borderWidth: 1.5 }, // green background
            ]}>
              {/* <Text style={styles.boxHeader}>Checklist #{index + 1}</Text> */}

              <View style={styles.row1}>
                <Text style={styles.label}>Checklist Name</Text>
                <TextInput style={[styles.input1, { width: 280 }]} value={item.CheckListName} editable={false} />

                <Text style={styles.label}>MouldID</Text>
                <TextInput style={[styles.input1, { width: 120 }]} value={item.MouldID.toString()} editable={false} />


                <Text style={styles.label}>Mould Name</Text>
                <TextInput style={styles.input1} value={item.MouldName} editable={false} />

                <Text style={styles.label}>HCFreqCount</Text>
                <TextInput style={[styles.input1, { width: 120 }]} value={item.HCFreqCount.toString()} editable={false} />


              </View>

              <View style={styles.row2}>

                <Text style={styles.label}>HCFreqDays</Text>
                <TextInput style={[styles.input1, { width: 60, marginLeft: 38 }]} value={item.HCFreqDays.toString()} editable={false} />
                <Text style={styles.label}>HCWarningCount</Text>
                <TextInput style={[styles.input2, { width: 80 }]} value={item.HCWarningCount.toString()} editable={false} />

                <Text style={styles.label}>HCWarningDays</Text>
                <TextInput style={[styles.input2, { width: 60 }]} value={item.HCWarningDays.toString()} editable={false} />

                <Text style={styles.label}>Instance</Text>
                <TextInput style={[styles.input2, { width: 50 }]} value={item.Instance.toString()} editable={false} />

                <Text style={styles.label}>HCStatus</Text>
                <TextInput style={[styles.input2, { width: 135 }]} value={getHCStatusText(item.HCStatus)} editable={false} />


                {item.HCStatus === 4 ? (
                  <TouchableOpacity
                    style={[styles.iconButton, { marginRight: 10 }]}
                    onPress={() => openCamera(item)}
                  >
                    <Icon name="camera" size={24} color="white" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.iconButton, { marginRight: 10, backgroundColor: '#ccc' }]}
                    disabled={true}
                  >
                    <Icon name="camera" size={24} color="#666" />
                  </TouchableOpacity>
                )}

                {item.HCStatus === 4 ? (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate('HCExecution', { checklistID: item.CheckListID })
                    }
                  >
                    <Text style={styles.buttonText}>Execute</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#ccc' }]} // Greyed out style
                    disabled={true}
                  >
                    <Text style={[styles.buttonText, { color: '#666' }]}>Execute</Text>
                  </TouchableOpacity>
                )}

              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default HCMonitoring;