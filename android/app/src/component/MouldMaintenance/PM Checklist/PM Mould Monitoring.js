import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  PermissionsAndroid,
  Image,
} from 'react-native';
import Header from '../../Common/header/header';
import styles from './MouldMonitoringStyle';
import { BASE_URL } from '../../Common/config/config';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera } from 'react-native-image-picker';
import axios from 'axios';

const PMMouldMonitoring = ({ username }) => {
  const [checklistData, setChecklistData] = useState([]);
  const [imageUri, setImageUri] = useState(null);
  const navigation = useNavigation();

  // Fetch checklist on mount
  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const res = await fetch(`${BASE_URL}/PMMouldMonitoring/PMChecklist`);
        const data = await res.json();
        if (data.status === 200) setChecklistData(data.data);
        else console.log('Error fetching checklist:', data.message);
      } catch (err) {
        console.error('API fetch error:', err);
      }
    };
    fetchChecklist();
  }, []);

  // Convert PMStatus to text
  const getPMStatusText = (pmStatus) => {
    const statusMap = {
      1: 'PM Not Started',
      2: 'PM Warning',
      3: 'PM Alarm',
      4: 'PM in Preparation',
      5: 'PM in Execution',
      6: 'Waiting for Approval',
      7: 'Approved',
      8: 'PM Due',
    };
    return statusMap[pmStatus] || 'Unknown Status';
  };

  // Request camera permission
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

  // Open camera and upload image
  const openCamera = (checkpoint) => {
    return new Promise(async (resolve, reject) => {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert('❌ Camera permission denied');
        return reject('Camera permission denied');
      }

      launchCamera(
        { mediaType: 'photo', quality: 0.7, saveToPhotos: true },
        async (response) => {
          try {
            if (response.didCancel) return reject('User cancelled');
            if (response.errorCode) return reject(response.errorMessage);

            const asset = response.assets?.[0];
            if (!asset?.uri) return reject('No image captured');

            setImageUri(asset.uri);

            const fileName = `${checkpoint.CheckListID}_${Date.now()}.jpg`;
            const formData = new FormData();
            formData.append('image', {
              uri: asset.uri,
              type: asset.type || 'image/jpeg',
              name: fileName,
            });

            const uploadResponse = await axios.post(
              `${BASE_URL}/PMMouldMonitoring/upload-image-to-checklist/${checkpoint.CheckListID}`,
              formData,
              { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if (uploadResponse.status === 200 && uploadResponse.data.status === 200) {
              // Alert.alert('✅ Image uploaded successfully');
              resolve();
            } else {
              reject(uploadResponse.data.message || 'Unknown upload error');
            }
          } catch (err) {
            console.error('Upload error:', err.response?.data || err.message);
            Alert.alert('❌ Error uploading image', err.response?.data?.message || 'Check console');
            reject(err);
          }
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <Header username={username} title="Preventive Maintenance Monitoring" />
      <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 700, marginBottom: 30, marginTop: 20 }}>
        {checklistData.map((item) => (
          <View key={item.UID}>
            <View
              style={[
                styles.Container1,
                (item.PMStatus === 4 || item.PMStatus === 5) && {
                  backgroundColor: '#00b050',
                  borderColor: '#28a745',
                  borderWidth: 1.5,
                },
              ]}
            >
              <View style={styles.row1}>
                <Text style={styles.label}>Checklist Name</Text>
                <TextInput style={[styles.input1, { width: 200 }]} value={item.CheckListName} editable={false} />

                <Text style={styles.label}>MouldID</Text>
                <TextInput style={[styles.input1, { width: 250 }]} value={item.MouldID.toString()} editable={false} />

                <Text style={styles.label}>Mould Name</Text>
                <TextInput style={styles.input1} value={item.MouldName} editable={false} />

                <Text style={styles.label}>PMFreqCount</Text>
                <TextInput style={[styles.input1, { width: 100 }]} value={item.PMFreqCount.toString()} editable={false} />
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
                    onPress={async () => {
                      try {
                        await openCamera(item);
                      } catch (err) {
                        console.log('Camera upload error:', err);
                      }
                    }}
                  >
                    <Icon name="camera" size={24} color="white" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={[styles.iconButton, { marginRight: 10, backgroundColor: '#ccc' }]} disabled={true}>
                    <Icon name="camera" size={24} color="#666" />
                  </TouchableOpacity>
                )}

                {item.PMStatus === 4 || item.PMStatus === 5 ? (
                  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PMPreparation', { checklistID: item.CheckListID })}>
                    <Text style={styles.buttonText}>Execute</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={[styles.button, { backgroundColor: '#ccc' }]} disabled={true}>
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

export default PMMouldMonitoring;
