import { StyleSheet, Dimensions, PixelRatio } from 'react-native';
import { scale, verticalScale, moderateScale } from '../../Common/utils/scale'; // Adjust path as needed

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: scale(20),
    backgroundColor: '#f0f4f8',
  },
  Container1: {
    backgroundColor: '#003366',
    width: '98%',
    marginLeft: scale(2.5),
    padding: scale(10),
    borderRadius: scale(10),
    marginTop:scale(8)
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
    marginLeft: scale(8),
  },
  label: {
    color: 'white',
    fontSize: moderateScale(14),
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: scale(6),
    marginLeft: scale(32),
    marginRight: scale(2),
  },
  button: {
    backgroundColor: '#4a90e2',

    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(7),
    borderRadius: scale(6),
    alignItems: 'center',
    marginTop: verticalScale(14),
    marginBottom: verticalScale(16),
    marginRight: scale(10),
    width: scale(80), // Instead of "10%" which is not reliable
   alignSelf: 'flex-end'
  },

  remarkInput1:{
    width:'95%',
    borderBottomColor: '#ccc',
   backgroundColor: 'white',
  borderRadius: scale(6),
   marginLeft: scale(10),
    marginTop: verticalScale(4),
    padding: scale(8),
  textAlignVertical: 'top',  // Important for multiline input
  minHeight: verticalScale(40), //
  },
  table: {
    backgroundColor: 'white',
    borderRadius: scale(12),
    margin: scale(10),
    minWidth: scale(1000),
    alignSelf: 'flex-start',
    padding: scale(10),
  },
  selectedRow: {
    backgroundColor: '#bbdefb',
  },

remarkInput: {
  flex: 1, // Takes available space
  borderBottomWidth: 1,
  borderBottomColor: '#ccc',
  backgroundColor: 'white',
  marginRight: 16, // Space between input and button
marginLeft:'3.5%',
  borderRadius: 6,
},
saveButton: {
  backgroundColor: '#4a90e2',
  paddingVertical: verticalScale(10),
  paddingHorizontal: scale(12),
  borderRadius: scale(6),
  alignItems: 'center',
  justifyContent: 'center',
},
buttonText: {
  color: 'white',
  fontWeight: 'bold',
}

});

export default styles;
