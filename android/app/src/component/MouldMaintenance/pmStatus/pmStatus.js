import React, { useState, useEffect } from 'react'; 
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Header from '../../Common/header/header';
import styles from './style';
import { SelectList } from 'react-native-dropdown-select-list';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../Common/config/config';

const pmStatus = ({ username ,setIsLoggedIn}) => {
  const navigation = useNavigation();
  const [selectMouldId, setSelectedMouldId] = useState('select mould');
  const [mouldScan, setMouldScan] = useState('');
  const [mouldOptions, setMouldOptions] = useState([]); 
  const [filteredMould, setFilteredMould] = useState(null);


  const getColorPM = (value) => {
    switch (value) {
      case 1: return '#27ae60'; // GREEN it is in normal state
      case 2: return '#f1c40f'; // YELLOW it is in warning state
      case 3: return '#e74c3c'; // RED it is in alarm state
      case 4: return '#f0d851'; // it is in maintenance state
      case 5: return '#8e44ad'; // PURPLE it is in maintenance state
      case 6: return '#8e44ad'; // PURPLE it is in maintenance state
      case 7: return '#8e44ad'; // PURPLE it is in maintenance state
      case 8: return '#e67e22'; // ORANGE it is in Due
      default: return '#bdc3c7'; // GRAY it is in unknown state
    }
  };

  const getMouldStatusText = (status) => {
    switch (status) {
      case 1:
        return 'Normal';
      case 2:
        return 'Mould Loaded';
      case 3:
        return 'Preventive Maintenance Start';
      case 4:
        return 'Breakdown';
      case 5:
        return 'Mould in Health Check';  
      case 6:
        return 'Not in Use';
      default:
        return 'Unknown Status';
    }
  };

  const getPMStatusText = (status) => {
    switch (status) {
      case 1:
        return 'Normal';
      case 2:
        return 'Warning';
      case 3:
        return 'Alarm';
        case 4:
          return 'Inprocess';
      case 5:
        return 'PM in Main Execution';
      case 6:
        return  'Waiting for Approval';
      case 7:
        return 'PM Approved';
      case 8:
        return 'PM Due'; 
      default:
        return 'Unknown Status';
    }
  };

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
        } else {
          console.log('Failed to fetch Mould IDs:', data.message);
        }
      } catch (error) {
        console.error('Error fetching Mould IDs:', error);
      }
    };
    fetchMouldIds();
  }, []);

  const fetchPMDetails = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/pm/PMDetails/${id}`);
      const json = await response.json();
      if (json.status === 200 && json.data.length > 0) {
        setFilteredMould(json.data[0]);
      } else {
        setFilteredMould(null);
        console.error('No Mould data found');
      }
    } catch (error) {
      console.error('Error fetching Mould details:', error);
    }
  };

  // Fetch details when the mould ID is selected from the dropdown
  useEffect(() => {
    if (selectMouldId !== 'select mould') {
      fetchPMDetails(selectMouldId);
    }
  }, [selectMouldId]);

  // Fetch details when a Mould ID is entered manually
  useEffect(() => {
    if (mouldScan) {
      fetchPMDetails(mouldScan); 
    }
  }, [mouldScan]);

  const pmWarning = filteredMould ? filteredMould.PMStatus : null;

  return (
    <View style={styles.container}>
      <Header username={username}  setIsLoggedIn={setIsLoggedIn} title = 'Preventive Maintenance Monitoring ' />
      
      <ScrollView>
        <View style={styles.dropdown}>
          <Text style={styles.label}>Select Mould  dropdown</Text>
          <SelectList 
            setSelected={(val) => setSelectedMouldId(val)} 
            data={mouldOptions} 
            save="value"
            placeholder="Select Mould ID "
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mould scan</Text>
          <TextInput
            style={styles.input}
            value={mouldScan}
            placeholder="Enter Mould ID"
            onChangeText={setMouldScan} // Bind to the mouldScan state
            returnKeyType="done"
            blurOnSubmit={false}
          />
        </View>

        {filteredMould ? (
  <View style={styles.mouldData}>
    <Text style={styles.label}>🧰Preventive Maintenance Details</Text>

    <View style={styles.dataRow}>
    <Text style={styles.dataLabel}>🆔   Mould ID: </Text>
    <Text style={styles.dataValue}>{filteredMould.MouldID}</Text>
    </View>
    <View style={styles.separator} />

     <View style={styles.dataRow}>
     <Text style={styles.dataLabel}>🔤   EquipmentID: </Text>
     <Text style={styles.dataValue}>{filteredMould.EquipmentID}</Text>
     </View>
    <View style={styles.separator} />

    <View style={styles.dataRow}>
    <Text style={styles.dataLabel}>📝CheckListID: </Text>
    <Text style={styles.dataValue}>{filteredMould.CheckListID}</Text>
    </View>
    <View style={styles.separator} />

    <View style={styles.dataRow}>
    <Text style={styles.dataLabel}>🔢 PMFreqCount: </Text>
    <Text style={styles.dataValue}>{filteredMould.PMFreqCount}</Text>
    </View>
    <View style={styles.separator} />
    <View style={styles.dataRow}> 
    <Text style={styles.dataLabel}>🔢 PMFreqDays: </Text>
    <Text style={styles.dataValue}>{filteredMould.PMFreqDays}</Text>
    </View>
    <View style={styles.separator} />

    <View style={styles.dataRow}>
    <Text style={styles.dataLabel}>🔧WarningCount</Text>
    <Text style={styles.dataValue}> {filteredMould.PMWarningCount}</Text>
    </View>
    <View style={styles.separator} />

    <View style={styles.dataRow}>
    <Text style={styles.dataLabel}>📅 PMWarningDays </Text>
    <Text style={styles.dataValue}>{filteredMould.PMWarningDays}</Text>
    </View>
    <View style={styles.separator} />

    <View style={styles.dataRow}>
    <Text style={styles.dataLabel }>⚙️ MaterialID </Text>
    <Text style={styles.dataValue}>{filteredMould.MaterialID}</Text>
    </View>
    <View style={styles.separator} />

    <View style={styles.dataRow}>
    <Text style={styles.dataLabel }>⚙️ MaterialName </Text>
    <Text style={styles.dataValue}>{filteredMould.MaterialName}</Text>
    </View>

    <View style={styles.separator} />

    <View style={styles.dataRow}>
    <Text style={[styles.dataLabel, { color: getColorPM(pmWarning) }]}>
      🛡   PM Status: 
    </Text>
    <Text style={[styles.dataValue,{ color: getColorPM(pmWarning) }]}>
    {getPMStatusText(filteredMould.PMStatus)}
    </Text>
    </View>
  </View>
) : (
  <Text style={styles.text}>No Mould Selected or Scanned</Text>
)}


        <TouchableOpacity style={styles.confirmButton} onPress={() => navigation.navigate('MouldHome')}>
          <Text style={styles.confirmText}>CLOSE</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default pmStatus;
