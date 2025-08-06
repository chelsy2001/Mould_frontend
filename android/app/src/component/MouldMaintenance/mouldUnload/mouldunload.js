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
  Animated,
  Modal
} from 'react-native';
import Header from '../../Common/header/header';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import styles from './style';
import { BASE_URL } from '../../Common/config/config';
import BreakDown from '../BreakDown/breakDown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MouldUnLoadingScreen = ({ username, setIsLoggedIn }) => {
  const navigation = useNavigation();
  const [machineScan, setMachineScan] = useState('');
  const [mouldScan, setMouldScan] = useState('');
  const [productName, setProductName] = useState('');
  const [mouldActualLife, setMouldActualLife] = useState(null);
  const [pmWarning, setPmWarning] = useState(null);
  const [healthCheckWarning, setHealthCheckWarning] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isMouldNotInUse, setIsMouldNotInUse] = useState(false);
  const machineInputRef = useRef(null);
  const mouldInputRef = useRef(null);
  const [mouldPmStatus, setMouldPmstatus] = useState(null);
  const [mouldHealthStatus, setMouldHealthStatus] = useState(null);
  const [mouldLife, setMouldLife] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));


  useEffect(() => {
    // Focus on the machine scan input when the screen loads
    if (machineInputRef.current) {
      machineInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const fetchProductName = async () => {
      if (machineScan && mouldScan) {
        try {
          const response = await axios.get(`${BASE_URL}/mould/details/${machineScan}/${mouldScan}`);

          if (response.status === 200 && response.data.data.length > 0) {
            const mouldData = response.data.data[0];

            // Validate that Machine ID and Mould ID exist in the system and match the inputs
            if (mouldData.EquipmentID == machineScan && mouldData.MouldID == mouldScan) {
              Alert.alert('Success', 'Mould Machine Validation successful', [
                {
                  text: 'OK',
                  onPress: async () => {
                    console.log('Calling UpdateValidationStatus API with:', machineScan, mouldScan);
                    try {
                      const updateRes = await axios.post(`${BASE_URL}/mould/updateValidationStatUnload`, {
                        EquipmentID: machineScan,
                        mouldID: mouldScan,
                      });

                      if (updateRes.status === 200) {
                        console.log('✅ ValidationStatus updated successfully');
                      } else {
                        console.warn('⚠️ Validation status update failed', updateRes.data);
                      }

                      setValidation('Mould Machine Validation successful');
                    } catch (err) {
                      console.error('❌ Error calling updateValidationStatus:', err.response?.data || err.message);
                    }
                  }
                }
              ]);

              // Set the product name from the response
              setProductName(mouldData.ProductGroupName);
              setMouldActualLife(mouldData.MouldActualLife);
              setPmWarning(mouldData.PMWarning);
              setHealthCheckWarning(mouldData.HealthCheckWarning);
              setMouldPmstatus(mouldData.MouldPMStatus);
              setMouldHealthStatus(mouldData.MouldHealthStatus)
              setMouldLife(mouldData.MouldLifeStatus)

              // Check if the mould status is "Not in Use"
              if (mouldData.MouldStatus === 6) {
                setIsMouldNotInUse(true);
                setProductName(''); // Clear product name
                Alert.alert('Warning', 'This Mould is not in use.');
              } else {
                setIsMouldNotInUse(false);
              }
            } else {
              // Show an error if Machine ID or Mould ID does not match
              Alert.alert('Error', 'Machine and Mould are not in the system.');
              setProductName('No data found');
            }
          } else {
            // Show an error if Machine ID or Mould ID is not found in the system
            Alert.alert('Error', 'Machine and Mould are not in the system.');
            setProductName('No data found');
            setIsMouldNotInUse(false);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setProductName('Error fetching data');
          setIsMouldNotInUse(false);
        }
      } else {
        setProductName('');
        setIsMouldNotInUse(false);
      }
    };
    fetchProductName();
  }, [machineScan, mouldScan]);



  const handleConfirm = () => {
    if (mouldScan && machineScan) {
      setModalVisible(true);
    } else {
      Alert.alert('Info', 'This Mould does not belong to this Machine.');
    }
  };

  const handleStatusSelect = async (status) => {
    let lifeStatus = 1; // default life status
    let successMessage = ''; // Success message variable

    // Check if the status is "Not in Use" or "Breakdown"
    if (status === 6) {
      lifeStatus = 2; // Set MouldLifeStatus to 2 for "Not in Use"
      successMessage = 'Mould is not in use'; // Set success message for "Not in Use"
    }
    else if (status === 1) {
      successMessage = 'Mould Unloading  Successfully'; // Set success message for "Normal"
    }
    else if (status === 4) {
      // Call the addBreakdownLog function for breakdown
      // await addBreakdownLog();
      successMessage = 'Mould in Breakdown state'; // Set success message for "Breakdown"
    }

    if (status !== 6) {
      // For statuses other than "Not in Use," directly update
      updateMouldStatus(status, lifeStatus, successMessage);
      setModalVisible(false);
    } else {
      // Show confirmation alert for "Not in Use" status
      Alert.alert(
        'Confirm',
        'Are you sure you want to set the Mould as "Not in Use"?',
        [
          {
            text: 'Cancel',
            onPress: () => setModalVisible(false), // Close the modal
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async () => {
              await updateMouldStatus(status, lifeStatus, successMessage); // Pass status, lifeStatus, and success message
              setModalVisible(false);
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  // const addBreakdownLog = async (status) => {
  //   const data = {
  //     MouldID: mouldScan,
  //     BDStartTime: new Date().toISOString().slice(0, 19).replace('T', ' '), // Set current time in the required format
  //     BDEndTime: '',
  //     BDDuration: 0,
  //     TotalBDCount: 0,
  //     UserID: "dalisoft",
  //     BDReason: "",
  //     BDRemark: "",
  //     BDStatus: 1,
  //     MouldStatus: 4,
  //     MouldLifeStatus: "",
  //     EquipmentID: machineScan,
  //     CurrentMouldLife: mouldActualLife,
  //     ParameterID: 4,
  //     ParameterValue:status ,
  //   };

  //   try {
  //     const response = await axios.post(`${BASE_URL}/mould/addbreakdownlog`, data);

  //     if (response.status === 200) {
  //       Alert.alert('Success', 'Mould in BreakDown state');
  //     } else {
  //       Alert.alert('Error', 'Failed to create breakdown state.');
  //     }
  //   } catch (error) {
  //     console.error('Error creating breakdown state:', error);
  //     Alert.alert('Error', 'Error creating breakdown state. Please try again.');
  //   }
  // };


  const updateMouldStatus = async (status, lifeStatus, successMessage) => {
    const data = {
      MouldStatus: status,
      MouldLifeStatus: lifeStatus,
      EquipmentID: machineScan,
      MouldID: mouldScan,
      CurrentMouldLife: mouldActualLife,
      ParameterID: 4,
      ParameterValue: status,
    };

    try {
      const response = await axios.post(`${BASE_URL}/mould/update`, data);

      if (response.status === 200) {
        // Display the specific success message based on the mould status
        Alert.alert('Success', successMessage, [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MouldHome'),
          },
        ]);
      } else {
        Alert.alert('Error', 'Failed to Update Mould.');
      }
    } catch (error) {
      console.error('Error Updating Mould:', error);
      Alert.alert('Error', 'Error Updating Mould. Please try again.');
    }
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

  const getColorHC = (value) => {
    switch (value) {
      case 1: return '#27ae60'; // GREEN it is in normal state
      case 2: return '#f1c40f'; // YELLOW it is in warning state
      case 3: return '#e74c3c'; // RED it is in alarm state
      case 4: return '#f0d851'; // it is in maintenance state
      case 5: return '#8e44ad'; // PURPLE it is in maintenance state
      case 6: return '#8e44ad'; // PURPLE it is in maintenance state
      case 7: return '#e67e22'; // ORANGE it is in Due
      default: return '#bdc3c7'; // GRAY it is in unknown state
    }
  };

  const isConfirmEnabled = machineScan && mouldScan && productName && mouldActualLife !== null && pmWarning !== null && !isMouldNotInUse;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Header username={username} setIsLoggedIn={setIsLoggedIn} title="Mould UnLoading "></Header>
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <ScrollView contentContainerStyle={{ paddingBottom: 40, paddingRight: '-10%', paddingLeft: '-10%' }} showsVerticalScrollIndicator={false} >
            <View style={styles.inputContainer}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.label}>Machine Scan</Text>
                <Icon name="qrcode-scan" size={20} color="#666" style={styles.icon} />
              </View>

              <TextInput
                style={styles.input}
                ref={machineInputRef}
                keyboardType='numeric'
                placeholder="Machine QR Code"
                placeholderTextColor={'black'}
                value={machineScan}
                onChangeText={setMachineScan}
                returnKeyType="next" // Show "Next" button on the keyboard
                onSubmitEditing={() => {
                  // When the user submits the machineScan input, focus on mouldScan
                  if (mouldInputRef.current) {
                    mouldInputRef.current.focus();
                  }
                }}
                blurOnSubmit={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.label}>Mould Scan</Text>
                <Icon name="qrcode-scan" size={20} color="#666" style={styles.icon} />
              </View>

              <TextInput
                style={styles.input}
                ref={mouldInputRef} // Set the ref for auto-focus
                placeholder="Mould QR Code"
                keyboardType='numeric'
                placeholderTextColor={'black'}
                value={mouldScan}
                onChangeText={setMouldScan}
                returnKeyType="done" // Show "Done" button on the keyboard
              />
            </View>

            {/* Hide Product Name if mould is not in use */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Product Name</Text>
              <View style={[styles.input, { borderWidth: 1, borderColor: '#ccc', justifyContent: 'center' }]}>
                <Text style={{ fontSize: 16, color: '#333' }}>{productName}</Text>
              </View>
            </View>

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

            <TouchableOpacity
              style={[styles.confirmButton, { opacity: isConfirmEnabled ? 1 : 0.5 }]}
              onPress={isConfirmEnabled ? handleConfirm : null}
              disabled={!isConfirmEnabled}
            >
              <Text style={styles.confirmText}>🚀 CONFIRM</Text>
            </TouchableOpacity>

            {/* Modal for selecting mould status */}
            <Modal
              visible={modalVisible}
              animationType="fade"
              transparent={true}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Select Mould Status</Text>
                  <Text style={styles.modalSubtitle}>Please choose a mould status option</Text>
                  <TouchableOpacity
                    style={[styles.button, styles.breakdownButton]}
                    onPress={() => navigation.navigate(BreakDown)}
                  >
                    <Text style={styles.buttonText}>Breakdown</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.notInUseButton]}
                    onPress={() => handleStatusSelect(6)}
                  >
                    <Text style={styles.buttonText}>Not in Use</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.normalButton]}
                    onPress={() => handleStatusSelect(1)}
                  >
                    <Text style={styles.buttonText}>Normal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </ScrollView>
        </Animated.View>

      </View>
    </KeyboardAvoidingView>

  );
};

export default MouldUnLoadingScreen;
