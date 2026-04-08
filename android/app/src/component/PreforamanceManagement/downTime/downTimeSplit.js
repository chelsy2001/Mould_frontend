import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import styles from "./splitStyle";
import { BASE_URL } from "../../Common/config/config";

const DowntimeSplit = ({ route, navigation }) => {
  const { rowData } = route.params;

  const [form, setForm] = useState({
    downtimeID: rowData.downtimeID,
    prodDate: rowData.prodDate,
    shift: rowData.prodShift,
    startTime: rowData.downtimeStartTime,
    endTime: rowData.downtimeEndTime,
    duration: Number(rowData.duration),

    // FIRST PART
    loss1: rowData.LossID || "",
    subloss1: rowData.SubLossID || "",
    reason: rowData.reason || "",

    // SECOND PART
    newDuration: "",
    loss2: rowData.LossID || "",
    subloss2: rowData.SubLossID || "",
    reason2: ""
  });

  const [lossData, setLossData] = useState([]);
  const [subLossData1, setSubLossData1] = useState([]);
  const [subLossData2, setSubLossData2] = useState([]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // 🔹 Fetch Loss List
  useEffect(() => {
    fetch(`${BASE_URL}/downtime/loss`)
      .then(res => res.json())
      .then(res => setLossData(res.data || []))
      .catch(err => console.log("Loss fetch error:", err));
  }, []);

  // 🔹 Fetch SubLoss for FIRST PART
  useEffect(() => {
    if (!form.loss1) return;

    fetch(`${BASE_URL}/downtime/Subloss?LossID=${form.loss1}`)
      .then(res => res.json())
      .then(res => {
        if (res.status === 200) {
          setSubLossData1(res.data.map(i => ({
            key: i.SubLossID.toString(),
            value: i.SubLossName
          })));
        }
      })
      .catch(err => console.log(err));
  }, [form.loss1]);

  // 🔹 Fetch SubLoss for SECOND PART
  useEffect(() => {
    if (!form.loss2) return;

    fetch(`${BASE_URL}/downtime/Subloss?LossID=${form.loss2}`)
      .then(res => res.json())
      .then(res => {
        if (res.status === 200) {
          setSubLossData2(res.data.map(i => ({
            key: i.SubLossID.toString(),
            value: i.SubLossName
          })));
        }
      })
      .catch(err => console.log(err));
  }, [form.loss2]);

  // 🔹 Remaining duration
  const remainingDuration = form.duration - (form.newDuration || 0);

  // 🔥 MAIN SPLIT FUNCTION
  const handleSplit = async () => {
    if (!form.newDuration) {
      Alert.alert("Error", "Please enter split duration");
      return;
    }

    if (form.newDuration <= 0 || form.newDuration >= form.duration) {
      Alert.alert("Error", "Invalid split duration");
      return;
    }

    try {
      const payload = {
        DowntimeID: parseInt(form.downtimeID),
        Duration: parseInt(form.duration),
        NewDuration: parseInt(form.newDuration),

        // FIRST PART
        LossName1: parseInt(form.loss1 || 0),
        SubLossName1: parseInt(form.subloss1 || 0),
        TPMSubLossName1: 0,
        Reason1: form.reason || "",

        // SECOND PART
        LossName2: parseInt(form.loss2 || 0),
        SubLossName2: parseInt(form.subloss2 || 0),
        TPMSubLossName2: 0,
        Reason2: form.reason2 || ""
      };

      console.log("🚀 FINAL PAYLOAD:", payload);

      const response = await fetch(`${BASE_URL}/downtime/downtime/split`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      console.log("✅ API RESPONSE:", result);

      if (result.success) {
        Alert.alert("Success", "Downtime Split Successful ✅");
        navigation.goBack();
      } else {
        Alert.alert("Error", result.message || "Split failed");
      }

    } catch (error) {
      console.error("❌ API ERROR:", error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Downtime Split</Text>

      {/* 🔹 ORIGINAL */}
      <View style={styles.card}>
        <Text>ID: {form.downtimeID}</Text>
        <Text>Shift: {form.shift}</Text>
<Text style={styles.label}> Duration</Text>
        <TextInput
          style={styles.input}
          value={form.duration?.toString()}
          editable={false}
        />
        <Text style={styles.label}>Split Duration</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={form.newDuration?.toString()}
          onChangeText={(t) => handleChange("newDuration", t)}
        />
        <Text style={styles.label}>Loss 1</Text>
        <SelectList
          data={lossData.map(item => ({
            key: item.LossID.toString(),
            value: item.LossName
          }))}
          setSelected={(val) => handleChange("loss1", val)}
          save="key"
        />

        <Text style={styles.label}>SubLoss 1</Text>
        <SelectList
          data={subLossData1}
          setSelected={(val) => handleChange("subloss1", val)}
          save="key"
        />

        <Text style={styles.label}>Reason</Text>
        <TextInput
          style={styles.input}
          value={form.reason}
          onChangeText={(t) => handleChange("reason", t)}
        />
      </View>

      {/* 🔹 SPLIT */}
      <View style={styles.card}>
        

        <Text style={styles.label}>Remaining Duration</Text>
        <TextInput
          style={styles.input}
          value={remainingDuration?.toString()}
          editable={false}
        />

        <Text style={styles.label}>Loss 2</Text>
        <SelectList
          data={lossData.map(item => ({
            key: item.LossID.toString(),
            value: item.LossName
          }))}
          setSelected={(val) => handleChange("loss2", val)}
          save="key"
        />

        <Text style={styles.label}>SubLoss 2</Text>
        <SelectList
          data={subLossData2}
          setSelected={(val) => handleChange("subloss2", val)}
          save="key"
        />

        <Text style={styles.label}>Reason 2</Text>
        <TextInput
          style={styles.input}
          value={form.reason2}
          onChangeText={(t) => handleChange("reason2", t)}
        />
      </View>

      <TouchableOpacity style={styles.splitBtn} onPress={handleSplit}>
        <Text style={styles.btnText}>Split Downtime</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DowntimeSplit;