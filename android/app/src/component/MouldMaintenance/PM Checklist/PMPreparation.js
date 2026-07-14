import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    FlatList,
    Platform,
    PermissionsAndroid
} from 'react-native';
import Header from '../../Common/header/header';
import { useRoute, useNavigation } from '@react-navigation/native';
import styles from './PMPreparationStyle';
import { BASE_URL } from '../../Common/config/config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera } from 'react-native-image-picker';
import axios from 'axios';

const PMPreparation = ({ username }) => {
    const route = useRoute();
    const navigation = useNavigation();
    const checklistID = route?.params?.checklistID || route?.params?.CheckListID || null;
    const instance = route?.params?.instance || route?.params?.Instance || 0;
    const mouldID = route?.params?.mouldID || route?.params?.MouldID || null;
    console.log("ChecklistID:", checklistID);
    console.log("Instance:", instance);
    const [checkpoints, setCheckpoints] = useState([]);
    const [imageUri, setImageUri] = useState(null);
    const [currentCheckpoint, setCurrentCheckpoint] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false); 

    // Fetch checkpoints on component mount
    useEffect(() => {
        fetch(`${BASE_URL}/PMMouldPreparation/GetCheckPoints/${checklistID}/${mouldID}`)
            .then(res => res.json())
            .then(response => {
                if (response.status === 200) {
                    const updatedData = response.data.map(item => ({
                        ...item,
                        ObservationInput: item.Observation ?? '',
                        isDisabled: item.Observation !== null && item.Observation !== '' && item.OKNOK !== null
                    }));
                    setCheckpoints(updatedData);

                    const allDone = updatedData.every(cp => cp.isDisabled);
                    setIsSubmitted(allDone);
                } else {
                    console.warn('API error:', response.message);
                }
            })
            .catch(err => console.error('API fetch error:', err));
    }, [checklistID, mouldID]);

    // Update checkpoint OK/NOK status
    const updateCheckpoint = (checkPointID, itemMouldID, observation, oknok, index) => {
        const payloadMouldID = itemMouldID || mouldID;
        if (!payloadMouldID) {
            Alert.alert('Error', 'MouldID is required to update checkpoint.');
            return;
        }

        fetch(`${BASE_URL}/PMMouldPreparation/UpdateCheckPointStatus`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ CheckPointID: checkPointID, MouldID: payloadMouldID, Observation: observation, OKNOK: oknok })
        })
        .then(res => res.json())
        .then(response => {
            if (response.status === 200) {
                Alert.alert('Success', response.message);
                const updated = [...checkpoints];
                updated[index].isDisabled = true;
                updated[index].OKNOK = oknok;
                setCheckpoints(updated);

                const allDone = updated.every(cp => cp.isDisabled);
                setIsSubmitted(allDone);
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
        updated[index].isDisabled = false;
        setCheckpoints(updated);
    };

    const handleSubmit = () => {
        fetch(`${BASE_URL}/PMMouldPreparation/SubmitPreparation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ CheckListID: checklistID })
        })
        .then(res => res.json())
        .then(response => {
            if (response.status === 200) {
                Alert.alert('Success', response.message || 'Moved to execution successfully.', [
                    {
                        text: 'OK',
                        onPress: () =>
                            navigation.navigate('PMExecution', {
                                checklistID,
                                instance,
                                mouldID,
                            }),
                    },
                ]);
                setIsSubmitted(true);
            } else {
                Alert.alert('Error', response.message || 'Failed to move to execution.');
            }
        })
        .catch(error => {
            console.error('Submit error:', error);
            Alert.alert('Error', 'Submission failed: ' + error.message);
        });
    };

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
                setCurrentCheckpoint(checkpoint);

                const fileName = `${checkpoint.CheckListID}_${checkpoint.CheckPointID}.jpg`;
                const formData = new FormData();
                formData.append("image", {
                    uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
                    type: "image/jpeg",
                    name: fileName,
                });

                try {
                    const uploadResponse = await axios.post(
  `${BASE_URL}/PMMouldPreparation/upload-image-to-checkpoint/${checklistID}/${checkpoint.CheckPointID}/${instance}`,
  formData,
  { headers: { "Content-Type": "multipart/form-data" } }
);

                    if (uploadResponse.status === 200 && uploadResponse.data.status === 200) {
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

    const renderItem = ({ item, index }) => (
        <View style={[
            styles.Container1,
            item.OKNOK === 1 ? { backgroundColor: '#00b050' } :
            item.OKNOK === 2 ? { backgroundColor: 'red' } : {}
        ]}>
            {/* Row 1 */}
            <View style={styles.row1}>
                <Text style={styles.label}>Checklist Name</Text>
                <TextInput style={[styles.input1, { width: 200 }]} multiline numberOfLines={4}
                    value={item.CheckListName} editable={false} />
                <Text style={styles.label}>CheckPoint Name</Text>
                <TextInput style={[styles.input1, { width: 200 }]} multiline numberOfLines={4}
                    value={item.CheckPointName} editable={false} />
                    <Text style={styles.label}>MouldID</Text>
                <TextInput style={[styles.input1, { width: 200 }]} multiline numberOfLines={4}
                    value={item.MouldID} editable={false} />
            </View>

            {/* Row 2 */}
            <View style={styles.row2}>
                <Text style={styles.label}>Judgement Criteria</Text>
                <TextInput style={[styles.input2, { width: 400 }]} multiline numberOfLines={4}
                    value={item.JudgementCriteria} editable={false} />
                <Text style={styles.label}>Observation & Action</Text>
                <TextInput
                    style={[styles.input2, { width: 400 }]}
                    multiline
                    numberOfLines={4}
                    value={item.ObservationInput}
                    editable={!item.isDisabled}
                    placeholder="Enter observation"
                    placeholderTextColor="#A9A9A9"
                    onChangeText={text => {
                        const updated = [...checkpoints];
                        updated[index].ObservationInput = text;
                        setCheckpoints(updated);
                    }}
                />
            </View>

            {/* Row 4 */}
            <View style={styles.row4}>
                <Text style={styles.label}>CheckPointItems</Text>
                <TextInput style={[styles.input4, { width: 150 }]} multiline numberOfLines={4}
                    value={item.CheckPointItems} editable={false} />
                <Text style={styles.label}>CheckPointArea</Text>
                <TextInput style={[styles.input4, { width: 150 }]} multiline numberOfLines={4}
                    value={item.CheckPointArea} editable={false} />
                <Text style={styles.label}>CheckingMethod</Text>
                <TextInput style={[styles.input4, { width: 150 }]} multiline numberOfLines={4}
                    value={item.CheckingMethod} editable={false} />
                <Text style={styles.label}>CheckArea</Text>
                <TextInput style={[styles.input4, { width: 150 }]} multiline numberOfLines={4}
                    value={item.CheckArea} editable={false} />
            </View>

            {/* Row 5 Buttons */}
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
                    onPress={() => !item.isDisabled && updateCheckpoint(item.CheckPointID, item.MouldID, item.ObservationInput, 1, index)}
                    disabled={item.isDisabled}
                >
                    <Text style={styles.buttonText}>OK</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { marginRight: 10, opacity: item.isDisabled ? 0.5 : 1 }]}
                    onPress={() => !item.isDisabled && updateCheckpoint(item.CheckPointID, item.MouldID, item.ObservationInput, 2, index)}
                    disabled={item.isDisabled}
                >
                    <Text style={styles.buttonText}>NOK</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton} onPress={() => handleEdit(index)}>
                    <Icon name="square-edit-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Header username={username} title="Preventive Maintenance Preparation" />

            <FlatList
                data={checkpoints}
                keyExtractor={(item) => item.UID.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 30, marginTop: 20 }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: -20, marginRight: 30 }}>
                {!isSubmitted ? (
                    <TouchableOpacity style={[styles.button, { marginRight: 10 }]} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.button, { marginRight: 10 }]}
                        onPress={() =>
                            navigation.navigate('PMExecution', {
                                checklistID,
                                instance,
                                mouldID,
                            })
                        }
                    >
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('PMPreparation', {
                        checklistID: checklistID,
                        mouldID: mouldID,
                    })}
                >
                    <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PMPreparation;