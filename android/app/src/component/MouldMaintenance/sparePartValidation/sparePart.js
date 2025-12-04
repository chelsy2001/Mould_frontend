// SparePart.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Animated,
  FlatList,
} from "react-native";
import Header from "../../Common/header/header";
import styles from "./style";
import { SelectList } from "react-native-dropdown-select-list";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { BASE_URL } from "../../Common/config/config";
import axios from "axios";

const SparePart = ({ username, setIsLoggedIn }) => {
  const [mouldId, setMouldId] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [partId, setPartId] = useState("");
  const [parts, setParts] = useState([]);
  const [currentQty, setCurrentQty] = useState("");
  const [locationData, setLocationData] = useState([]);
  const [selectedPartName, setSelectedPartName] = useState("");


  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // ⭐ Fetch categories when mouldId changes
  useEffect(() => {
    if (!mouldId) return;

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/sparepart/categories/${mouldId}`);
        const json = await res.json();

        if (json.status === 200) {
          const formatted = json.data.map(item => ({
            key: item.SparePartCategory,
            value: item.SparePartCategory,
          }));
          setCategoryList(formatted);
        }
      } catch (error) {
        console.log("Category Fetch Error: ", error);
      }
    };

    fetchCategories();
  }, [mouldId]);

  // ⭐ Fetch parts when selectedCategory changes
  useEffect(() => {
  if (!selectedCategory || !mouldId) return;

  axios
    .get(`${BASE_URL}/sparepart/parts/by-category/${mouldId}/${selectedCategory}`)
    .then((res) => {
      if (res.data.status === 200) {      // ✅ FIXED
        const partData = res.data.data.map((p) => ({
          key: p.SparePartID,
          value: p.SparePartName,
        }));
        setParts(partData);
        setPartId("");
        setLocationData([]);
        setCurrentQty("");
      }
    })
    .catch((err) => console.log("Parts API error:", err));
}, [selectedCategory]);


  // ⭐ Fetch quantity & location after selecting part
  useEffect(() => {
  if (!selectedPartName) return;

  axios
    .get(`${BASE_URL}/sparepart/details/by-name/${selectedPartName}`)
    .then((res) => {
      if (res.data.status === 200) {
        const item = res.data.data[0];
        setCurrentQty(item.CurrentQuantity?.toString() || "0");
      }
    })
    .catch((err) => console.log("Details API error:", err));

  axios
    .get(`${BASE_URL}/sparepart/location/by-name/${selectedPartName}`)
    .then((res) => {
      if (res.data.status === 200) {
        const locData = res.data.data
          .map((l) => ({
            Location: l.LocationID,
            Qty: Number(l.Quantity || 0),
            UseQty: "",
            Timestamp: l.Timestamp,
          }))
          .sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));

        setLocationData(locData);
      }
    })
    .catch((err) => console.log("Location API error:", err));
}, [selectedPartName]);


  // ---------- FIFO Logic (unchanged) ----------
  const getFirstNonDepletedIndex = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      const qty = Number(arr[i].Qty || 0);
      const use = Number(arr[i].UseQty || 0);
      if (qty - use > 0) return i;
    }
    return -1;
  };

  const validateFIFOAfterUpdate = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      const useI = Number(arr[i].UseQty || 0);
      if (useI > 0) {
        for (let j = 0; j < i; j++) {
          const remainingJ =
            Number(arr[j].Qty || 0) - Number(arr[j].UseQty || 0);
          if (remainingJ > 0) {
            return {
              ok: false,
              message:
                "FIFO rule violated: please consume first from highlighted green location.",
            };
          }
        }
      }
    }
    for (let i = 0; i < arr.length; i++) {
      const use = Number(arr[i].UseQty || 0);
      const qty = Number(arr[i].Qty || 0);
      if (use < 0 || isNaN(use))
        return { ok: false, message: "Enter valid numeric quantity." };
      if (use > qty)
        return {
          ok: false,
          message: `Used qty can't exceed available qty at ${arr[i].Location}.`,
        };
    }
    return { ok: true };
  };

  const updateUseQty = (index, value) => {
    const sanitized = value.replace(/[^0-9]/g, "");
    const updated = locationData.map((r) => ({ ...r }));
    updated[index].UseQty = sanitized;

    const valid = validateFIFOAfterUpdate(updated);
    if (!valid.ok) {
      Alert.alert("Error", valid.message);
      return;
    }

    setLocationData(updated);
  };

  const handleConfirm = async () => {
    const locationsToSend = locationData.map((r) => ({
      LocationID: r.Location,
      Quantity: Number(r.UseQty || 0),
    }));
    const totalUse = locationsToSend.reduce((sum, l) => sum + l.Quantity, 0);

    if (totalUse <= 0) {
      Alert.alert("Error", "Please enter quantity to use.");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/sparepart/movement`, {
        MouldID: mouldId,
        SparePartID: partId,
        locations: locationsToSend,
      });
      if (res.data.success) {
        Alert.alert("Success", `Consumed total ${totalUse}.`);
        setLocationData(locationData.map((r) => ({ ...r, UseQty: "" })));
        setCurrentQty((prev) => (Number(prev) - totalUse).toString());
      } else {
       Alert.alert('Success', successMessage, [
                 {
                   text: 'OK',
                   onPress: () => navigation.navigate('MouldHome'),
                 },
               ]);
      }
    } catch (err) {
      console.log("Movement API error:", err);
      Alert.alert("Error", "Failed to update quantities.");
    }
  };

  const rowBackgroundFor = (index) => {
    const firstNonDepleted = getFirstNonDepletedIndex(locationData);
    const remaining =
      Number(locationData[index].Qty || 0) -
      Number(locationData[index].UseQty || 0);
    if (remaining <= 0) return styles.tableRowDepleted;
    if (index === firstNonDepleted) return styles.tableRowActive;
    return styles.tableRowBlocked;
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Header
        username={username}
        setIsLoggedIn={setIsLoggedIn}
        title="Spare Part"
      />

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Mould ID */}
        <View style={styles.card}>
          <Text style={styles.label}>
            <Icon name="qrcode-scan" size={18} color="#003366" /> Scan Mould ID
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter / Scan Mould ID"
            value={mouldId}
            onChangeText={setMouldId}
          />
        </View>

        {/* Category */}
        <View style={styles.card}>
          <Text style={styles.label}>
            <Icon name="shape-outline" size={18} color="#003366" /> Spare Part
            Category
          </Text>
          <SelectList
            setSelected={setSelectedCategory}
            data={categoryList}
            save="value"
            placeholder="Select Category"
          />
        </View>

        {/* Spare Part */}
        {selectedCategory !== "" && (
          <View style={styles.card}>
            <Text style={styles.label}>
              <Icon name="cog-outline" size={18} color="#003366" /> Spare Part
              Name
            </Text>
            <SelectList
  data={parts}
  save="value"          // ⭐ picks SparePartName
  setSelected={(val) => {
      setSelectedPartName(val);  // Save name
      const selected = parts.find(p => p.value === val);
      setPartId(selected?.key);  // Save ID separately
  }}
  placeholder="Select Spare Part"
  boxStyles={styles.dropdown}
/>

          </View>
        )}

        {/* Current Quantity */}
        {partId !== "" && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Available Quantity: {currentQty}
            </Text>
          </View>
        )}

        {/* Location Table */}
        {locationData.length > 0 && (
          <View style={styles.tableCard}>
            <Text style={styles.tableHeader}>Location-wise Quantity</Text>
            <FlatList
              data={locationData}
              keyExtractor={(item, i) => i.toString()}
              renderItem={({ item, index }) => (
                <View style={[styles.tableRow, rowBackgroundFor(index)]}>
                  <View style={styles.tableCellWrap}>
                    <Text style={styles.tableCellTitle}>
                      Location: {item.Location}
                    </Text>
                    <Text style={styles.tableCellSub}>
                      Available: {item.Qty}
                    </Text>
                  </View>
                  <TextInput
                    style={styles.tableInput}
                    keyboardType="numeric"
                    placeholder="Use"
                    value={item.UseQty}
                    onChangeText={(val) => updateUseQty(index, val)}
                  />
                </View>
              )}
            />
          </View>
        )}

        {/* Confirm */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmText}>CONFIRM</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
};

export default SparePart;
