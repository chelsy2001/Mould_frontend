// SparePart.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import Header from '../../Common/header/header';
import styles from './style';
import { SelectList } from 'react-native-dropdown-select-list';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BASE_URL } from '../../Common/config/config'; // Adjust the import based on your project structure

const SparePart = ({ username, setIsLoggedIn }) => {
  const navigation = useNavigation();

  const [selectedMouldId, setSelectedMouldId] = useState(''); // mould ID
  const [sparePartCategoryId, setSparePartCategoryId] = useState(''); // spare part category ID
  const [mouldGroup, setMouldGroup] = useState('');
  const [selectedSparePart, setSelectedSparePart] = useState(''); // selected spare part ID
  const [quantity, setQuantity] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('');
  const [sparePartLoc, setSparePartLoc] = useState('');
  const [spareLocationScan, setSpareLocationScan] = useState('');
  const [sparePartOptions, setSparePartOptions] = useState([]); // category options
  const [partNameOptions, setPartNameOptions] = useState([]); // part name options
  const [prefferdSparePart, setPrefferdSparePart] = useState('');
  const [RequiredQuantity, setRequiredQuantity] = useState(''); // required quantity
  
  console.log(prefferdSparePart,'prefferdSparePart');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const SparePartLocation = useRef(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  //category fetch
useEffect(() => {
  if (selectedMouldId) {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/sparepart/categories/${selectedMouldId}`);
        const result = await response.json();
        // console.log("Parsed Category Response:", result);

        if (result.status === 200 && Array.isArray(result.data)) {
          const formatted = result.data.map(item => ({
            key: item.SparePartCategoryID,
            value: item.SparePartCategoryName,
          }));
          setSparePartOptions(formatted);
        } else {
          Alert.alert('Error', result.message || 'Something went wrong');
        }
      } catch (error) {
        Alert.alert('Error', error.message);
        console.log("❌ Fetch Error:", error.message);
      }
    };
    fetchCategories();
  }
}, [selectedMouldId]);


// fetch spare part names based on selected category
useEffect(() => {
  if(sparePartCategoryId){
    const fetchSparePartsByCategory = async () => {
      try {
        const response =await fetch(`${BASE_URL}/sparepart/parts/by-category/${sparePartCategoryId}`);
        const result = await response.json();
        // console.log("Fetched Spare Parts:", result);
        if(result.status === 200 && Array.isArray(result.data) ){
          const formatted = result.data.map(item => ({
            key: item.SparePartID,
            value: item.SparePartName,
          }));
          setPartNameOptions(formatted);
        }
        else {
          setPartNameOptions([]); // Clear the list if empty or invalid
          Alert.alert('Error', result.message || 'Unable to fetch part names.');
        }
      }catch (error) {
        // Alert.alert('Error', error.message);
        // console.error("Spare Part Name Fetch Error:", error.message);
      }
    };
    fetchSparePartsByCategory();
  }
}, [sparePartCategoryId]);

 //fetch mould group based on selected mould ID
 useEffect(() => {
  if (selectedMouldId) {
    const fetchMouldGroup = async () => {
      try {
        const response = await fetch(`${BASE_URL}/sparepart/mouldgroup/${selectedMouldId}`);
        const result = await response.json();
        if (result.status === 200 && result.data && result.data.MouldGroupName) {
          setMouldGroup(result.data.MouldGroupName);
        } else {
          setMouldGroup('--');
        }
      } catch (error) {
        Alert.alert('Error', error.message);
        console.error("Mould Group Fetch Error:", error);
      }
    };
    fetchMouldGroup();
  }
}, [selectedMouldId]);

// fetch preferred spare part based on selected category
useEffect(() => {
  if (sparePartCategoryId) {
    const fetchPrefferdSparePart = async () => {
      try {
        const response = await fetch(`${BASE_URL}/sparepart/parts/by-category-prefferd/${sparePartCategoryId}`);
        const result = await response.json();
        console.log("Fetched Preferred Spare Part:", result);
        if (result.status === 200 && Array.isArray(result.data) && result.data.length > 0) {
          setPrefferdSparePart(result.data[0].SparePartName);
        } else {
          setPrefferdSparePart('--');
        }
      } catch (error) {
        Alert.alert('Error', error.message);
        console.error("prefferd spare part Fetch Error:", error);
      }
    };
    fetchPrefferdSparePart();
    console.log(fetchPrefferdSparePart(),'testeee ')
  }
  
}, [sparePartCategoryId]);

const handleFind = async () => {
  if (!selectedSparePart) {
    Alert.alert("Please select a spare part first.");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/sparepart/monitoring/${selectedSparePart}`);
    const result = await response.json();

    if (result.status === 200 && result.data) {
      const fetchedQuantity = result.data.CurrentQuantity; // ✅ API se aaya hua value
      setCurrentQuantity(String(fetchedQuantity));
      setSparePartLoc(result.data.SparePartLoc);

      // ✅ Required vs Available quantity check
      if (parseInt(RequiredQuantity) > parseInt(fetchedQuantity)) {
        Alert.alert(
          "Insufficient Quantity",
          `Required quantity (${RequiredQuantity}) exceeds available stock (${fetchedQuantity}).`
        );
        return;
      }
    } else {
      Alert.alert("Not Found", result.message || "No data found.");
    }
  } catch (error) {
    Alert.alert("Error", error.message);
  }
};


const handleConfirm = async () => {
  // if (spareLocationScan.trim() !== sparePartLoc.trim()) {
  //   Alert.alert("Location Mismatch", "Scanned location does not match stored location.");
  //   return;
  // }

  if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
    Alert.alert("Invalid Quantity", "Please enter a valid quantity to use.");
    return;
  }

  const payload = {
    MouldID: selectedMouldId,
    SparePartID: selectedSparePart,
    Quantity: quantity,
  };

  try {
    const response = await fetch(`${BASE_URL}/sparepart/movement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.status === 200) {
      Alert.alert("Success", "Spare part used and updated successfully.", [
    {
      text: "OK",
      onPress: () => {
        setQuantity('');
        setSpareLocationScan('');
        navigation.navigate('MouldHome'); 
      },
    },
  ]);
    } else {
      Alert.alert("Error", result.message || "Failed to update.");
    }
  } catch (error) {
    Alert.alert("Error", error.message);
  }
};



  // Reset state when the screen is focused or unfocused

  useFocusEffect(
    useCallback(() => {
      // This will run when the screen is focused
      return () => {
        // This will run when the screen is unfocused
        setSelectedMouldId('');
        setSparePartCategoryId('');
        setMouldGroup('');
        setSelectedSparePart('');
        setQuantity('');
        setCurrentQuantity('');
        setSparePartLoc('');
        setSpareLocationScan('');
        setSparePartOptions([]);
        setPartNameOptions([]);
      };
    }, [])
  );


  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Header username={username} setIsLoggedIn={setIsLoggedIn} title="Spare Part " />
      <ScrollView contentContainerStyle={{ paddingBottom: 30, padding: 30}}>

        <View style={styles.mouldData}>
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
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              <Icon name="shape-outline" size={15} color="#003366" /> Spare Part Category
            </Text>
           <SelectList
  key={sparePartOptions.length} // ⚠️ Add this to force update
  setSelected={setSparePartCategoryId}
  style={styles.dropdown}
  data={sparePartOptions}
  save="key"
  placeholder=""
  dropdownTextStyle={{ color: '#003366' }}
  dropdownItemStyle={{ backgroundColor: '#e6f0ff' }}
  boxStyles={{
    backgroundColor: '#fff',
    // borderColor: '#b3c6ff',
    borderWidth: 0.5,
    borderRadius: 25,
    fontSize:10,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  }}
/>

          </View>
        </View>

        {/* MOULD GROUP AND SPARE PART SELECTION */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              <Icon name="layers-outline" size={18} color="#003366" /> Mould Group
            </Text>
            <Text style={styles.currentqty}>{String(mouldGroup || '--')}</Text>
          </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>
              <Icon name="layers-outline" size={18} color="#003366" /> Perfferred Spare Part
            </Text>
            <Text style={styles.currentqty}>{String(prefferdSparePart || '--')}</Text>
          </View>
        </View>

         <View style={styles.inputContainer}>
            <Text style={styles.label}>
              <Icon name="cog-outline" size={18} color="#003366" /> Select Part Name
            </Text>
            <SelectList
             setSelected={setSelectedSparePart}
              data={partNameOptions}
              save="key" // ✅ This ensures you get SparePartID
              placeholder="Select Spare Part"
              dropdownTextStyle={{ color: '#003366', fontSize: 5 }}
              dropdownItemStyle={{ backgroundColor: '#e6f0ff'  }}
              boxStyles={{
                 backgroundColor: '#fff',
    // borderColor: '#b3c6ff',
    borderWidth: 0.5,
    borderRadius: 25,
    fontSize:10,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
              }}
            />
          </View>

        {/* REQUIRED QUANTITY AND FIND BUTTON */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              <Icon name="numeric" size={18} color="#003366" /> Required Quantity
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Required Quantity"
              value={RequiredQuantity}
              keyboardType="numeric"
              onChangeText={setRequiredQuantity}
              placeholderTextColor={'black'}
            />
          </View>

          <View style={styles.inputContainer}>
           <TouchableOpacity style={styles.findButton} onPress={handleFind}>
  <Text style={styles.confirmText}>
    <Icon name="magnify" size={18} color="#fff" /> Find
  </Text>
</TouchableOpacity>
          </View>
        </View>

        {/* CURRENT QUANTITY AND SPARE LOCATION */}
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

        {/* SCAN LOCATION AND QUANTITY TO USE */}
        <View style={styles.row}>
          {/* <View style={styles.inputContainer}>
            <Text style={styles.label}>
              <Icon name="qrcode-scan" size={18} color="#003366" /> ScanSparePartLoc
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Scan Location"
              value={spareLocationScan}
              onChangeText={setSpareLocationScan}
              ref={SparePartLocation}
              placeholderTextColor={'black'}
            />
          </View> */}

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
     </View> 
        {/* CONFIRM BUTTON */}
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

