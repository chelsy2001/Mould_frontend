// SparePart.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Animated, Easing } from 'react-native';
import Header from '../header/header';
import styles from './style';
import { SelectList } from 'react-native-dropdown-select-list';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../config/config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SparePart = ({ username, setIsLoggedIn }) => {
  const navigation = useNavigation();
  const [spareLocationScan, setSpareLocationScan] = useState('');
  const [quantity, setQuantity] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('');
  const [selectedMouldId, setSelectedMouldId] = useState('');
  const [selectedSparePart, setSelectedSparePart] = useState('');
  const [mouldIdOptions, setMouldIdOptions] = useState([]);
  const [sparePartOptions, setSparePartOptions] = useState([]);
  const [sparePartLoc, setSparePartLoc] = useState('');
  const SparePartLocation = useRef(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (SparePartLocation.current) {
      SparePartLocation.current.focus();
    }
  }, []);

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
        }
      } catch (error) {
        console.error('Error fetching Mould IDs:', error);
      }
    };
    fetchMouldIds();
  }, []);

  useEffect(() => {
    if (selectedMouldId) {
      const fetchSpareParts = async () => {
        try {
          const response = await fetch(`${BASE_URL}/sparepart/${selectedMouldId}`);
          const data = await response.json();
          if (data.status === 200) {
            const options = data.data.map(item => ({
              key: item.SparePartID,
              value: `${item.SparePartName}`,
              location: item.SparePartLoc,
              quantity: item.CurrentQuantity,  // Store quantity here!
            }));
            setSparePartOptions(options);
          }
        } catch (error) {
          console.error('Error fetching spare parts:', error);
        }
      };
      fetchSpareParts();
    }
  }, [selectedMouldId]);

  const handleSparePartSelect = (val) => {
    const selectedPart = sparePartOptions.find(item => item.value === val);
    setSelectedSparePart(val);
    setSparePartLoc(selectedPart?.location || '');
    setCurrentQuantity(selectedPart?.quantity?.toString() || '0');  // Update quantity here based on selection
  };

  const handleConfirm = async () => {
    if (sparePartLoc === spareLocationScan) {
      try {
        const selectedPart = sparePartOptions.find(part => part.value === selectedSparePart);
        const response = await fetch(`${BASE_URL}/sparepart/movement`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            SparePartID: selectedPart?.key,
            MouldID: selectedMouldId,
            Quantity: parseInt(quantity),
          }),
        });
        const data = await response.json();
        if (data.status === 200) {
          Alert.alert('Success', 'Spare part consumption updated', [
            { text: 'OK', onPress: () => navigation.navigate('MouldHome') },
          ]);
        } else {
          Alert.alert('Error', `Failed to update: ${data.message}`);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to update spare parts.');
      }
    } else {
      Alert.alert('Error', 'Spare part location does not match the scanned location.');
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Header username={username} setIsLoggedIn={setIsLoggedIn} title = 'Spare Part Screen'/>
      <ScrollView contentContainerStyle={{ paddingBottom: 30, padding: 40 }}>
        <Text style={styles.label}><Icon name="hammer-wrench" size={18} color="#003366" /> Select Mould ID</Text>
        <View style={styles.dropdown}>
          <SelectList
            setSelected={setSelectedMouldId}
            data={mouldIdOptions}
            save="value"
            placeholder="Choose Mould"
          />
        </View>

        <Text style={styles.label}><Icon name="cog" size={18} color="#003366" /> Select Spare Part</Text>
        <View style={styles.dropdown}>
          <SelectList
            setSelected={handleSparePartSelect}
            data={sparePartOptions}
            save="value"
            placeholder="Choose Spare Part"
          />
        </View>

        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}><Icon name="cube" size={18} color="#003366" /> Current Quantity</Text>
            <Text style={styles.currentqty}>{currentQuantity || '--'}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}><Icon name="counter" size={18} color="#003366" /> Quantity to Use</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Quantity"
              value={quantity}
              keyboardType="numeric"
              onChangeText={setQuantity}
              placeholderTextColor={'black'}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}><Icon name="map-marker" size={18} color="#003366" /> Spare Part Location</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#f0f0f0' }]}
            placeholder="Spare Location"
            value={sparePartLoc}
            editable={false}
            ref={SparePartLocation}
            placeholderTextColor={'black'}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}><Icon name="qrcode-scan" size={18} color="#003366" /> Scan Spare Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Scan Location"
            value={spareLocationScan}
            onChangeText={setSpareLocationScan}
          />
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}><Icon name="check-circle-outline" size={20} color="#fff" /> CONFIRM</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
};

export default SparePart;
