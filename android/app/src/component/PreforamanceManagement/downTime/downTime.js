import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { DataTable } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list';
import { BASE_URL } from '../../Common/config/config';
import Header from '../../Common/header/header';
import styles from './style';
import { scale, verticalScale, moderateScale } from '../../Common/utils/scale';

const Downtime = ({ route, username, setIsLoggedIn }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedLineName, setselectedLineName] = useState('');
  const [LineName, setLineName] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [lossData, setLossData] = useState([]);
  const [selectedLoss, setSelectedLoss] = useState('');
  const [subLossData, setSubLossData] = useState([]);
  const [selectedSubLoss, setSelectedSubLoss] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // NEW STATES
  // const [loss4MData, setLoss4MData] = useState([]);
  // const [selected4MLoss, setSelected4MLoss] = useState('');

  const lineName = route?.params?.lineName ?? 'No Line Selected';
  const { equipmentName } = route.params;

  const [formData, setFormData] = useState({
    downtimeID: '',
    LossName: '',
    subLossName: '',
    // loss4MData:'',
    shift: '',
    startTime: '',
    endTime: '',
    prodDate: '',
    duration: '',
    reason: '',
  });

  useEffect(() => {
    if (lineName) {
      setselectedLineName(lineName);
    }
  }, [lineName]);

  // Existing Loss Fetch
  useEffect(() => {
    const fetchLossData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/downtime/loss`);
        const result = await response.json();
        if (result?.data) {
          setLossData(result.data);
        } else {
          setLossData([]);
        }
      } catch (error) {
        console.error("Error fetching loss data:", error);
        setLossData([]);
      }
    };
    fetchLossData();
  }, []);

  // 🔹 NEW: Fetch 4M Loss Data
  // useEffect(() => {
  //   const fetchLoss4MData = async () => {
  //     try {
  //       const response = await fetch(`${BASE_URL}/downtime/loss4M`);
  //       const result = await response.json();
  //       if (result?.data) {
  //         setLoss4MData(result.data.map(item => ({
  //           key: item["4MLossID"].toString(),
  //           value: item["4MLossName"],
  //         })));
  //       } else {
  //         setLoss4MData([]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching 4M loss data:", error);
  //     }
  //   };
  //   fetchLoss4MData();
  // }, []);

  useEffect(() => {
    if (!selectedLoss) return;
    const fetchSubLossData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/downtime/Subloss/LossName?LossName=${selectedLoss}`);
        const json = await response.json();
        if (json.status === 200) {
          setSubLossData(json.data.map(item => ({ key: item.SubLossID.toString(), value: item.SubLossName })));
        }
      } catch (error) {
        console.error('Error fetching subloss data:', error);
      }
    };
    fetchSubLossData();
  }, [selectedLoss]);

  const fetchEquipmentIdAndDT = async () => {
    try {
      if (!equipmentName) return;

      const equipmentRes = await fetch(`${BASE_URL}/oee/getEquipmentID/${encodeURIComponent(equipmentName)}`);
      const equipmentData = await equipmentRes.json();

      const EquipmentID = equipmentData?.EquipmentID;
      if (!EquipmentID) return;

      const dtRes = await fetch(`${BASE_URL}/downtime/Getdowntime/unassigned/${EquipmentID}`);
      const dtData = await dtRes.json();

      if (dtData.status === 200 && Array.isArray(dtData.data)) {
        setTableData(
          dtData.data.map(item => ({
            id: item.DowntimeID,
            downtimeID: item.DowntimeID ? item.DowntimeID.toString() : '',
            prodDate: item.ProdDate?.split("T")[0] || '',
            prodShift: item.ProdShift,
            LossName: item.LossName,
            subLossName: item.SubLossName,
            // loss4MName: item["4MLossName"] || '',
            downtimeStartTime: item.StartTime ? new Date(item.StartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            downtimeEndTime: item.EndTime ? new Date(item.EndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            reason: item.Reason || '',
            duration: item.Duration || '0',
          }))
        );
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching downtime data:", error);
      console.log("Duration",item.Duration);
    }
  };

  useEffect(() => {
    fetchEquipmentIdAndDT();
  }, [equipmentName]);

  const handleRowPress = (row) => {
    setSelectedRow(row.id);
    setFormData(row);
    setSelectedLoss(row.LossName);
    setSelectedSubLoss(row.subLossName);
    // setSelected4MLoss(row.loss4MName);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    if (!selectedRow) {
      alert("Please select a row to update.");
      return;
    }

    const selectedLossName = selectedLoss;
    const selectedSubLossName = subLossData.find(item => item.key === selectedSubLoss)?.value || formData.subLossName;

    const requestBody = {
      DowntimeID: formData.downtimeID,
      LossName: selectedLossName,
      SubLossName: selectedSubLossName,
      Reason: formData.reason,
      // LossName4M: selected4MLoss,  // ✅ include 4M Loss
    };

    try {
      const response = await fetch(`${BASE_URL}/downtime/downtime/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const json = await response.json();

      if (json.status === 200) {
        alert("Update successful");
        // Clear form fields after successful save
        setFormData({
          downtimeID: '',
          LossName: '',
          subLossName: '',
          shift: '',
          startTime: '',
          endTime: '',
          prodDate: '',
          duration: '',
          reason: '',
        });
        setSelectedLoss('');
        setSelectedSubLoss('');
        setSubLossData([]);
        setSelectedRow(null);
        setRefreshKey(prev => prev + 1);
        fetchEquipmentIdAndDT();
      } else {
        alert("Update failed: " + json.message);
      }
    } catch (error) {
      console.error("Error updating reason:", error);
      alert("Error updating reason. Please check console logs.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header username={username} setIsLoggedIn={setIsLoggedIn} title='DownTime Reason Assignment Screen' />
      <View style={styles.Container1}>
        <View style={styles.row}>
          <Text style={styles.label}>Machine Name</Text>
          <View style={styles.pickerContainer}>
            <Text style={{ padding: scale(10) }}>{equipmentName}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Loss Name</Text>
          <View style={{ flex: 1, marginLeft: scale(53) }}>
            <SelectList
              key={`loss-${refreshKey}`}
              boxStyles={{ backgroundColor: 'white' }}
              dropdownStyles={{ backgroundColor: '#f0f8ff' }}
              data={lossData.map(item => ({
                key: item.LossID?.toString(),
                value: item.LossName || "Unnamed Loss",
              }))}
              setSelected={setSelectedLoss}
              save="value"
              placeholder="Select Loss"
              defaultOption={
                formData.LossName ? { key: formData.LossName, value: formData.LossName } : null
              }
            />
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Subloss Name</Text>
          <View style={{ flex: 1, marginLeft: scale(35) }}>
            <SelectList
              key={`subloss-${refreshKey}`}
              boxStyles={{ backgroundColor: 'white' }}
              dropdownStyles={{ backgroundColor: '#f0f8ff' }}
              setSelected={setSelectedSubLoss}
              data={subLossData}
              save="key"
              placeholder="Select SubLoss"
              defaultOption={
                selectedSubLoss
                  ? {
                    key: selectedSubLoss,
                    value: subLossData.find(item => item.key === selectedSubLoss)?.value || selectedSubLoss,
                  }
                  : null
              }
            />
          </View>
        </View>

        {/* 🔹 NEW DROPDOWN FOR 4M LOSS NAME */}
        {/* <View style={styles.row}>
          <Text style={styles.label}>4M Loss Name</Text>
          <View style={{ flex: 1, marginLeft: scale(25) }}>
            <SelectList
              boxStyles={{ backgroundColor: 'white' }}
              dropdownStyles={{ backgroundColor: '#f0f8ff' }}
              setSelected={setSelected4MLoss}
              data={loss4MData}
              save="value"
              placeholder="Select 4M Loss"
              defaultOption={
                selected4MLoss
                  ? { key: selected4MLoss, value: selected4MLoss }
                  : null
              }
            />
          </View>
        </View> */}

        <Text style={[styles.label, { marginLeft: 12 }]}>Remark</Text>
        <TextInput
          style={[styles.remarkInput1]}
          value={formData.reason}
          onChangeText={(text) => handleInputChange('reason', text)}
          multiline={true}
          placeholder="Enter your remark"
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, marginTop: verticalScale(10) }}>
          {/* Outer Horizontal ScrollView to enable horizontal scroll for both header + rows */}
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
              {/* Sticky Header (rendered outside vertical scroll) */}
              <DataTable style={{ backgroundColor: '#dcdcdc', minWidth: scale(1200) }}>
                <DataTable.Header>
                  <DataTable.Title style={{ width: scale(60), justifyContent: 'center',borderRightWidth: 1,borderColor: '#aa9c9cff' }}>Downtime ID</DataTable.Title>
                  <DataTable.Title style={{ width: scale(100), justifyContent: 'center',borderRightWidth: 1,borderColor: '#aa9c9cff'  }}>Loss Name</DataTable.Title>
                  <DataTable.Title style={{ width: scale(100), justifyContent: 'center',borderRightWidth: 1,borderColor: '#aa9c9cff'  }}>Sub Loss Name</DataTable.Title>
                  {/* <DataTable.Title style={{ width: scale(100), justifyContent: 'center',borderRightWidth: 1,borderColor: '#aa9c9cff'  }}>4M Loss Name</DataTable.Title> */}
                  <DataTable.Title style={{ width: scale(50), justifyContent: 'center' ,borderRightWidth: 1,borderColor: '#aa9c9cff' }}>Shift</DataTable.Title>
                  <DataTable.Title style={{ width: scale(80), justifyContent: 'center',borderRightWidth: 1,borderColor: '#aa9c9cff'  }}>Start Time</DataTable.Title>
                  <DataTable.Title style={{ width: scale(80), justifyContent: 'center',borderRightWidth: 1,borderColor: '#aa9c9cff'  }}>End Time</DataTable.Title>
                  <DataTable.Title style={{ width: scale(80), justifyContent: 'center',borderRightWidth: 1,borderColor: '#aa9c9cff'  }}>Prod Date</DataTable.Title>
                  <DataTable.Title style={{ width: scale(80), justifyContent: 'center',borderRightWidth: 1,borderColor: '#aa9c9cff'  }}>Duration</DataTable.Title>
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
                      <DataTable.Row key={row.id}  onPress={() => handleRowPress(row)}>
                        <DataTable.Cell style={{ width: scale(60), justifyContent: 'center' ,borderRightWidth: 1,borderColor: '#E0E0E0' }}>{row.downtimeID}</DataTable.Cell>
                        <DataTable.Cell style={{ width: scale(100), justifyContent: 'center' ,borderRightWidth: 1,borderColor: '#E0E0E0' }}>{row.LossName}</DataTable.Cell>
                 <DataTable.Cell style={{ width: scale(100), justifyContent: 'center', borderRightWidth: 1, borderColor: '#E0E0E0' }}>
    {row.subLossName}
  </DataTable.Cell>
  {/* <DataTable.Cell style={{ width: scale(100), justifyContent: 'center', borderRightWidth: 1, borderColor: '#E0E0E0' }}>
    {row.loss4MName}
  </DataTable.Cell> */}
                        <DataTable.Cell style={{ width: scale(50), justifyContent: 'center',borderRightWidth: 1,borderColor: '#E0E0E0'  }}>{row.prodShift}</DataTable.Cell>
                        <DataTable.Cell style={{ width: scale(80), justifyContent: 'center',borderRightWidth: 1,borderColor: '#E0E0E0'  }}>{row.downtimeStartTime}</DataTable.Cell>
                        <DataTable.Cell style={{ width: scale(80), justifyContent: 'center',borderRightWidth: 1,borderColor: '#E0E0E0'  }}>{row.downtimeEndTime}</DataTable.Cell>
                        <DataTable.Cell style={{ width: scale(80), justifyContent: 'center',borderRightWidth: 1,borderColor: '#E0E0E0'  }}>{row.prodDate}</DataTable.Cell>
                        <DataTable.Cell style={{ width: scale(80), justifyContent: 'center',borderRightWidth: 1,borderColor: '#E0E0E0'  }}>{row.duration}</DataTable.Cell>
                        <DataTable.Cell style={{ width: scale(200), justifyContent: 'center' }}>{row.reason}</DataTable.Cell>
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

export default Downtime;
