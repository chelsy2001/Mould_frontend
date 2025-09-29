import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from '../../Common/utils/scale';
import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    paddingHorizontal: scale(15),
    paddingBottom: verticalScale(30),
    backgroundColor: '#f3f7fa',
  },

  section: {
  backgroundColor: '#fff',
  borderRadius: scale(12),
  padding: scale(12),
  marginBottom: verticalScale(16),
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
},

sectionTitle: {
  fontSize: moderateScale(14),
  fontWeight: 'bold',
  marginBottom: verticalScale(10),
  color: '#003366',
},

formRow: {
  marginBottom: verticalScale(10),
},

formRowHorizontal: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: scale(10),
},

formRowStack: {
  flexDirection: 'column',
},

field: {
  flex: 1,
},

label: {
  fontSize: moderateScale(12),
  marginBottom: verticalScale(4),
  color: '#333',
},

input: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: scale(8),
  paddingHorizontal: scale(10),
  paddingVertical: verticalScale(8),
  fontSize: moderateScale(12),
  backgroundColor: '#f9f9f9',
},

actionField: {
  flex: 1,
  justifyContent: 'flex-end',
},

// ✅ Button styles
buttonRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: scale(10),
  marginTop: verticalScale(10),
},

button: {
  flex: 1,
  paddingVertical: verticalScale(10),
  borderRadius: scale(8),
  alignItems: 'center',
  justifyContent: 'center',
},
button1: {
  paddingVertical: verticalScale(5),
   paddingHorizontal: verticalScale(100),
   marginTop: verticalScale(10),
  borderRadius: scale(10),
  alignItems: 'center',
  justifyContent: 'center',
},

assignBtn: {
  backgroundColor: '#28a745',
},

detailsBtn: {
  backgroundColor: '#000',
},

buttonText: {
  color: 'white',
  fontSize: moderateScale(12),
  fontWeight: '600',
},

// callBtn: {
//   flex: 1,
//   marginHorizontal: scale(5),
//   paddingVertical: verticalScale(10),
//   borderRadius: scale(8),
//   alignItems: 'center',
// },

// callText: {
//   color: 'white',
//   fontSize: moderateScale(12),
//   fontWeight: '600',
// },

row4: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: verticalScale(10),
},


 headerRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: scale(10),
  marginTop: verticalScale(20),
  marginBottom: verticalScale(10),
},

headerBox: {
  fontSize: moderateScale(14),
  fontWeight: '600',
  color: '#fcfdffff',
  backgroundColor: '#003366',
  padding: scale(8),
  borderRadius: scale(6),
  flex: 1,
  marginHorizontal: scale(5),
  textAlign: 'center',
},

chartSection: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  paddingVertical: verticalScale(10),
},

progressContainer: {
  alignItems: 'center',
  margin: verticalScale(10),
},

chartPercentage: {
  fontSize: moderateScale(14),
  fontWeight: '700',
  color: '#003366',
},

chartTitle: {
  fontSize: moderateScale(12),
  color: '#555',
  marginTop: verticalScale(5),
},

  callBtn: {
    padding: scale(10),
    borderRadius: scale(6),
    margin: scale(5),
  },

  callText: {
    color: 'white',
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
