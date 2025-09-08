import React, { useState, useEffect } from 'react'; 
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Header from '../../Common/header/header';
import styles from './style';
import { SelectList } from 'react-native-dropdown-select-list';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../Common/config/config';

const hcStatus = ({ username ,setIsLoggedIn}) => {
  const navigation = useNavigation();

  const [selectMouldId, setSelectedMouldId] = useState(null);
  const [mouldScan, setMouldScan] = useState('');
  const [mouldOptions, setMouldOptions] = useState([]); 

  const [checklistOptions, setChecklistOptions] = useState([]);
  const [selectCheckListID, setSelectedCheckListID] = useState(null);

  const [filteredChecklist, setFilteredChecklist] = useState(null);

  // PM Status color
  const getColorHC = (value) => {
    switch (value) {
      case 1: return '#27ae60'; // GREEN it is in normal state
      case 2: return '#e68b22ff'; // YELLOW it is in warning state
      case 3: return '#e73c3cff'; // RED it is in alarm state
      case 4: return '#3c64e7ff'; // it is in maintenance state
      case 5: return '#085a49ff'; // PURPLE it is in maintenance state
      case 6: return '#27ae60'; // PURPLE it is in maintenance state
      case 7: return '#f1c40f'; // ORANGE it is in Due
      default: return '#bdc3c7'; // GRAY it is in unknown state
    }
  };

  // PM Status text
  const getHCStatusText = (Status) => {
    switch (Status) {
      case 1:
        return 'HC Not Started';
      case 2:
        return 'HC Warring';
      case 3:
        return 'HC Alarm';
      case 4:
        return 'HC in Prepration';
      case 5:
        return 'waiting for approval';
      case 6:
        return 'Approived';
      case 7:
        return 'HC Due';  
      default:
        return 'Unknown Status';
    }
  };

  // 🔹 Fetch all Mould IDs
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
        }
      } catch (error) {
        console.error('Error fetching Mould IDs:', error);
      }
    };
    fetchMouldIds();
  }, []);

  // 🔹 Fetch Checklist by MouldID
  const fetchChecklistByMould = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/hc/checklist/${id}`);
      const json = await response.json();
      if (json.status === 200) {
        const options = json.data.map(item => ({
          key: item.CheckListID,
          value: item.CheckListID,
        }));
        setChecklistOptions(options);
      } else {
        setChecklistOptions([]);
      }
    } catch (error) {
      console.error('Error fetching Checklist:', error);
    }
  };

  // 🔹 Fetch PM Details by ChecklistID
  const fetchPMDetails = async (checklistID) => {
    try {
      const response = await fetch(`${BASE_URL}/hc/hcDetails/${checklistID}`);
      const json = await response.json();
      if (json.status === 200 && json.data.length > 0) {
        setFilteredChecklist(json.data[0]);
      } else {
        setFilteredChecklist(null);
      }
    } catch (error) {
      console.error('Error fetching checklist details:', error);
    }
  };

  // 🔹 When MouldID changes → fetch Checklist
  useEffect(() => {
    if (selectMouldId) {
      fetchChecklistByMould(selectMouldId);
      setSelectedCheckListID(null);
      setFilteredChecklist(null);
    }
  }, [selectMouldId]);

  // 🔹 When ChecklistID changes → fetch PM Details
  useEffect(() => {
    if (selectCheckListID) {
      fetchPMDetails(selectCheckListID);
    }
  }, [selectCheckListID]);

  // 🔹 If scanned manually
  useEffect(() => {
    if (mouldScan) {
      fetchChecklistByMould(mouldScan);
    }
  }, [mouldScan]);

  const hcWarning = filteredChecklist ? filteredChecklist.HCStatus : null;

  return (
    <View style={styles.container}>
      <Header username={username} setIsLoggedIn={setIsLoggedIn} title=' Health Check Monitoring' />
      
      <ScrollView>
        {/* 🔹 Select Mould */}
        <View style={styles.dropdown}>
          <Text style={styles.label}>Select Mould</Text>
          <SelectList 
            setSelected={(val) => setSelectedMouldId(val)} 
            data={mouldOptions} 
            save="value"
            placeholder="Select Mould ID"
          />
        </View>
        {/* 🔹 Select Checklist */}
        {/* {checklistOptions.length > 0 && ( */}
          <View style={styles.dropdown}>
            <Text style={styles.label}>Select Checklist</Text>
            <SelectList 
              setSelected={(val) => setSelectedCheckListID(val)} 
              data={checklistOptions} 
              save="value"
              placeholder="Select Checklist ID"
            />
          </View>
        {/* )} */}

        {/* 🔹 Show Details */}
        {filteredChecklist ? (
            <View style={styles.mouldData}>
    <Text style={styles.label}>🧰Health Check Details</Text>

    <View style={styles.dataRow}>
    <Text style={styles.dataLabel}>🆔   Mould ID: </Text>
    <Text style={styles.dataValue}>{filteredChecklist.MouldID}</Text>
    </View>
    <View style={styles.separator} />

     <View style={styles.dataRow}>
     <Text style={styles.dataLabel}>🔤   MachineID: </Text>
     <Text style={styles.dataValue}>{filteredChecklist.EquipmentID}</Text>
     </View>
    <View style={styles.separator} />

    <View style={styles.dataRow}>
    <Text style={styles.dataLabel}>📝CheckListID: </Text>
    <Text style={styles.dataValue}>{filteredChecklist.CheckListID}</Text>
    </View>
    <View style={styles.separator} />

    <View style={styles.dataRow}>
    <Text style={styles.dataLabel}>🔢 PMFreqCount: </Text>
    <Text style={styles.dataValue}>{filteredChecklist.PMFreqCount}</Text>
    </View>
    <View style={styles.separator} />
    <View style={styles.dataRow}> 
    <Text style={styles.dataLabel}>🔢 PMFreqDays: </Text>
    <Text style={styles.dataValue}>{filteredChecklist.PMFreqDays}</Text>
    </View>
    <View style={styles.separator} />

    <View style={styles.dataRow}>
    <Text style={styles.dataLabel}>🔧WarningCount</Text>
    <Text style={styles.dataValue}> {filteredChecklist.PMWarningCount}</Text>
    </View>
    <View style={styles.separator} />

    <View style={styles.dataRow}>
    <Text style={styles.dataLabel}>📅 PMWarningDays </Text>
    <Text style={styles.dataValue}>{filteredChecklist.PMWarningDays}</Text>
    </View>
    <View style={styles.separator} />

    <View style={styles.dataRow}>
    <Text style={styles.dataLabel }>⚙️ MaterialID </Text>
    <Text style={styles.dataValue}>{filteredChecklist.MaterialID}</Text>
    </View>
    <View style={styles.separator} />

    <View style={styles.dataRow}>
    <Text style={styles.dataLabel }>⚙️ MaterialName </Text>
    <Text style={styles.dataValue}>{filteredChecklist.MaterialName}</Text>
    </View>

    <View style={styles.separator} />

    <View style={styles.dataRow}>
    <Text style={[styles.dataLabel, { color: getColorHC(hcWarning) }]}>
      🛡   HC Status: 
    </Text>
    <Text style={[styles.dataValue,{ color: getColorHC(hcWarning) }]}>
    {getHCStatusText(filteredChecklist.HCStatus)}
    </Text>
    </View>
  </View>
        ) : (
          <Text style={styles.text}>No Checklist Selected</Text>
        )}

        <TouchableOpacity style={styles.confirmButton} onPress={() => navigation.navigate('MouldHome')}>
          <Text style={styles.confirmText}>CLOSE</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default hcStatus;
