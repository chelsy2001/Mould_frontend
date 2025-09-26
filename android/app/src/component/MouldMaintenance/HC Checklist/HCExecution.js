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
import styles from './HCExecutionStyle';
import { BASE_URL } from '../../Common/config/config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera } from 'react-native-image-picker';
import axios from 'axios';

const HCExecution = ({ username }) => {
    const route = useRoute();
    const { checklistID } = route.params;
    const [checkpoints, setCheckpoints] = useState([]);
    const [imageUri, setImageUri] = useState(null);
    const [currentCheckpoint, setCurrentCheckpoint] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        console.log('ChecklistID:', checklistID);
        fetchCheckpoints();
    }, [checklistID]);

    const fetchCheckpoints = async () => {
        try {
            const res = await fetch(`${BASE_URL}/HCMouldExecution/GetCheckPoints/${checklistID}`);
            const response = await res.json();
            if (response.status === 200) {
                const updated = response.data.map(item => ({
                    ...item,
                    ObservationInput: item.Observation ?? '',
                    isDisabled: item.Observation !== null && item.Observation !== '' && item.OKNOK !== null
                }));
                setCheckpoints(updated);
            } else {
                console.warn('API error:', response.message);
            }
        } catch (err) {
            console.error('API fetch error:', err);
        }
    };

    const updateCheckpoint = async (checkPointID, observation, oknok, index) => {
        try {
            const res = await fetch(`${BASE_URL}/HCMouldExecution/UpdateCheckPointStatus`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ CheckPointID: checkPointID, Observation: observation, OKNOK: oknok })
            });
            const response = await res.json();
            if (response.status === 200) {
                Alert.alert('Success', response.message);
                const updated = [...checkpoints];
                updated[index].isDisabled = true;
                updated[index].OKNOK = oknok;
                setCheckpoints(updated);
            } else {
                Alert.alert('Error', response.message);
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to update checkpoint');
            console.error(err);
        }
    };

    const handleEdit = index => {
        const updated = [...checkpoints];
        updated[index].isDisabled = false;
        setCheckpoints(updated);
    };

    const handleSubmit = async () => {
        try {
            const res = await fetch(`${BASE_URL}/HCMouldExecution/SubmitHCChecklist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ CheckListID: checklistID })
            });
            const response = await res.json();
            if (response.status === 200) {
                Alert.alert('Success', response.message || 'Moved to execution successfully.', [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('HCApprove', { checklistID }),
                    },
                ]);
            } else {
                Alert.alert('Error', response.message || 'Failed to move to execution.');
            }
        } catch (err) {
            console.error('Submit error:', err);
            Alert.alert('Error', 'Submission failed: ' + err.message);
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

        launchCamera({ mediaType: 'photo', quality: 0.7, saveToPhotos: true }, async response => {
            if (!response.didCancel && !response.errorCode && response.assets?.[0]?.uri) {
                const uri = response.assets[0].uri;
                setImageUri(uri);
                setCurrentCheckpoint(checkpoint);

                const fileName = `${checkpoint.CheckListID}_${checkpoint.CheckPointID}.jpg`;
                const formData = new FormData();
                formData.append('image', { uri, type: 'image/jpeg', name: fileName });

                try {
                    const uploadResponse = await axios.post(
                        `${BASE_URL}/HCMouldExecution/upload-image-to-checkpoint/${checkpoint.CheckListID}/${checkpoint.CheckPointID}`,
                        formData,
                        { headers: { 'Content-Type': 'multipart/form-data' } }
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

    const renderItem = ({ item, index }) => (
        <View
            style={[
                styles.Container1,
                item.OKNOK === 1
                    ? { backgroundColor: '#00b050' }
                    : item.OKNOK === 2
                        ? { backgroundColor: 'red' }
                        : {}
            ]}
        >
            <View style={styles.row1}>
                <Text style={styles.label}>Checklist Name</Text>
                <TextInput style={[styles.input1, { width: 400 }]} multiline value={item.CheckListName} editable={false} />

                <Text style={styles.label}>CheckPoint Name</Text>
                <TextInput style={[styles.input1, { width: 400 }]} multiline value={item.CheckPointName} editable={false} />
            </View>

            <View style={styles.row2}>
                <Text style={styles.label}>CheckPointCategory</Text>
                <TextInput style={[styles.input2, { width: 400 }]} multiline value={item.CheckPointCategory} editable={false} />

                <Text style={styles.label}>Observation</Text>
                <TextInput
                    style={[styles.input2, { width: 400 }]}
                    multiline
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

            <View style={styles.row5}>
                {item.CheckingMethod === 'Visual' && (
                    <TouchableOpacity style={[styles.iconButton, { marginRight: 10 }]} onPress={() => openCamera(item)}>
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
    );

    return (
        <View style={styles.container}>
            <Header username={username} title="Health Check Execution" />

            <FlatList
                data={checkpoints}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 100 }}
                nestedScrollEnabled
            />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, marginRight: 30 }}>
                <TouchableOpacity style={[styles.button, { marginRight: 10 }]} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HCMonitoring', { checklistID })}>
                    <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HCExecution;
