import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { DataTable } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list';
import { BASE_URL } from '../../Common/config/config';
import Header from '../../Common/header/header';
import { Modal } from 'react-native';
import styles from './style';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { scale, verticalScale, moderateScale } from '../../Common/utils/scale'; // Adjust path as needed

const Downtime = ({ route, username, setIsLoggedIn }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedLineName, setselectedLineName] = useState('');
  const [LineName, setLineName] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const lineName = route?.params?.lineName ?? 'No Line Selected';


  const [lossData, setLossData] = useState([]);
  const [selectedLoss, setSelectedLoss] = useState('');
  const [subLossData, setSubLossData] = useState([]);
  const [selectedSubLoss, setSelectedSubLoss] = useState('');

  const screenWidth = Dimensions.get("window").width;

  const data = {
    labels: ["8AM", "9AM", "10AM", "11AM", "12PM", "1PM"],
    datasets: [
      {
        data: [60, 70, 65, 80, 75, 90],
        strokeWidth: 2,
      }
    ],
  };

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
  //line name
  // Fetch Line Names from API
  useEffect(() => {
    const fetchLineName = async () => {
      // try {
      //   const response = await fetch(`${BASE_URL}/rework/Line`);
      //   const json = await response.json();
      //   if (json.status === 200) {
      //     const formattedData = json.data.map(item => ({ key: item.LineID.toString(), value: item.LineName }));
      //     setLineName(formattedData);
      //   }
      // } catch (error) {
      //   console.error('Error fetching LineName:', error);
      // } finally {
      //   setLoading(false);
      // }
    };
    fetchLineName();
  }, []);

  useEffect(() => {
    if (lineName) {
      setselectedLineName(lineName);
      console.log('Line Name:', LineName);
    }
  }, [lineName]);

  // Fetch Loss Names
  useEffect(() => {
    const fetchLossData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/downtime/loss`);
        const result = await response.json();
        console.log("Loss API Response:", result);

        // Check if data exists
        if (result?.data) {
          setLossData(result.data); // Correct way
        } else {
          console.warn("No data in loss API response.");
          setLossData([]);
        }
      } catch (error) {
        console.error("Error fetching loss data:", error);
        setLossData([]);
      }
    };
    fetchLossData();
  }, []);


  console.log("Loss Data:", lossData);
  console.log("Sub Loss Data:", subLossData);

  // Fetch Subloss Names when Loss is selected
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


  const handleRowPress = (row) => {
    setSelectedRow(row.id);
    setFormData(row);
    setSelectedLoss(row.LossName);  // Update loss selection
    setSelectedSubLoss(row.subLossName)
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  useEffect(() => {
    if (!selectedLineName) return;
    fetchTableData();
  }, [selectedLineName]);

  const fetchTableData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/downtime/downtime/details/LineName?LineName=${encodeURIComponent(selectedLineName)}`);
      // const response = await fetch(`${BASE_URL}/downtime/downtime/details/LineName?LineName=${LineName}`);
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

  const handleSave = async () => {
    if (!selectedRow) {
      alert("Please select a row to update.");
      return;
    }

    // Extract selected LossName and SubLossName from dropdowns
    // const selectedLossName = lossData.find(item => item.key === selectedLoss)?.value || formData.LossName;
    const selectedLossName = selectedLoss;

    const selectedSubLossName = subLossData.find(item => item.key === selectedSubLoss)?.value || formData.subLossName;

    console.log("Selected Loss Name:", selectedLossName);

    const requestBody = {
      DowntimeID: formData.downtimeID,
      LossName: selectedLossName,  // Ensure it's a string
      SubLossName: selectedSubLossName,  // Ensure it's a string
      Reason: formData.reason,
    };

    console.log("Sending Request Body:", JSON.stringify(requestBody, null, 2));

    try {
      const response = await fetch(`${BASE_URL}/downtime/downtime/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const json = await response.json();
      console.log("Parsed Response:", json);

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
              boxStyles={{
                width: verticalScale(150),
                backgroundColor: 'white',
              }}
              dropdownStyles={{
                backgroundColor: '#f0f8ff'// Replace with your desired color

              }}
              data={lossData.map((item) => ({
                key: item.LossID.toString(),
                value: item.LossName || "Unnamed Loss",
              }))}
              setSelected={setSelectedLoss}
              save={"value"}
              placeholder="Select Loss"
              defaultOption={
                formData.LossName
                  ? { key: formData.LossName, value: formData.LossName }
                  : null
              }
            />


          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Subloss Name</Text>
            {/* <View style={styles.pickerContainer}> */}
            <SelectList
              boxStyles={{
                width: verticalScale(150),
                backgroundColor: 'white',
              }}
              dropdownStyles={{
                backgroundColor: '#f0f8ff'// Replace with your desired color
              }}
              setSelected={setSelectedSubLoss}
              data={subLossData}
              save="key"
              placeholder="Select SubLoss"
              defaultOption={
                selectedSubLoss
                  ? { key: selectedSubLoss, value: subLossData.find(item => item.key === selectedSubLoss)?.value || selectedSubLoss }
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

        <View style={{ flex: 1, marginTop: verticalScale(10) }}>
          <ScrollView
            nestedScrollEnabled={true}
            style={{ maxHeight: 500, marginBottom: 30, backgroundColor: 'white' }}
          >

            <ScrollView horizontal={true}>
              <DataTable style={{ minWidth: scale(1100) }}>
                <DataTable.Header>
                  <DataTable.Title style={{ width: scale(120), justifyContent: 'center' }}>Downtime ID</DataTable.Title>
                  <DataTable.Title style={{ width: scale(150), justifyContent: 'center' }}>Loss Name</DataTable.Title>
                  <DataTable.Title style={{ width: scale(150), justifyContent: 'center' }}>Sub Loss Name</DataTable.Title>
                  <DataTable.Title style={{ width: scale(100), justifyContent: 'center' }}>Shift</DataTable.Title>
                  <DataTable.Title style={{ width: scale(130), justifyContent: 'center' }}>Start Time</DataTable.Title>
                  <DataTable.Title style={{ width: scale(130), justifyContent: 'center' }}>End Time</DataTable.Title>
                  <DataTable.Title style={{ width: scale(150), justifyContent: 'center' }}>Prod Date</DataTable.Title>
                  <DataTable.Title style={{ width: scale(130), justifyContent: 'center' }}>Duration</DataTable.Title>
                  <DataTable.Title style={{ width: scale(200), justifyContent: 'center' }}>Remark</DataTable.Title>
                </DataTable.Header>

                {tableData.length > 0 ? (
                  tableData.map((row) => (
                    <DataTable.Row
                      key={row.id}
                      onPress={() => handleRowPress(row)}
                      style={selectedRow === row.id ? styles.selectedRow : null}
                    >
                      <DataTable.Cell style={{ width: scale(120) }}>{row.downtimeID}</DataTable.Cell>
                      <DataTable.Cell style={{ width: scale(160) }}>{row.LossName}</DataTable.Cell>
                      <DataTable.Cell style={{ width: scale(160) }}>{row.subLossName}</DataTable.Cell>
                      <DataTable.Cell style={{ width: scale(100) }}>{row.prodShift}</DataTable.Cell>
                      <DataTable.Cell style={{ width: scale(140) }}>{row.downtimeStartTime}</DataTable.Cell>
                      <DataTable.Cell style={{ width: scale(140) }}>{row.downtimeEndTime}</DataTable.Cell>
                      <DataTable.Cell style={{ width: scale(160) }}>{row.prodDate}</DataTable.Cell>
                      <DataTable.Cell style={{ width: scale(130) }}>{row.duration}</DataTable.Cell>
                      <DataTable.Cell style={{ width: scale(200) }}>{row.reason}</DataTable.Cell>
                    </DataTable.Row>
                  ))
                ) : (
                  <Text style={{ padding: 10 }}>No data available</Text>
                )}
              </DataTable>

            </ScrollView>

          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};
export default Downtime;
