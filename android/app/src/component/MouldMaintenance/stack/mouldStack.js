import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MouldLoadingScreen from '../mouldLoad/mould.js';
import MouldUnLoadingScreen from '../mouldUnload/mouldunload.js';
import MouldStatus from '../mouldStatus/mouldStatus.js';
import HealthCheck from '../healthCheck/healthCheck.js';
import BreakDown from '../BreakDown/breakDown.js';
import SparePart from '../sparePartValidation/sparePart.js';
import MouldHome from '../home/home.js';
import PmConfig from '../pmConf/pmconfg.js';
import PMMouldMonitoring from '../PM Checklist/PM Mould Monitoring.js';
import PMPreparation from '../PM Checklist/PMPreparation.js';
import PMExecution from '../PM Checklist/PMExecution.js';
import PMApprove from '../PM Checklist/PMApprove.js';
import HCMonitoring from '../HC Checklist/HC Monitoring.js';
import HCExecution from '../HC Checklist/HCExecution.js';
import HCApprove from '../HC Checklist/HCApprove.js';

import SeperatePMApproval from '../Approval/SeperatePMApproval.js';
import SeperateHCApproval from '../Approval/SeperateHCApproval.js';
import PMApprovalCheckpoint from '../Approval/PMApprovalCheckpoint.js';
import HCApprovalCheckpoint from '../Approval/HCApprovalCheckpoint.js';
const Stack = createNativeStackNavigator();

const MouldStack = ({ setIsLoggedIn, username }) => {
  return (
    <Stack.Navigator initialRouteName="MouldHome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MouldHome">
        {() => <MouldHome setIsLoggedIn={setIsLoggedIn} username={username} />}
      </Stack.Screen>
      <Stack.Screen name="MouldLoadingScreen">
        {() => <MouldLoadingScreen setIsLoggedIn={setIsLoggedIn} username={username} />}
      </Stack.Screen>
      <Stack.Screen name="MouldUnloadingScreen">
        {() => <MouldUnLoadingScreen setIsLoggedIn={setIsLoggedIn} username={username} />}
      </Stack.Screen>
      <Stack.Screen name="SparePartScreen">
        {() => <SparePart setIsLoggedIn={setIsLoggedIn} username={username} />}
      </Stack.Screen>
      <Stack.Screen name="pmconfig">
        {() => <PmConfig setIsLoggedIn={setIsLoggedIn} username={username} />}
      </Stack.Screen>
      <Stack.Screen name="MouldStatus">
        {() => <MouldStatus setIsLoggedIn={setIsLoggedIn} username={username} />}
      </Stack.Screen>
      <Stack.Screen name="HealthCheck">
        {() => <HealthCheck setIsLoggedIn={setIsLoggedIn} username={username} />}
      </Stack.Screen>
      <Stack.Screen name="BreakDown">
        {() => <BreakDown setIsLoggedIn={setIsLoggedIn} username={username} />}
      </Stack.Screen>
      <Stack.Screen name="PMMouldMonitoring">
        {() => <PMMouldMonitoring setIsLoggedIn={setIsLoggedIn} username={username} />}
      </Stack.Screen>
      <Stack.Screen name="HCMonitoring">
        {() => <HCMonitoring setIsLoggedIn={setIsLoggedIn} username={username} />}
      </Stack.Screen>
      <Stack.Screen name="HCExecution">
        {() => <HCExecution setIsLoggedIn={setIsLoggedIn} username={username} />}
      </Stack.Screen>
      <Stack.Screen name="HCApprove">
        {() => <HCApprove setIsLoggedIn={setIsLoggedIn} username={username} />}
      </Stack.Screen>
      <Stack.Screen name="PMPreparation">
        {() => <PMPreparation setIsLoggedIn={setIsLoggedIn} username={username} />}
      </Stack.Screen>
      <Stack.Screen name="PMExecution">
        {() => <PMExecution setIsLoggedIn={setIsLoggedIn} username={username} />}
      </Stack.Screen>
      <Stack.Screen name="PMApprove">
        {() => <PMApprove setIsLoggedIn={setIsLoggedIn} username={username} />}
      </Stack.Screen>

           <Stack.Screen name="SeperatePMApproval">
        {() => <SeperatePMApproval setIsLoggedIn={setIsLoggedIn} username={username} />}
      </Stack.Screen>

       <Stack.Screen name="SeperateHCApproval">
        {() => <SeperateHCApproval setIsLoggedIn={setIsLoggedIn} username={username} />}
      </Stack.Screen>

  <Stack.Screen name="PMApprovalCheckpoint">
        {() => <PMApprovalCheckpoint setIsLoggedIn={setIsLoggedIn} username={username} />}
      </Stack.Screen>
      <Stack.Screen name="HCApprovalCheckpoint">
        {() => <HCApprovalCheckpoint setIsLoggedIn={setIsLoggedIn} username={username} />}
      </Stack.Screen>

    </Stack.Navigator>
  );
};


export default MouldStack;