
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList
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
  const [loading, setLoading] = useState(true);
  const [prodDate, setProdDate] = useState('');
  const [shiftName, setShiftName] = useState('');
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [equipmentID, setEquipmentID] = useState(null);


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

  // Fetch current prodDate and shiftName
  useEffect(() => {
    const fetchShiftInfo = async () => {
      try {
        const response = await fetch(`${BASE_URL}/oee/ProdDate/Shift`);
        const data = await response.json();
        if (data?.status === 200 && data.data?.length > 0) {
          setProdDate(data.data[0].ProdDate);
          setShiftName(data.data[0].ShiftName);
        }
      } catch (error) {
        console.error('Error fetching shift info:', error);
      }
    };
    fetchShiftInfo();
  }, []);

const fetchEquipmentIdAndDT = async () => {
  try {
    if (!equipmentName) return;

    setLoading(true);

    const equipmentRes = await fetch(`${BASE_URL}/oee/getEquipmentID/${encodeURIComponent(equipmentName)}`);
    const equipmentData = await equipmentRes.json();

    const EquipmentID = equipmentData?.EquipmentID;
    if (!EquipmentID) {
      console.warn("EquipmentID not found");
      setLoading(false);
      return;
    }

    console.log("Fetched EquipmentID for DT:", EquipmentID);

    // Build URL with optional query params for filtering
    let url = `${BASE_URL}/downtime/Getdowntime/details/${encodeURIComponent(EquipmentID)}`;
    const params = [];
    if (prodDate) params.push(`ProdDate=${encodeURIComponent(prodDate)}`);
    if (shiftName) params.push(`ShiftName=${encodeURIComponent(shiftName)}`);
    if (params.length > 0) url += '?' + params.join('&');

    const dtRes = await fetch(url);
    const dtData = await dtRes.json();

    console.log("Downtime API Response:", dtData);

    if (dtData.status === 200 && Array.isArray(dtData.data)) {
      // Limit data to prevent performance issues - show max 1000 records
      const limitedData = dtData.data.slice(0, 1000);
      setTableData(
        limitedData.map(item => ({
          id: item.DowntimeID,
          downtimeID: item.DowntimeID ? item.DowntimeID.toString() : '',
          prodDate: item.ProdDate?.split("T")[0] || '',
          prodShift: item.ProdShift,
          LossName: item.LossName,
          subLossName: item.SubLossName,
            loss4MName: item["4MLossName"] || '',
          downtimeStartTime: item.StartTime ? new Date(item.StartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          downtimeEndTime: item.EndTime ? new Date(item.EndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          reason: item.Reason || '',
          duration: item.Duration  || "0",
        }))
      );
    } else {
      setTableData([]);
    }
  } catch (error) {
    console.error("Error fetching downtime data:", error);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  fetchEquipmentIdAndDT();
}, [equipmentName, prodDate, shiftName]);

useEffect(() => {
  const getEquipmentID = async () => {
    try {
      const res = await fetch(`${BASE_URL}/oee/getEquipmentID/${encodeURIComponent(equipmentName)}`);
      const json = await res.json();
      setEquipmentID(json?.EquipmentID);
    } catch (err) {
      console.error(err);
    }
  };

  getEquipmentID();
}, []);

const fetchData = async (pageNumber = 1) => {
  if (loading || !hasMore || !equipmentID) return;

  setLoading(true);

  try {
    const res = await fetch(
      `${BASE_URL}/downtime/Getdowntime/unassigned/${equipmentID}?page=${pageNumber}`
    );

    const json = await res.json();

    console.log("Page:", pageNumber, "Records:", json?.data?.length);

    if (json.status === 200) {
      const newData = json.data.map(item => ({
        id: item.DowntimeID,
        downtimeID: item.DowntimeID?.toString(),
        prodDate: item.ProdDate?.split("T")[0] || '',
        prodShift: item.ProdShift,
        LossName: item.LossName,
        subLossName: item.SubLossName,
        loss4MName: item["4MLossName"] || '',
        downtimeStartTime: item.StartTime
          ? new Date(item.StartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '',
        downtimeEndTime: item.EndTime
          ? new Date(item.EndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '',
        reason: item.Reason || '',
        duration: item.Duration  || "0",
      }));

      if (newData.length < 100) {
        setHasMore(false);
      }

      setTableData(prev => [...prev, ...newData]);
    }
  } catch (err) {
    console.error(err);
  }

  setLoading(false);
};

useEffect(() => {
  if (equipmentID) {
    fetchData(1);
  }
}, [equipmentID]);

const loadMore = () => {
  if (!loading && hasMore) {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage);
  }
};

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
        {/* <View style={DTDetailsstyles.row}>
          <Text style={DTDetailsstyles.label}>Records</Text>
          <TextInput style={DTDetailsstyles.input} value={`${tableData.length} shown`} editable={false} />
        </View> */}
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
          {/* <DataTable.Title style={{ width: scale(100), justifyContent: 'center',borderRightWidth: 1,borderColor: '#aa9c9cff'  }}>4M Loss Name</DataTable.Title> */}
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
          {loading ? (
            <Text style={{ padding: verticalScale(20), textAlign: 'center' }}>Loading...</Text>
          ) : tableData.length > 0 ? (
           <FlatList
  data={tableData}
  keyExtractor={(item) => item.id.toString()}
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}
  nestedScrollEnabled

  ListFooterComponent={
    loading ? <Text style={{ textAlign: 'center', padding: 10 }}>Loading...</Text> : null
  }

  renderItem={({ item: row }) => (
    <DataTable.Row>
      <DataTable.Cell style={{ width: scale(60), justifyContent: 'center', borderRightWidth: 1 }}>
        {row.downtimeID}
      </DataTable.Cell>
      <DataTable.Cell style={{ width: scale(100), justifyContent: 'center', borderRightWidth: 1 }}>
        {row.LossName}
      </DataTable.Cell>
      <DataTable.Cell style={{ width: scale(100), justifyContent: 'center', borderRightWidth: 1 , flexWrap: 'wrap'}}>
        {row.subLossName}
      </DataTable.Cell>
      {/* <DataTable.Cell style={{ width: scale(100), justifyContent: 'center', borderRightWidth: 1 }}>
        {row.loss4MName}
      </DataTable.Cell> */}
      <DataTable.Cell style={{ width: scale(50), justifyContent: 'center', borderRightWidth: 1 }}>
        {row.prodShift}
      </DataTable.Cell>
      <DataTable.Cell style={{ width: scale(80), justifyContent: 'center', borderRightWidth: 1 }}>
        {row.downtimeStartTime}
      </DataTable.Cell>
      <DataTable.Cell style={{ width: scale(80), justifyContent: 'center', borderRightWidth: 1 }}>
        {row.downtimeEndTime}
      </DataTable.Cell>
      <DataTable.Cell style={{ width: scale(80), justifyContent: 'center', borderRightWidth: 1 }}>
        {row.prodDate}
      </DataTable.Cell>
      <DataTable.Cell style={{ width: scale(80), justifyContent: 'center', borderRightWidth: 1 }}>
        {row.duration} 
      </DataTable.Cell>
      <DataTable.Cell style={{ width: scale(200), justifyContent: 'center' }}>
        {row.reason}
      </DataTable.Cell>
    </DataTable.Row>
  )}
/>
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