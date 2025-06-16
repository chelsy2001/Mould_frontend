// SparePart.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Animated, Easing } from 'react-native';
import Header from '../header/header';
import styles from './style';
import { SelectList } from 'react-native-dropdown-select-list';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BASE_URL } from '../config/config';

const SparePart = ({ username, setIsLoggedIn }) => {
   const navigation = useNavigation();
  const [spareLocationScan, setSpareLocationScan] = useState('');
  const [quantity, setQuantity] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('');
  const [selectedMouldId, setSelectedMouldId] = useState('');
  const [selectedSparePart, setSelectedSparePart] = useState('');
  const [sparePartOptions, setSparePartOptions] = useState([]);
  const [sparePartLoc, setSparePartLoc] = useState('');
  const SparePartLocation = useRef(null);
  const [sparePartCategoryId, setSparePartCategoryId] = useState('');
  const [partNameOptions, setPartNameOptions] = useState([]);



  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

const fetchCategoriesByMould = async (mouldId) => {
  if (mouldId) {
    try {
      const response = await fetch(`${BASE_URL}/sparepart/categories/${mouldId}`);
      const text = await response.text();
      console.log("Raw response:", text); // Debug actual response

      const data = JSON.parse(text);
      if (data.statusCode === 200) {
        const formatted = data.data.map(item => ({
          key: item.SparePartCategoryID,
          value: item.SparePartCategoryName,
        }));
        setSparePartOptions(formatted);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }
};

 // ✅ Fetch mould group
  const fetchMouldGroupByMould = async (mouldId) => {
    if (mouldId) {
      try {
        const response = await fetch(`${BASE_URL}sparepart/mouldgroup/${mouldId}`);
        const data = await response.json();
        if (data.statusCode === 200) {
          setCurrentQuantity(data.data?.MouldGroupName || '--');
        }
      } catch (error) {
        console.error("Error fetching mould group:", error);
      }
    }
  };

  // ✅ When spare part category is selected
  const handleSparePartSelect = async (categoryId) => {
    setSelectedSparePart(categoryId);
    try {
      const response = await fetch(`${BASE_URL}sparepart/parts/by-category/${categoryId}`);
      const data = await response.json();
      if (data.statusCode === 200) {
        const formatted = data.data.map(item => ({
          key: item.SparePartID,
          value: item.SparePartName,
        }));
        setPartNameOptions(formatted);
      }
    } catch (error) {
      console.error("Error fetching spare part names:", error);
    }
  };

  // ✅ When part name is selected
  const getSparePartDetails = async (sparePartName) => {
    try {
      const response = await fetch(`${BASE_URL}sparepart/details/by-name/${encodeURIComponent(sparePartName)}`);
      const data = await response.json();
      if (data.statusCode === 200 && data.data.length > 0) {
        const part = data.data[0];
        setSparePartLoc(part.Location);
        setCurrentQuantity(part.Quantity.toString());
      }
    } catch (error) {
      console.error("Error fetching spare part details:", error);
    }
  };

  useEffect(() => {
    if (SparePartLocation.current) {
      SparePartLocation.current.focus();
    }
  }, []);

  useEffect(() => {
    if (SparePartLocation.current) {
      SparePartLocation.current.focus();
    }
  }, []);

  const handleConfirm = async () => {
    if (sparePartLoc === spareLocationScan) {
      Alert.alert('Success', 'Spare part consumption updated (simulation)', [
        { text: 'OK', onPress: () => navigation.navigate('MouldHome') },
      ]);
    } else {
      Alert.alert('Error', 'Spare part location does not match the scanned location.');
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Header username={username} setIsLoggedIn={setIsLoggedIn} title='Spare Part Screen'/>
      <ScrollView contentContainerStyle={{ paddingBottom: 30, padding: 40 }}>

        {/* MOULD SCAN AND SPARE PART CATEGORY */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              <Icon name="qrcode-scan" size={18} color="#003366" /> Scan Mould ID
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Scan Mould ID"
              value={selectedMouldId}
              keyboardType="numeric"
              placeholderTextColor={'black'}
             onChangeText={setSelectedMouldId}
              onSubmitEditing={() => {
                fetchMouldGroupByMould(selectedMouldId);
                fetchCategoriesByMould(selectedMouldId);
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              <Icon name="shape-outline" size={18} color="#003366" /> Select Spare Part Category
            </Text>
           <SelectList
  setSelected={setSparePartCategoryId}
  data={sparePartOptions}
  save="key"
  onSelect={handleSparePartSelect}
  placeholder="Select Spare Part Category"
  dropdownTextStyle={{ color: '#003366' }}
  dropdownItemStyle={{ backgroundColor: '#e6f0ff' }}
  boxStyles={{ backgroundColor: '#fff', borderColor: '#b3c6ff', borderWidth: 1.5, borderRadius: 12 }}
/>

          </View>
        </View>


        {/* MOULD GROUP AND SPARE PART SELECTION */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              <Icon name="layers-outline" size={18} color="#003366" /> Mould Group
            </Text>
            <Text style={styles.currentqty}>{ fetchMouldGroupByMould|| '--'}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              <Icon name="cog-outline" size={18} color="#003366" /> Select Part Name
            </Text>
            {/* Spare Part Name Dropdown */}
<SelectList
  setSelected={setSelectedSparePart}
  data={partNameOptions}
  save="value"
  onSelect={getSparePartDetails}
  placeholder="Select Spare Part"
  dropdownTextStyle={{ color: '#003366' }}
  dropdownItemStyle={{ backgroundColor: '#e6f0ff' }}
  boxStyles={{ backgroundColor: '#fff', borderColor: '#b3c6ff', borderWidth: 1.5, borderRadius: 12 }}
/>
          </View>
        </View>

        {/* REQUIRED QUANTITY */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              <Icon name="numeric" size={18} color="#003366" /> Required Quantity
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Required Quantity"
              value={quantity}
              keyboardType="numeric"
              onChangeText={setQuantity}
              placeholderTextColor={'black'}
            />
          </View>

          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.findButton} onPress={handleConfirm}>
              <Text style={styles.confirmText}>
                <Icon name="magnify" size={20} color="#fff" /> Find
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CURRENT QUANTITY AND SPARE PART LOCATION */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              <Icon name="warehouse" size={18} color="#003366" /> Current Quantity
            </Text>
            <Text style={styles.currentqty}>{currentQuantity || '--'}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              <Icon name="map-marker-outline" size={18} color="#003366" /> Spare Part Location
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Location"
              value={sparePartLoc}
              editable={false}
              placeholderTextColor={'black'}
            />
          </View>
        </View>

        {/* SCAN LOCATION AND QUANTITY USED */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              <Icon name="qrcode-scan" size={18} color="#003366" /> Scan Spare Part Location
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Scan Location"
              value={spareLocationScan}
              onChangeText={setSpareLocationScan}
              ref={SparePartLocation}
              placeholderTextColor={'black'}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              <Icon name="cart-arrow-down" size={18} color="#003366" /> Quantity to Use
            </Text>
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

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>
            <Icon name="check-circle-outline" size={20} color="#fff" /> CONFIRM
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
};

export default SparePart;
