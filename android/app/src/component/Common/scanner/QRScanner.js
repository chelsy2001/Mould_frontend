import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

const QRScanner = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  useEffect(() => {
    const getPermission = async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    };
    getPermission();
  }, []);

  if (!hasPermission) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No camera permission</Text>
        <Button title="Grant Permission" onPress={async () => {
          const status = await Camera.requestCameraPermission();
          setHasPermission(status === 'authorized');
        }} />
      </View>
    );
  }

  if (device == null) return <Text>Loading Camera...</Text>;

  return (
    <Camera
      style={{ flex: 1 }}
      device={device}
      isActive={true}
    />
  );
};

export default QRScanner;
