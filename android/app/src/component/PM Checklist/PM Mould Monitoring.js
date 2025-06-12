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
import Header from '../header/header';
import styles from './MouldMonitoringStyle';
import { BASE_URL } from '../config/config';
import { useNavigation } from '@react-navigation/native';

const PMMouldMonitoring = ({ username, setIsLoggedIn }) => {

  const [checklistData, setChecklistData] = useState([]);
const navigation = useNavigation();

  //integrate the checklist api
  useEffect(() => {
    fetch(`${BASE_URL}/PMMouldMonitoring/PMChecklist`)
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
    //<ScrollView style={styles.container}>
      <View style={styles.container}>
      <Header username={username} title="PM Mould Monitoring" />
  <ScrollView
        nestedScrollEnabled={true}
        style={{ maxHeight: 700, marginBottom: 30 }}
      >
      {checklistData.map((item, index) => (
        <View>
          <View key={item.UID} style={[
            styles.Container1,
            item.PMStatus === 4 && { backgroundColor: '#00b050', borderColor: '#28a745', borderWidth: 1.5 }, // green background
          ]}>
            <Text style={styles.boxHeader}>Checklist #{index + 1}</Text>

            <View style={styles.row1}>
              <Text style={styles.label}>Checklist Name</Text>
              <TextInput style={[styles.input1, { width: 280 }]} value={item.CheckListName} editable={false} />

              <Text style={styles.label}>Mould Name</Text>
              <TextInput style={styles.input1} value={item.MouldName} editable={false} />

              <Text style={styles.label}>PMFreqCount</Text>
              <TextInput style={[styles.input1, { width: 120 }]} value={item.PMFreqCount.toString()} editable={false} />

              <Text style={styles.label}>PMFreqDays</Text>
              <TextInput style={[styles.input1, { width: 120 }]} value={item.PMFreqDays.toString()} editable={false} />
            </View>

            <View style={styles.row2}>
              <Text style={styles.label}>PMWarningCount</Text>
              <TextInput style={[styles.input2, { width: 80 }]} value={item.PMWarningCount.toString()} editable={false} />

              <Text style={styles.label}>PMWarningDays</Text>
              <TextInput style={[styles.input2, { width: 80 }]} value={item.PMWarningDays.toString()} editable={false} />

              <Text style={styles.label}>Instance</Text>
              <TextInput style={[styles.input2, { width: 80 }]} value={item.Instance.toString()} editable={false} />

              <Text style={styles.label}>PMStatus</Text>
              <TextInput style={[styles.input2, { width: 150 }]} value={item.PMStatus.toString()} editable={false} />

              <TouchableOpacity style={styles.button} 
               onPress={() => navigation.navigate('PMPreparation', { checklistID: item.CheckListID })}
              >
                <Text style={styles.buttonText}>Execute</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
      </ScrollView>
      </View>
    //</ScrollView>
  );
};

export default PMMouldMonitoring;