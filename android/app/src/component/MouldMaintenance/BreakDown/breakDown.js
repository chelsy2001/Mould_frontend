import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Header from '../../Common/header/header';
import styles from './style';
import { BASE_URL } from '../../Common/config/config';
import { SelectList } from 'react-native-dropdown-select-list';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BreakDown = ({ username, setIsLoggedIn }) => {
  const navigation = useNavigation();

  const [mouldIdOptions, setMouldIdOptions] = useState([]);
  const [selectedMouldId, setSelectedMouldId] = useState('');
  const [breakdownReason, setBreakdownReason] = useState('');
  const [breakdownRemark, setBreakdownRemark] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duration, setDuration] = useState('');
  const [totalBDCount, setTotalBDCount] = useState(0);
  const [userID] = useState(username);
  const [mouldStatus, setMouldStatus] = useState(0);
  const [bdStatus, setBDStatus] = useState(0);
  const [mouldLifeStatus, setMouldLifeStatus] = useState('');
  const [machineID] = useState('');
  const [currentMouldLife, setCurrentMouldLife] = useState(100);
  const [parameterID, setParameterID] = useState(4);
  const [parameterValue, setParameterValue] = useState(10);
  const [isBreakdownInProgress, setIsBreakdownInProgress] = useState(false);

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
          setMouldIdOptions(options);
        } else {
          console.log('Failed to fetch Mould IDs:', data.message);
        }
      } catch (error) {
        console.error('Error fetching Mould IDs:', error);
      }
    };

    fetchMouldIds();
  }, []);


  const handleStart = async () => {
    if (!selectedMouldId || !breakdownReason) {
      Alert.alert("Error", "Please select a Mould ID and provide a reason before starting.");
      return;
    }


       const getLocalDateTime = () => {
      const now = new Date();
   
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
   
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const currentStartTime = getLocalDateTime();


    setStartTime(currentStartTime);
    setEndTime(null);
    setDuration('0');

    setMouldStatus(4);
    setBDStatus(1);
    setIsBreakdownInProgress(true);
console.log("Time",currentStartTime);
    const requestData = {
      MouldID: selectedMouldId,
      BDStartTime: currentStartTime,
      BDEndTime: null,
      BDDuration: '0',
      TotalBDCount: totalBDCount,
      UserID: userID,
      BDReason: breakdownReason,
      BDRemark: breakdownRemark,
      BDStatus: 1,
      MouldStatus: 4,
      MouldLifeStatus: mouldLifeStatus,
      EquipmentID: machineID,
      CurrentMouldLife: currentMouldLife,
      ParameterID: parameterID,
      ParameterValue: parameterValue,
      LastUpdatedTime: getLocalDateTime,
    };

    try {
      const response = await fetch(`${BASE_URL}/mould/addbreakdownlog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (data.status === 200) {
        Alert.alert("Success", "Breakdown started successfully.");
      } else {
        Alert.alert("Error", data.message || "Failed to start breakdown.");
      }
    } catch (error) {
      console.error("Error starting breakdown:", error);
      Alert.alert("Error", "Failed to start breakdown.");
    }
  };


  const handleEnd = async () => {
    if (!selectedMouldId || !breakdownReason) {
      Alert.alert("Error", "Please select a Mould ID and provide a reason before ending.");
      return;
    }
  
    if (!startTime) {
      Alert.alert("Error", "Start time not set. Please start the breakdown first.");
      return;
    }

      //  const utctime=dayjs();

       const getLocalDateTime = () => {
      const now = new Date();
   
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
   
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    
  
    const currentEndTime = getLocalDateTime();
  
    const calculateDuration = (start, end) => {
      const startTimeMs = new Date(start).getTime();
      const endTimeMs = new Date(end).getTime();
      const durationSeconds = ((endTimeMs - startTimeMs) / 1000).toFixed(2);
      return durationSeconds; // to match BDDuration string format
    };
  
    const durationCalculated = calculateDuration(startTime, currentEndTime);
  
    setEndTime(currentEndTime);
    setDuration(durationCalculated);
    setMouldStatus(1);
    setBDStatus(2);
    setIsBreakdownInProgress(false);
  
    const requestData = {
      MouldID: selectedMouldId,
      BDStartTime: startTime,
      BDEndTime: currentEndTime,
      BDDuration: durationCalculated,
      TotalBDCount: totalBDCount,
      UserID: userID,
      BDReason: breakdownReason,
      BDRemark: breakdownRemark,
      BDStatus: 2,
      LastUpdatedTime: getLocalDateTime(),
      MouldStatus: 1,
      MouldLifeStatus: mouldLifeStatus,
      EquipmentID: machineID,
      CurrentMouldLife: currentMouldLife,
      ParameterID: parameterID,
      ParameterValue: parameterValue,
    };
  
    try {
      const response = await fetch(`${BASE_URL}/mould/addbreakdownlog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      const data = await response.json();
  
      if (data.status === 200) {
        Alert.alert("Success", "Breakdown ended successfully.");
      } else {
        Alert.alert("Error", data.message || "Failed to end breakdown.");
      }
    } catch (error) {
      console.error("Error ending breakdown:", error);
      Alert.alert("Error", "Failed to end breakdown.");
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Header username={username} setIsLoggedIn={setIsLoggedIn} title = 'BreakDown Screen' />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{padding:20}}>
        <View style={styles.dropdownsection}>
          <Text style={styles.sectionTitle}>
            <Icon name="cog-outline" size={20} color="#000000ff" /> Select Mould
          </Text>
          <View style={styles.dropdown}>
            <SelectList
              setSelected={(val) => setSelectedMouldId(val)}
              data={mouldIdOptions}
              save="value"
              placeholder="Choose Mould ID"
              search={true}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Icon name="tools" size={20} color="#003f7d" /> Breakdown Details
          </Text>
          //Reason
          <View style={styles.inputGroup}>
          <View style={styles.inputview}>
          <Text style={styles.label}><Icon name="alert-circle-outline" size={20} />Reason</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Reason"
              value={breakdownReason}
              onChangeText={setBreakdownReason}
              placeholderTextColor={'black'}
            />
          </View>

          //Remark
          <View  style={styles.inputview}>
          <Text style={styles.label}><Icon name="note-edit-outline"  size={20} />Remark</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Remark"
              value={breakdownRemark}
              onChangeText={setBreakdownRemark}
              placeholderTextColor={'black'}
            />
          </View>

        //Start Time
          <View  style={styles.inputview}>
          <Text style={styles.label}><Icon name="clock-start" size={18} />StartTime</Text>
            <TextInput
              style={styles.input}
              placeholder="Start Time"
              value={startTime}
              editable={false}
              placeholderTextColor={'black'}
            />
          </View>

          //End Time
          <View  style={styles.inputview}>
          <Text style={styles.label}><Icon name="clock-end" size={20} />EndTime</Text>
            <TextInput
              style={styles.input}
              placeholder="End Time"
              value={endTime}
              editable={false}
              placeholderTextColor={'black'}
            />
          </View>
            
            //Duration
            <View style={styles.inputview}>
            <Text style={styles.label}><Icon name="timer-outline" size={20} />Duration</Text>
            <TextInput
              style={styles.input}
              placeholder="Duration"
              value={duration ? `${duration} sec` : ''}
              editable={false}
              placeholderTextColor={'black'}
            />
            </View>
            
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#28a745' }]} onPress={handleStart}>
            <Icon name="play-circle-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#dc3545' }]} onPress={handleEnd}>
            <Icon name="stop-circle-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}>End</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default BreakDown;
