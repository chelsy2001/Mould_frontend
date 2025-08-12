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
import { useRoute } from '@react-navigation/native';
import styles from './HCExecutionStyle';
import { BASE_URL } from '../../Common/config/config';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera } from 'react-native-image-picker';
import axios from 'axios';


const HCExecution = ({ username, setIsLoggedIn }) => {
    const route = useRoute();
    const { checklistID } = route.params;
    const [checkpoints, setCheckpoints] = useState([]);

    const [imageUri, setImageUri] = useState(null);
    const [currentCheckpoint, setCurrentCheckpoint] = useState(null);


    const navigation = useNavigation();


    useEffect(() => {
        console.log('Received checklistID:', checklistID);
        // You can now fetch or use checklistID as needed
    }, [checklistID]);
    //fetch the HC Execution Data
    useEffect(() => {
        fetch(`${BASE_URL}/HCMouldExecution/GetCheckPoints/${checklistID}`)
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
        fetch(`${BASE_URL}/HCMouldExecution/UpdateCheckPointStatus`, {
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
                Alert.alert('Error', 'Failed to update checkpoint');
                console.error(err);
            });
    };

    const handleEdit = (index) => {
        const updated = [...checkpoints];
        updated[index].isDisabled = false; // enable again for editing
        setCheckpoints(updated);
    };
    const handleSubmit = () => {
        fetch(`${BASE_URL}/HCMouldExecution/SubmitHCChecklist`, {
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
                            onPress: () => navigation.navigate('HCApprove', { checklistID }), // Pass checklistID if needed
                        },])
                } else {
                    Alert.alert('Error', response.message || 'Failed to move to execution.');
                }
            })
            .catch(error => {
                console.error('Submit error:', error);
                Alert.alert('Error', 'Submission failed: ' + error.message);
            });
    };

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

                const fileName = `${checkpoint.CheckListID}_${checkpoint.CheckPointID}.jpg`;
                const formData = new FormData();
                formData.append('image', {
                    uri,
                    type: 'image/jpeg',
                    name: fileName,
                });

                try {
                    const uploadResponse = await axios.post(
                        `${BASE_URL}/HCMouldExecution/upload-image-to-checkpoint/${checkpoint.CheckListID}/${checkpoint.CheckPointID}`,
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
            <Header username={username} title="HC Execution" />
            <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 630, marginBottom: 30, marginTop: 20 }}>
                <View>
                    {checkpoints.map((item, index) => (
                        <View key={index}
                            style={[
                                styles.Container1,
                                item.OKNOK === 1
                                    ? { backgroundColor: '#00b050' } // Green background for OK
                                    : item.OKNOK === 2
                                        ? { backgroundColor: 'red' } // Red background for NOK
                                        : {}
                            ]}>
                            <View style={styles.row1}>
                                <Text style={styles.label}>Checklist Name</Text>
                                <TextInput style={[styles.input1, { width: 400 }]} multiline={true}
                                    numberOfLines={4} value={item.CheckListName} editable={false} />

                                <Text style={styles.label}>CheckPoint Name</Text>
                                <TextInput style={[styles.input1, { width: 400 },]} multiline={true}
                                    numberOfLines={4} value={item.CheckPointName} editable={false} />
                            </View>

                            <View style={styles.row2}>
                                <Text style={styles.label}>CheckPointCategory</Text>
                                <TextInput style={[styles.input2, { width: 400, marginStart: '-10' }]} multiline={true}
                                    numberOfLines={4} value={item.CheckPointCategory} editable={false} />

                                <Text style={styles.label}>Observation</Text>

                                <TextInput
                                    style={[styles.input2, { width: 400, marginEnd: '-2' }]}
                                    multiline={true}
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

                            <View style={styles.row4}>
                                <Text style={styles.label}>StandardCondition</Text>
                                <TextInput style={[styles.input4, { width: 150 }]} multiline={true}
                                    numberOfLines={4} value={item.StandardCondition} editable={false} />

                                <Text style={styles.label}>CheckPointType</Text>
                                <TextInput style={[styles.input4, { width: 150 }]} multiline={true}
                                    numberOfLines={4} value={item.CheckPointType} editable={false} />

                                <Text style={styles.label}>CheckingMethod</Text>
                                <TextInput style={[styles.input4, { width: 150 }]} multiline={true}
                                    numberOfLines={4} value={item.CheckingMethod} editable={false} />

                                <Text style={styles.label}>CheckArea</Text>
                                <TextInput style={[styles.input4, { width: 150 }]} multiline={true}
                                    numberOfLines={4} value={item.CheckArea} editable={false} />
                            </View>
                            {/* edit later row 6*/}
                            <View style={styles.row4}>

                                <Text style={styles.label}>CheckPointValue</Text>
                                <TextInput style={[styles.input4, { width: 100 }]} multiline={true}
                                    numberOfLines={4} value={item.CheckPointValue?.toString() || ''} editable={false} />
                                <Text style={styles.label}>UpperLimit</Text>
                                <TextInput style={[styles.input4, { width: 100 }]} multiline={true}
                                    numberOfLines={4} value={item.UpperLimit?.toString() || ''} editable={false} />

                                <Text style={styles.label}>LowerLimit</Text>
                                <TextInput style={[styles.input4, { width: 100 }]} multiline={true}
                                    numberOfLines={4} value={item.LowerLimit?.toString() || ''} editable={false} />

                                <Text style={styles.label}>Standard</Text>
                                <TextInput style={[styles.input4, { width: 100 }]} multiline={true}
                                    numberOfLines={4} value={item.Standard?.toString() || ''} editable={false} />

                                <Text style={styles.label}>UOM</Text>
                                <TextInput style={[styles.input4, { width: 100 }]} multiline={true}
                                    numberOfLines={4} value={item.UOM} editable={false} />
                            </View>
                            <View style={styles.row5}>
                                {/* <TouchableOpacity style={[styles.iconButton, { marginRight: 10, }]} >
                                    <Icon name="camera" size={24} color="white" />
                                </TouchableOpacity> */}
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

                                <TouchableOpacity style={[styles.button, { marginRight: 10, opacity: item.isDisabled ? 0.5 : 1 }]}
                                    onPress={() => !item.isDisabled && updateCheckpoint(item.CheckPointID, item.ObservationInput, 2, index)}
                                    disabled={item.isDisabled}><Text style={styles.buttonText}>NOK</Text></TouchableOpacity>
                                <TouchableOpacity style={styles.iconButton} onPress={() => handleEdit(index)}>
                                    {/* <Text style={styles.buttonText}>Edit</Text> */}
                                    <Icon name="square-edit-outline" size={24} color="white"></Icon>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: -20, marginRight: 30 }}>
                <TouchableOpacity style={[styles.button, { marginRight: 10 }]}
                    onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button}
                    //  onPress={() => navigation.goBack()}
                    onPress={() => navigation.navigate('HCMonitoring', { checklistID })}
                >
                    <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};
export default HCExecution;