import { StyleSheet, Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

// Scaling utilities
const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const styles = StyleSheet.create({
  container: {
   padding: 20,
    backgroundColor: '#f0f4f8',
  },
   Container1:{
 backgroundColor: '#003366',
width:'98%',
marginLeft:15,
padding:10,
borderRadius: 10
  },

  // innerContainer:{
  //   backgroundColor:'red',
  //   marginRight:"10%",
  //  // justifyContent:"center"
  // },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: scale(20),
    margin: scale(10),
    backgroundColor: '#004080',
    borderRadius: scale(8),
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: moderateScale(18),
  },
  form: {
    backgroundColor: '#003366',
    padding: 15,
    margin: 5,
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft:8

  },
  label: {
    color: 'white',
  },
  input: {

    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'white',
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 6,
    marginLeft:20,
      height:40,
      marginRight:8,
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // marginVertical: verticalScale(15),
    marginVertical: 10
  },
  button: {
    backgroundColor: '#4a90e2',
  paddingVertical: verticalScale(10),
  paddingHorizontal: scale(7),
   borderRadius: scale(2),
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 16,
    marginRight:10.8,
    width:"10%"
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  table: {
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 20,
    minWidth: 1000, // <-- Force horizontal scroll
    alignSelf: 'flex-start', // Prevent centering cutoff
    padding: 10,
  },
  
  selectedRow: {
    backgroundColor: '#bbdefb',
  },
  remarkRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: -14,
  marginLeft:8
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
saveButtonText: {
  color: 'white',
  fontWeight: 'bold',
}

});

export default styles;
