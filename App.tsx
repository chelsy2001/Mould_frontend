// App.js
import React,{ useState ,useEffect}  from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import LoginScreen from './android/app/src/component/login/login';
import HomeScreen from './android/app/src/component/home/home';
import MouldLoadingScreen from './android/app/src/component/mouldLoad/mould';
import MouldUnLoadingScreen from './android/app/src/component/mouldUnload/mouldunload';
import Pmconfg from './android/app/src/component/pmConf/pmconfg';
import SparePart from './android/app/src/component/sparePartValidation/sparePart';
import MouldStatus from './android/app/src/component/mouldStatus/mouldStatus';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HealthCheck from './android/app/src/component/healthCheck/healthCheck';
import BreakDown from './android/app/src/component/BreakDown/breakDown';
import PMMouldMonitoring from './android/app/src/component/PM Checklist/PM Mould Monitoring';
import HCMonitoring from './android/app/src/component/HC Checklist/HC Monitoring';
import { LogBox } from 'react-native';
import PMPreparation from './android/app/src/component/PM Checklist/PMPreparation';
import PMExecution from './android/app/src/component/PM Checklist/PMExecution';
import PMApprove from './android/app/src/component/PM Checklist/PMApprove';
import HCExecution from './android/app/src/component/HC Checklist/HCExecution';
import HCApprove from './android/app/src/component/HC Checklist/HCApprove';
import SeperatePMApproval from './android/app/src/component/Approval/SeperatePMApproval';
import SeperateHCApproval from './android/app/src/component/Approval/SeperateHCApproval';
const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Ignore all log warnings
    LogBox.ignoreAllLogs(true);

    // Alternatively, ignore specific warnings
    LogBox.ignoreLogs(['Warning: ...', 'Another specific warning']);
  }, []);

  return (
    <NavigationContainer>
       <SafeAreaView style={styles.container}>
      <Stack.Navigator initialRouteName="Login">
          {!isLoggedIn ? (
            <Stack.Screen name="Login">
              {(props) =>  <LoginScreen 
                {...props} 
                setIsLoggedIn={setIsLoggedIn} 
                setUsername={setUsername} // Pass setUsername to capture logged-in username
              />} 
            </Stack.Screen>
          ) : (
            <>
               <Stack.Screen name="Home" options={{ headerShown: false }}>
                {(props) => <HomeScreen {...props} setIsLoggedIn={setIsLoggedIn}  username={username}/>}
              </Stack.Screen>
              <Stack.Screen name="MouldLoadingScreen"  options={{ headerShown: false }} >
              {(props) => <MouldLoadingScreen {...props} username={username}/>}
              </Stack.Screen>
              <Stack.Screen name="MouldUnloadingScreen"  options={{ headerShown: false }} >
              {(props) => <MouldUnLoadingScreen setIsLoggedIn={undefined} {...props} username={username}/>}
              </Stack.Screen>
              <Stack.Screen name="SparePartScreen"  options={{ headerShown: false }} >
              {(props) => <SparePart setIsLoggedIn={undefined} {...props} username={username}/>}
              </Stack.Screen>
              <Stack.Screen name="Pmconfg"  options={{ headerShown: false }} >
              {(props) => <Pmconfg setIsLoggedIn={undefined} {...props} username={username}/>}
              </Stack.Screen>
              <Stack.Screen name="MouldStatus"  options={{ headerShown: false }} >
              {(props) => <MouldStatus setIsLoggedIn={undefined} {...props} username={username}/>}
              </Stack.Screen>
              <Stack.Screen name="HealthCheck"  options={{ headerShown: false }} >
              {(props) => <HealthCheck setIsLoggedIn={undefined} {...props} username={username}/>}
              </Stack.Screen>
              <Stack.Screen name="BreakDown"  options={{ headerShown: false }} >
              {(props) => <BreakDown setIsLoggedIn={undefined} {...props} username={username}/>}
              </Stack.Screen>
              // pm checklist 
               <Stack.Screen name="PMMouldMonitoring" options={{ headerShown: false }} >
        {() => <PMMouldMonitoring setIsLoggedIn={setIsLoggedIn} username={username} />}
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
      //HC checklist
         <Stack.Screen name="HCMonitoring" options={{ headerShown: false }} >
        {() => <HCMonitoring setIsLoggedIn={setIsLoggedIn} username={username} />}
      </Stack.Screen>
       <Stack.Screen name="HCExecution">
        {() => <HCExecution setIsLoggedIn={setIsLoggedIn} username={username} />}
      </Stack.Screen>
      <Stack.Screen name="HCApprove">
        {() => <HCApprove setIsLoggedIn={setIsLoggedIn} username={username} />}
      </Stack.Screen>
       <Stack.Screen name="SeperatePMApproval">
        {() => <SeperatePMApproval setIsLoggedIn={setIsLoggedIn} username={username} />}
      </Stack.Screen>

       <Stack.Screen name="SeperateHCApproval">
        {() => <SeperateHCApproval setIsLoggedIn={setIsLoggedIn} username={username} />}
      </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
    </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
