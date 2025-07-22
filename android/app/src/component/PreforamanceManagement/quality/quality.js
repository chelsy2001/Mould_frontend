import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import Header from '../../Common/header/header';
import styles from './style';
import { DataTable } from 'react-native-paper';
import { BASE_URL } from '../../Common/config/config';
import { scale, verticalScale, moderateScale } from '../../Common/utils/scale';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/FontAwesome'; // or MaterialIcons, Ionicons, etc.

const Quality = ({ route, navigation, username, setIsLoggedIn }) => {
  const { lineName } = route.params || {};

  const [lineID, setLineID] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [role, setRole] = useState('');
  const [rejectedCount, setRejectedCount] = useState('');
  const [rework, setRework] = useState('');
  const [scrap, setScrap] = useState('');
  const [goodPart, setGoodPart] = useState('');


  const [reasonList, setReasonList] = useState([]);
  const [actionList, setActionList] = useState([]);
  const [selectedReason, setSelectedReason] = useState('');
  const [selectedAction, setSelectedAction] = useState('');

  const [count, setCount] = useState('');
  const [remark, setRemark] = useState('');

  ///-----------set the role to quality supervisor
  useEffect(() => {
    const storeUserRole = async () => {
      try {
        await AsyncStorage.setItem('Role', 'Quality Supervisor');
        console.log('Role saved as Quality Supervisor');
      } catch (error) {
        console.log('Error storing user role:', error);
      }
    };

    storeUserRole();
  }, []);

  //------check and get the role--
  const getUserRole = async () => {
    try {
      const role = await AsyncStorage.getItem('Role');
      console.log('Retrieved role:', role);
    } catch (error) {
      console.log('Error retrieving user role:', error);
    }
  };

  // -------------------role is store in variable {role}----------
  // =======================================
  //----------fetch the lineid on the basis of lineName which is coming from previous screen
  useEffect(() => {
    if (lineName) {
      fetch(`${BASE_URL}/oee/getLineID/${lineName}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.LineID) {
            setLineID(data.LineID);
            fetchReworkData(data.LineID);
            fetchCycleTimeData(data.LineID);
          }
        })
        .catch((err) => {
          console.error("Error fetching LineID:", err);
        });
    }
  }, [lineName]);
  //-----------fetch the reason-------
  useEffect(() => {
    fetch(`${BASE_URL}/rework/ReworkReason`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          const formatted = data.data.map((item) => ({
            key: item.ReworkReasonID,
            value: item.ReworkReason,
          }));
          setReasonList(formatted);
        }
      })
      .catch((err) => {
        console.error('Error fetching Rework Reasons:', err);
      });
  }, []);

  //--------------fecth the action

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const role = await AsyncStorage.getItem('Role');
        const res = await fetch(`${BASE_URL}/rework/get-actions/${role}`);
        const data = await res.json();

        if (data && data.data) {
          const formattedActions = data.data.map((item, index) => ({
            key: index.toString(),
            value: item.Action,
          }));
          setActionList(formattedActions);
        }
      } catch (err) {
        console.error('Error fetching actions:', err);
      }
    };

    fetchActions();
  }, []);
  //================update api
  const handleUpdateRework = async () => {
    if (!lineID || !selectedAction || !selectedReason || !count || !remark) {
      alert('Please fill all required fields.');
      return;
    }

    const payload = {
      LineID: lineID,
      UserRole: role || 'Quality Supervisor',
      Action: selectedAction,
      Count: parseInt(count),
      Reason: selectedReason,
      Remark: remark,
    };

    console.log('🚀 Payload being sent to update-rework API:', payload);

    try {
      const response = await fetch(`${BASE_URL}/rework/update-rework`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      console.log('✅ API Response:', result);

      if (response.ok && result.status === 200) {
        alert(result.message || 'Updated successfully');

        // Optionally clear fields
        setCount('');
        setRemark('');
        setSelectedAction('');
        setSelectedReason('');
      } else {
        alert('Failed to update: ' + (result.message || 'Unknown error'));
        console.warn('⚠️ Update failed response:', result);
      }
    } catch (error) {
      console.error('❌ Error updating rework:', error);
      alert('Something went wrong while updating.');
    }
  };
  //-----------------fecth the table data--------


  const fetchTableData = async (lineID) => {
    try {
      const response = await fetch(`${BASE_URL}/REWORK/rework-genealogy/${lineID}`);
      const json = await response.json();
      if (json && json.data) {
        setTableData(json.data);
        setLoading(false);
      } else {
        setTableData([]);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching rework genealogy data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lineID) {
      fetchTableData(lineID);
    }
  }, [lineID]);


  const fetchCycleTimeData = (lineID) => {
    fetch(`${BASE_URL}/rework/cycletime/${lineID}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API Data Response:", data);  // 🔍 Add this line
        if (data?.data?.length > 0) {
          const cycleData = data.data[0];
          console.log("Parsed cycleData:", cycleData);  // 🔍 Add this line
          setRejectedCount(cycleData.RejectedCount?.toString() || '0');
          setRework(cycleData.Rework?.toString() || '0');
          setScrap(cycleData.Scrap?.toString() || '0');
          setGoodPart(cycleData.GoodPart?.toString() || '0');
        } else {
          console.log("No data received or data is empty.");
        }
      })
      .catch((err) => {
        console.error("Error fetching cycle time data:", err);
      });
  };
  useEffect(() => {
    fetchCycleTimeData(1); // or dynamic lineID
  }, []);
  //-----------------test values-----------------------
  useEffect(() => {
    console.log("Selected Rework Reason:", selectedReason);
  }, [selectedReason]);

  useEffect(() => {
    console.log("Selected Action:", selectedAction);
  }, [selectedAction]);

  const [selectedDate, setSelectedDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    setSelectedDate(formattedDate);
    hideDatePicker();
  };


  //-------------------------------------------------

  return (
    <ScrollView style={styles.container}>
      <Header
        username={username}
        setIsLoggedIn={setIsLoggedIn}
        title="Rework Reason Assignment Screen"
      //  title={lineName}
      //  title={role}
      />

      <View style={styles.Container1}>
        <View style={styles.row1}>
          <Text style={styles.label}>ProdDate</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.input12}
              value={selectedDate}
              editable={false}
              placeholder="Select Date"
            />
            <TouchableOpacity onPress={showDatePicker} style={styles.iconContainer}>
              <Icon name="calendar" size={20} color="#555" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Shift</Text>
          <TextInput style={styles.input1} value={rework} editable={false} />

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </View>

        <View style={styles.row2}>
          <Text style={styles.label}>Machine Name</Text>
          <TextInput style={styles.input2} value={rejectedCount} editable={false} />

        </View>

        <View>
          <Text style={styles.label}>Rework Reason</Text>
          <SelectList
            setSelected={setSelectedReason}
            data={reasonList}
            save="value"
            placeholder="Select Reason"
            boxStyles={{
              marginRight: scale(7),
              width: scale(243),
              backgroundColor: 'white',
            }}
            dropdownStyles={{
              backgroundColor: '#f0f8ff',
            }}
            defaultOption={{ key: '', value: '' }}
          />
        </View>

        <View style={styles.row4}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Total Qty</Text>
            <TextInput
              style={styles.input3}
              value={count}
              onChangeText={setCount}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Ok Qty</Text>
            <TextInput
              style={styles.input3}
              value={count}
              onChangeText={setCount}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={styles.row4}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Total NOK Qty</Text>
            <TextInput
              style={styles.input3}
              value={count}
              onChangeText={setCount}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>NOT OK Entry</Text>
            <TextInput
              style={styles.input3}
              value={count}
              onChangeText={setCount}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.row5}>
          <Text style={styles.label}>Remark</Text>

          <View style={styles.inputWithButton}>
            <TextInput
              style={styles.remarkInput}
              placeholder="Remark"
              value={remark}
              onChangeText={setRemark}
              multiline={true}
            />

            <TouchableOpacity style={styles.button} onPress={handleUpdateRework}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{ flex: 1, marginTop: verticalScale(10) }}>
        {/* Outer Horizontal ScrollView to enable horizontal scroll for both header + rows */}
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View>
            {/* Sticky Header (rendered outside vertical scroll) */}
            <DataTable style={{ backgroundColor: '#dcdcdc', minWidth: scale(1200) }}>
              <DataTable.Header>
                <DataTable.Title style={{ width: scale(20), justifyContent: 'center', borderRightWidth: 1, borderColor: '#aa9c9cff' }}>Line ID</DataTable.Title>
                <DataTable.Title style={{ width: scale(30), justifyContent: 'center', borderRightWidth: 1, borderColor: '#aa9c9cff' }}>Line Name</DataTable.Title>
                <DataTable.Title style={{ width: scale(30), justifyContent: 'center', borderRightWidth: 1, borderColor: '#aa9c9cff' }}>User</DataTable.Title>
                <DataTable.Title style={{ width: scale(30), justifyContent: 'center', borderRightWidth: 1, borderColor: '#aa9c9cff' }}>ProdDate</DataTable.Title>
                <DataTable.Title style={{ width: scale(20), justifyContent: 'center', borderRightWidth: 1, borderColor: '#aa9c9cff' }}>PrdoShift</DataTable.Title>
                <DataTable.Title style={{ width: scale(40), justifyContent: 'center', borderRightWidth: 1, borderColor: '#aa9c9cff' }}>SKUName</DataTable.Title>
                <DataTable.Title style={{ width: scale(10), justifyContent: 'center', borderRightWidth: 1, borderColor: '#aa9c9cff' }}>QTY</DataTable.Title>
                <DataTable.Title style={{ width: scale(50), justifyContent: 'center', borderRightWidth: 1, borderColor: '#aa9c9cff' }}>Reason</DataTable.Title>
                <DataTable.Title style={{ width: scale(200), justifyContent: 'center' }}>Remark</DataTable.Title>
              </DataTable.Header>
            </DataTable>

            {/* Vertically scrollable body */}
            <ScrollView
              style={{
                maxHeight: verticalScale(400),
                backgroundColor: 'white',
              }}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled
            >
              <DataTable style={{ minWidth: scale(1200) }}>
                {tableData.length > 0 ? (
                  tableData.map((row) => (
                    <DataTable.Row key={row.id} onPress={() => handleRowPress(row)}>
                      <DataTable.Cell style={{ width: scale(20), justifyContent: 'center', borderRightWidth: 1, borderColor: '#E0E0E0' }}>{row.LineID}</DataTable.Cell>
                      <DataTable.Cell style={{ width: scale(30), justifyContent: 'center', borderRightWidth: 1, borderColor: '#E0E0E0' }}>{row.LineName}</DataTable.Cell>
                      <DataTable.Cell style={{ width: scale(30), justifyContent: 'center', borderRightWidth: 1, borderColor: '#E0E0E0' }}>{row.User}</DataTable.Cell>
                      <DataTable.Cell style={{ width: scale(30), justifyContent: 'center', borderRightWidth: 1, borderColor: '#E0E0E0' }}>{row.ProdDate}</DataTable.Cell>
                      <DataTable.Cell style={{ width: scale(20), justifyContent: 'center', borderRightWidth: 1, borderColor: '#E0E0E0' }}>{row.PrdoShift}</DataTable.Cell>
                      <DataTable.Cell style={{ width: scale(40), justifyContent: 'center', borderRightWidth: 1, borderColor: '#E0E0E0' }}>{row.SKUName}</DataTable.Cell>
                      <DataTable.Cell style={{ width: scale(10), justifyContent: 'center', borderRightWidth: 1, borderColor: '#E0E0E0' }}>{row.QTY}</DataTable.Cell>
                      <DataTable.Cell style={{ width: scale(50), justifyContent: 'center', borderRightWidth: 1, borderColor: '#E0E0E0' }}>{row.Reason}</DataTable.Cell>
                      <DataTable.Cell style={{ width: scale(200), justifyContent: 'center' }}>{row.Remark}</DataTable.Cell>
                    </DataTable.Row>
                  ))
                ) : (
                  <Text
                    style={{
                      padding: verticalScale(10),
                      textAlign: 'center',
                      fontSize: moderateScale(14),
                    }}
                  >
                    No data available
                  </Text>
                )}
              </DataTable>
            </ScrollView>
          </View>
        </ScrollView>
      </View>

    </ScrollView>
  );
};

export default Quality;
