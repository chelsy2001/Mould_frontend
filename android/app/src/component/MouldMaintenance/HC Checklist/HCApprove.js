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
import styles from './HCApproveStyle';
import { BASE_URL,REPORT_URL } from '../../Common/config/config';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HCApprove = ({ username, setIsLoggedIn }) => {
    const route = useRoute();
    const { checklistID } = route.params;
    const [checkpoints, setCheckpoints] = useState([]);
    const navigation = useNavigation();


    useEffect(() => {
        console.log('Received checklistID:', checklistID);
        // You can now fetch or use checklistID as needed
    }, [checklistID]);

    //fetch the HC Execution Data
    useEffect(() => {
        fetch(`${BASE_URL}/HCApproval/GetCheckPoints/${checklistID}`)
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

    return (<View style={styles.container}>
        <Header username={username} title="HC Approval" />
        <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 630, marginBottom: 30 }}>
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

                    </View>
                ))}
            </View>
        </ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: -20, marginRight: 30 }}>
                                            <TouchableOpacity
  style={[styles.button, { marginRight: 10, width: '14%' }]}
  onPress={() => {
    // const reportUrl = `http://192.168.1.15:8083`;
    const reportUrl = `${REPORT_URL}`
    // 👆 Replace with your actual report path and query param

    Linking.openURL(reportUrl)
      .catch(err => {
        console.error('Failed to open browser:', err);
        Alert.alert('Error', 'Failed to open report in browser');
      });
  }}
>
  <Text style={styles.buttonText}>View Reports</Text>
</TouchableOpacity>

            <TouchableOpacity style={styles.button}
                onPress={() => navigation.goBack()}

            >
                <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
        </View>
    </View>
    );
};

export default HCApprove;