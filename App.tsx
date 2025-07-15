import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './android/app/src/component/Common/login/login';
import MainHome from './android/app/src/component/Common/mainScreen/main';
import PerformanceStack from './android/app/src/component/PreforamanceManagement/stack/performanceStack';
import MouldStack from './android/app/src/component/MouldMaintenance/stack/mouldStack';
import { SafeAreaView, StyleSheet } from 'react-native';
import { LogBox } from 'react-native';

const Stack = createNativeStackNavigator();

function App() {
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
            <Stack.Screen name="Login" options={{headerShown:false}}>
              {(props) =>  <LoginScreen 
                {...props} 
                setIsLoggedIn={setIsLoggedIn} 
                setUsername={setUsername} // Pass setUsername to capture logged-in username
              />} 
            </Stack.Screen>
          ) : (
            <>
               <Stack.Screen name="Home" options={{ headerShown: false }}>
                {(props) => <MainHome title={undefined} {...props} username={username} setIsLoggedIn={setIsLoggedIn} />}
              </Stack.Screen>
              <Stack.Screen name="Performance" options={{ headerShown: false }}>
                {(props) => <PerformanceStack {...props} username={username} setIsLoggedIn={setIsLoggedIn} />}
              </Stack.Screen>
              <Stack.Screen name="Maintenance" options={{ headerShown: false }}>
                {(props) => <MouldStack setIsLoggedIn={undefined} username={username}  />}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
    </SafeAreaView>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});