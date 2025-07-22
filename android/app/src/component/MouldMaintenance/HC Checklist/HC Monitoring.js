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
import styles from './hcMonitoringStyle';
import { BASE_URL } from '../../Common/config/config';
import { useNavigation } from '@react-navigation/native';


const HCMonitoring = ({ username, setIsLoggedIn }) => {

  const [checklistData, setChecklistData] = useState([]);
const navigation = useNavigation();
  //integrate the checklist api
  useEffect(() => {
    fetch(`${BASE_URL}/HCMouldMonitoring/HCChecklist`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          setChecklistData(data.data);
        } else {
          console.log('Error:', data.message);
        }
      })
      .catch(error => console.error('API fetch error:', error));
  }, []);

  return (
      <View style={styles.container}>
      <Header username={username} title="HC Mould Monitoring" />
  <ScrollView
        nestedScrollEnabled={true}
        style={{ maxHeight: 700, marginBottom: 30,marginTop:20 }}
      >
      {checklistData.map((item, index) => (
        <View>
          <View key={item.UID} style={[
            styles.Container1,
            item.HCStatus === 4 && { backgroundColor: '#00b050', borderColor: '#28a745', borderWidth: 1.5 }, // green background
          ]}>
            <Text style={styles.boxHeader}>Checklist #{index + 1}</Text>

            <View style={styles.row1}>
              <Text style={styles.label}>Checklist Name</Text>
              <TextInput style={[styles.input1, { width: 280 }]} value={item.CheckListName} editable={false} />

              <Text style={styles.label}>Mould Name</Text>
              <TextInput style={styles.input1} value={item.MouldName} editable={false} />

              <Text style={styles.label}>HCFreqCount</Text>
              <TextInput style={[styles.input1, { width: 120 }]} value={item.HCFreqCount.toString()} editable={false} />

              <Text style={styles.label}>HCFreqDays</Text>
              <TextInput style={[styles.input1, { width: 120 }]} value={item.HCFreqDays.toString()} editable={false} />
            </View>

            <View style={styles.row2}>
              <Text style={styles.label}>HCWarningCount</Text>
              <TextInput style={[styles.input2, { width: 80 }]} value={item.HCWarningCount.toString()} editable={false} />

              <Text style={styles.label}>HCWarningDays</Text>
              <TextInput style={[styles.input2, { width: 80 }]} value={item.HCWarningDays.toString()} editable={false} />

              <Text style={styles.label}>Instance</Text>
              <TextInput style={[styles.input2, { width: 80 }]} value={item.Instance.toString()} editable={false} />

              <Text style={styles.label}>HCStatus</Text>
              <TextInput style={[styles.input2, { width: 150 }]} value={item.HCStatus.toString()} editable={false} />

              <TouchableOpacity style={styles.button}
              onPress={() => navigation.navigate('HCExecution', { checklistID: item.CheckListID })}
              >
                <Text style={styles.buttonText}>Execute</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
      </ScrollView>
      </View>
  );
};

export default HCMonitoring;