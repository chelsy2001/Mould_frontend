import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PerformanceScreen from '../performacehome/perhome';
import Assembly from '../Assembly/assembly';
import OEE from '../OEE/oee';
import Downtime from '../downTime/downTime';
import Quality from '../quality/quality';
import DTDetails from '../OEE/DT Details';

import ZoneScreen from '../zone/zone';
import StationScreen from '../station/station';

const Stack = createNativeStackNavigator();

const PerformanceStack = ({ setIsLoggedIn, username }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="PerformanceHome" 
        children={(props) => <PerformanceScreen {...props} setIsLoggedIn={setIsLoggedIn} username={username} />} 
      />
      <Stack.Screen 
        name="Zone" 
        children={(props) => <ZoneScreen {...props} setIsLoggedIn={setIsLoggedIn} username={username} />} 
      />
      <Stack.Screen 
        name="Station" 
        children={(props) => <StationScreen {...props} setIsLoggedIn={setIsLoggedIn} username={username} />} 
      />
      <Stack.Screen 
        name="Assembly" 
        children={(props) => <Assembly {...props} setIsLoggedIn={setIsLoggedIn} username={username} />} 
      />
      <Stack.Screen 
        name="OEE" 
        children={(props) => <OEE {...props} setIsLoggedIn={setIsLoggedIn} username={username} />} 
      />
      <Stack.Screen 
        name="Downtime" 
        children={(props) => <Downtime {...props} setIsLoggedIn={setIsLoggedIn} username={username} />} 
      />
      <Stack.Screen 
        name="Quality" 
        children={(props) => <Quality {...props} setIsLoggedIn={setIsLoggedIn} username={username} />} 
      />

         <Stack.Screen 
        name="DTDetails" 
        children={(props) => <DTDetails {...props} setIsLoggedIn={setIsLoggedIn} username={username} />} 
      />
     
    </Stack.Navigator>
  );
};



export default PerformanceStack;
