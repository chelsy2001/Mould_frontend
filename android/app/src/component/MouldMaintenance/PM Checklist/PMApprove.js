import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  Linking
} from 'react-native';
import Header from '../../Common/header/header';
import { useRoute, useNavigation } from '@react-navigation/native';
import styles from './PMApproveStyle';
import { BASE_URL, REPORT_URL } from '../../Common/config/config';

const PMApprove = ({ username }) => {
  const route = useRoute();
  const { checklistID } = route.params;
  const navigation = useNavigation();
  const [checkpoints, setCheckpoints] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/PMMouldApproval/GetCheckPoints/${checklistID}`)
      .then(res => res.json())
      .then(response => {
        if (response.status === 200) {
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

  const renderItem = ({ item, index }) => (
    <View
      style={[
        styles.Container1,
        item.OKNOK === 1
          ? { backgroundColor: '#00b050' } // Green for OK
          : item.OKNOK === 2
            ? { backgroundColor: 'red' } // Red for NOK
            : {}
      ]}
    >
      <View style={styles.row1}>
        <Text style={styles.label}>Checklist Name</Text>
        <TextInput
          style={[styles.input1, { width: 400 }]}
          multiline
          numberOfLines={4}
          value={item.CheckListName}
          editable={false}
        />

        <Text style={styles.label}>CheckPoint Name</Text>
        <TextInput
          style={[styles.input1, { width: 400 }]}
          multiline
          numberOfLines={4}
          value={item.CheckPointName}
          editable={false}
        />
      </View>

      <View style={styles.row2}>
        <Text style={styles.label}>Judgement Criteria</Text>
        <TextInput
          style={[styles.input2, { width: 400, marginStart: 1 }]}
          multiline
          numberOfLines={4}
          value={item.JudgementCriteria}
          editable={false}
        />

        <Text style={styles.label}>Observation</Text>
        <TextInput
          style={[styles.input2, { width: 400, marginEnd: -2 }]}
          multiline
          numberOfLines={4}
          value={item.ObservationInput}
          editable={!item.isDisabled}
          placeholder="Enter observation"
          onChangeText={text => {
            const updated = [...checkpoints];
            updated[index].ObservationInput = text;
            setCheckpoints(updated);
          }}
        />
      </View>

      <View style={styles.row4}>
        <Text style={styles.label}>CheckPointItems</Text>
        <TextInput
          style={[styles.input4, { width: 150 }]}
          multiline
          numberOfLines={4}
          value={item.CheckPointItems}
          editable={false}
        />

        <Text style={styles.label}>CheckPointArea</Text>
        <TextInput
          style={[styles.input4, { width: 150 }]}
          multiline
          numberOfLines={4}
          value={item.CheckPointArea}
          editable={false}
        />

        <Text style={styles.label}>CheckingMethod</Text>
        <TextInput
          style={[styles.input4, { width: 150 }]}
          multiline
          numberOfLines={4}
          value={item.CheckingMethod}
          editable={false}
        />

        <Text style={styles.label}>CheckArea</Text>
        <TextInput
          style={[styles.input4, { width: 150 }]}
          multiline
          numberOfLines={4}
          value={item.CheckArea}
          editable={false}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header username={username} title="Preventive Maintenance Executed Checklist" />

      <FlatList
        data={checkpoints}
        keyExtractor={(item) => item.UID.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30, marginTop: 20 }}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: -20, marginRight: 30 }}>
        <TouchableOpacity
          style={[styles.button, { marginRight: 10, width: '14%' }]}
          onPress={() => {
            Linking.openURL(REPORT_URL).catch(err => {
              console.error('Failed to open report:', err);
              Alert.alert('Error', 'Failed to open report in browser');
            });
          }}
        >
          <Text style={styles.buttonText}>View Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('MouldHome')}
        >
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PMApprove;
