import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated
} from 'react-native';
import Header from '../../Common/header/header';
import styles from './styles';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../Common/config/config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MouldLoadingScreen = ({ username }) => {
  const navigation = useNavigation();
  const [machineScan, setMachineScan] = useState('');
  const [mouldScan, setMouldScan] = useState('');
  const [productName, setProductName] = useState('');
  const [mouldActualLife, setMouldActualLife] = useState(null);
  const [pmWarning, setPmWarning] = useState(null);
  const [healthCheckWarning, setHealthCheckWarning] = useState(null);
  const [mouldStatus, setMouldStatus] = useState(null);
  const [mouldPmStatus, setMouldPmstatus] = useState(null);
  const [mouldHealthStatus, setMouldHealthStatus] = useState(null);
  const [mouldLife, setMouldLife] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  const machineInputRef = useRef(null);
  const mouldInputRef = useRef(null);
  const validationTimeoutRef = useRef(null);


  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (machineInputRef.current) {
      machineInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!machineScan || !mouldScan) return;

    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    validationTimeoutRef.current = setTimeout(async () => {
      const fetchProductName = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/mould/details/${machineScan}/${mouldScan}`
          );

          if (response.status !== 200) return;

          const mouldData = response.data.data;

          if (!Array.isArray(mouldData) || mouldData.length === 0) {
            Alert.alert('Error', 'No data found for this combination.');
            resetFields();
            return;
          }

          const data = mouldData[0];

          if (
            String(data.EquipmentID) !== String(machineScan) ||
            String(data.MouldID) !== String(mouldScan)
          ) {
            Alert.alert('Error', 'Machine and Mould not in system.');
            resetFields();
            return;
          }

          if (data.ProductGroupID == null) {
            Alert.alert(
              'Error',
              'Machine and Mould validation failed — ProductGroupID is missing.'
            );
            resetFields();
            return;
          }

          setProductName(data.ProductGroupName || 'No Product Name');
          setMouldActualLife(data.MouldActualLife);
          setPmWarning(data.PMWarning);
          setHealthCheckWarning(data.HealthCheckWarning);
          setMouldStatus(data.MouldStatus);
          setMouldPmstatus(data.MouldPMStatus);
          setMouldHealthStatus(data.MouldHealthStatus);
          setMouldLife(data.MouldLifeStatus);

          try {
            const updateRes = await axios.post(
              `${BASE_URL}/mould/updateValidationStatusLoad`,
              {
                EquipmentID: machineScan,
                mouldID: mouldScan,
              }
            );

            if (updateRes.status === 200) {
              console.log('✅ ValidationStatus updated successfully');
              Alert.alert('Success', 'Mould Machine Validation successful');
            }
          } catch (err) {
            console.error('❌ Error updating validation:', err.response?.data || err.message);

            const backendMessage =
              err.response?.data?.message ||
              err.response?.data?.error ||
              err.message ||
              'Something went wrong';

            Alert.alert('Error', backendMessage);
            resetFields();
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setProductName('Error fetching data');
        }
      };

      await fetchProductName();
    }, 500);

    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, [machineScan, mouldScan]);





  const resetFields = () => {
    setProductName('');
    setMouldActualLife(null);
    setPmWarning(null);
    setHealthCheckWarning(null);
    setMouldStatus(null);
    setMouldPmstatus(null);
  };

  const handleConfirm = async () => {
    if (mouldScan && machineScan) {
      if (mouldStatus !== 1) {
        Alert.alert('Error', 'Mould must be in idle state.');
        return;
      }
      if (mouldPmStatus === 3) {
        Alert.alert('Alert', 'Mould validation OK but PM is in alarm state.');
        return;
      }
      if (mouldStatus === 1 && mouldPmStatus === 1) {
        Alert.alert('Success', 'Mould validation OK and PM in normal state.', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MouldHome'),
          },
        ]);
      } else if (mouldStatus === 1 && mouldPmStatus === 2) {
        Alert.alert('Warning', 'Mould validation OK and PM in warning state.', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MouldHome'),
          },
        ]);
      }
      const data = {
        MouldStatus: 2,
        EquipmentID: machineScan,
        MouldID: mouldScan,
        MouldLifeStatus: mouldLife,
        CurrentMouldLife: mouldActualLife,
        NewMouldLife: mouldActualLife ,  // or keep mouldActualLife
  MouldActualLife: mouldActualLife,
        ParameterID: 4,
        ParameterValue: 2,
      };
      try {
        const response = await axios.post(`${BASE_URL}/mould/load`, data);
        if (response.status !== 200) {
          Alert.alert('Error', 'Failed to mould machine validation.');
        }
      } catch (error) {
        console.error('Error Updating Mould Machine Validation:', error);
        Alert.alert('Error', 'Error Updating Mould Machine Validation. Please try again.');
      }
    } else {
      Alert.alert('Info', 'Please enter both MouldID and MachineID.');
    }
  };

  const isConfirmButtonEnabled = () => {
    return Boolean(machineScan && mouldScan);
  };

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

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Header username={username} title="Mould Loading " date="05-10-2024" />
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <ScrollView contentContainerStyle={{ paddingBottom: 40, paddingRight: '-10%', paddingLeft: '-10%' }} showsVerticalScrollIndicator={false}>
            <View style={styles.inputContainer}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.label}>Machine Scan</Text>
                <Icon name="qrcode-scan" size={20} color="#666" style={styles.icon} />
              </View>

              <View style={styles.inputRow}>
                <TextInput
                  ref={machineInputRef}
                  style={styles.input}
                  placeholder="Machine QR Code"
                  placeholderTextColor={'black'}
                  keyboardType='numeric'
                  value={machineScan}
                  onChangeText={setMachineScan}
                  returnKeyType="next"
                  onSubmitEditing={() => mouldInputRef.current?.focus()}
                  blurOnSubmit={false}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.label}>Mould Scan</Text>
                <Icon name="qrcode-scan" size={20} color="#666" style={styles.icon} />
              </View>

              <View style={styles.inputRow}>

                <TextInput
                  ref={mouldInputRef}
                  style={styles.input}
                  placeholder="Mould QR Code"
                  value={mouldScan}
                  keyboardType='numeric'
                  placeholderTextColor={'black'}
                  onChangeText={setMouldScan}
                  returnKeyType="done"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Product Name</Text>
              <View style={[styles.input, { borderWidth: 1, borderColor: '#ccc', justifyContent: 'center' }]}>
                <Text style={{ fontSize: 16, color: '#333' }}>{productName}</Text>
              </View>
            </View>
            {/* lower buttons */}
            <View style={styles.statusContainer}>
              <View style={[styles.statusButton, { backgroundColor: getColorMould(mouldLife) }]}>
                <Text style={styles.statusText}>⚙️</Text>
                <Text style={styles.statusText}>Mould Life</Text>
              </View>
              <View style={[styles.statusButton, { backgroundColor: getColorPM(mouldPmStatus) }]}>
                <Text style={styles.statusText}>🔧</Text>
                <Text style={styles.statusText}>PM Status</Text>
              </View>
              <View style={[styles.statusButton, { backgroundColor: getColorHC(mouldHealthStatus) }]}>
                <Text style={styles.statusText}>🩺</Text>
                <Text style={styles.statusText}>Health Status</Text>
              </View>
            </View>
            {/* confirm button */}
            <TouchableOpacity
              style={[styles.confirmButton, { opacity: isConfirmButtonEnabled() ? 1 : 0.5 }]}
              onPress={handleConfirm}
              disabled={!isConfirmButtonEnabled()}
            >
              <Text style={styles.confirmText}>🚀 CONFIRM</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MouldLoadingScreen;
