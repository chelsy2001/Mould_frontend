import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    FlatList,
    Linking
} from 'react-native';
import Header from '../../Common/header/header';
import { useRoute, useNavigation } from '@react-navigation/native';
import styles from './HCApproveStyle';
import { BASE_URL, REPORT_URL } from '../../Common/config/config';

const HCApprove = ({ username }) => {
    const route = useRoute();
    const { checklistID } = route.params;
    const [checkpoints, setCheckpoints] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        fetch(`${BASE_URL}/HCMouldApproval/GetCheckPoints/${checklistID}`)
            .then(res => res.json())
            .then(response => {
                if (response.status === 200) {
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

    const renderCheckpoint = ({ item, index }) => (
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
            {/* Row 1 */}
            <View style={styles.row1}>
                <Text style={styles.label}>Checklist Name</Text>
                <TextInput style={[styles.input1, { width: 400 }]} multiline value={item.CheckListName} editable={false} />
                <Text style={styles.label}>CheckPoint Name</Text>
                <TextInput style={[styles.input1, { width: 400 }]} multiline value={item.CheckPointName} editable={false} />
            </View>

            {/* Row 2 */}
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
                />
            </View>

            {/* Row 4 */}
            <View style={styles.row4}>
                <Text style={styles.label}>StandardCondition</Text>
                <TextInput style={[styles.input4, { width: 150 }]} multiline value={item.StandardCondition} editable={false} />

                <Text style={styles.label}>CheckPointType</Text>
                <TextInput style={[styles.input4, { width: 150 }]} multiline value={item.CheckPointType} editable={false} />

                <Text style={styles.label}>CheckingMethod</Text>
                <TextInput style={[styles.input4, { width: 150 }]} multiline value={item.CheckingMethod} editable={false} />

                <Text style={styles.label}>CheckArea</Text>
                <TextInput style={[styles.input4, { width: 150 }]} multiline value={item.CheckArea} editable={false} />
            </View>

            {/* Row 6 */}
            <View style={styles.row4}>
                <Text style={styles.label}>CheckPointValue</Text>
                <TextInput style={[styles.input4, { width: 100 }]} multiline value={item.CheckPointValue?.toString() || ''} editable={false} />

                <Text style={styles.label}>UpperLimit</Text>
                <TextInput style={[styles.input4, { width: 100 }]} multiline value={item.UpperLimit?.toString() || ''} editable={false} />

                <Text style={styles.label}>LowerLimit</Text>
                <TextInput style={[styles.input4, { width: 100 }]} multiline value={item.LowerLimit?.toString() || ''} editable={false} />

                <Text style={styles.label}>Standard</Text>
                <TextInput style={[styles.input4, { width: 100 }]} multiline value={item.Standard?.toString() || ''} editable={false} />

                <Text style={styles.label}>UOM</Text>
                <TextInput style={[styles.input4, { width: 100 }]} multiline value={item.UOM} editable={false} />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Header username={username} title="Health Check Executed Checklist" />

            <FlatList
                data={checkpoints}
                renderItem={renderCheckpoint}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: 30, marginTop: 20 }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: -20, marginRight: 30 }}>
                <TouchableOpacity
                    style={[styles.button, { marginRight: 10, width: '14%' }]}
                    onPress={() => {
                        const reportUrl = `${REPORT_URL}`;
                        Linking.openURL(reportUrl).catch(err => {
                            console.error('Failed to open browser:', err);
                            Alert.alert('Error', 'Failed to open report in browser');
                        });
                    }}
                >
                    <Text style={styles.buttonText}>View Reports</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MouldHome')}>
                    <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HCApprove;
