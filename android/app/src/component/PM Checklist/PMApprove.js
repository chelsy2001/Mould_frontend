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
import { useRoute } from '@react-navigation/native';
import styles from './PMApproveStyle';
import { BASE_URL } from '../config/config';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PMApprove = ({ username, setIsLoggedIn }) => {
  const route = useRoute();
  const { checklistID } = route.params;
  const navigation = useNavigation();
  const [checkpoints, setCheckpoints] = useState([]);

  useEffect(() => {
    console.log('Received checklistID:', checklistID);
    // You can now fetch or use checklistID as needed
  }, [checklistID]);

  //Fetch the PM Perartion data
  useEffect(() => {
    fetch(`${BASE_URL}/PMApproval/GetCheckPoints/${checklistID}`)
      .then(res => res.json())
      .then(response => {
        if (response.status === 200) {
          // setCheckpoints(response.data);
          const updatedData = response.data.map(item => ({
            ...item,
            ObservationInput: item.Observation ?? '',
            isDisabled: item.Observation !== null && item.Observation !== '' && item.OKNOK !== null
          }));
          setCheckpoints(updatedData);
        } else {
          console.warn('API error:', response.message);
        }
      })
      .catch(err => console.error('API fetch error:', err));
  }, [checklistID]);

  return (
    <View style={styles.container}>
      <Header username={username} title="PM Approval" />
      <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 630, marginBottom: 30 }}>
        <View>
          {checkpoints.map((item, index) => (
            <View key={index} style={[
              styles.Container1,
              item.OKNOK === 1
                ? { backgroundColor: '#00b050' } // Green background for OK
                : item.OKNOK === 2
                  ? { backgroundColor: 'red' } // Red background for NOK
                  : {}
            ]}>
              <View style={styles.row1}>
                <Text style={styles.label}>Checklist Name</Text>
                <TextInput style={[styles.input1, { width: 400 }]} multiline={true}
                  numberOfLines={4} value={item.CheckListName} editable={false} />

                <Text style={styles.label}>CheckPoint Name</Text>
                <TextInput style={[styles.input1, { width: 400 },]} multiline={true}
                  numberOfLines={4} value={item.CheckPointName} editable={false} />
              </View>

              <View style={styles.row2}>
                <Text style={styles.label}>Judgement Criteria</Text>
                <TextInput style={[styles.input2, { width: 400, marginStart: '1' }]} multiline={true}
                  numberOfLines={4} value={item.JudgementCriteria} editable={false} />

                <Text style={styles.label}>Observation</Text>

                <TextInput
                  style={[styles.input2, { width: 400, marginEnd: '-2' }]}
                  multiline={true}
                  numberOfLines={4}
                  value={item.ObservationInput}
                  editable={!item.isDisabled}
                  onChangeText={text => {
                    const updated = [...checkpoints];
                    updated[index].ObservationInput = text;
                    setCheckpoints(updated);
                  }}
                  placeholder="Enter observation"
                />
              </View>

              <View style={styles.row4}>
                <Text style={styles.label}>CheckPointItems</Text>
                <TextInput style={[styles.input4, { width: 150 }]} multiline={true}
                  numberOfLines={4} value={item.CheckPointItems} editable={false} />

                <Text style={styles.label}>CheckPointArea</Text>
                <TextInput style={[styles.input4, { width: 150 }]} multiline={true}
                  numberOfLines={4} value={item.CheckPointArea} editable={false} />

                <Text style={styles.label}>CheckingMethod</Text>
                <TextInput style={[styles.input4, { width: 150 }]} multiline={true}
                  numberOfLines={4} value={item.CheckingMethod} editable={false} />

                <Text style={styles.label}>CheckArea</Text>
                <TextInput style={[styles.input4, { width: 150 }]} multiline={true}
                  numberOfLines={4} value={item.CheckArea} editable={false} />
              </View>
              <View style={styles.row5}>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: -20, marginRight: 30 }}>
        <TouchableOpacity style={[styles.button, { marginRight: 10 }]}
        >
          <Text style={styles.buttonText}>View Report</Text>
        </TouchableOpacity> 

        <TouchableOpacity style={styles.button}
          onPress={() => navigation.goBack()}

        >
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PMApprove;