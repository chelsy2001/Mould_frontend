import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Animated
} from 'react-native';
import { launchCamera } from "react-native-image-picker";
import axios from "axios";
import { PermissionsAndroid, Platform, Image } from "react-native";
import Header from '../../Common/header/header';
import { useRoute } from '@react-navigation/native';
import styles from './PMExecutionStyle';
import { BASE_URL } from '../../Common/config/config';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const PMExecution = ({ username, setIsLoggedIn }) => {
    const route = useRoute();
    const { checklistID } = route.params;
    const [checkpoints, setCheckpoints] = useState([]);
      const [imageUri, setImageUri] = useState(null);
    const navigation = useNavigation();
    //fetch the PM Execution data  
    useEffect(() => {
        fetch(`${BASE_URL}/PMMouldExecution/GetExecuteCheckPoints/${checklistID}`)
            .then(res => res.json())
            .then(response => {
                if (response.status === 200) {
                    // setCheckpoints(response.data);
                    const updatedData = response.data.map(item => ({
                        ...item,
                        ObservationInput: item.Observation ?? '',
                        isDisabled: item.Observation !== null && item.Observation !== '' && item.OKNOK !== null
                    }));
                    setCheckpoints(updatedData);
                } else {
                    console.warn('API error:', response.message);
                }
            })
            .catch(err => console.error('API fetch error:', err));
    }, [checklistID]);
    // Handle update API call
    const updateCheckpoint = (checkPointID, observation, oknok, index) => {
        fetch(`${BASE_URL}/PMMouldExecution/ExecuteUpdateCheckPointStatus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                CheckPointID: checkPointID,
                Observation: observation,
                OKNOK: oknok // 1 for OK, 2 for NOK
            })
        })
            .then(res => res.json())
            .then(response => {
                if (response.status === 200) {
                    Alert.alert('Success', response.message);
                    const updated = [...checkpoints];
                    updated[index].isDisabled = true; // disable after update
                    updated[index].OKNOK = oknok;
                    setCheckpoints(updated);
                } else {
                    Alert.alert('Error', response.message);
                }
            })
            .catch(err => {
                Alert.alert('Error', 'Failed to Update Checkpoint');
                console.error(err);
            });
    };
    const handleEdit = (index) => {
        const updated = [...checkpoints];
        updated[index].isDisabled = false; // enable again for editing
        setCheckpoints(updated);
    };
    //Integrate the API to submit the list
    const handleSubmit = () => {
        fetch(`${BASE_URL}/PMMouldExecution/SubmitPMChecklist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ CheckListID: checklistID })
        })
            .then(res => res.json())
            .then(response => {
                if (response.status === 200) {
                    Alert.alert('Success', response.message || 'Moved to execution successfully.', [
                        // You can navigate or refresh data here if needed
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('PMApprove', { checklistID }), // Pass checklistID if needed
                        },])
                } else {
                    Alert.alert('Error', response.message || 'Failed to Move to Execution.');
                }
            })
            .catch(error => {
                console.error('Submit error:', error);
                Alert.alert('Error', 'Submission failed: ' + error.message);
            });
    };

    // Ask for camera permission
 // Camera permissions
    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    { title: 'Camera Permission', message: 'App needs access to your camera', buttonPositive: 'OK' }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) { console.warn(err); return false; }
        }
        return true;
    };

// Open camera and upload image
  const openCamera = async (checkpoint) => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    launchCamera({ mediaType: 'photo', quality: 0.7, saveToPhotos: true }, async (response) => {
        if (!response.didCancel && !response.errorCode && response.assets?.[0]?.uri) {
            const uri = response.assets[0].uri;
            setImageUri(uri);

            const fileName = `${checkpoint.CheckListID}_${checkpoint.CheckPointID}.jpg`;
            const formData = new FormData();
            formData.append("image", {
                uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
                type: "image/jpeg",
                name: fileName
            });

            try {
                const uploadResponse = await axios.post(
  `${BASE_URL}/PMMouldExecution/upload-image-to-checkpoint/${checklistID}/${checkpoint.CheckPointID}`,
  formData,
  { headers: { "Content-Type": "multipart/form-data" }, timeout: 10000 }
);

                if (uploadResponse.data.status === 200) {
                    // Alert.alert('✅ Image uploaded successfully');
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
    <Header username={username} title="Preventive Maintenance Execution" />

    <FlatList
      data={checkpoints}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ paddingBottom: 80 , marginTop: 20 }}
      renderItem={({ item, index }) => (
        <View
          key={index}
          style={[
            styles.Container1,
            item.OKNOK === 1
              ? { backgroundColor: '#00b050' }
              : item.OKNOK === 2
                ? { backgroundColor: 'red' }
                : {}
          ]}
        >
          {/* Row 1 */}
          <View style={styles.row1}>
            <Text style={styles.label}>Checklist Name</Text>
            <TextInput
              style={[styles.input1, { width: 400 }]}
              multiline
              numberOfLines={4}
              value={item.CheckListName}
              editable={false}
            />

            <Text style={styles.label}>CheckPoint Name</Text>
            <TextInput
              style={[styles.input1, { width: 400 }]}
              multiline
              numberOfLines={4}
              value={item.CheckPointName}
              editable={false}
            />
          </View>

          {/* Row 2 */}
          <View style={styles.row2}>
            <Text style={styles.label}>Judgement Criteria</Text>
            <TextInput
              style={[styles.input2, { width: 400 }]}
              multiline
              numberOfLines={4}
              value={item.JudgementCriteria}
              editable={false}
            />

            <Text style={styles.label}>Observation</Text>
            <TextInput
              style={[styles.input2, { width: 400 }]}
              multiline
              numberOfLines={4}
              value={item.ObservationInput}
              editable={!item.isDisabled}
              onChangeText={text => {
                const updated = [...checkpoints];
                updated[index].ObservationInput = text;
                setCheckpoints(updated);
              }}
              placeholder="Enter observation"
              placeholderTextColor="#A9A9A9"
            />
          </View>

          {/* Row 4 */}
          <View style={styles.row4}>
            <Text style={styles.label}>CheckPointItems</Text>
            <TextInput style={[styles.input4, { width: 150 }]} value={item.CheckPointItems} editable={false} />
            <Text style={styles.label}>CheckPointArea</Text>
            <TextInput style={[styles.input4, { width: 150 }]} value={item.CheckPointArea} editable={false} />
            <Text style={styles.label}>CheckingMethod</Text>
            <TextInput style={[styles.input4, { width: 150 }]} value={item.CheckingMethod} editable={false} />
            <Text style={styles.label}>CheckArea</Text>
            <TextInput style={[styles.input4, { width: 150 }]} value={item.CheckArea} editable={false} />
          </View>

          {/* Row 6 */}
          <View style={styles.row4}>
            <Text style={styles.label}>CheckPointValue</Text>
            <TextInput style={[styles.input4, { width: 100 }]} value={item.CheckPointValue?.toString() || ''} editable={false} />
            <Text style={styles.label}>UpperLimit</Text>
            <TextInput style={[styles.input4, { width: 100 }]} value={item.UpperLimit?.toString() || ''} editable={false} />
            <Text style={styles.label}>LowerLimit</Text>
            <TextInput style={[styles.input4, { width: 100 }]} value={item.LowerLimit?.toString() || ''} editable={false} />
            <Text style={styles.label}>Standard</Text>
            <TextInput style={[styles.input4, { width: 100 }]} value={item.Standard?.toString() || ''} editable={false} />
            <Text style={styles.label}>UOM</Text>
            <TextInput style={[styles.input4, { width: 100 }]} value={item.UOM} editable={false} />
          </View>

          {/* Row 5 */}
          <View style={styles.row5}>
           {item.CheckingMethod === 'Visual' && (
                    <TouchableOpacity
                        style={[styles.iconButton, { marginRight: 10 }]}
                        onPress={() => openCamera(item)}
                    >
                        <Icon name="camera" size={24} color="white" />
                    </TouchableOpacity>
                )}
            <TouchableOpacity
              style={[styles.button, { marginRight: 10, opacity: item.isDisabled ? 0.5 : 1 }]}
              onPress={() => !item.isDisabled && updateCheckpoint(item.CheckPointID, item.ObservationInput, 1, index)}
              disabled={item.isDisabled}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { marginRight: 10, opacity: item.isDisabled ? 0.5 : 1 }]}
              onPress={() => !item.isDisabled && updateCheckpoint(item.CheckPointID, item.ObservationInput, 2, index)}
              disabled={item.isDisabled}
            >
              <Text style={styles.buttonText}>NOK</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => handleEdit(index)}>
              <Icon name="square-edit-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    />

    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginRight: 30 }}>
      <TouchableOpacity style={[styles.button, { marginRight: 10 }]} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PMPreparation', { checklistID })}
      >
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
);
};

export default PMExecution;