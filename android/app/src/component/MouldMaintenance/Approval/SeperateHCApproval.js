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
  StyleSheet,
} from 'react-native';
import Header from '../../Common/header/header';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL, REPORT_URL } from '../../Common/config/config';
import { SelectList } from 'react-native-dropdown-select-list';
import { launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './SeperateHCApprovalStyle';

const SeperateHCApproval = ({ username, setIsLoggedIn }) => {
  const [HCData, setHCData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [password, setPassword] = useState('');
  const [modalMode, setModalMode] = useState('');
  const [mouldOptions, setMouldOptions] = useState([]);
  const [selectMouldId, setSelectedMouldId] = useState('select mould');

  const navigation = useNavigation();

  const getHCStatusText = (hcStatus) => {
    switch (hcStatus) {
      case 1: return 'HC Not Started';
      case 2: return 'HC Warring';
      case 3: return 'HC Alarm';
      case 4: return 'HC in Prepration';
      case 5: return 'waiting for approval';
      case 6: return 'Approved';
      case 7: return 'HC Due';
      default: return 'Unknown Status';
    }
  };

  // Fetch users
  useEffect(() => {
    fetch(`${BASE_URL}/SeperateHCApproval/Users`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          const formattedUsers = data.data.map((user, index) => ({
            key: index.toString(),
            value: user.UserName,
          }));
          setUserList(formattedUsers);
        }
      })
      .catch((error) => console.error('API user fetch error:', error));
  }, []);

  // Fetch Mould IDs
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

  // Fetch HC Approval Data
  const fetchChecklistData = (mouldId) => {
    if (!mouldId) return;
    fetch(`${BASE_URL}/SeperateHCApproval/HC-approval/${mouldId}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          const formatted = [];
          if (Array.isArray(data.HCStart)) data.HCStart.forEach(item => formatted.push({ ...item, type: 'Start' }));
          if (Array.isArray(data.HCApproved)) data.HCApproved.forEach(item => formatted.push({ ...item, type: 'Approved' }));
          setHCData(formatted);
        } else setHCData([]);
      })
      .catch(err => console.error('❌ API fetch error:', err));
  };

  useEffect(() => { fetchChecklistData(selectMouldId); }, [selectMouldId]);

  // Render FlatList Item
  const renderHCItem = ({ item, index }) => (
    <View
      style={[
        styles.Container1,
        item.type === 'Start' && { backgroundColor: '#FFF8DC', borderColor: '#FFD700' },
        item.type === 'Approved' && { backgroundColor: '#D4EDDA', borderColor: '#28A745' },
        { padding: 10, marginBottom: 10, borderRadius: 8, borderWidth: 1 },
      ]}
    >
      {/* Row 1 */}
      <View style={styles.row1}>
        <Text style={styles.label}>Checklist Name</Text>
        <TextInput style={[styles.input1, { width: 250 }]} value={item.CheckListName || '-'} editable={false} />
        <Text style={styles.label}>Mould Name</Text>
        <TextInput style={[styles.input1, { width: 180 }]} value={item.MouldName || '-'} editable={false} />
        <Text style={styles.label}>HC Shots</Text>
        <TextInput style={[styles.input2, { width: 80 }]} value={item.HCShots?.toString() || '-'} editable={false} />
        <Text style={styles.label}>Instance</Text>
        <TextInput style={[styles.input2, { width: 80 }]} value={item.Instance?.toString() || '-'} editable={false} />
      </View>

      {/* Row 2 */}
      <View style={styles.row2}>
        <Text style={styles.label}>Due Shots</Text>
        <TextInput style={[styles.input2, { width: 80 }]} value={item.DueShots?.toString() || '-'} editable={false} />
        <Text style={styles.label}>Due Date</Text>
        <TextInput style={[styles.input2, { width: 180 }]} value={item.DueDate || '-'} editable={false} />
        <Text style={styles.label}>HCStart Date</Text>
        <TextInput style={[styles.input2, { width: 180 }]} value={item.HCStartDate || '-'} editable={false} />
        <Text style={styles.label}>HCEnd Date</Text>
        <TextInput style={[styles.input2, { width: 180 }]} value={item.HCEndDate || '-'} editable={false} />
      </View>

      {/* Row 3 */}
      <View style={styles.row2}>
        <Text style={styles.label}>Done By</Text>
        <TextInput style={[styles.input2, { width: 150 }]} value={username || '-'} editable={false} />
        <Text style={styles.label}>Approved By</Text>
        <TextInput style={[styles.input2, { width: 180 }]} value={item.ApprovedByUserName?.toString() || '--'} editable={false} />
        <Text style={styles.label}>Approved Date</Text>
        <TextInput style={[styles.input2, { width: 180 }]} value={item.ApprovedDate || '--'} editable={false} />
        <Text style={styles.label}>HC Status</Text>
        <TextInput style={[styles.input2, { width: 150 }]} value={getHCStatusText(item.HCStatus)} editable={false} />
      </View>

      {/* Row 4 - Remark */}
      <View style={styles.row2}>
        <Text style={styles.label}>Remark</Text>
        <TextInput
          style={[styles.input1, { width: '90%' }]}
          value={item.Remark}
          onChangeText={(text) => {
            if (item.HCStatus === 5) {
              const updated = [...HCData];
              updated[index].Remark = text;
              setHCData(updated);
            }
          }}
          editable={item.HCStatus === 5}
        />
      </View>

      {/* Buttons Row */}
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

        {item.HCStatus === 5 && (
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

        {item.HCStatus === 5 && (
          <TouchableOpacity
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
  );

  return (
    <View style={styles.container}>
      <Header username={username} title="HC Approval" />

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
        data={HCData}
        renderItem={renderHCItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 30, marginTop: 20 }}
      />

      {/* Modal */}
      <Modal transparent visible={isModalVisible} animationType="fade" onRequestClose={() => setIsModalVisible(false)}>
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContainer}>
            <Text style={modalStyles.modalTitle}>Login</Text>

            <Text style={modalStyles.modalLabel}>User</Text>
            <SelectList
              setSelected={setSelectedUser}
              data={userList}
              save="value"
              placeholder="Select User"
              boxStyles={modalStyles.modalSelectBox}
              dropdownStyles={modalStyles.modalSelectDropdown}
            />

            <Text style={modalStyles.modalLabel}>Password</Text>
            <TextInput
              style={modalStyles.modalInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <View style={modalStyles.modalButtonRow}>
              <TouchableOpacity
                style={[modalStyles.modalButton, { backgroundColor: '#28a745' }]}
                onPress={() => {
                  if (!selectedUser || !password) {
                    Alert.alert('Validation', 'Please select user and enter password');
                    return;
                  }

                  fetch(`${BASE_URL}/SeperateHCApproval/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: selectedUser, password }),
                  })
                    .then(res => res.json())
                    .then(data => {
                      if (data.status === 200) {
                        if (modalMode === 'approve') {
                          fetch(`${BASE_URL}/SeperateHCApproval/ApproveChecklist`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ CheckListID: selectedChecklist.CheckListID }),
                          })
                            .then(res => res.json())
                            .then(result => {
                              if (result.status === 200) {
                                Alert.alert('Approved', 'Checklist approved successfully');
                                fetchChecklistData(selectMouldId);
                                setIsModalVisible(false);
                                setPassword('');
                                setSelectedUser('');
                                setModalMode('');
                              } else {
                                Alert.alert('Error', result.message);
                              }
                            })
                            .catch(err => Alert.alert('Error', 'Approval API failed'));
                        } else if (modalMode === 'edit') {
                          navigation.navigate('HCApprovalCheckpoint', { checklist: selectedChecklist });
                          setIsModalVisible(false);
                          setPassword('');
                          setSelectedUser('');
                          setModalMode('');
                        }
                      } else Alert.alert('Login Failed', data.message);
                    })
                    .catch(() => Alert.alert('Error', 'Server error'));
                }}
              >
                <Text style={modalStyles.modalButtonText}>Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[modalStyles.modalButton, { backgroundColor: '#dc3545' }]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={modalStyles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
  },
  modalSelectBox: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    marginBottom: 15,
  },
  modalSelectDropdown: {
    backgroundColor: '#fff',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  modalButton: {
    flex: 0.48,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SeperateHCApproval;
