import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import Header from '../header/header';
import styles from './style';

const HomePage = ({ setIsLoggedIn, username }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <Header username={username} operatorID="I20" setIsLoggedIn={setIsLoggedIn} />

      {/* Scrollable Menu Section */}
      <ScrollView contentContainerStyle={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('MouldLoadingScreen')}>
          <Image style={styles.icon} source={require('..//assets/mouldloading.jpg')} />
          <Text style={styles.menuText}>Mould Loading</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('MouldUnloadingScreen')}>
          <Image style={styles.icon} source={require('..//assets/manual-loading.jpg')} />
          <Text style={styles.menuText}>Mould Unloading</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Pmconfg')}>
          <Image style={styles.icon} source={require('..//assets/pm.jpg')} />
          <Text style={styles.menuText}>PreventiveMainten</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('SparePartScreen')}>
          <Image style={styles.icon} source={require('..//assets/spare.jpg')} />
          <Text style={styles.menuText}>Mould Spare Part </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('MouldStatus')}>
          <Image style={styles.icon} source={require('..//assets/mouldmon.jpg')} />
          <Text style={styles.menuText}>Mould Monitoring</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('HealthCheck')}>
          <Image style={styles.icon} source={require('..//assets/healthcheck.jpg')} />
          <Text style={styles.menuText}>Health Check</Text>
        </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PMMouldMonitoring')}>
          <Image style={styles.icon} source={require('../assets/checklist.jpg')} />
          <Text style={styles.menuText}>PM Checklist</Text>
        </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('HCMonitoring')}>
          <Image style={styles.icon} source={require('..//assets/checklist.jpg')} />
          <Text style={styles.menuText}>HC Checklist</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('BreakDown')}>
          <Image style={styles.icon} source={require('..//assets/BD.jpeg')} />
          <Text style={styles.menuText}>BreakDown</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('SeperatePMApproval')}>
          <Image style={styles.icon} source={require('..//assets/Aprroval.jpeg')} />
          <Text style={styles.menuText}>Aprroval PM</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('SeperateHCApproval')}>
          <Image style={styles.icon} source={require('..//assets/Aprroval.jpeg')} />
          <Text style={styles.menuText}>Approval HC</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default HomePage;
