import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../Common/header/header';
import { Dimensions } from 'react-native';
import styles from './style';

const HomePage = ({ setIsLoggedIn, username }) => {
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');
  const isLargeScreen = width >= 768; // typical for tablets (10", 11", 12")
  const isSmallScreen = width < 720; // typical for tablets (10", 11", 12")


  return (
    <View style={styles.container}>
      {/* Header Section */}
      <Header username={username} setIsLoggedIn={setIsLoggedIn} title='Mould Home Screen' />

      {/* Scrollable Menu Section */}
      <ScrollView contentContainerStyle={styles.menuContainer}>
{        isSmallScreen && (
  <>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('MouldLoadingScreen')}>
          <Image style={styles.icon} source={require('../../Common/assets/mouldloading.jpg')} />
          <View style={styles.labelWrapper}>
            <Text style={styles.menuText}>Mould Loading</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('MouldUnloadingScreen')}>
          <Image style={styles.icon} source={require('../../Common/assets/manual-loading.jpg')} />
          <View style={styles.labelWrapper}>
            <Text style={styles.menuText}>Mould Unloading</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Pmconfg')}>
          <Image style={styles.icon} source={require('../../Common/assets/pm.jpg')} />
          <View style={styles.labelWrapper}>
            <Text style={styles.menuText}>Preventive </Text>
            <Text style={{ fontSize: 14, color: 'white', fontWeight: '500', textAlign: 'center', marginTop: -30 }}>
              Maintenance
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('SparePartScreen')}>
          <Image style={styles.icon} source={require('../../Common/assets/spare.jpg')} />
          <View style={styles.labelWrapper}>
            <Text style={styles.menuText}>Mould Spare Part</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('MouldStatus')}>
          <Image style={styles.icon} source={require('../../Common/assets/mouldmon.jpg')} />
          <View style={styles.labelWrapper}>
            <Text style={styles.menuText}>Mould Monitoring</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('HealthCheck')}>
          <Image style={styles.icon} source={require('../../Common/assets/healthcheck.jpg')} />
          <View style={styles.labelWrapper}>
            <Text style={styles.menuText}>Health Check</Text>
          </View>
        </TouchableOpacity>

         <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('BreakDown')}>
          <Image style={styles.icon} source={require('../../Common/assets/BD.jpeg')} />
          <View style={styles.labelWrapper}>
            <Text style={styles.menuText}>BreakDown</Text>
          </View>
        </TouchableOpacity>
        </>
        )}

        { isLargeScreen && (
          <>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PMMouldMonitoring')}>
          <Image style={styles.icon} source={require('../../Common/assets/checklist.jpg')} />
          <View style={styles.labelWrapper}>
            <Text style={styles.menuText}>Preventive Maintenance Execution</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('HCMonitoring')}>
          <Image style={styles.icon} source={require('../../Common/assets/checklist.jpg')} />
          <View style={styles.labelWrapper}>
            <Text style={styles.menuText}>Health Check Execution</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('SeperatePMApproval')}>
          <Image style={styles.icon} source={require('../../Common/assets/app.jpg')} />
          <View style={styles.labelWrapper}>
            <Text style={styles.menuText}>Preventive Maintenance Approval</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('SeperateHCApproval')}>
          <Image style={styles.icon} source={require('../../Common/assets/app.jpg')} />
          <View style={styles.labelWrapper}>
            <Text style={styles.menuText}>Health CheckApproval</Text>
          </View>
        </TouchableOpacity>
</>
        )}
      </ScrollView>
    </View>
  );
};

export default HomePage;
