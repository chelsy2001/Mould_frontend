
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
import styles from './ReworkDetailsStyle';
import { DataTable } from 'react-native-paper';
import { BASE_URL } from '../../Common/config/config';

const ReworkDetails = ({route, navigation, username, setIsLoggedIn }) =>{
 const { lineName } = route.params || {};
 
 const [LineName, setLineName] = useState([]);
    const [tableData, setTableData] = useState([]);
  const [selectedLineName, setselectedLineName] = useState('');
   const [loading, setLoading] = useState(true);
 

 //----------fetch the lineid on the basis of lineName which is coming from previous screen
  useEffect(() => {
    if (lineName) {
      fetch(`${BASE_URL}/oee/getLineID/${lineName}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.LineID) {
            setLineID(data.LineID);
            fetchReworkData(data.LineID);
           
          }
        })
        .catch((err) => {
          console.error("Error fetching LineID:", err);
        });
    }
  }, [lineName]);

  const fetchReworkData = (id) => {
    fetch(`${BASE_URL}/rework/rework-genealogy/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTableData(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching table data:", err);
        setLoading(false);
      });
  };


  return(
          <ScrollView style={styles.container}>
          <Header 
        username={username}
        setIsLoggedIn={setIsLoggedIn}
        title="Rework Details Screen"
      //  title={lineName}
      //  title={role}
      />

      <View style={styles.Container1}>
        <View style={styles.row}>
          <Text style={styles.label}>Line Name</Text>
          <TextInput style={styles.input} value={lineName} editable={false} />
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
             <DataTable>
               <DataTable.Header>
                 <DataTable.Title style={{ width: 120, justifyContent: 'center' }}>
                   Line ID
                 </DataTable.Title>
                 <DataTable.Title style={{ width: 150, justifyContent: 'center' }}>
                   Line Name
                 </DataTable.Title>
                 <DataTable.Title style={{ width: 150, justifyContent: 'center' }}>
                   User
                 </DataTable.Title>
                 <DataTable.Title style={{ width: 100, justifyContent: 'center' }}>
                   ProdDate
                 </DataTable.Title>
                 <DataTable.Title style={{ width: 130, justifyContent: 'center' }}>
                   PrdoShift
                 </DataTable.Title>
                 <DataTable.Title style={{ width: 130, justifyContent: 'center' }}>
                   SKUName
                 </DataTable.Title>
                 <DataTable.Title style={{ width: 150, justifyContent: 'center' }}>
                   QTY
                 </DataTable.Title>
                 <DataTable.Title style={{ width: 130, justifyContent: 'center' }}>
                   Reason
                 </DataTable.Title>
                 <DataTable.Title style={{ width: 200, justifyContent: 'center' }}>
                   Remark
                 </DataTable.Title>
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
               {loading ? (
                 <Text style={{ padding: 10 }}>Loading...</Text>
               ) : tableData.length === 0 ? (
                 <Text style={{ padding: 10 }}>No data available</Text>
               ) : (
                 tableData.map((item, index) => (
                   <DataTable.Row key={index}>
                     <DataTable.Cell style={{ width: 120, justifyContent: 'center' }}>
                       {item.LineID}
                     </DataTable.Cell>
                     <DataTable.Cell style={{ width: 150, justifyContent: 'center' }}>
                       {item.LineName}
                     </DataTable.Cell>
                     <DataTable.Cell style={{ width: 150, justifyContent: 'center' }}>
                       {item.User}
                     </DataTable.Cell>
                     <DataTable.Cell style={{ width: 100, justifyContent: 'center' }}>
                       {item.ProdDate?.split('T')[0]}
                     </DataTable.Cell>
                     <DataTable.Cell style={{ width: 130, justifyContent: 'center' }}>
                       {item.ProdShift}
                     </DataTable.Cell>
                     <DataTable.Cell style={{ width: 130, justifyContent: 'center' }}>
                       {item.SKUName}
                     </DataTable.Cell>
                     <DataTable.Cell style={{ width: 150, justifyContent: 'center' }}>
                       {item.Qty}
                     </DataTable.Cell>
                     <DataTable.Cell style={{ width: 130, justifyContent: 'center' }}>
                       {item.Reason}
                     </DataTable.Cell>
                     <DataTable.Cell style={{ width: 200, justifyContent: 'center' }}>
                       {item.Remark}
                     </DataTable.Cell>
                   </DataTable.Row>
                 ))
               )}
             </DataTable>
           </ScrollView>
   
      </ScrollView>
    );
}
export default ReworkDetails;