import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  useWindowDimensions 
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
import axios from 'axios';

const Quality = ({ route, navigation, username, setIsLoggedIn }) => {
  const { lineName } = route.params || {};
  const { equipmentName } = route.params;
  const [lineID, setLineID] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShift, setSelectedShift] = useState('');

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

  const [totalCount, setTotalCount] = useState('');
const { width } = useWindowDimensions();
const isLargeScreen = width > 600; // You can tune this threshold


  const shiftList = [
    { key: '1', value: 'A' },
    { key: '2', value: 'B' },
    { key: '3', value: 'C' },
  ];

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



  //================update api
  const handleUpdateRework = async () => {
    if (!selectedDate || !selectedShift || !selectedReason || !remark || !count) {
      alert('Please fill all required fields.');
      return;
    }

    const payload = {
      ProdDate: selectedDate,
      ProdShift: selectedShift,
      ReworkReason: selectedReason,
      Remark: remark,
      NOTOKQuantity: parseInt(count),
      EquipmentName: equipmentName,
      UserName: username || 'admin',
    };

    console.log('🚀 Sending payload to update-rework-cycle-summary:', payload);

    try {
      const response = await fetch(`${BASE_URL}/rework/update-rework-cycle-summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('✅ API Response:', result);

      if (response.ok && result.status === 200) {
        alert(result.message || 'Rework updated successfully.');

        // Update UI values with the response
        //   setCount(result.data.TotalCount?.toString() || '0');
        setGoodPart(result.data.GoodPart?.toString() || '0');
        setRejectedCount(result.data.RejectedCount?.toString() || '0');

        // Clear inputs
        setSelectedReason('');
        setRemark('');
      } else {
        console.warn('⚠️ Update failed:', result);
        alert(result.message || 'Failed to update.');
      }
    } catch (error) {
      console.error('❌ Error during API call:', error);
      alert('Error occurred while updating rework.');
    }
  };
  //-----------------fecth the table data--------
  const fetchEquipmentIdAndReworkDetails = async () => {
    try {
      if (!equipmentName) return;

      const equipmentRes = await fetch(`${BASE_URL}/oee/getEquipmentID/${encodeURIComponent(equipmentName)}`);
      const equipmentData = await equipmentRes.json();

      const EquipmentID = equipmentData?.EquipmentID;
      if (!EquipmentID) {
        console.warn("EquipmentID not found");
        return;
      }

      console.log("Fetched EquipmentID:", EquipmentID);

      const dtRes = await fetch(`${BASE_URL}/rework/ReworkGenelogy/${EquipmentID}`);
      const dtData = await dtRes.json();

      console.log("Rework API Response:", dtData);

      if (dtData.status === 200 && Array.isArray(dtData.data)) {
        setTableData(
          dtData.data.map(item => ({
            id: item.EquipmentID,
            EquipmentID: item.EquipmentID ? item.EquipmentID.toString() : '',
            EquipmentName: item.EquipmentName || '',
            ProdDate: item.ProdDate?.split("T")[0] || '',
            ProdShift: item.ProdShift,
            UserName: item.UserName,
            NOKQuantity: item.NOKQuantity,
            Remark: item.Remark || '',
            Reason: item.Reason || '',
          }))
        );
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching downtime data:", error);
    }
  };
  useEffect(() => {
    fetchEquipmentIdAndReworkDetails();
  }, [equipmentName]);
  //------------------------ APi to fetch the qty's from cycle time table


  const fetchCycleSummary = async (prodDate, shift, equipmentName) => {
    if (!prodDate || !shift || !equipmentName) return;

    try {
      // Step 1: Get EquipmentID from EquipmentName
      const equipmentIdResponse = await axios.get(`${BASE_URL}/oee/getEquipmentID/${equipmentName}`);
      const EquipmentID = equipmentIdResponse.data.EquipmentID;

      if (!EquipmentID) {
        console.warn("No EquipmentID found for:", equipmentName);
        return;
      }

      // Step 2: Call CycleSummary API with EquipmentID
      const response = await fetch(
        `${BASE_URL}/rework/CycleSummary?ProdDate=${encodeURIComponent(prodDate)}&ProdShift=${encodeURIComponent(shift)}&EquipmentID=${encodeURIComponent(EquipmentID)}`
      );
      const data = await response.json();

      console.log("CycleSummary API Response:", data);

      if (data.status === 200 && data.data.length > 0) {
        const cycle = data.data[0];
        setRejectedCount(cycle.RejectedCount?.toString() || '0');
        setGoodPart(cycle.GoodPart?.toString() || '0');
        setTotalCount(cycle.TotalCount?.toString() || '0');

      } else {
        console.warn("No cycle data found.");
        setRejectedCount('0');
        setGoodPart('0');
        setTotalCount('0');
      }
    } catch (error) {
      console.error("Error fetching cycle summary:", error);
    }
  };
  useEffect(() => {
    if (selectedDate && selectedShift && equipmentName) {
      fetchCycleSummary(selectedDate, selectedShift, equipmentName);
    }
  }, [selectedDate, selectedShift, equipmentName]);



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
    const formattedDate = date.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
    hideDatePicker();

    if (selectedShift && equipmentName) {
      fetchCycleSummary(formattedDate, selectedShift, equipmentName);
    }
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
          <View style={styles.fieldGroup}>
            <Text style={styles.labelWithMargin}>ProdDate</Text>
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
          </View>

          {/* Shift Group */}
          <View style={styles.fieldGroup}>
            <Text style={styles.labelWithMargin}>Shift</Text>
            <View style={styles.dropdownWrapper}>
              <SelectList
                setSelected={setSelectedShift}
                data={shiftList}
                save="value"
                placeholder="Select"
                boxStyles={{
                  backgroundColor: 'white',
                  borderRadius: scale(6),
                  minHeight: verticalScale(20),
                  borderColor: '#ccc',
                  borderWidth: 1,
                }}
                dropdownStyles={{
                  backgroundColor: '#f0f8ff',
                  borderRadius: scale(6),
                }}
              />
            </View>
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </View>

        <View style={styles.row2}>
          <Text style={styles.label}>Machine Name</Text>
          <TextInput style={styles.input2} value={equipmentName} editable={false} />

        </View>

        <View>
          <Text style={styles.label}>Rework Reason</Text>
           <View style={{ flex: 1, marginLeft: scale(2), marginRight: scale(2) }}>
          <SelectList
            setSelected={setSelectedReason}
            data={reasonList}
            save="value"
            placeholder="Select Reason"
            boxStyles={{
             
              backgroundColor: 'white',
            }}
            dropdownStyles={{
              backgroundColor: '#f0f8ff',
            }}
            defaultOption={{ key: '', value: '' }}
          />
          </View>
        </View>

        {/* <View style={styles.row4}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Total Qty</Text>
            <TextInput
              style={styles.input3}
              value={totalCount}
              editable={false} // If read-only
              keyboardType="numeric"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Ok Qty</Text>
            <TextInput
              style={styles.input3}
              value={goodPart}
              editable={false}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={[styles.row4, { marginTop: verticalScale(-4) }]}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Total NOK Qty</Text>
            <TextInput
              style={styles.input3}
              value={rejectedCount}
              editable={false}
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
        </View> */}
{isLargeScreen ? (
  // LARGE SCREEN: Show all 4 fields in a single row
  <View style={[styles.row4, { flexWrap: 'nowrap' }]}>
    <View style={styles.flexItem}>
      <Text style={styles.label}>Total Qty</Text>
      <TextInput
        style={styles.input3}
        value={totalCount}
        editable={false}
        keyboardType="numeric"
      />
    </View>
    <View style={styles.flexItem}>
      <Text style={styles.label}>OK Qty</Text>
      <TextInput
        style={styles.input3}
        value={goodPart}
        editable={false}
        keyboardType="numeric"
      />
    </View>
    <View style={styles.flexItem}>
      <Text style={styles.label}>Total NOK Qty</Text>
      <TextInput
        style={styles.input3}
        value={rejectedCount}
        editable={false}
        keyboardType="numeric"
      />
    </View>
    <View style={styles.flexItem}>
      <Text style={styles.label}>NOT OK Entry</Text>
      <TextInput
        style={styles.input3}
        value={count}
        onChangeText={setCount}
        keyboardType="numeric"
      />
    </View>
  </View>
) : (
  // SMALL SCREEN: Render same as before (2 rows)
  <>
    <View style={styles.row4}>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Total Qty</Text>
        <TextInput
          style={styles.input3}
          value={totalCount}
          editable={false}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Ok Qty</Text>
        <TextInput
          style={styles.input3}
          value={goodPart}
          editable={false}
          keyboardType="numeric"
        />
      </View>
    </View>

    <View style={[styles.row4, { marginTop: verticalScale(-4) }]}>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Total NOK Qty</Text>
        <TextInput
          style={styles.input3}
          value={rejectedCount}
          editable={false}
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
  </>
)}

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
                <DataTable.Title style={{ width: scale(20), justifyContent: 'center', borderRightWidth: 1, borderColor: '#aa9c9cff' }}>EquipmentID</DataTable.Title>
                <DataTable.Title style={{ width: scale(30), justifyContent: 'center', borderRightWidth: 1, borderColor: '#aa9c9cff' }}>Equipment Name</DataTable.Title>
                <DataTable.Title style={{ width: scale(30), justifyContent: 'center', borderRightWidth: 1, borderColor: '#aa9c9cff' }}>UserName</DataTable.Title>
                <DataTable.Title style={{ width: scale(30), justifyContent: 'center', borderRightWidth: 1, borderColor: '#aa9c9cff' }}>ProdDate</DataTable.Title>
                <DataTable.Title style={{ width: scale(20), justifyContent: 'center', borderRightWidth: 1, borderColor: '#aa9c9cff' }}>ProdShift</DataTable.Title>
                <DataTable.Title style={{ width: scale(40), justifyContent: 'center', borderRightWidth: 1, borderColor: '#aa9c9cff' }}>NOKQuantity</DataTable.Title>
                <DataTable.Title style={{ width: scale(10), justifyContent: 'center', borderRightWidth: 1, borderColor: '#aa9c9cff' }}>Remark</DataTable.Title>
                <DataTable.Title style={{ width: scale(200), justifyContent: 'center', borderRightWidth: 1, borderColor: '#aa9c9cff' }}>Reason</DataTable.Title>

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
                      <DataTable.Cell style={{ width: scale(20), justifyContent: 'center', borderRightWidth: 1, borderColor: '#E0E0E0' }}>{row.EquipmentID}</DataTable.Cell>
                      <DataTable.Cell style={{ width: scale(30), justifyContent: 'center', borderRightWidth: 1, borderColor: '#E0E0E0' }}>{row.EquipmentName}</DataTable.Cell>
                      <DataTable.Cell style={{ width: scale(30), justifyContent: 'center', borderRightWidth: 1, borderColor: '#E0E0E0' }}>{row.UserName}</DataTable.Cell>
                      <DataTable.Cell style={{ width: scale(30), justifyContent: 'center', borderRightWidth: 1, borderColor: '#E0E0E0' }}>{row.ProdDate}</DataTable.Cell>
                      <DataTable.Cell style={{ width: scale(20), justifyContent: 'center', borderRightWidth: 1, borderColor: '#E0E0E0' }}>{row.ProdShift}</DataTable.Cell>
                      <DataTable.Cell style={{ width: scale(40), justifyContent: 'center', borderRightWidth: 1, borderColor: '#E0E0E0' }}>{row.NOKQuantity}</DataTable.Cell>
                      <DataTable.Cell style={{ width: scale(10), justifyContent: 'center', borderRightWidth: 1, borderColor: '#E0E0E0' }}>{row.Remark}</DataTable.Cell>
                      <DataTable.Cell style={{ width: scale(200), justifyContent: 'center', borderRightWidth: 1, borderColor: '#E0E0E0' }}>{row.Reason}</DataTable.Cell>

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
