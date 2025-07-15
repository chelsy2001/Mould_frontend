import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import mainstyles from './mainStyle';
import Header from '../header/header';

const MainHome = ({ navigation, setIsLoggedIn, username,title }) => {
  return (
    <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Header username={username} setIsLoggedIn={setIsLoggedIn}  title = 'Home Screen'/>
        
        {/* <Text style={mainstyles.sectionTitle}>Welcome, {username} 👋</Text> */}

        <View style={mainstyles.container}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Performance')}
            style={mainstyles.cardButton}
            activeOpacity={0.85}
          >
            <Image source={require('../assets/per.jpg')} style={mainstyles.icon} />
            <Text style={mainstyles.cardText}>Performance Management</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Maintenance')}
            style={mainstyles.cardButton}
            activeOpacity={0.85}
          >
            <Image source={require('../assets/maint.jpg')} style={mainstyles.icon} />
            <Text style={mainstyles.cardText}>Mould Maintenance</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default MainHome;
