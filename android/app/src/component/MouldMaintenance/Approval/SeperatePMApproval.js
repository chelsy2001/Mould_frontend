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
import styles from './SeperatePMApprovalStyle';
import { BASE_URL, REPORT_URL } from '../../Common/config/config';
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Modal } from 'react-native';
import { Linking } from 'react-native';
import { scale, verticalScale, moderateScale } from '../../Common/utils/scale';


const SeperatePMApproval = ({ username, setIsLoggedIn }) => {
    const [checklistData, setChecklistData] = useState([]);
    const navigation = useNavigation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedChecklist, setSelectedChecklist] = useState(null);
    const [userList, setUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [password, setPassword] = useState('');
    const [modalMode, setModalMode] = useState(''); // 'approve' or 'edit'


    const getPMStatusText = (pmStatus) => {
        switch (pmStatus) {
            case 1:
                return 'PM Not Started';
            case 2:
                return 'PM Warring';
            case 3:
                return 'PM Alarm';
            case 4:
                return 'PM in Prepration';
            case 5:
                return 'PM in MainExcution';
            case 6:
                return 'waiting for approval';
            case 7:
                return 'Approived';
            case 8:
                return 'PM Due';
            default:
                return 'Unknown Status';
        }
    }

    //integrate the checklist api
    useEffect(() => {
        fetch(`${BASE_URL}/SeperatePMApproval/PMChecklistForApproval`)
            .then(res => res.json())
            .then(data => {
                if (data.status === 200) {
                    setChecklistData(data.data);
                } else {
                    console.log('Error:', data.message);
                }
            })
            .catch(error => console.error('API fetch error:', error));
    }, []);


    //Get the users who's role quality supervisor
    useEffect(() => {
        console.log("Fetching user list...");
        fetch(`${BASE_URL}/SeperatePMApproval/Users`)
            .then((res) => res.json())
            .then((data) => {
                console.log("User fetch response:", data);
                if (data.status === 200) {
                    // Convert user list into format required by SelectList
                    const formattedUsers = data.data.map((user, index) => ({
                        key: index.toString(), // or use user.UserID if unique
                        value: user.UserName
                    }));
                    setUserList(formattedUsers);
                } else {
                    console.log('User fetch error:', data.message);
                }
            })
            .catch((error) => console.error('API user fetch error:', error));
    }, []);

    //For refresh data

    const fetchChecklistData = () => {
        fetch(`${BASE_URL}/SeperatePMApproval/PMChecklistForApproval`)
            .then(res => res.json())
            .then(data => {
                if (data.status === 200) {
                    setChecklistData(data.data);
                } else {
                    console.log('Error:', data.message);
                }
            })
            .catch(error => console.error('API fetch error:', error));
    };


    return (
        // <View style={styles.container}>
        //     <Header username={username} title="PM Approval" />
        //     <ScrollView
        //         nestedScrollEnabled={true}
        //         style={{ maxHeight: 700, marginBottom: 30, marginTop: 20 }}
        //     >
        //         {checklistData.map((item, index) => (
        //             <View>
        //                 <View key={item.UID} style={[
        //                     styles.Container1,
        //                     item.PMStatus === 6 && { backgroundColor: '#00b050', borderColor: '#28a745', borderWidth: 1.5 }, // green background
        //                 ]}>
        //                     {/* <Text style={styles.boxHeader}>Checklist #{index + 1}</Text> */}

        //                     <View style={styles.row1}>
        //                         <Text style={styles.label}>Checklist Name</Text>
        //                         <TextInput style={[styles.input1, { width: 280 }]} value={item.CheckListName} editable={false} />


        //                         <Text style={styles.label}>MouldID</Text>
        //                         <TextInput style={[styles.input1, { width: 120 }]} value={item.MouldID.toString()} editable={false} />

        //                         <Text style={styles.label}>Mould Name</Text>
        //                         <TextInput style={styles.input1} value={item.MouldName} editable={false} />

        //                         <Text style={styles.label}>PMFreqCount</Text>
        //                         <TextInput style={[styles.input1, { width: 120 }]} value={item.PMFreqCount.toString()} editable={false} />


        //                     </View>

        //                     <View style={styles.row2}>
        //                         <Text style={styles.label}>PMFreqDays</Text>
        //                         <TextInput style={[styles.input1, { width: 80, marginLeft: 37 }]} value={item.PMFreqDays.toString()} editable={false} />
        //                         <Text style={styles.label}>PMWarningCount</Text>
        //                         <TextInput style={[styles.input2, { width: 80 }]} value={item.PMWarningCount.toString()} editable={false} />

        //                         <Text style={styles.label}>PMWarningDays</Text>
        //                         <TextInput style={[styles.input2, { width: 80 }]} value={item.PMWarningDays.toString()} editable={false} />

        //                         <Text style={styles.label}>Instance</Text>
        //                         <TextInput style={[styles.input2, { width: 50 }]} value={item.Instance.toString()} editable={false} />

        //                         <Text style={styles.label}>PMStatus</Text>
        //                         <TextInput style={[styles.input2, { width: 167 }]} value={getPMStatusText(item.PMStatus)} editable={false} />


        //                     </View>

        //                     <View style={styles.row3}>
        //                         <TouchableOpacity
        //                             style={[styles.button, { marginRight: 10, width: '14%' }]}
        //                             onPress={() => {
        //                                 // const reportUrl = `http://192.168.1.15:8083`;
        //                                 const reportUrl = `${REPORT_URL}`
        //                                 // 👆 Replace with your actual report path and query param

        //                                 Linking.openURL(reportUrl)
        //                                     .catch(err => {
        //                                         console.error('Failed to open browser:', err);
        //                                         Alert.alert('Error', 'Failed to open report in browser');
        //                                     });
        //                             }}
        //                         >
        //                             <Text style={styles.buttonText}>View Reports</Text>
        //                         </TouchableOpacity>

        //                         <TouchableOpacity
        //                             style={[styles.button, { marginRight: 10 }]}
        //                             onPress={() => {
        //                                 setSelectedChecklist(item);
        //                                 setModalMode('approve');
        //                                 setIsModalVisible(true);
        //                             }}
        //                         >
        //                             <Text style={styles.buttonText}>Approve</Text>
        //                         </TouchableOpacity>

        //                         <TouchableOpacity
        //                             style={[styles.button, { marginRight: 10 }]}
        //                             onPress={() => {
        //                                 setSelectedChecklist(item);
        //                                 setModalMode('edit');
        //                                 setIsModalVisible(true);
        //                             }}
        //                         >
        //                             <Text style={styles.buttonText}>Edit</Text>
        //                         </TouchableOpacity>
        //                     </View>

        //                 </View>
        //             </View>
        //         ))}
        //     </ScrollView>
        //     <Modal
        //         transparent={true}
        //         visible={isModalVisible}
        //         animationType="slide"
        //         onRequestClose={() => setIsModalVisible(false)}
        //     >
        //         <View style={{
        //             flex: 1,
        //             backgroundColor: 'rgba(0,0,0,0.5)',
        //             justifyContent: 'center',
        //             alignItems: 'center'
        //         }}>
        //             <View style={{
        //                 width: '30%',
        //                 backgroundColor: 'white',
        //                 padding: 20,
        //                 borderRadius: 10,
        //                 alignItems: 'center'
        //             }}>
        //                 <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        //                     Login
        //                 </Text>
        //                 <View>
        //                     <Text style={[styles.label, { marginLeft: '12%' }]}>User</Text>
        //                     <SelectList
        //                         setSelected={setSelectedUser}
        //                         data={userList}
        //                         save="value"
        //                         placeholder="Select User"
        //                         boxStyles={{

        //                             marginLeft: '12%',
        //                             width: 250,
        //                             backgroundColor: 'white',
        //                         }}
        //                         dropdownStyles={{
        //                             backgroundColor: '#f0f8ff',
        //                         }}

        //                     />
        //                     <Text style={[styles.label, { marginLeft: '12%' }]}>Password</Text>
        //                     <TextInput style={[styles.input2, { width: 250, marginLeft: '12%' }]}
        //                         value={password}
        //                         onChangeText={setPassword}
        //                         secureTextEntry={true}
        //                     />
        //                 </View>

        //                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        //                     <TouchableOpacity
        //                         style={[styles.button, { marginRight: 10, width: '30%' }]}
        //                         onPress={() => {
        //                             if (!selectedUser || !password) {
        //                                 Alert.alert("Validation", "Please select user and enter password");
        //                                 return;
        //                             }

        //                             fetch(`${BASE_URL}/SeperatePMApproval/login`, {
        //                                 method: 'POST',
        //                                 headers: {
        //                                     'Content-Type': 'application/json',
        //                                 },
        //                                 body: JSON.stringify({
        //                                     username: selectedUser,
        //                                     password: password
        //                                 }),
        //                             })
        //                                 .then(res => res.json())
        //                                 .then(data => {
        //                                     if (data.status === 200) {
        //                                         if (modalMode === 'approve') {
        //                                             // ✅ Call your approval API
        //                                             fetch(`${BASE_URL}/SeperatePMApproval/ApproveChecklist`, {
        //                                                 method: 'POST',
        //                                                 headers: {
        //                                                     'Content-Type': 'application/json',
        //                                                 },
        //                                                 body: JSON.stringify({
        //                                                     CheckListID: selectedChecklist.CheckListID // or another unique identifier
        //                                                 }),
        //                                             })
        //                                                 .then(res => res.json())
        //                                                 .then(result => {
        //                                                     if (result.status === 200) {
        //                                                         Alert.alert("Approved", "Checklist approved successfully");
        //                                                         fetchChecklistData(); // ✅ refresh
        //                                                         setIsModalVisible(false);
        //                                                         setPassword('');
        //                                                         setSelectedUser('');
        //                                                         setModalMode('');
        //                                                         // Optionally refresh checklistData here
        //                                                     } else {
        //                                                         Alert.alert("Error", result.message);
        //                                                     }
        //                                                 })
        //                                                 .catch(err => {
        //                                                     console.error("Approval error:", err);
        //                                                     Alert.alert("Error", "Approval API failed");
        //                                                 });
        //                                         } else if (modalMode === 'edit') {
        //                                             // ✅ Navigate to edit screen
        //                                             navigation.navigate('PMApprovalCheckpoint', {
        //                                                 checklist: selectedChecklist
        //                                             });
        //                                             setIsModalVisible(false);
        //                                             setPassword('');
        //                                             setSelectedUser('');
        //                                             setModalMode('');
        //                                         }
        //                                     } else {
        //                                         Alert.alert("Login Failed", data.message);
        //                                     }
        //                                 })
        //                                 .catch((err) => {
        //                                     console.error('Login API error:', err);
        //                                     Alert.alert("Error", "Server error");
        //                                 });
        //                         }}

        //                     >
        //                         <Text style={styles.buttonText}>Submit</Text>
        //                     </TouchableOpacity>

        //                     <TouchableOpacity
        //                         style={[styles.button, { width: '30%' }]}
        //                         onPress={() => setIsModalVisible(false)}
        //                     >
        //                         <Text style={styles.buttonText}>Cancel</Text>
        //                     </TouchableOpacity>
        //                 </View>
        //             </View>
        //         </View>
        //     </Modal>

        // </View>
        <View style={styles.container}>
            <Header username={username} title="PM Approval" />
            <ScrollView
                nestedScrollEnabled={true}
                style={{ maxHeight: 700, marginBottom: 30, marginTop: 20 }}
            >
                {checklistData.map((item, index) => (
                    <View>
                        <View key={item.UID} style={[
                            styles.Container1,
                            {
  backgroundColor: item.PMStatus === 6 
    ? '#FFFF00'   // Yellow for 6
    : item.PMStatus === 7 
      ? '#00FF00' // Green for 7
      : '#FFFFFF', // Default for others (white)
  borderColor: item.PMStatus === 6 
    ? '#FFFF00' 
    : item.PMStatus === 7 
      ? '#00FF00' 
      : '#FFFFFF',
  borderWidth: 1.5
}
                        ]}>
                            <View style={styles.row1}>
                                <Text style={styles.label}>Checklist Name</Text>
                                <TextInput style={[styles.input1, { width: 280 }]} value={item.CheckListName} editable={false} />

                                <Text style={styles.label}>Mould Name</Text>
                                <TextInput style={styles.input1} value={item.MouldName} editable={false} />

                                <Text style={styles.label}>Instance</Text>
                                <TextInput style={[styles.input1, { width: 120 }]} value={item.PMFreqCount.toString()} editable={false} />

                                 <Text style={styles.label}>PM Shots</Text>
                                <TextInput style={[styles.input1, { width: 120 }]} value={item.PMFreqCount.toString()} editable={false} />
                            </View>

                            <View style={styles.row2}>
                                <Text style={styles.label}>DueDays</Text>
                                <TextInput style={[styles.input1, { width: 280 }]} value={item.PMFreqDays.toString()} editable={false} />
                                <Text style={styles.label}>DueShots</Text>
                                <TextInput style={styles.input1} value={item.PMWarningCount.toString()} editable={false} />

                                <Text style={styles.label}>PMStart Date</Text>
                                <TextInput style={[styles.input1, { width: 120 }]} value={item.PMWarningDays.toString()} editable={false} />

                                <Text style={styles.label}>PMEnd Date</Text>
                                <TextInput style={[styles.input1, { width: 120 }]} value={item.Instance.toString()} editable={false} />


                            </View>

                            <View style={styles.row2}>
                                <Text style={styles.label}>Done By</Text>
                                <TextInput style={[styles.input1, { width: 120 }]} value={item.PMFreqDays.toString()} editable={false} />
                                <Text style={styles.label}>Approved By </Text>
                                <TextInput style={[styles.input1, { width: 120 }]} value={item.PMWarningCount.toString()} editable={false} />

                                <Text style={styles.label}>Approved Date</Text>
                                <TextInput style={[styles.input1, { width: 120 }]} value={item.PMWarningDays.toString()} editable={false} />

                                <Text style={styles.label}>PM Status</Text>
                                <TextInput style={[styles.input1, { width: 120 }]} value={item.PMStatus.toString()} editable={false} />
                            </View>

                              <View style={styles.row2}>
                                <Text style={styles.label}>Remark</Text>
                                <TextInput style={[styles.input1, { width: 700}]} value={item.PMFreqDays.toString()} editable={false} />
                                <Text style={styles.label}>Time Stamp </Text>
                                <TextInput style={[styles.input2, { width: 200 }]} value={item.PMWarningCount.toString()} editable={false} />
                            </View>

                            <View style={styles.row3}>
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

                                <TouchableOpacity
                                    style={[styles.button, { marginRight: 10 }]}
                                    onPress={() => {
                                        setSelectedChecklist(item);
                                        setModalMode('approve');
                                        setIsModalVisible(true);
                                    }}
                                >
                                    <Text style={styles.buttonText}>Approve</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, { marginRight: 10 }]}
                                    onPress={() => {
                                        setSelectedChecklist(item);
                                        setModalMode('edit');
                                        setIsModalVisible(true);
                                    }}
                                >
                                    <Text style={styles.buttonText}>Edit</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                ))}
            </ScrollView>
            <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View style={{
                        width: '30%',
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 10,
                        alignItems: 'center'
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                            Login
                        </Text>
                        <View>
                            <Text style={[styles.label, { marginLeft: '12%' }]}>User</Text>
                            <SelectList
                                setSelected={setSelectedUser}
                                data={userList}
                                save="value"
                                placeholder="Select User"
                                boxStyles={{

                                    marginLeft: '12%',
                                    width: 250,
                                    backgroundColor: 'white',
                                }}
                                dropdownStyles={{
                                    backgroundColor: '#f0f8ff',
                                }}

                            />
                            <Text style={[styles.label, { marginLeft: '12%' }]}>Password</Text>
                            <TextInput style={[styles.input2, { width: 250, marginLeft: '12%' }]}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={true}
                            />
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                            <TouchableOpacity
                                style={[styles.button, { marginRight: 10, width: '30%' }]}
                                onPress={() => {
                                    if (!selectedUser || !password) {
                                        Alert.alert("Validation", "Please select user and enter password");
                                        return;
                                    }

                                    fetch(`${BASE_URL}/SeperatePMApproval/login`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            username: selectedUser,
                                            password: password
                                        }),
                                    })
                                        .then(res => res.json())
                                        .then(data => {
                                            if (data.status === 200) {
                                                if (modalMode === 'approve') {
                                                    // ✅ Call your approval API
                                                    fetch(`${BASE_URL}/SeperatePMApproval/ApproveChecklist`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                        },
                                                        body: JSON.stringify({
                                                            CheckListID: selectedChecklist.CheckListID // or another unique identifier
                                                        }),
                                                    })
                                                        .then(res => res.json())
                                                        .then(result => {
                                                            if (result.status === 200) {
                                                                Alert.alert("Approved", "Checklist approved successfully");
                                                                fetchChecklistData(); // ✅ refresh
                                                                setIsModalVisible(false);
                                                                setPassword('');
                                                                setSelectedUser('');
                                                                setModalMode('');
                                                                // Optionally refresh checklistData here
                                                            } else {
                                                                Alert.alert("Error", result.message);
                                                            }
                                                        })
                                                        .catch(err => {
                                                            console.error("Approval error:", err);
                                                            Alert.alert("Error", "Approval API failed");
                                                        });
                                                } else if (modalMode === 'edit') {
                                                    // ✅ Navigate to edit screen
                                                    navigation.navigate('PMApprovalCheckpoint', {
                                                        checklist: selectedChecklist
                                                    });
                                                    setIsModalVisible(false);
                                                    setPassword('');
                                                    setSelectedUser('');
                                                    setModalMode('');
                                                }
                                            } else {
                                                Alert.alert("Login Failed", data.message);
                                            }
                                        })
                                        .catch((err) => {
                                            console.error('Login API error:', err);
                                            Alert.alert("Error", "Server error");
                                        });
                                }}

                            >
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, { width: '30%' }]}
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>

    );
}

export default SeperatePMApproval;