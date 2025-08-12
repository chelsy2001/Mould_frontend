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
import styles from './MouldMonitoringStyle';
import { BASE_URL } from '../../Common/config/config';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera } from 'react-native-image-picker';
import axios from 'axios';


const PMMouldMonitoring = ({ username, setIsLoggedIn }) => {

  const [checklistData, setChecklistData] = useState([]);
  const navigation = useNavigation();


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
        return 'PM in Execution';
      case 6:
        return 'Waiting for Approval';
      case 7:
        return 'Approved';
      case 8:
        return 'PM Due';
      default:
        return 'Unknown Status';
    }
  }

  //integrate the checklist api
  useEffect(() => {
    fetch(`${BASE_URL}/PMMouldMonitoring/PMChecklist`)
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
    //<ScrollView style={styles.container}>
    <View style={styles.container}>
      <Header username={username} title="PM Mould Monitoring" />
      <ScrollView
        nestedScrollEnabled={true}
        style={{ maxHeight: 700, marginBottom: 30, marginTop: 20 }}
      >
        {checklistData.map((item, index) => (
          <View>
            <View key={item.UID} style={[
              styles.Container1,
              (item.PMStatus === 4 || item.PMStatus === 5) && {
                backgroundColor: '#00b050',
                borderColor: '#28a745',
                borderWidth: 1.5
              }
            ]}>
              {/* <Text style={styles.boxHeader}>Checklist #{index + 1}</Text> */}

              <View style={styles.row1}>
                <Text style={styles.label}>Checklist Name</Text>
                <TextInput style={[styles.input1, { width: 280 }]} value={item.CheckListName} editable={false} />

                <Text style={styles.label}>MouldID</Text>
                <TextInput style={[styles.input1, { width: 120 }]} value={item.MouldID.toString()} editable={false} />

                <Text style={styles.label}>Mould Name</Text>
                <TextInput style={styles.input1} value={item.MouldName} editable={false} />

                <Text style={styles.label}>PMFreqCount</Text>
                <TextInput style={[styles.input1, { width: 120 }]} value={item.PMFreqCount.toString()} editable={false} />


              </View>

              <View style={styles.row2}>
                <Text style={styles.label}>PMFreqDays</Text>
                <TextInput style={[styles.input1, { width: 60, marginLeft: 37 }]} value={item.PMFreqDays.toString()} editable={false} />

                <Text style={styles.label}>PMWarningCount</Text>
                <TextInput style={[styles.input2, { width: 80 }]} value={item.PMWarningCount.toString()} editable={false} />

                <Text style={styles.label}>PMWarningDays</Text>
                <TextInput style={[styles.input2, { width: 60 }]} value={item.PMWarningDays.toString()} editable={false} />

                <Text style={styles.label}>Instance</Text>
                <TextInput style={[styles.input2, { width: 50 }]} value={item.Instance.toString()} editable={false} />

                <Text style={styles.label}>PMStatus</Text>
                <TextInput style={[styles.input2, { width: 140 }]} value={getPMStatusText(item.PMStatus)} editable={false} />

                {item.PMStatus === 4 || item.PMStatus === 5 ? (
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

                {item.PMStatus === 4 || item.PMStatus === 5 ? (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate('PMPreparation', { checklistID: item.CheckListID })
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
    //</ScrollView>
  );
};

export default PMMouldMonitoring;