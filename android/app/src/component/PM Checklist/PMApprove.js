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
import { BASE_URL } from '../../../config/config';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const PMApprove = ({ username, setIsLoggedIn }) => {
const [selectedAction, setSelectedAction] = useState('');

    return(
        <View style={styles.container}>
          <Header username={username} title="PM Approval Screen" />
          <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
  <Text style={[styles.label, { marginRight: 10 }]}>Action</Text>
  <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, flex: 1 ,backgroundColor:"white"}}>
    <Picker
      selectedValue={selectedAction}
      onValueChange={(itemValue) => setSelectedAction(itemValue)}
      mode="dropdown"
    >
      <Picker.Item label="Select Action" value="" />
      <Picker.Item label="Approve" value="approve" />
      <Picker.Item label="Reject" value="reject" />
    </Picker>
  </View>
</View>

        </View>
    );
};

export default PMApprove;