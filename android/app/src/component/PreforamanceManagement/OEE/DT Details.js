
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import Header from '../../Common/header/header';
import DTDetailsstyles from './DTDetailsStyle';
import { DataTable } from 'react-native-paper';
import { BASE_URL } from '../../Common/config/config';
const DTDetails = ({ route, navigation, username, setIsLoggedIn }) =>{
 const { lineName } = route.params || {};

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

       const fetchTableData = async () => {
         try {
           const response = await fetch(`${BASE_URL}/downtime/downtime/details/LineName?LineName=${encodeURIComponent(selectedLineName)}`);
           // const response = await fetch(`${BASE_URL}/downtime/downtime/details/LineName?LineName=${LineName}`);
           const json = await response.json();
           if (json.status === 200) {
             setTableData(json.data.map(item => ({
               id: item.DowntimeID,
               downtimeID: item.DowntimeID.toString(),
               prodDate: item.ProdDate?.split("T")[0] || '',
               prodShift: item.ProdShift,
               LossName: item.LossName,
               subLossName: item.SubLossName,
               downtimeStartTime: new Date(item.StartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
               downtimeEndTime: new Date(item.EndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
               reason: item.Reason || '',
               duration: item.SystemDownTime ? `${item.SystemDownTime} min` : "N/A"
             })));
           } else {
             setTableData([]);
           }
         } catch (error) {
           console.error("Error fetching table data:", error);
         }
       };

    return(
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
          <Text style={DTDetailsstyles.label}>Line Name</Text>
          <TextInput style={DTDetailsstyles.input} value={lineName} editable={false} />
     </View>
      </View>


          <View
          style={{
            backgroundColor: 'white',
            // borderRadius: 20,
            marginHorizontal: 20,
            width: '97.4%',
            marginTop: 10
          }}
        >
          <DataTable >
            <DataTable.Header>
              <DataTable.Title style={{ width: 120, justifyContent: 'center' }}>Downtime ID</DataTable.Title>
              <DataTable.Title style={{ width: 150, justifyContent: 'center' }}>Loss Name</DataTable.Title>
              <DataTable.Title style={{ width: 150, justifyContent: 'center' }}>Sub Loss Name</DataTable.Title>
              <DataTable.Title style={{ width: 100, justifyContent: 'center' }}>Shift</DataTable.Title>
              <DataTable.Title style={{ width: 130, justifyContent: 'center' }}>Start Time</DataTable.Title>
              <DataTable.Title style={{ width: 130, justifyContent: 'center' }}>End Time</DataTable.Title>
              <DataTable.Title style={{ width: 150, justifyContent: 'center' }}>Prod Date</DataTable.Title>
              <DataTable.Title style={{ width: 130, justifyContent: 'center' }}>Duration</DataTable.Title>
              <DataTable.Title style={{ width: 200, justifyContent: 'center' }}>Remark</DataTable.Title>
            </DataTable.Header>
          </DataTable>
        </View>

        <ScrollView
          nestedScrollEnabled={true}
          style={{ maxHeight: 400, marginBottom: 30 }}
        >
          <DataTable
            style={{
              backgroundColor: 'white',
              marginHorizontal: 20,

              width: '97.4%',
            }}
          >
            {tableData.length > 0 ? (
              tableData.map((row) => (
                <DataTable.Row key={row.id} onPress={() => handleRowPress(row)} >
                  <DataTable.Cell style={{ width: 120, justifyContent: 'center' }}>{row.downtimeID}</DataTable.Cell>
                  <DataTable.Cell style={{ width: 150, justifyContent: 'center' }}>{row.LossName}</DataTable.Cell>
                  <DataTable.Cell style={{ width: 150, justifyContent: 'center' }}>{row.subLossName}</DataTable.Cell>
                  <DataTable.Cell style={{ width: 100, justifyContent: 'center' }}>{row.prodShift}</DataTable.Cell>
                  <DataTable.Cell style={{ width: 130, justifyContent: 'center' }}>{row.downtimeStartTime}</DataTable.Cell>
                  <DataTable.Cell style={{ width: 130, justifyContent: 'center' }}>{row.downtimeEndTime}</DataTable.Cell>
                  <DataTable.Cell style={{ width: 150, justifyContent: 'center' }}>{row.prodDate}</DataTable.Cell>
                  <DataTable.Cell style={{ width: 130, justifyContent: 'center' }}>{row.duration}</DataTable.Cell>
                  <DataTable.Cell style={{ width: 200, justifyContent: 'center' }}>{row.reason}</DataTable.Cell>
                </DataTable.Row>
              ))
            ) : (
              <Text style={{ padding: 10 }}>No data available</Text>
            )}
          </DataTable>
          {/* </View>  */}
        </ScrollView>
   
      </ScrollView>
    );
}
export default DTDetails;