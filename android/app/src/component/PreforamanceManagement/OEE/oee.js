import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  TextInput
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { BASE_URL } from '../../Common/config/config';
import Header from '../../Common/header/header';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWindowDimensions } from 'react-native';
import axios from 'axios';
import { scale, verticalScale, moderateScale } from '../../Common/utils/scale'; // adjust path if needed

const OEE = ({ route, username, setIsLoggedIn }) => {
  const [selectedLineName, setselectedLineName] = useState('');
  const navigation = useNavigation();
  const [selectedShift, setSelectedShift] = useState('A');
  const [LineName, setLineName] = useState([]);
  const [EquipmentName, setEquipmentName] = useState([]);
  const [loading, setLoading] = useState(true);



  const { equipmentName } = route.params;
  const [prodDate, setProdDate] = useState('');
  const [shiftName, setShiftName] = useState('');
  // const getRandomPercent = () => Math.floor(Math.random() * 50) + 50;
  //---------oee related data--------
  const [availability, setAvailability] = useState("");
  const [performance, setPerformance] = useState("");
  const [quality, setQuality] = useState("");
  const [oee, setOEE] = useState("");
  const [shiftTime, setShiftTime] = useState('');
  const [totalTime, setTotalTime] = useState('');
  const [totalDownTime, setTotalDownTime] = useState('');
  const [expectedQty, setExpectedQty] = useState('');
  const [actualQty, setActualQty] = useState('');
  const [gap, setGap] = useState('');
  const [goodQty, setGoodQty] = useState('');
  const [rework, setRework] = useState('');
  const [rejected, setRejected] = useState('');
  const [unassignedReasonCount, setUnassignedReasonCount] = useState('');
  const [unassignedReworkReasonCount, setUnassignedReworkReasonCount] = useState('0');

const { width: windowWidth } = useWindowDimensions();
const isLarge = windowWidth >= 900;
const isMedium = windowWidth >= 420 && windowWidth < 900;

  // const oee = Math.round((availability * performance * quality) / 10000);

  const metrics = [
    { title: 'OEE', value: oee },
    { title: 'Availability', value: availability },
    { title: 'Performance', value: performance },
    { title: 'Quality', value: quality },
  ];

  const getColor = (value) => {
    if (value < 40) return '#ff3b30';
    if (value > 70) return '#34c759';
    return '#ffcc00';
  };

  const currentDate = new Date().toLocaleDateString();

  // useEffect(() => {
  //   if (lineName) {
  //     setselectedLineName(lineName);
  //     console.log('Line Name:', LineName);
  //   }
  // }, [lineName]);
  //----------fetch prodate and shiftname 


  useEffect(() => {
    const fetchShiftInfo = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/oee/ProdDate/Shift`);
        if (response.data?.status === 200 && response.data.data.length > 0) {
          const { ProdDate, ShiftName } = response.data.data[0];

          // Format date if needed
          const formattedDate = new Date(ProdDate).toLocaleDateString();

          setProdDate(formattedDate);
          setShiftName(ShiftName);

        } else {
          console.warn('No data found for shift info');
        }
      } catch (error) {
        console.error('Error fetching shift info:', error);
      }
    };

    fetchShiftInfo();
  }, []);
  //----------------------fetch the lineid and on the basis of it fetch the oee details
  useEffect(() => {
    const fetchLineIdAndOEE = async () => {
      try {
        if (!equipmentName) return;

        // Step 1: Get LineID from lineName
        const equipmentIdResponse = await axios.get(`${BASE_URL}/oee/getEquipmentID/${equipmentName}`);
        const EquipmentID = equipmentIdResponse.data.EquipmentID;

        // Step 2: Fetch OEE details using LineID
        const oeeResponse = await axios.get(`${BASE_URL}/oee/OEEDetails/${EquipmentID}`);

        if (oeeResponse.data?.status === 200 && oeeResponse.data.data?.length > 0) {
          const oeeData = oeeResponse.data.data[0];
          console.log("oee", oeeData)
          // Update values based on backend data instead of random
          setOEE(Math.round(oeeData.OEE || 0));
          setAvailability(Math.round(oeeData.Availability || 0));
          setPerformance(Math.round(oeeData.Performance || 0));
          setQuality(Math.round(oeeData.Quality || 0));
          // New assignments
          setShiftTime(oeeData.ShiftTimeInMin?.toString() ?? '');
          setTotalTime(oeeData.TotalTimeInMin?.toString() ?? '');
          setTotalDownTime(oeeData.TotalDownTimeInMin?.toString() ?? '');
          setExpectedQty(oeeData.ExpectedQuantity?.toString() ?? '');
          setActualQty(oeeData.TotalQuantity?.toString() ?? '');
          setGap(oeeData.Gap?.toString() ?? '');
          setGoodQty(oeeData.GoodQuantity?.toString() ?? '');
          setRework(oeeData.Rework?.toString() ?? '');
          setRejected(oeeData.RejectedCount?.toString() ?? '');

        } else {
          console.warn('No OEE data found for LineID:', lineId);
        }
      } catch (error) {
        console.error('Error fetching OEE data:', error);
      }
    };

    fetchLineIdAndOEE();
  }, [equipmentName]);

  //-----------------fetch the unassigned drowntime count

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!equipmentName) return;

        // Step 1: Get LineID from lineName
        const equipmentIdResponse = await axios.get(`${BASE_URL}/oee/getEquipmentID/${equipmentName}`);
        const EquipmentID = equipmentIdResponse.data.EquipmentID;


        // Fetch Unassigned Reason Count using LineID
        const unassignedRes = await axios.get(`${BASE_URL}/oee/unassigned-downtime-count/${EquipmentID}`);
        if (unassignedRes.status === 200) {
          setUnassignedReasonCount(unassignedRes.data.count?.toString() || '0');
        } else {
          console.warn('Unassigned count not found');
          setUnassignedReasonCount('0');
        }


        // Fetch other OEE-related data if needed here

      } catch (error) {
        console.error('Error fetching unassigned downtime count:', error);
      }
    };

    fetchData();
  }, [equipmentName]);

// function to handle call status for different departments
  const [callStatus, setCallStatus] = useState({});

// const handleCallToggle = (deptId) => {
//   setCallStatus((prevStatus) => {
//     const current = prevStatus[deptId];
//     if (current.status === 0) {
//       // Start call
//       return {
//         ...prevStatus,
//         [deptId]: {
//           status: 1,
//           startTime: new Date(),
//           endTime: null,
//           duration: null,
//         },
//       };
//     } else {
//       // End call
//       const endTime = new Date();
//       const durationInMinutes = Math.round((endTime - new Date(current.startTime)) / 60000);
//       return {
//         ...prevStatus,
//         [deptId]: {
//           ...current,
//           status: 0,
//           endTime,
//           duration: `${durationInMinutes} min`,
//         },
//       };
//     }
//   });
// };

const handleCallToggle = async (departmentName) => {
  try {
    await axios.post(`${BASE_URL}/OEE/logCall`, {
      EquipmentName: equipmentName,
      DepartmentName: departmentName,
    });

    setCallStatus((prevStatus) => {
      const current = prevStatus[departmentName];
      let updatedStatus;

      if (!current || current.status === 0) {
        updatedStatus = {
          ...prevStatus,
          [departmentName]: {
            status: 1,
            startTime: new Date().toISOString(),
            endTime: null,
            duration: null,
          },
        };
      } else {
        const endTime = new Date();
        const durationInMinutes = Math.round((endTime - new Date(current.startTime)) / 60000);
        updatedStatus = {
          ...prevStatus,
          [departmentName]: {
            ...current,
            status: 0,
            endTime: endTime.toISOString(),
            duration: `${durationInMinutes} min`,
          },
        };
      }

      // Save to AsyncStorage
      AsyncStorage.setItem('callStatus', JSON.stringify(updatedStatus));
      return updatedStatus;
    });

    Alert.alert('Success', `${departmentName} call logged successfully.`);
  } catch (error) {
    console.error(`Error logging call for ${departmentName}:`, error);
    Alert.alert('Error', `Failed to log call for ${departmentName}.`);
  }
};

useEffect(() => {
  const loadCallStatus = async () => {
    try {
      const storedStatus = await AsyncStorage.getItem('callStatus');
      if (storedStatus) {
        setCallStatus(JSON.parse(storedStatus));
      }
    } catch (error) {
      console.error('Failed to load call status from storage', error);
    }
  };

  loadCallStatus();
}, []);


const getCallBtnStyle = (departmentName) => {
  const isActive = callStatus[departmentName]?.status === 1;
  return {
    ...styles.callBtn,
    backgroundColor: isActive ? 'green' : '#003366',
  };
};


  return (
    <View style={{ flex: 1 }}>
      <Header username={username} setIsLoggedIn={setIsLoggedIn} title='Overall line effectiveness​' />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Row */}
<View style={styles.headerRow}>
  <Text style={styles.headerBox}>{equipmentName}</Text>
  <Text style={styles.headerBox}>Shift Name: {shiftName}</Text>
</View>

{/* Circular Progress Section */}
<View style={styles.chartSection}>
  {metrics.map((metric, index) => (
    <View key={index} style={styles.progressContainer}>
      <AnimatedCircularProgress
        size={scale(90)}
        width={scale(10)}
        fill={metric.value}
        tintColor={getColor(metric.value)}
        backgroundColor="#e0e0e0"
        duration={1500}
      >
        {fill => <Text style={styles.chartPercentage}>{Math.round(fill)}%</Text>}
      </AnimatedCircularProgress>
      <Text style={styles.chartTitle}>{metric.title}</Text>
    </View>
  ))}
</View>


      // section for OEE, Availability, Performance, Quality
       {/* ---------- Availability Section ---------- */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Availability {availability}%</Text>

  {/* Row: Shift Time and TotalDT */}
  <View style={[styles.formRow, isLarge ? styles.formRowHorizontal : styles.formRowStack]}>
    <View style={styles.field}>
      <Text style={styles.label}>Shift Time</Text>
      <TextInput style={styles.input} value={shiftTime} editable={false} />
    </View>
    <View style={styles.field}>
      <Text style={styles.label}>TotalDT</Text>
      <TextInput style={styles.input} value={totalDownTime} editable={false} />
    </View>

       <View style={styles.field}>
      <Text style={styles.label}>TotalTime</Text>
      <TextInput style={styles.input} value={totalTime} editable={false} />
    </View>
  </View>

  {/* Row: TotalTime and Details Button */}
  {/* <View style={[styles.formRow, isLarge ? styles.formRowHorizontal : styles.formRowStack]}>
    <View style={styles.field}>
      <Text style={styles.label}>TotalTime</Text>
      <TextInput style={styles.input} value={totalTime} editable={false} />
    </View>
   
  </View> */}

  {/* Row: UnAssigned Reason */}
  <View style={[styles.formRow, isLarge ? styles.formRowHorizontal : styles.formRowStack]}>
  <View style={styles.field}>
    <Text style={styles.label}>UnAssigned Reason</Text>
    <TextInput style={styles.input} value={unassignedReasonCount} editable={false} />
  </View>
  
</View>
   {/* 🔄 Combine both buttons into a horizontal row */}
  <View style={styles.buttonRow}>
    <TouchableOpacity
      style={[styles.button, styles.detailsBtn]}
      onPress={() => navigation.navigate('DTDetails', { equipmentName })}
    >
      <Text style={styles.buttonText}>Details</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.button, styles.assignBtn]}
      onPress={() => navigation.navigate('Downtime', { equipmentName })}
    >
      <Text style={styles.buttonText}>Update Reason</Text>
    </TouchableOpacity>
  </View>
</View>

{/* ---------- Performance Section ---------- */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Performance {performance}%</Text>

  {/* Row: Expected Qty and Gap */}
  <View style={[styles.formRow, isLarge ? styles.formRowHorizontal : styles.formRowStack]}>
    <View style={styles.field}>
      <Text style={styles.label}>Expected Qty</Text>
      <TextInput style={styles.input} value={expectedQty} editable={false} />
    </View>
    <View style={styles.field}>
      <Text style={styles.label}>Gap</Text>
      <TextInput style={styles.input} value={gap} editable={false} />
    </View>
     <View style={styles.field}>
      <Text style={styles.label}>Actual Qty</Text>
      <TextInput style={styles.input} value={actualQty} editable={false} />
    </View>
  </View>

  {/* Row: Actual Qty */}
  {/* <View style={[styles.formRow, isLarge ? styles.formRowHorizontal : styles.formRowStack]}>
    <View style={styles.field}>
      <Text style={styles.label}>Actual Qty</Text>
      <TextInput style={styles.input} value={actualQty} editable={false} />
    </View>
  </View> */}
</View>

{/* ---------- Quality Section ---------- */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Quality {quality}%</Text>

  {/* Row: Rejected Count and Button */}
 <View style={[styles.formRow, isLarge ? styles.formRowHorizontal : styles.formRowStack]}>
  <View style={styles.field}>
    <Text style={styles.label}>Rejected Count</Text>
    <TextInput style={styles.input} value={rejected} editable={false} />
  </View>
 <TouchableOpacity
      style={[styles.button1, styles.assignBtn]}
      onPress={() => navigation.navigate('Quality', { equipmentName })}
    >
      <Text style={styles.buttonText}>RejectionEntry</Text>
    </TouchableOpacity>
  {/* <View style={styles.actionField}>
   
  </View> */}
</View>

</View>

       {/* Calls Section */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Department Calls</Text>

  <View style={styles.callButtonRow}>
    {['Maintenance', 'Production', 'Quality'].map((dept) => (
      <TouchableOpacity
        key={dept}
        style={getCallBtnStyle(dept)}
        onPress={() => handleCallToggle(dept)}
      >
        <Text style={styles.callText}>{dept}</Text>
      </TouchableOpacity>
    ))}
  </View>
</View>

{/* //<View style={styles.section}>
  {Object.entries(callStatus).map(([id, info]) => (
    <Text key={id} style={{ fontSize: 12 }}>
      {`Dept ${id} | Status: ${info.status} | Duration: ${info.duration || '-'} `}
    </Text>
  ))}
</View> */}

      </ScrollView>
    </View>
  );
}

export default OEE;