// export default SeperatePMApproval;
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
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
  const [showPassword, setShowPassword] = useState(false);

  const getPMStatusText = (pmStatus) => {
    switch (pmStatus) {
      case 1: return 'PM Not Started';
      case 2: return 'PM Warring';
      case 3: return 'PM Alarm';
      case 4: return 'PM in Prepration';
      case 5: return 'PM in MainExcution';
      case 6: return 'waiting for approval';
      case 7: return 'Approved';
      case 8: return 'PM Due';
      default: return 'Unknown Status';
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

    launchCamera(
      { mediaType: 'photo', quality: 0.8, saveToPhotos: true },
      (response) => {
        if (response.didCancel) console.log('Camera cancelled');
        else if (response.errorCode) Alert.alert('Error', response.errorMessage);
        else {
          Alert.prompt(
            'Enter Mould ID',
            'Please enter the mould ID from the photo you just took:',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'OK',
                onPress: (mouldId) => {
                  if (mouldId?.trim() !== '') {
                    const mouldExists = mouldOptions.some(option => option.value === mouldId);
                    if (mouldExists) setSelectedMouldId(mouldId);
                    else Alert.alert('Invalid Mould ID', 'The entered mould ID does not exist in the system.');
                  }
                }
              }
            ],
            'plain-text'
          );
        }
      }
    );
  };

  useEffect(() => {
    const fetchMouldIds = async () => {
      try {
        const response = await fetch(`${BASE_URL}/mould/ids`);
        const data = await response.json();
        if (data.status === 200) {
          const options = data.data.map(item => ({ key: item.MouldID, value: item.MouldID }));
          setMouldOptions(options);
        }
      } catch (error) {
        console.error('Error fetching Mould IDs:', error);
      }
    };
    fetchMouldIds();
  }, []);

  const fetchChecklistData = (mouldId) => {
    fetch(`${BASE_URL}/SeperatePMApproval/pm-approval/${mouldId}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          const formatted = [];
          Array.isArray(data.pmStart) && data.pmStart.forEach(item => formatted.push({ ...item, type: 'Start' }));
          Array.isArray(data.pmApproved) && data.pmApproved.forEach(item => formatted.push({ ...item, type: 'Approved' }));
          setPmData(formatted);
        } else setPmData([]);
      })
      .catch(err => console.error('❌ API fetch error:', err));
  };

  useEffect(() => fetchChecklistData(selectMouldId), [selectMouldId]);

  useEffect(() => {
    fetch(`${BASE_URL}/SeperatePMApproval/Users`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          const formattedUsers = data.data.map((user, index) => ({ key: index.toString(), value: user.UserName }));
          setUserList(formattedUsers);
        }
      })
      .catch(err => console.error('User fetch error:', err));
  }, []);

  const renderPMItem = ({ item, index }) => (
    <View
      key={index}
      style={[
        styles.Container1,
        item.type === 'Start' && { backgroundColor: '#FFFF00', borderColor: '#FFD700' },
        item.type === 'Approved' && { backgroundColor: '#00FF00', borderColor: '#008000' },
      ]}
    >
      {/* Row 1 */}
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

      {/* Row 2 */}
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

      {/* Row 3 */}
      <View style={styles.row2}>
        <Text style={styles.label}>Done By</Text>
        <TextInput style={[styles.input2, { width: 150 }]} value={username || '-'} editable={false} />

        <Text style={styles.label}>Approved By</Text>
        <TextInput style={[styles.input2, { width: 180 }]} value={item.ApprovedByUserName?.toString() || '--'} editable={false} />

        <Text style={styles.label}>Approved Date</Text>
        <TextInput style={[styles.input2, { width: 180 }]} value={item.ApprovedDate || '--'} editable={false} />

        <Text style={styles.label}>PM Status</Text>
        <TextInput style={[styles.input2, { width: 150 }]} value={getPMStatusText(item.PMStatus)} editable={false} />
      </View>

      {/* Row 4 - Remark */}
      <View style={styles.row2}>
        <Text style={styles.label}>Remark</Text>
        <TextInput
          style={[styles.input1, { width: '90%' }]}
          value={item.Remark}
          onChangeText={(text) => {
            if (item.PMStatus === 6) {
              const updated = [...pmData];
              updated[index].Remark = text;
              setPmData(updated);
            }
          }}
          editable={item.PMStatus === 6}
        />
      </View>

      {/* Buttons */}
      <View style={styles.row3}>
        <TouchableOpacity
          style={[styles.button, { marginRight: 10 }]}
          onPress={() => Linking.openURL(REPORT_URL).catch(err => Alert.alert('Error', 'Failed to open report'))}
        >
          <Text style={styles.buttonText}>View Reports</Text>
        </TouchableOpacity>

        {item.PMStatus === 6 && (
          <>
            <TouchableOpacity
              style={[styles.button, { marginRight: 10 }]}
              onPress={() => { setSelectedChecklist(item); setModalMode('approve'); setIsModalVisible(true); }}
            >
              <Text style={styles.buttonText}>Approve</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => { setSelectedChecklist(item); setModalMode('edit'); setIsModalVisible(true); }}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

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

      <FlatList
        data={pmData}
        renderItem={renderPMItem}
        keyExtractor={(item, index) => index.toString()}
        style={{ maxHeight: 700, marginTop: 20, marginBottom: 30 }}
        nestedScrollEnabled
      />

         {/* Modal for login */}
<Modal
  transparent
  visible={isModalVisible}
  animationType="slide"
  onRequestClose={() => setIsModalVisible(false)}
>
  <View
    style={{
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    }}
  >
    <View
      style={{
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Login
      </Text>

      {/* User Dropdown */}
      <Text style={[styles.label, { alignSelf: 'flex-start', marginBottom: 5 }]}>
        User
      </Text>
      <SelectList
        setSelected={setSelectedUser}
        data={userList}
        save="value"
        placeholder="Select User"
        boxStyles={{
          width: '100%',
          backgroundColor: '#f9f9f9',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#ccc',
          marginBottom: 15,
        }}
        dropdownStyles={{
          backgroundColor: '#f0f8ff',
          borderRadius: 8,
        }}
        inputStyles={{ color: '#333' }}
      />

      {/* Password Input with eye toggle */}
      <Text style={[styles.label, { alignSelf: 'flex-start', marginBottom: 5 }]}>
        Password
      </Text>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          height: 45,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          backgroundColor: '#f9f9f9',
          paddingHorizontal: 10,
          marginBottom: 20,
          alignItems: 'center',
        }}
      >
        <TextInput
          style={{ flex: 1, color: '#333' }}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          placeholder="Enter Password"
          placeholderTextColor="#888"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            color="#333"
          />
        </TouchableOpacity>
      </View>

      {/* Buttons */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: '#3535ebff',
            paddingVertical: 12,
            borderRadius: 8,
            marginRight: 10,
            alignItems: 'center',
          }}
          onPress={async () => {
            if (!selectedUser || !password) {
              Alert.alert('Validation', 'Please select user and enter password');
              return;
            }

            try {
              // Login API
              const loginRes = await fetch(`${BASE_URL}/SeperatePMApproval/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: selectedUser, password }),
              });
              const loginData = await loginRes.json();

              if (loginData.status === 200) {
                // Approve flow
                if (modalMode === 'approve') {
                  const approveRes = await fetch(`${BASE_URL}/SeperatePMApproval/ApproveChecklist`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ CheckListID: selectedChecklist.CheckListID,UserName: selectedUser }),
                  });
                  const approveData = await approveRes.json();

                  if (approveData.status === 200) {
                    Alert.alert('Approved', 'Checklist approved successfully');
                    fetchChecklistData(selectMouldId);
                    setIsModalVisible(false);
                  } else {
                    Alert.alert('Error', approveData.message);
                  }
                }
                // Edit flow
                else if (modalMode === 'edit') {
                  navigation.navigate('PMApprovalCheckpoint', { checklist: selectedChecklist });
                  setIsModalVisible(false);
                }

                // Reset modal state
                setPassword('');
                setSelectedUser('');
                setModalMode('');
              } else {
                Alert.alert('Login Failed', loginData.message);
              }
            } catch (error) {
              console.error('Login/Approval error:', error);
              Alert.alert('Error', 'Server error, try again later');
            }
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: '#3535ebff',
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
          }}
          onPress={() => setIsModalVisible(false)}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

    </View>
  );
};

export default SeperatePMApproval;
