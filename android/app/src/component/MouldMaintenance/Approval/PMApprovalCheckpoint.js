import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import Header from '../../Common/header/header';
import { useRoute, useNavigation } from '@react-navigation/native';
import styles from './PMApprovalCheckpointStyle';
import { BASE_URL } from '../../Common/config/config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale } from '../../Common/utils/scale';

const PMApprovalCheckpoint = ({ username }) => {
  const route = useRoute();
  const navigation = useNavigation();
  const { checklist } = route.params || {};
  const checklistID = checklist?.CheckListID || route.params?.checklistID;
  const MouldId = checklist?.MouldID || route.params?.MouldID || route.params?.mouldID;

  const [checkpoints, setCheckpoints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!checklistID || !MouldId) {
      setIsLoading(false);
      setErrorMessage('Missing checklist or mould ID. Cannot load checkpoints.');
      return;
    }

    fetch(`${BASE_URL}/SeperatePMApproval/GetCheckPoints/${checklistID}/${MouldId}`)
      .then(res => res.json())
      .then(response => {
        if (response.status === 200 && Array.isArray(response.data)) {
          const updatedData = response.data.map(item => ({
            ...item,
            MouldID: item.MouldID || MouldId,
            ObservationInput: item.Observation ?? '',
            OKNOKInput: item.OKNOK ?? null,
            isDisabled: item.Observation !== null && item.Observation !== '' && item.OKNOK !== null,
          }));
          setCheckpoints(updatedData);
        } else {
          console.warn('API error or empty data:', response);
          setErrorMessage('No checkpoint data returned from API.');
        }
      })
      .catch(err => {
        console.error('API fetch error:', err);
        setErrorMessage('Failed to load checkpoints.');
      })
      .finally(() => setIsLoading(false));
  }, [checklistID, MouldId]);

  const handleUpdate = async index => {
    const item = checkpoints[index];
    if (!item.OKNOKInput || item.ObservationInput.trim() === '') {
      Alert.alert('Validation', 'Please select OK/NOK and provide Observation before updating.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/SeperatePMApproval/UpdateCheckPoint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          CheckPointID: item.CheckPointID,
          Observation: item.ObservationInput,
          OKNOK: item.OKNOKInput,
        }),
      });

      const result = await response.json();

      if (response.status === 200) {
        Alert.alert('Success', 'CheckPoint updated successfully.');
        const updated = [...checkpoints];
        updated[index].isDisabled = true;
        updated[index].OKNOK = updated[index].OKNOKInput;
        setCheckpoints(updated);
      } else {
        Alert.alert('Error', result.message || 'Failed to update checkpoint.');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error: ' + err.message);
    }
  };

  const handleOKNOK = (index, value) => {
    const updated = [...checkpoints];
    updated[index].OKNOKInput = value;
    setCheckpoints(updated);
  };

  const renderCheckpoint = ({ item, index }) => (
    <View
      style={[
        styles.Container1,
        item.OKNOK === 1
          ? { backgroundColor: '#00b050' }
          : item.OKNOK === 2
            ? { backgroundColor: 'red' }
            : {},
      ]}
    >
      {/* Row 1 */}
      <View style={styles.row1}>
        <Text style={styles.label}>Checklist Name</Text>
        <TextInput
          style={[styles.input1, { width: 200 }]}
          multiline
          numberOfLines={4}
          value={item.CheckListName}
          editable={false}
        />

        <Text style={styles.label}>CheckPoint Name</Text>
        <TextInput
          style={[styles.input1, { width: 200 }]}
          multiline
          numberOfLines={4}
          value={item.CheckPointName}
          editable={false}
        />

        <Text style={styles.label}>Mould ID</Text>
        <TextInput
          style={[styles.input1, { width: 200 }]}
          multiline
          numberOfLines={4}
          value={item.MouldID}
          editable={false}
        />
      </View>

      {/* Row 2 */}
      <View style={styles.row2}>
        <Text style={styles.label}>Judgement Criteria</Text>
        <TextInput
          style={[styles.input2, { width: 400 }]}
          multiline
          numberOfLines={4}
          value={item.JudgementCriteria}
          editable={false}
        />

        <Text style={styles.label}>Observation</Text>
        <TextInput
          style={[
            styles.input2,
            { width: 250, opacity: item.isDisabled ? 0.5 : 1 },
          ]}
          multiline
          numberOfLines={4}
          value={item.ObservationInput}
          editable={!item.isDisabled}
          onChangeText={text => {
            const updated = [...checkpoints];
            updated[index].ObservationInput = text;
            setCheckpoints(updated);
          }}
          placeholder="Enter observation"
          placeholderTextColor="#A9A9A9"
        />

        <TouchableOpacity
          style={{
            width: '6%',
            backgroundColor: '#0059b3',
            alignItems: 'center',
            marginRight: 5,
            opacity: item.isDisabled ? 0.5 : 1,
          }}
          onPress={() => handleOKNOK(index, 1)}
          disabled={item.isDisabled}
        >
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: '6%',
            backgroundColor: '#0059b3',
            alignItems: 'center',
            opacity: item.isDisabled ? 0.5 : 1,
          }}
          onPress={() => handleOKNOK(index, 2)}
          disabled={item.isDisabled}
        >
          <Text style={styles.buttonText}>NOK</Text>
        </TouchableOpacity>
      </View>

      {/* Row 4 */}
      <View style={styles.row4}>
        <Text style={styles.label}>CheckPointItems</Text>
        <TextInput style={[styles.input4, { width: 150 }]} value={item.CheckPointItems} editable={false} />

        <Text style={styles.label}>CheckPointArea</Text>
        <TextInput style={[styles.input4, { width: 150 }]} value={item.CheckPointArea} editable={false} />

        <Text style={styles.label}>CheckingMethod</Text>
        <TextInput style={[styles.input4, { width: 150 }]} value={item.CheckingMethod} editable={false} />

        <Text style={styles.label}>CheckArea</Text>
        <TextInput style={[styles.input4, { width: 150 }]} value={item.CheckArea} editable={false} />
      </View>

      {/* Row 5 */}
      <View style={styles.row5}>
        <TouchableOpacity
          style={[styles.button, { marginRight: 10, opacity: item.isDisabled ? 0.5 : 1 }]}
          onPress={() => handleUpdate(index)}
          disabled={item.isDisabled}
        >
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            const updated = [...checkpoints];
            updated[index].isDisabled = false;
            setCheckpoints(updated);
          }}
        >
          <Icon name="square-edit-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header username={username} title="PM Preparation" />

      {/* <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Mould ID:</Text>
        <Text>{MouldId || 'Unknown'}</Text>
      </View> */}

      {isLoading ? (
        <View style={{ padding: 20 }}>
          <Text>Loading checkpoints...</Text>
        </View>
      ) : errorMessage ? (
        <View style={{ padding: 20 }}>
          <Text style={{ color: 'red' }}>{errorMessage}</Text>
        </View>
      ) : (
        <FlatList
          data={checkpoints}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderCheckpoint}
          contentContainerStyle={{ paddingBottom: 100, marginTop: scale(10) }}
          ListEmptyComponent={() => (
            <View style={{ padding: 20 }}>
              <Text>No checkpoints available.</Text>
            </View>
          )}
        />
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, marginRight: 30 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SeperatePMApproval', { checklistID })}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PMApprovalCheckpoint;
