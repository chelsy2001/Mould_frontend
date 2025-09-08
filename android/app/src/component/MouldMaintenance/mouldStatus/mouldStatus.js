import React, { useState, useEffect } from 'react'; 
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Header from '../../Common/header/header';
import styles from './style';
import { SelectList } from 'react-native-dropdown-select-list';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../Common/config/config';

const MouldStatus = ({ username ,setIsLoggedIn}) => {
  const navigation = useNavigation();
  const [selectMouldId, setSelectedMouldId] = useState('select mould');
  const [mouldScan, setMouldScan] = useState('');
  const [mouldOptions, setMouldOptions] = useState([]); 
  const [filteredMould, setFilteredMould] = useState(null);

  const getColorMould = (value) => {
    switch (value) {
      case 1: return '#27ae60';
      case 2: return '#f1c40f';
      case 3: return '#e74c3c';
      case 4: return '#FFA500';
      default: return '#bdc3c7';
    }
  };

  const getColorPM = (value) => {
    switch (value) {
      case 1: return '#27ae60'; // GREEN it is in normal state
      case 2: return '#e68b22ff'; // orange it is in warning state
      case 3: return '#e73c3cff'; // RED it is in alarm state
      case 4: return '#3c64e7ff'; // purple  in preparation maintenance state
      case 5: return '#67a3c5ff'; // Main Execution
      case 6: return '#085a49ff'; // gray it is in maintenance state
      case 7: return '#27ae60'; // Approved 
      case 8: return '#f1c40f'; // Yellow it is in Alert
      default: return '#bdc3c7'; // GRAY it is in unknown state
    }
  };

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

  const getHealthCheckStatusText = (status) => {
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
        return 'Health Check in Main Execution';
      case 6:
        return 'Health Check Approved';
      case 7:
        return 'Health Check Due';
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

  const fetchMouldDetails = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/mould/details/${id}`);
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
      fetchMouldDetails(selectMouldId);
    }
  }, [selectMouldId]);

  // Fetch details when a Mould ID is entered manually
  useEffect(() => {
    if (mouldScan) {
      fetchMouldDetails(mouldScan); 
    }
  }, [mouldScan]);

  const pmWarning = filteredMould ? filteredMould.MouldPMStatus : null;
  const healthCheckWarning = filteredMould ? filteredMould.MouldHealthStatus : null;

  return (
    <View style={styles.container}>
      <Header username={username}  setIsLoggedIn={setIsLoggedIn} title = 'Mould Monitoring ' />
      
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
    <Text style={styles.label}>🧰    Mould Details</Text>

    <View style={styles.dataRow}>
    <Text style={styles.dataLabel}>🆔   Mould ID: </Text>
    <Text style={styles.dataValue}>{filteredMould.MouldID}</Text>
    </View>
    <View style={styles.separator} />

     <View style={styles.dataRow}>
     <Text style={styles.dataLabel}>🔤   Name: </Text>
     <Text style={styles.dataValue}>{filteredMould.MouldName}</Text>
     </View>
    <View style={styles.separator} />

    <View style={styles.dataRow}>
    <Text style={styles.dataLabel}>📝   Description: </Text>
    <Text style={styles.dataValue}>{filteredMould.MouldDesc}</Text>
    </View>
    <View style={styles.separator} />

    <View style={styles.dataRow}>
    <Text style={styles.dataLabel}>🔢   Life: </Text>
    <Text style={styles.dataValue}>{filteredMould.MouldLife}</Text>
    </View>
    <View style={styles.separator} />
    <View style={styles.dataRow}> 
    <Text style={styles.dataLabel}>📦  Storage: </Text>
    <Text style={styles.dataValue}>{filteredMould.MouldStorageLoc}</Text>
    </View>
    <View style={styles.separator} />

    <View style={styles.dataRow}>
    <Text style={[styles.dataLabel, { color: getColorHC(healthCheckWarning) }]}>
      🧪 Health Check: 
    </Text>
    <Text style={[styles.dataValue, { color: getColorHC(healthCheckWarning) }]}>{getHealthCheckStatusText(filteredMould.MouldHealthStatus)}</Text>
    </View>
    <View style={styles.separator} />

    <View style={styles.dataRow}>
    <Text style={styles.dataLabel}>🛠   Machine ID: </Text>
    <Text style={styles.dataValue}>{filteredMould.EquipmentID}</Text>
    </View> 
    <View style={styles.separator} />

    <View style={styles.dataRow}>
    <Text style={styles.dataLabel}>🔧   Actual Life:</Text>
    <Text style={styles.dataValue}> {filteredMould.MouldActualLife}</Text>
    </View>
    <View style={styles.separator} />

    <View style={styles.dataRow}>
    <Text style={styles.dataLabel}>📅 Next PM Due: </Text>
    <Text style={styles.dataValue}>{filteredMould.NextPMDue}</Text>
    </View>
    <View style={styles.separator} />

    <View style={styles.dataRow}>
    <Text style={styles.dataLabel }>⚙️ HC Threshold: </Text>
    <Text style={styles.dataValue}>{filteredMould.HealthCheckThreshold}</Text>
    </View>
    <View style={styles.separator} />

    <View style={styles.dataRow}>
    <Text style={styles.dataLabel}>📊 Mould Status: </Text>
    <Text style={styles.dataValue}>{getMouldStatusText(filteredMould.MouldStatus)}</Text>
    </View>
    <View style={styles.separator} />

    <View style={styles.dataRow}>
    <Text style={[styles.dataLabel, { color: getColorPM(pmWarning) }]}>
      🛡   PM Status: 
    </Text>
    <Text style={[styles.dataValue,{ color: getColorPM(pmWarning) }]}>
    {getPMStatusText(filteredMould.MouldPMStatus)}
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

export default MouldStatus;
