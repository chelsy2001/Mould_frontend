import React, { useState, useEffect } from 'react'; 
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Header from '../../Common/header/header';
import styles from './style';
import { SelectList } from 'react-native-dropdown-select-list';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../Common/config/config';

const pmStatus = ({ username ,setIsLoggedIn}) => {
  const navigation = useNavigation();

  const [selectMouldId, setSelectedMouldId] = useState(null);
  const [mouldScan, setMouldScan] = useState('');
  const [mouldOptions, setMouldOptions] = useState([]); 

  const [checklistOptions, setChecklistOptions] = useState([]);
  const [selectCheckListID, setSelectedCheckListID] = useState(null);

  const [filteredChecklist, setFilteredChecklist] = useState(null);

  // PM Status color
  const getColorPM = (value) => {
    switch (value) {
      case 1: return '#27ae60';
      case 2: return '#f1c40f';
      case 3: return '#e74c3c';
      case 4: return '#f0d851';
      case 5: case 6: case 7: return '#8e44ad';
      case 8: return '#e67e22';
      default: return '#bdc3c7';
    }
  };

  // PM Status text
  const getPMStatusText = (status) => {
    switch (status) {
      case 1: return 'Normal';
      case 2: return 'Warning';
      case 3: return 'Alarm';
      case 4: return 'Inprocess';
      case 5: return 'PM in Main Execution';
      case 6: return 'Waiting for Approval';
      case 7: return 'PM Approved';
      case 8: return 'PM Due'; 
      default: return 'Unknown Status';
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
      const response = await fetch(`${BASE_URL}/pm/checklist/${id}`);
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
      const response = await fetch(`${BASE_URL}/pm/PMDetails/${checklistID}`);
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

  const pmWarning = filteredChecklist ? filteredChecklist.PMStatus : null;

  return (
    <View style={styles.container}>
      <Header username={username} setIsLoggedIn={setIsLoggedIn} title='Preventive Maintenance Monitoring' />
      
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
    <Text style={styles.label}>🧰Preventive Maintenance Details</Text>

    <View style={styles.dataRow}>
    <Text style={styles.dataLabel}>🆔   Mould ID: </Text>
    <Text style={styles.dataValue}>{filteredChecklist.MouldID}</Text>
    </View>
    <View style={styles.separator} />

     <View style={styles.dataRow}>
     <Text style={styles.dataLabel}>🔤   EquipmentID: </Text>
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
    <Text style={[styles.dataLabel, { color: getColorPM(pmWarning) }]}>
      🛡   PM Status: 
    </Text>
    <Text style={[styles.dataValue,{ color: getColorPM(pmWarning) }]}>
    {getPMStatusText(filteredChecklist.PMStatus)}
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

export default pmStatus;
