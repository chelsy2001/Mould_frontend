import { StyleSheet } from 'react-native';

import { Dimensions } from 'react-native';
// Scaling utilities
const { width, height } = Dimensions.get('window');
const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;


const PMApproveStyle = StyleSheet.create({
container: {
    padding: 20,
    backgroundColor: '#e0e9f5',
    height:'100%'
  },
});
export default PMApproveStyle;