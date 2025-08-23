import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  Linking,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Header from '../../Common/header/header';
import { useNavigation } from '@react-navigation/native';
import styles from './SeperatePMApprovalStyle';
import { BASE_URL, REPORT_URL } from '../../Common/config/config';
import { SelectList } from 'react-native-dropdown-select-list';
import { launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SeperatePMApproval = ({ username }) => {
  const [pmData, setPmData] = useState([]);
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [password, setPassword] = useState('');
  const [modalMode, setModalMode] = useState(''); // 'approve' or 'edit'
  const [mouldOptions, setMouldOptions] = useState([]); 
    const [selectMouldId, setSelectedMouldId] = useState('select mould');
  


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
                return 'Approved';
            case 8:
                return 'PM Due';
            default:
                return 'Unknown Status';
        }
    }


  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera to scan mould IDs',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required to scan mould IDs');
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: true,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('Camera cancelled');
      } else if (response.errorCode) {
        console.error('Camera error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to take photo: ' + response.errorMessage);
      } else {
        // Show an alert to let the user manually enter the mould ID from the photo
        Alert.prompt(
          'Enter Mould ID',
          'Please enter the mould ID from the photo you just took:',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: (mouldId) => {
                if (mouldId && mouldId.trim() !== '') {
                  // Check if the mould ID exists in our options
                  const mouldExists = mouldOptions.some(option => option.value === mouldId);
                  if (mouldExists) {
                    setSelectedMouldId(mouldId);
                  } else {
                    Alert.alert('Invalid Mould ID', 'The entered mould ID does not exist in the system.');
                  }
                }
              },
            },
          ],
          'plain-text'
        );
      }
    });
  };

// ✅ fetch Mould IDs for dropdown
  useEffect(() => {
      const fetchMouldIds = async () => {
        try {
          const response = await fetch(`${BASE_URL}/mould/ids`);
          const data = await response.json();
          if (data.status === 200) {
            const options = data.data.map(item => ({
              key: item.MouldID,
              value: item.MouldID,
            }));
            setMouldOptions(options);
          } else {
            console.log('Failed to fetch Mould IDs:', data.message);
          }
        } catch (error) {
          console.error('Error fetching Mould IDs:', error);
        }
      };
      fetchMouldIds();
    }, []);

  
  // ✅ fetch PM Approval data
const fetchChecklistData = (mouldId = 1) => {
  fetch(`${BASE_URL}/SeperatePMApproval/pm-approval/${mouldId}`)
    .then(res => res.json())
    .then(data => {
      if (data) {
        const formatted = [];

        // handle pmStart array
        if (Array.isArray(data.pmStart)) {
          data.pmStart.forEach(item => {
            formatted.push({ ...item, type: 'Start' });
          });
        }

        // handle pmApproved array
        if (Array.isArray(data.pmApproved)) {
          data.pmApproved.forEach(item => {
            formatted.push({ ...item, type: 'Approved' });
          });
        }

        setPmData(formatted);
      } else {
        setPmData([]);
      }
    })
    .catch(err => console.error('❌ API fetch error:', err));
};


  useEffect(() => {
    fetchChecklistData(selectMouldId);
  }, [selectMouldId]);

  // ✅ fetch users (Quality Supervisors)
  useEffect(() => {
    fetch(`${BASE_URL}/SeperatePMApproval/Users`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          const formattedUsers = data.data.map((user, index) => ({
            key: index.toString(),
            value: user.UserName,
          }));
          setUserList(formattedUsers);
        }
      })
      .catch(err => console.error('User fetch error:', err));
  }, []);

  return (
    <View style={styles.container}>
      <Header username={username} title="PM Approval" />

      <View style={styles.dropdownContainer}>
  <Text style={styles.dropdownLabel}>Select Mould ID</Text>
  <SelectList
    setSelected={(val) => setSelectedMouldId(val)}
    data={mouldOptions}
    save="value"
    placeholder="Choose a Mould ID"
    boxStyles={styles.dropdownBox}
    inputStyles={styles.dropdownInput}
    dropdownStyles={styles.dropdownList}
    dropdownTextStyles={styles.dropdownText}
  />
</View>

      <ScrollView nestedScrollEnabled style={{ maxHeight: 700, marginBottom: 30, marginTop: 20 }}>
  {pmData.map((item, index) => (
    <View
      key={index}
      style={[
        styles.Container1,
        item.type === 'Start' && { backgroundColor: '#FFFF00', borderColor: '#FFD700' },
        item.type === 'Approved' && { backgroundColor: '#00FF00', borderColor: '#008000' },
      ]}
    >
      {/* -------- Row 1 -------- */}
      <View style={styles.row1}>
        <Text style={styles.label}>Checklist Name</Text>
        <TextInput style={[styles.input1, { width: 250 }]} value={item.CheckListName || '-'} editable={false} />

        <Text style={styles.label}>Mould Name</Text>
        <TextInput style={[styles.input1, { width: 180 }]} value={item.MouldName || '-'} editable={false} />

         <Text style={styles.label}>PM Shots</Text>
        <TextInput style={[styles.input2, { width: 80 }]} value={item.PMShots?.toString() || '-'} editable={false} />
         <Text style={styles.label}>Instance</Text>
        <TextInput style={[styles.input2, { width: 80 }]} value={item.Instance?.toString() || '-'} editable={false} />
      </View>

      {/* -------- Row 2 -------- */}
      <View style={styles.row2}>

        <Text style={styles.label}>Due Shots</Text>
        <TextInput style={[styles.input2, { width: 80 }]} value={item.DueShots?.toString() || '-'} editable={false} />

        <Text style={styles.label}>Due Date</Text>
        <TextInput style={[styles.input2, { width: 180 }]} value={item.DueDate || '-'} editable={false} />

           <Text style={styles.label}>PMStart Date</Text>
        <TextInput style={[styles.input2, { width: 180 }]} value={item.PMStartDate || '-'} editable={false} />

   <Text style={styles.label}>PMEnd Date</Text>
        <TextInput style={[styles.input2, { width: 180 }]} value={item.PMEndDate || '-'} editable={false} />


      </View>

      {/* -------- Row 3 -------- */}
      <View style={styles.row2}>
        <Text style={styles.label}>Done By</Text>
        <TextInput style={[styles.input2, { width: 150 }]} value={username || username || '-'} editable={false} />

        <Text style={styles.label}>Approved By</Text>
        <TextInput style={[styles.input2, { width: 180 }]} value={item.ApprovedByUserName?.toString() || '--'} editable={false} />

        <Text style={styles.label}>Approved Date</Text>
        <TextInput style={[styles.input2, { width: 180 }]} value={item.ApprovedDate || '--'} editable={false} />

        
        <Text style={styles.label}>PM Status</Text>
        <TextInput style={[styles.input2, { width: 150 }]} value={getPMStatusText(item.PMStatus)} editable={false} />
      </View>

    {/* -------- Row 4 -------- */}
<View style={styles.row2}>
  <Text style={styles.label}>Remark</Text>
  <TextInput
    style={[styles.input1, { width: '90%' }]}
    value={item.Remark}
    onChangeText={(text) => {
      // Allow editing remarks only if status = waiting for approval
      if (item.PMStatus === 6) {
        const updated = [...pmData];
        updated[index].Remark = text;
        setPmData(updated);
      }
    }}
    editable={item.PMStatus === 6} // ✅ Editable only in waiting state
  />
</View>

{/* -------- Buttons Row -------- */}
<View style={styles.row3}>
  <TouchableOpacity
    style={[styles.button, { marginRight: 10 }]}
    onPress={() => {
      Linking.openURL(REPORT_URL).catch(err => {
        console.error('Failed to open browser:', err);
        Alert.alert('Error', 'Failed to open report in browser');
      });
    }}
  >
    <Text style={styles.buttonText}>View Reports</Text>
  </TouchableOpacity>

  {/* ✅ Approve button only if PMStatus = 6 (waiting for approval) */}
  {item.PMStatus === 6 && (
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
  )}

  {/* Edit button hamesha rahe */}
    {item.PMStatus === 6 && (<TouchableOpacity
    style={styles.button}
    onPress={() => {
      setSelectedChecklist(item);
      setModalMode('edit');
      setIsModalVisible(true);
    }}
  >
    <Text style={styles.buttonText}>Edit</Text>
  </TouchableOpacity>
  )}
</View>

    </View>
  ))}
</ScrollView>


      {/* Modal for login */}
      <Modal transparent visible={isModalVisible} animationType="slide" onRequestClose={() => setIsModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '30%', backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Login</Text>

            <Text style={[styles.label, { marginLeft: '12%' }]}>User</Text>
            <SelectList
              setSelected={setSelectedUser}
              data={userList}
              save="value"
              placeholder="Select User"
              boxStyles={{ marginLeft: '12%', width: 250, backgroundColor: 'white' }}
              dropdownStyles={{ backgroundColor: '#f0f8ff' }}
            />

            <Text style={[styles.label, { marginLeft: '12%' }]}>Password</Text>
            <TextInput
              style={[styles.input2, { width: 250, marginLeft: '12%' }]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <TouchableOpacity
                style={[styles.button, { marginRight: 10, width: '30%' }]}
                onPress={() => {
                  if (!selectedUser || !password) {
                    Alert.alert('Validation', 'Please select user and enter password');
                    return;
                  }

                  fetch(`${BASE_URL}/SeperatePMApproval/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: selectedUser, password }),
                  })
                    .then(res => res.json())
                    .then(data => {
                      if (data.status === 200) {
                        if (modalMode === 'approve') {
                          fetch(`${BASE_URL}/SeperatePMApproval/ApproveChecklist`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ CheckListID: selectedChecklist.CheckListID }),
                          })
                            .then(res => res.json())
                            .then(result => {
                              if (result.status === 200) {
                                Alert.alert('Approved', 'Checklist approved successfully');
                                fetchChecklistData();
                                setIsModalVisible(false);
                                setPassword('');
                                setSelectedUser('');
                                setModalMode('');
                              } else {
                                Alert.alert('Error', result.message);
                              }
                            })
                            .catch(err => {
                              console.error('Approval error:', err);
                              Alert.alert('Error', 'Approval API failed');
                            });
                        } else if (modalMode === 'edit') {
                          navigation.navigate('PMApprovalCheckpoint', { checklist: selectedChecklist });
                          setIsModalVisible(false);
                          setPassword('');
                          setSelectedUser('');
                          setModalMode('');
                        }
                      } else {
                        Alert.alert('Login Failed', data.message);
                      }
                    })
                    .catch(err => {
                      console.error('Login API error:', err);
                      Alert.alert('Error', 'Server error');
                    });
                }}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, { width: '30%' }]} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SeperatePMApproval;
