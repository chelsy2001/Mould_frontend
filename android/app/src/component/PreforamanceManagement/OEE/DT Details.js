
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { scale, verticalScale, moderateScale } from '../../Common/utils/scale'; // Adjust path as needed
import { SelectList } from 'react-native-dropdown-select-list';
import Header from '../../Common/header/header';
import DTDetailsstyles from './DTDetailsStyle';
import { DataTable } from 'react-native-paper';
import { BASE_URL } from '../../Common/config/config';
const DTDetails = ({ route, navigation, username, setIsLoggedIn }) => {
  const { lineName } = route.params || {};
const { equipmentName } = route.params;

  const [LineName, setLineName] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedLineName, setselectedLineName] = useState('');


  useEffect(() => {
    if (lineName) {
      setselectedLineName(lineName);
      console.log('Line Name:', LineName);
    }
  }, [lineName]);

  useEffect(() => {
    if (!selectedLineName) return;
    fetchTableData();
  }, [selectedLineName]);

const fetchEquipmentIdAndDT = async () => {
  try {
    if (!equipmentName) return;

    const equipmentRes = await fetch(`${BASE_URL}/oee/getEquipmentID/${encodeURIComponent(equipmentName)}`);
    const equipmentData = await equipmentRes.json();

    const EquipmentID = equipmentData?.EquipmentID;
    if (!EquipmentID) {
      console.warn("EquipmentID not found");
      return;
    }

    console.log("Fetched EquipmentID:", EquipmentID);

    const dtRes = await fetch(`${BASE_URL}/downtime/Getdowntime/details/${EquipmentID}`);
    const dtData = await dtRes.json();

    console.log("Downtime API Response:", dtData);

    if (dtData.status === 200 && Array.isArray(dtData.data)) {
      setTableData(
        dtData.data.map(item => ({
          id: item.DowntimeID,
          downtimeID: item.DowntimeID ? item.DowntimeID.toString() : '',
          prodDate: item.ProdDate?.split("T")[0] || '',
          prodShift: item.ProdShift,
          LossName: item.LossName,
          subLossName: item.SubLossName,
          downtimeStartTime: item.StartTime ? new Date(item.StartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          downtimeEndTime: item.EndTime ? new Date(item.EndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          reason: item.Reason || '',
          duration: item.SystemDownTime ? `${item.SystemDownTime} min` : "N/A"
        }))
      );
    } else {
      setTableData([]);
    }
  } catch (error) {
    console.error("Error fetching downtime data:", error);
  }
};
useEffect(() => {
  fetchEquipmentIdAndDT();
}, [equipmentName]);

  return (
    <ScrollView style={DTDetailsstyles.container}>
      <Header
        username={username}
        setIsLoggedIn={setIsLoggedIn}
        title="Downtime Details Screen"
      //  title={lineName}
      //  title={role}
      />

      <View style={DTDetailsstyles.Container1}>
        <View style={DTDetailsstyles.row}>
          <Text style={DTDetailsstyles.label}>Machine Name</Text>
          <TextInput style={DTDetailsstyles.input} value={equipmentName} editable={false} />
        </View>
      </View>
  
<View style={{ flex: 1, marginTop: verticalScale(10) }}>
  {/* Outer Horizontal ScrollView to enable horizontal scroll for both header + rows */}
  <ScrollView horizontal showsHorizontalScrollIndicator={true}>
    <View>
      {/* Sticky Header (rendered outside vertical scroll) */}
      <DataTable style={{ backgroundColor: '#dcdcdc', minWidth: scale(1200) }}>
        <DataTable.Header>
          <DataTable.Title style={{ width: scale(60), justifyContent: 'center',borderRightWidth: 1,borderColor: '#aa9c9cff' }}>Downtime ID</DataTable.Title>
          <DataTable.Title style={{ width: scale(100), justifyContent: 'center',borderRightWidth: 1,borderColor: '#aa9c9cff'  }}>Loss Name</DataTable.Title>
          <DataTable.Title style={{ width: scale(100), justifyContent: 'center',borderRightWidth: 1,borderColor: '#aa9c9cff'  }}>Sub Loss Name</DataTable.Title>
          <DataTable.Title style={{ width: scale(50), justifyContent: 'center' ,borderRightWidth: 1,borderColor: '#aa9c9cff' }}>Shift</DataTable.Title>
          <DataTable.Title style={{ width: scale(80), justifyContent: 'center',borderRightWidth: 1,borderColor: '#aa9c9cff'  }}>Start Time</DataTable.Title>
          <DataTable.Title style={{ width: scale(80), justifyContent: 'center',borderRightWidth: 1,borderColor: '#aa9c9cff'  }}>End Time</DataTable.Title>
          <DataTable.Title style={{ width: scale(80), justifyContent: 'center',borderRightWidth: 1,borderColor: '#aa9c9cff'  }}>Prod Date</DataTable.Title>
          <DataTable.Title style={{ width: scale(80), justifyContent: 'center',borderRightWidth: 1,borderColor: '#aa9c9cff'  }}>Duration</DataTable.Title>
          <DataTable.Title style={{ width: scale(200), justifyContent: 'center' }}>Remark</DataTable.Title>
        </DataTable.Header>
      </DataTable>

      {/* Vertically scrollable body */}
      <ScrollView
        style={{
          maxHeight: verticalScale(400),
          backgroundColor: 'white',
        }}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled
      >
        <DataTable style={{ minWidth: scale(1200) }}>
          {tableData.length > 0 ? (
            tableData.map((row) => (
              <DataTable.Row key={row.id}  onPress={() => handleRowPress(row)}>
                <DataTable.Cell style={{ width: scale(60), justifyContent: 'center' ,borderRightWidth: 1,borderColor: '#E0E0E0' }}>{row.downtimeID}</DataTable.Cell>
                <DataTable.Cell style={{ width: scale(100), justifyContent: 'center' ,borderRightWidth: 1,borderColor: '#E0E0E0' }}>{row.LossName}</DataTable.Cell>
                <DataTable.Cell style={{ width: scale(100), justifyContent: 'center' ,borderRightWidth: 1,borderColor: '#E0E0E0' }}>{row.subLossName}</DataTable.Cell>
                <DataTable.Cell style={{ width: scale(50), justifyContent: 'center',borderRightWidth: 1,borderColor: '#E0E0E0'  }}>{row.prodShift}</DataTable.Cell>
                <DataTable.Cell style={{ width: scale(80), justifyContent: 'center',borderRightWidth: 1,borderColor: '#E0E0E0'  }}>{row.downtimeStartTime}</DataTable.Cell>
                <DataTable.Cell style={{ width: scale(80), justifyContent: 'center',borderRightWidth: 1,borderColor: '#E0E0E0'  }}>{row.downtimeEndTime}</DataTable.Cell>
                <DataTable.Cell style={{ width: scale(80), justifyContent: 'center',borderRightWidth: 1,borderColor: '#E0E0E0'  }}>{row.prodDate}</DataTable.Cell>
                <DataTable.Cell style={{ width: scale(80), justifyContent: 'center',borderRightWidth: 1,borderColor: '#E0E0E0'  }}>{row.duration}</DataTable.Cell>
                <DataTable.Cell style={{ width: scale(200), justifyContent: 'center' }}>{row.reason}</DataTable.Cell>
              </DataTable.Row>
            ))
          ) : (
            <Text
              style={{
                padding: verticalScale(10),
                textAlign: 'center',
                fontSize: moderateScale(14),
              }}
            >
              No data available
            </Text>
          )}
        </DataTable>
      </ScrollView>
    </View>
  </ScrollView>
</View>



    </ScrollView>
  );
}
export default DTDetails;