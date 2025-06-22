import { StyleSheet } from 'react-native';

import { Dimensions } from 'react-native';
// Scaling utilities
const { width, height } = Dimensions.get('window');
const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;


const HCApprovalCheckpointStyle = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#e0e9f5',
         height:'100%'
  },
  label: {
    color: 'black'
  },
  Container1: {
    backgroundColor: '#fff',
    shadowColor: '#ffff',
    shadowOpacity: 0.05,
    width: '97%',
    width: '98%',
    marginLeft: 15,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20, // 👈 adds space between boxes
    elevation: 5, // for shadow on Android

  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: '#004aad',
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: '2%'
  },

  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '97%',
    marginLeft: '2%',
    marginTop: '5'

  },
  row4: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor:'green',
    width: '95%',
    marginLeft: '2%',
    // marginRight:-20,
    marginTop: '5'

  },
  row5: {
    flexDirection: 'row',
    alignItems: 'End',
    justifyContent: 'flex-end',
    // backgroundColor:'green',
    width: '95%',
   marginLeft: '4.5%',
  
    marginTop: '8'

  },
  input1: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
    color: 'black',
    borderRadius: 6,
    padding: 3,
    width: 200,
    height: 40,
    marginHorizontal: 9,
    marginLeft: '2%'
  },
  input2: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    padding: 3,
    height: 42,
    color: 'black',
    marginRight: 40,
    marginHorizontal: 9,
    marginLeft: '2%'
  },
  input4: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    padding: 3,
    height: 42,
    color: 'black',
    // marginRight:10,
    // marginHorizontal:1 ,
    marginLeft: '4%'
  },
  button: {
    backgroundColor: '#0059b3',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(7),
    borderRadius: scale(2),
    alignItems: 'center',
    width: "10%"
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
    iconButton: {
    backgroundColor: '#2980b9',
    borderRadius: 30,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

});

export default HCApprovalCheckpointStyle;