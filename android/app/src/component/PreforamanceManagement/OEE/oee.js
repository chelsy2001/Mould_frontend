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
import axios from 'axios';

const OEE = ({ route, username, setIsLoggedIn }) => {
  const [selectedLineName, setselectedLineName] = useState('');
  const navigation = useNavigation();
  const [selectedShift, setSelectedShift] = useState('A');
  const [LineName, setLineName] = useState([]);
  const [loading, setLoading] = useState(true);
  const lineName = route?.params?.MachineName ?? 'No Line Selected';


  const [prodDate, setProdDate] = useState('');
  const [shiftName, setShiftName] = useState('');
  // const getRandomPercent = () => Math.floor(Math.random() * 50) + 50;
  //---------oee related data--------
  const [availability, setAvailability] = useState("");
  const [performance, setPerformance] = useState("");
  const [quality, setQuality] = useState("");
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


  const oee = Math.round((availability * performance * quality) / 10000);

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

  useEffect(() => {
    if (lineName) {
      setselectedLineName(lineName);
      console.log('Line Name:', LineName);
    }
  }, [lineName]);
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
        if (!lineName) return;

        // Step 1: Get LineID from lineName
        const lineIdResponse = await axios.get(`${BASE_URL}/oee/getLineID/${lineName}`);
        const lineId = lineIdResponse.data.LineID;

        // Step 2: Fetch OEE details using LineID
        const oeeResponse = await axios.get(`${BASE_URL}/oee/OEEDetails/${lineId}`);

        if (oeeResponse.data?.status === 200 && oeeResponse.data.data?.length > 0) {
          const oeeData = oeeResponse.data.data[0];
          console.log("oee", oeeData)
          // Update values based on backend data instead of random
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
  }, [lineName]);

  //-----------------fetch the unassigned drowntime count

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!lineName) return;

        // Get LineID based on lineName
        const lineIdRes = await axios.get(`${BASE_URL}/oee/getLineID/${lineName}`);
        const lineId = lineIdRes.data.LineID;

        // Fetch Unassigned Reason Count using LineID
        const unassignedRes = await axios.get(`${BASE_URL}/oee/unassigned-downtime-count/${lineId}`);
        if (unassignedRes.status === 200) {
          setUnassignedReasonCount(unassignedRes.data.count?.toString() || '0');
        } else {
          console.warn('Unassigned count not found');
          setUnassignedReasonCount('0');
        }

        // ✅ Fetch Unassigned Rework Reason Count
        const reworkRes = await axios.get(`${BASE_URL}/oee/unassigned-ReworkReason-count/${lineId}`);
        if (reworkRes.status === 200) {
          setUnassignedReworkReasonCount(reworkRes.data.count?.toString() || '0');
        } else {
          console.warn('Unassigned rework count not found');
          setUnassignedReworkReasonCount('0');
        }

        // Fetch other OEE-related data if needed here

      } catch (error) {
        console.error('Error fetching unassigned downtime count:', error);
      }
    };

    fetchData();
  }, [lineName]);


  return (
     <View style={{ flex: 1 }}>
      <Header username={username} setIsLoggedIn={setIsLoggedIn} title='Overall line effectiveness​' />
 <ScrollView contentContainerStyle={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16, marginTop: 20 }}>
        {/* <Text style={styles.headerBox}>Date : {prodDate}</Text> */}

        <Text style={styles.headerBox}>{lineName}</Text>
        <Text style={styles.headerBox}>Shift : A</Text>
        {/* <Text style={styles.headerBox}>Shift Name: {shiftName}</Text> */}
      </View>
      {/* Circular Progress Section */}
      <View style={styles.chartSection}>
        {metrics.map((metric, index) => (
          <View key={index} style={styles.progressContainer}>
            <AnimatedCircularProgress
              size={100}
              width={10}
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
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Availability {availability}%</Text>
        <View style={styles.row}>
          <Text>Shift Time</Text>
          <TextInput style={styles.input} value={shiftTime} editable={false} />

          <Text>TotalDT</Text>
          <TextInput style={styles.input} value={totalDownTime} editable={false} />


        </View>

        <View style={styles.row3}>
          <Text>TotalTime</Text>
          <TextInput style={styles.input} value={totalTime} editable={false} />
          <TouchableOpacity style={styles.detailsBtn}
            onPress={() => navigation.navigate('DTDetails', { lineName: lineName })}
          >
            <Text style={{ color: 'white' }}>Details</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.row2}>
          <Text>UnAssigned Reason </Text>
          <TextInput
            style={styles.input2}
            value={unassignedReasonCount}
            editable={false}
          />
          <TouchableOpacity
            style={[styles.assignBtn, { marginLeft: 4 }]}
            onPress={() => navigation.navigate('Downtime', { lineName: lineName })}
          >
            <Text style={{ color: 'white' }}>Update Reason</Text>
          </TouchableOpacity>
        </View>


      </View>
      {/* Performance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance {performance}%</Text>
        <View style={styles.row}>
          <Text>Expected Quntity</Text>
          <TextInput style={styles.input} value={expectedQty} editable={false} />
          <Text>Gap</Text>
          <TextInput style={styles.input} value={gap} editable={false} />
        </View>

        <View style={styles.row2}>
          <Text>Actual Quntity</Text>
          <TextInput style={styles.input} value={actualQty} editable={false} />
        </View>

      </View>
      {/* Quality */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quality {quality}%</Text>


        <View style={styles.row4}>
          <Text>Rejected Count</Text>
          <TextInput style={styles.input} value={rejected} editable={false} />
          <TouchableOpacity style={[styles.assignBtn, { marginLeft: 4 }]}
            onPress={() => navigation.navigate('Quality', { lineName: lineName })}>
            <Text style={{ color: 'white' }}>Rejection Entry </Text>
          </TouchableOpacity>


        </View>

      </View>

    </ScrollView>
    </View>
  );
}

export default OEE;
