import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { DataTable } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list';
import { BASE_URL } from '../../Common/config/config';
import Header from '../../Common/header/header';
import styles from './style';
import { scale, verticalScale,moderateScale } from '../../Common/utils/scale';

const Downtime = ({ route, username, setIsLoggedIn }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedLineName, setselectedLineName] = useState('');
  const [LineName, setLineName] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [lossData, setLossData] = useState([]);
  const [selectedLoss, setSelectedLoss] = useState('');
  const [subLossData, setSubLossData] = useState([]);
  const [selectedSubLoss, setSelectedSubLoss] = useState('');


  const lineName = route?.params?.lineName ?? 'No Line Selected';
 const { equipmentName } = route.params;


 
  const COLUMN_WIDTHS = [
    scale(60), scale(100), scale(100), scale(50),
    scale(80), scale(80), scale(80), scale(80), scale(200),
  ];

  const [formData, setFormData] = useState({
    downtimeID: '',
    LossName: '',
    subLossName: '',
    shift: '',
    startTime: '',
    endTime: '',
    prodDate: '',
    duration: '',
    reason: ''
  });

  useEffect(() => {
    if (lineName) {
      setselectedLineName(lineName);
    }
  }, [lineName]);

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

  useEffect(() => {
    if (!selectedLineName) return;
    fetchTableData();
  }, [selectedLineName]);

  const fetchTableData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/downtime/downtime/details/LineName?LineName=${encodeURIComponent(selectedLineName)}`);
      const json = await response.json();
      if (json.status === 200) {
        setTableData(json.data.map(item => ({
          id: item.DowntimeID,
          downtimeID: item.DowntimeID.toString(),
          prodDate: item.ProdDate?.split("T")[0] || '',
          prodShift: item.ProdShift,
          LossName: item.LossName,
          subLossName: item.SubLossName,
          downtimeStartTime: new Date(item.StartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          downtimeEndTime: new Date(item.EndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reason: item.Reason || '',
          duration: item.SystemDownTime ? `${item.SystemDownTime} min` : "N/A"
        })));
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  const handleRowPress = (row) => {
    setSelectedRow(row.id);
    setFormData(row);
    setSelectedLoss(row.LossName);
    setSelectedSubLoss(row.subLossName);
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
        fetchTableData();
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
      <View>
        <Header username={username} setIsLoggedIn={setIsLoggedIn} title='DownTime Reason Assignment Screen' />
        <View style={styles.Container1}>

          <View style={styles.row}>
            <Text style={styles.label}>Line Name</Text>
            <View style={styles.pickerContainer}>
              <Text style={{ padding: scale(10), alignContent: 'center' }}>{lineName}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Loss Name</Text>
            <SelectList
              boxStyles={{ width: verticalScale(150), backgroundColor: 'white' }}
              dropdownStyles={{ backgroundColor: '#f0f8ff' }}
              data={lossData.map(item => ({
                key: item.LossID.toString(),
                value: item.LossName || "Unnamed Loss"
              }))}
              setSelected={setSelectedLoss}
              save="value"
              placeholder="Select Loss"
              defaultOption={
                formData.LossName ? { key: formData.LossName, value: formData.LossName } : null
              }
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Subloss Name</Text>
            <SelectList
              boxStyles={{ width: verticalScale(150), backgroundColor: 'white' }}
              dropdownStyles={{ backgroundColor: '#f0f8ff' }}
              setSelected={setSelectedSubLoss}
              data={subLossData}
              save="key"
              placeholder="Select SubLoss"
              defaultOption={
                selectedSubLoss
                  ? {
                    key: selectedSubLoss,
                    value: subLossData.find(item => item.key === selectedSubLoss)?.value || selectedSubLoss
                  }
                  : null
              }
            />
          </View>

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

        {/* Table Section */}
        {/* <View style={{ flex: 1, marginTop: verticalScale(10) }}>
          <ScrollView
            nestedScrollEnabled={true}
            style={{
              maxHeight: '50%',
              marginBottom: scale(30),
              backgroundColor: '#dcdcdc',
              borderRadius: scale(10)
            }}
          >
            <ScrollView horizontal={true} style={{ backgroundColor: '#dcdcdc' }}>
              <View style={{
                backgroundColor: '#dcdcdc',
                minWidth: COLUMN_WIDTHS.reduce((a, b) => a + b, 0)
              }}>
                <DataTable>
                  <DataTable.Header>
                    {["Downtime ID", "Loss Name", "Sub Loss Name", "Shift", "Start Time", "End Time", "Prod Date", "Duration", "Remark"].map((title, index) => (
                      <DataTable.Title
                        key={index}
                        style={{
                          width: COLUMN_WIDTHS[index],
                          justifyContent: 'center',
                          borderRightWidth: 1,
                          borderRightColor: '#ccc',
                          backgroundColor: '#dcdcdc'
                        }}
                      >
                        {title}
                      </DataTable.Title>
                    ))}
                  </DataTable.Header>

                  {tableData.length > 0 ? (
                    tableData.map((row) => (
                      <DataTable.Row
                        key={row.id}
                        onPress={() => handleRowPress(row)}
                        style={[
                          selectedRow === row.id ? styles.selectedRow : null,
                          { borderBottomWidth: 1, borderColor: '#ddd', backgroundColor: 'white' }
                        ]}
                      >
                        {[
                          row.downtimeID,
                          row.LossName,
                          row.subLossName,
                          row.prodShift,
                          row.downtimeStartTime,
                          row.downtimeEndTime,
                          row.prodDate,
                          row.duration,
                          row.reason
                        ].map((cell, index) => (
                          <DataTable.Cell
                            key={index}
                            style={{
                              width: COLUMN_WIDTHS[index],
                              justifyContent: 'center',
                              borderRightWidth: 1,
                              borderRightColor: '#eee'
                            }}
                          >
                            {cell}
                          </DataTable.Cell>
                        ))}
                      </DataTable.Row>
                    ))
                  ) : (
                    <Text style={{ padding: 10 }}>No data available</Text>
                  )}
                </DataTable>
              </View>
            </ScrollView>
          </ScrollView>
        </View> */}

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
                        <DataTable.Cell style={{ width: scale(100), justifyContent: 'center' ,borderRightWidth: 1,borderColor: '#E0E0E0' }}>{row.subLossName}</DataTable.Cell>
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
        
      </View>
    </ScrollView>
  );
};

export default Downtime;
