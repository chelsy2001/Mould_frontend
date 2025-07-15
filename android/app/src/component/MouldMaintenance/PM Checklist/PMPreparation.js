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
import Header from '../../Common/header/header';
import { useRoute } from '@react-navigation/native';
import styles from './PMPreparationStyle';
import { BASE_URL } from '../../Common/config/config';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PMPreparation = ({ username, setIsLoggedIn }) => {
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
        fetch(`${BASE_URL}/PMMouldPreparation/GetCheckPoints/${checklistID}`)
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
        fetch(`${BASE_URL}/PMMouldPreparation/UpdateCheckPointStatus`, {
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
    //Integrate the API to submit the list
    const handleSubmit = () => {
        fetch(`${BASE_URL}/PMMouldPreparation/SubmitPreparation`, {
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
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('PMExecution', { checklistID }),
                        },
                    ]);
                } else {
                    Alert.alert('Error', response.message || 'Failed to move to execution.');
                }
            })
            .catch(error => {
                console.error('Submit error:', error);
                Alert.alert('Error', 'Submission failed: ' + error.message);
            });
    };


    return (
        <View style={styles.container}>
            <Header username={username} title="PM Preparation" />
            <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 630, marginBottom: 30 }}>
                <View>
                    {checkpoints.map((item, index) => (
                        <View key={index} style={[
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
                                <Text style={styles.label}>Judgement Criteria</Text>
                                <TextInput style={[styles.input2, { width: 400, marginStart: '1' }]} multiline={true}
                                    numberOfLines={4} value={item.JudgementCriteria} editable={false} />

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
                                />
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


                                {/* <TouchableOpacity style={[styles.iconButton, { marginRight: 10, }]} >
                                    <Icon name="camera" size={24} color="white" />
                                </TouchableOpacity> */}
                                {item.CheckingMethod === 'Visual' && (
                                    <TouchableOpacity style={[styles.iconButton, { marginRight: 10 }]}>
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
                    // onPress={() => navigation.goBack()}
                    onPress={() => navigation.navigate('PMExecution', { checklistID })}
                >
                    <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PMPreparation;