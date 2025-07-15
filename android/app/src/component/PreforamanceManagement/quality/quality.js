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

import AsyncStorage from '@react-native-async-storage/async-storage';

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


  //------------fetch the rework,rejected.... parts from cycletime data ---

  // const fetchCycleTimeData = (lineID) => {
  //   fetch(`${BASE_URL}/rework/cycletime/${lineID}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data?.data?.length > 0) {
  //         const cycleData = data.data[0];
  //         setRejectedCount(cycleData.RejectedCount?.toString() || '0');
  //         setRework(cycleData.Rework?.toString() || '0');
  //         setScrap(cycleData.Scrap?.toString() || '0');
  //         setGoodPart(cycleData.GoodPart?.toString() || '0');
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching cycle time data:", err);
  //     });
  // };

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
          <Text style={styles.label}>Rejected</Text>
          <TextInput style={styles.input1} value={rejectedCount} editable={false} />

          <Text style={styles.label}>Rework</Text>
          <TextInput style={styles.input1} value={rework} editable={false} />

          <Text style={styles.label}>Scrap</Text>
          <TextInput style={styles.input1} value={scrap} editable={false} />

          <Text style={styles.label}>Ok Part</Text>
          <TextInput style={styles.input1} value={goodPart} editable={false} />
        </View>

        <View style={styles.row2}>
          <Text style={styles.label}>Action</Text>
          <SelectList
            setSelected={setSelectedAction}
            data={actionList}
            save="value"
            placeholder="Select Action"
            boxStyles={{
              marginRight: '4%',
              width: 250,
              backgroundColor: 'white',
            }}
            dropdownStyles={{
              backgroundColor: '#f0f8ff',
            }}
            defaultOption={{ key: '', value: '' }}
          />


          <Text style={styles.label}>Count</Text>
          <TextInput style={styles.input2}
            value={count}
            onChangeText={setCount}
            keyboardType="numeric" />

          <Text style={styles.label}>Reason</Text>
          <SelectList
            setSelected={setSelectedReason}
            data={reasonList}
            save="value"
            placeholder="Select Reason"
            boxStyles={{
              marginRight: 7,
              width: 350,
              backgroundColor: 'white',
            }}
            dropdownStyles={{
              backgroundColor: '#f0f8ff',
            }}
            defaultOption={{ key: '', value: '' }}
          />

        </View>

        <View style={styles.row3}>
          <Text style={styles.label}>Remark</Text>
          <TextInput
            style={styles.input3}
            placeholder="Remark"
            value={remark}
            onChangeText={setRemark}
          />
          <TouchableOpacity style={styles.button} onPress={handleUpdateRework}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          backgroundColor: 'white',
          // borderRadius: 20,
          marginHorizontal: 20,
          width: '97.4%',
          marginTop: 10
        }}
      >
        <DataTable>
          <DataTable.Header>
            <DataTable.Title style={{ width: 120, justifyContent: 'center' }}>
              Line ID
            </DataTable.Title>
            <DataTable.Title style={{ width: 150, justifyContent: 'center' }}>
              Line Name
            </DataTable.Title>
            <DataTable.Title style={{ width: 150, justifyContent: 'center' }}>
              User
            </DataTable.Title>
            <DataTable.Title style={{ width: 100, justifyContent: 'center' }}>
              ProdDate
            </DataTable.Title>
            <DataTable.Title style={{ width: 130, justifyContent: 'center' }}>
              PrdoShift
            </DataTable.Title>
            <DataTable.Title style={{ width: 130, justifyContent: 'center' }}>
              SKUName
            </DataTable.Title>
            <DataTable.Title style={{ width: 150, justifyContent: 'center' }}>
              QTY
            </DataTable.Title>
            <DataTable.Title style={{ width: 130, justifyContent: 'center' }}>
              Reason
            </DataTable.Title>
            <DataTable.Title style={{ width: 200, justifyContent: 'center' }}>
              Remark
            </DataTable.Title>
          </DataTable.Header>
        </DataTable>
      </View>

      <ScrollView
        nestedScrollEnabled={true}
        style={{ maxHeight: 400, marginBottom: 30 }}
      >
        <DataTable
          style={{
            backgroundColor: 'white',
            marginHorizontal: 20,

            width: '97.4%',
          }}
        >
          {loading ? (
            <Text style={{ padding: 10 }}>Loading...</Text>
          ) : tableData.length === 0 ? (
            <Text style={{ padding: 10 }}>No data available</Text>
          ) : (
            tableData.map((item, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell style={{ width: 120, justifyContent: 'center' }}>
                  {item.LineID}
                </DataTable.Cell>
                <DataTable.Cell style={{ width: 150, justifyContent: 'center' }}>
                  {item.LineName}
                </DataTable.Cell>
                <DataTable.Cell style={{ width: 150, justifyContent: 'center' }}>
                  {item.User}
                </DataTable.Cell>
                <DataTable.Cell style={{ width: 100, justifyContent: 'center' }}>
                  {item.ProdDate?.split('T')[0]}
                </DataTable.Cell>
                <DataTable.Cell style={{ width: 130, justifyContent: 'center' }}>
                  {item.ProdShift}
                </DataTable.Cell>
                <DataTable.Cell style={{ width: 130, justifyContent: 'center' }}>
                  {item.SKUName}
                </DataTable.Cell>
                <DataTable.Cell style={{ width: 150, justifyContent: 'center' }}>
                  {item.Qty}
                </DataTable.Cell>
                <DataTable.Cell style={{ width: 130, justifyContent: 'center' }}>
                  {item.Reason}
                </DataTable.Cell>
                <DataTable.Cell style={{ width: 200, justifyContent: 'center' }}>
                  {item.Remark}
                </DataTable.Cell>
              </DataTable.Row>
            ))
          )}
        </DataTable>
      </ScrollView>
    </ScrollView>
  );
};

export default Quality;
