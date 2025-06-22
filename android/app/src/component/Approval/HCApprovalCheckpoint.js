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
    Animated
} from 'react-native';
import Header from '../header/header';
import { useRoute } from '@react-navigation/native';
import styles from './HCApprovalCheckpointStyle';
import { BASE_URL } from '../config/config';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const HCApprovalCheckpoint = ({ username, setIsLoggedIn }) => {
    const route = useRoute();
    const { checklistID } = route.params;
    const [checkpoints, setCheckpoints] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        console.log('Received checklistID:', checklistID);
        // You can now fetch or use checklistID as needed
    }, [checklistID]);
    //fetch the PM Perartion data 
    useEffect(() => {
        fetch(`${BASE_URL}/SeperatePMApproval/GetCheckPoints/${checklistID}`)
            .then(res => res.json())
            .then(response => {
                if (response.status === 200) {
                    // setCheckpoints(response.data);
                    const updatedData = response.data.map(item => ({
                        ...item,
                        ObservationInput: item.Observation ?? '',
                        OKNOKInput: item.OKNOK ?? null,
                        isDisabled: item.Observation !== null && item.Observation !== '' && item.OKNOK !== null
                    }));
                    setCheckpoints(updatedData);
                } else {
                    console.warn('API error:', response.message);
                }
            })
            .catch(err => console.error('API fetch error:', err));
    }, [checklistID]);

    const handleUpdate = async (index) => {
        const item = checkpoints[index];

        if (!item.OKNOKInput || item.ObservationInput.trim() === '') {
            Alert.alert("Validation", "Please select OK/NOK and provide Observation before updating.");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/SeperateHCApproval/UpdateCheckPoint`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    CheckPointID: item.CheckPointID,
                    Observation: item.ObservationInput,
                    OKNOK: item.OKNOKInput
                }),
            });

            const result = await response.json();

            if (response.status === 200) {
                Alert.alert("Success", "CheckPoint updated successfully.");
                const updated = [...checkpoints];
                updated[index].isDisabled = true;
                updated[index].OKNOK = updated[index].OKNOKInput; // ← update color source value
                setCheckpoints(updated);
            } else {
                Alert.alert("Error", result.message || "Failed to update checkpoint.");
            }
        } catch (err) {
            Alert.alert("Error", "Network error: " + err.message);
        }
    };

    const handleOKNOK = (index, value) => {
        const updated = [...checkpoints];
        updated[index].OKNOKInput = value; // 1 for OK, 2 for NOK
        setCheckpoints(updated);
    };

    return (
        <View style={styles.container}>
            <Header username={username} title="HC Preparation" />
            <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 630, marginBottom: 30 }}>
                <View>
                    {checkpoints.map((item, index) => (
                        <View key={index} style={[
                            styles.Container1,
                            item.OKNOK === 1
                                ? { backgroundColor: '#00b050' }
                                : item.OKNOK === 2
                                    ? { backgroundColor: 'red' }
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
                                <Text style={styles.label}>Judgement Criteria</Text>
                                <TextInput style={[styles.input2, { width: 400, marginStart: '1' }]} multiline={true}
                                    numberOfLines={4} value={item.JudgementCriteria} editable={false} />

                                <Text style={styles.label}>Observation</Text>

                                <TextInput
                                    style={[styles.input2, { width: 250, marginEnd: '-20' ,opacity: item.isDisabled ? 0.5 : 1 }]}
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
                                />

                                <TouchableOpacity
                                    style={{
                                        width: '6%',
                                        backgroundColor: '#0059b3',
                                        paddingVertical: '4',
                                        paddingHorizontal: '4',
                                        marginRight: '-30',
                                        alignItems: 'center',
                                        opacity: item.isDisabled ? 0.5 : 1
                                    }}
                                    onPress={() => handleOKNOK(index, 1)}
                                    disabled={item.isDisabled}
                                >
                                    <Text style={styles.buttonText}>OK</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        width: '6%',
                                        backgroundColor: '#0059b3',
                                        paddingVertical: '4',
                                        paddingHorizontal: '4',
                                        alignItems: 'center',
                                        opacity: item.isDisabled ? 0.5 : 1
                                    }}
                                    onPress={() => handleOKNOK(index, 2)}
                                    disabled={item.isDisabled}
                                >
                                    <Text style={styles.buttonText}>NOK</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.row4}>
                                <Text style={styles.label}>CheckPointItems</Text>
                                <TextInput style={[styles.input4, { width: 150 }]} multiline={true}
                                    numberOfLines={4} value={item.CheckPointItems} editable={false} />

                                <Text style={styles.label}>CheckPointArea</Text>
                                <TextInput style={[styles.input4, { width: 150 }]} multiline={true}
                                    numberOfLines={4} value={item.CheckPointArea} editable={false} />

                                <Text style={styles.label}>CheckingMethod</Text>
                                <TextInput style={[styles.input4, { width: 150 }]} multiline={true}
                                    numberOfLines={4} value={item.CheckingMethod} editable={false} />

                                <Text style={styles.label}>CheckArea</Text>
                                <TextInput style={[styles.input4, { width: 150 }]} multiline={true}
                                    numberOfLines={4} value={item.CheckArea} editable={false} />
                            </View>

                            <View style={styles.row5}>
                                <TouchableOpacity
                                    style={[styles.button, { marginRight: 10, opacity: item.isDisabled ? 0.5 : 1 }]}
                                    onPress={() => handleUpdate(index)}
                                    disabled={item.isDisabled}

                                >
                                    <Text style={styles.buttonText}>Update</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.iconButton}
                                    onPress={() => {
                                        const updated = [...checkpoints];
                                        updated[index].isDisabled = false;
                                        setCheckpoints(updated);
                                    }}
                                >
                                    {/* <Text style={styles.buttonText}>Edit</Text> */}
                                    <Icon name="square-edit-outline" size={24} color="white"></Icon>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
<View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: -20, marginRight: 30 }}>
     <TouchableOpacity style={styles.button}
                    // onPress={() => navigation.goBack()}
                    onPress={() => navigation.navigate('SeperateHCApproval', { checklistID })}
                >
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
</View>
        </View>
    );
}
export default HCApprovalCheckpoint;