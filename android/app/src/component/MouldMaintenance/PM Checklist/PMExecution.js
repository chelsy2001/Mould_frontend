import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Animated
} from 'react-native';
import Header from '../../Common/header/header';
import { useRoute } from '@react-navigation/native';
import styles from './PMExecutionStyle';
import { BASE_URL } from '../../Common/config/config';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const PMExecution = ({ username, setIsLoggedIn }) => {
    const route = useRoute();
    const checklistID = route?.params?.checklistID || route?.params?.CheckListID || null;
    const instance = route?.params?.instance || route?.params?.Instance || 0;
    const mouldID = route?.params?.mouldID || route?.params?.MouldID || null;
    const [checkpoints, setCheckpoints] = useState([]);
    const navigation = useNavigation();
    //fetch the PM Execution data  
    useEffect(() => {
        fetch(`${BASE_URL}/PMMouldExecution/GetExecuteCheckPoints/${checklistID}/${mouldID}`)
            .then(res => res.json())
            .then(response => {
                if (response.status === 200) {
                    // setCheckpoints(response.data);
                    const updatedData = response.data.map(item => ({
                        ...item,
                        ObservationInput: item.Observation ?? '',
                        UpperLimitInput: '',   // ðŸ‘ˆ NEW (manual input)
                        LowerLimitInput: '',   // ðŸ‘ˆ NEW (manual input)
                        isDisabled: item.Observation !== null && item.Observation !== '' && item.OKNOK !== null  && item.UpperLimit !== 0 && item.LowerLimit !== 0
                    }));
                    setCheckpoints(updatedData);
                    console.log('Fetched checkpoints:', updatedData);
                    console.log(' Upper Limit:', updatedData.map(item => item.UpperLimitInput));
                    console.log(' Lower Limit:', updatedData.map(item => item.LowerLimitInput));
                } else {
                    console.warn('API error:', response.message);
                }
            })
            .catch(err => console.error('API fetch error:', err));
    }, [checklistID, mouldID]);
    // Handle update API call
    const updateCheckpoint = (checkPointID, itemMouldID, observation, oknok, upperLimit, lowerLimit, index) => {
        const payloadMouldID = itemMouldID || mouldID;
        if (!payloadMouldID) {
            Alert.alert('Error', 'MouldID missing for checkpoint update');
            return;
        }

        fetch(`${BASE_URL}/PMMouldExecution/ExecuteUpdateCheckPointStatus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                CheckPointID: checkPointID,
                MouldID: payloadMouldID,
                Observation: observation,
                OKNOK: oknok, // 1 for OK, 2 for NOK
                UpperLimit: upperLimit,   // NEW
                LowerLimit: lowerLimit
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
    if (!mouldID) {
      Alert.alert('Error', 'MouldID is required before submitting.');
      return;
    }

    fetch(`${BASE_URL}/PMMouldExecution/SubmitPMChecklist`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            CheckListID: checklistID,
            MouldID: mouldID,
        }),
    })
        .then(res => res.json())
        .then(response => {
            if (response.status === 200) {
                Alert.alert(
                    'Success',
                    response.message || 'PM Checklist submitted successfully.',
                    [
                        {
                            text: 'OK',
                            onPress: () =>
                                navigation.navigate('PMApprove', {
                                    checklistID,
                                    instance,
                                    mouldID,
                                }),
                        },
                    ]
                );
            } else {
                Alert.alert('Error', response.message || 'Failed to submit PM Checklist.');
            }
        })
        .catch(error => {
            console.error('Submit error:', error);
            Alert.alert('Error', 'Submission failed: ' + error.message);
        });
};

    return (
        <View style={styles.container}>
            <Header username={username} title="PM Execution" />
            <FlatList
                data={checkpoints}
                keyExtractor={(item, index) => item.CheckPointID?.toString() || index.toString()}
                style={{ maxHeight: 630, marginBottom: 30, marginTop: 20 }}
                nestedScrollEnabled={true}
                renderItem={({ item, index }) => (
                    <View
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
                                <TextInput style={[styles.input1, { width: 200 }]} multiline={true}
                                    numberOfLines={4} value={item.CheckListName} editable={false} />

                                <Text style={styles.label}>CheckPoint Name</Text>
                                <TextInput style={[styles.input1, { width: 200 },]} multiline={true}
                                    numberOfLines={4} value={item.CheckPointName} editable={false} />
                                    <Text style={styles.label}>MouldID</Text>
                                <TextInput style={[styles.input1, { width: 200 },]} multiline={true}
                                    numberOfLines={4} value={item.MouldID} editable={false} />
                            </View>

                            <View style={styles.row2}>
                                <Text style={styles.label}>Judgement Criteria</Text>
                                <TextInput style={[styles.input2, { width: 400, marginStart: '1' }]} multiline={true}
                                    numberOfLines={4} value={item.JudgementCriteria} editable={false} />

                                <Text style={styles.label}>Observation & Action</Text>

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
                            {/* edit later row 6*/}
                            <View style={styles.row4}>

                                <Text style={styles.label}>CheckPointValue</Text>
                                <TextInput style={[styles.input4, { width: 100 }]} multiline={true}
                                    numberOfLines={4} value={item.CheckPointValue?.toString() || ''} editable={false} />
                                <Text style={styles.label}>UpperLimit</Text>
                                <TextInput
                                    style={[styles.input4, { width: 100 }]}
                                    value={item.UpperLimitInput}
                                    editable={!item.isDisabled}
                                    keyboardType="numeric"
                                    onChangeText={text => {
                                        const updated = [...checkpoints];
                                        updated[index].UpperLimitInput = text;
                                        setCheckpoints(updated);
                                    }}
                                    placeholder="Upper"
                                />
                                <Text style={styles.label}>LowerLimit</Text>
                                <TextInput
                                    style={[styles.input4, { width: 100 }]}
                                    value={item.LowerLimitInput}
                                    editable={!item.isDisabled}
                                    keyboardType="numeric"
                                    onChangeText={text => {
                                        const updated = [...checkpoints];
                                        updated[index].LowerLimitInput = text;
                                        setCheckpoints(updated);
                                    }}
                                    placeholder="Lower"
                                />

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
                                    <TouchableOpacity style={[styles.iconButton, { marginRight: 10 }]}>
                                        <Icon name="camera" size={24} color="white" />
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    style={[styles.button, { marginRight: 10, opacity: item.isDisabled ? 0.5 : 1 }]}
                                    onPress={() => !item.isDisabled && updateCheckpoint(
                                        item.CheckPointID,
                                        item.MouldID,
                                        item.ObservationInput,
                                        1,
                                        item.UpperLimitInput,
                                        item.LowerLimitInput,
                                        index
                                    )}
                                    disabled={item.isDisabled}
                                >
                                    <Text style={styles.buttonText}>OK</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.button, { marginRight: 10, opacity: item.isDisabled ? 0.5 : 1 }]}
                                    onPress={() => !item.isDisabled && updateCheckpoint(
                                        item.CheckPointID,
                                        item.MouldID,
                                        item.ObservationInput,
                                        2,
                                        item.UpperLimitInput,
                                        item.LowerLimitInput,
                                        index
                                    )}
                                    disabled={item.isDisabled}><Text style={styles.buttonText}>NOK</Text></TouchableOpacity>
                                <TouchableOpacity style={styles.iconButton} onPress={() => handleEdit(index)}>
                                    {/* <Text style={styles.buttonText}>Edit</Text> */}
                                    <Icon name="square-edit-outline" size={24} color="white"></Icon>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: -20, marginRight: 30 }}>
                <TouchableOpacity style={[styles.button, { marginRight: 10 }]}
                    onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button}
                    //  onPress={() => navigation.goBack()}
                    onPress={() => navigation.navigate('PMApprove', { checklistID })}
                >
                    <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PMExecution;