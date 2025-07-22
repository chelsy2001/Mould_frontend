import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from '../../Common/utils/scale'

const styles = StyleSheet.create({
  container: {
    padding: scale(20),
    backgroundColor: '#f0f4f8',
  },
  label: {
    color: 'white',
    fontSize: scale(12),
  },
  Container1: {
    backgroundColor: '#003366',
    width: '98%',
    marginLeft: scale(5),
    padding: scale(10),
    borderRadius: scale(10),
    marginTop:scale(6),
  },
  title: {
    fontSize: scale(22),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: verticalScale(16),
    color: '#004aad',
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '35%',
   // marginLeft: '1%',
  },
    row2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '97%',
   // marginLeft: '2%',
    marginTop:'2%'
  },

    row4: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '97%',
   // marginLeft: '2%',
    marginTop:'2%'
  },
row5: {
  width: '97%',
  //marginLeft: '2%',
  marginTop: '2%',
},

inputWithButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 5,
},

remarkInput: {
  flex: 1,
  backgroundColor: 'white',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 6,
  padding: 8,
  marginRight: 10,
},
inputWithIcon: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#ccc',
  backgroundColor: 'white',
  marginLeft:scale(6),
marginRight:scale(4)
},

iconContainer: {
  paddingHorizontal: 2,
  position: 'absolute',
  right: scale(1),
  top: 6,
  zIndex: 1,

},

input12: {
  flex: 1,
  height:verticalScale(28),
  backgroundColor: '#fff',
  
},

  input1: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    color: 'black',
    borderRadius: scale(6),
    padding: scale(3),
    width: scale(70),
    height: verticalScale(30),
    marginHorizontal: scale(9),
  },
  input2: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: scale(6),
    padding: scale(3),
    width: scale(150),
    height: verticalScale(30),
    color: 'black',
    backgroundColor: 'white',
    marginHorizontal: scale(9),
  },
  input3: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: scale(6),
    padding: scale(3),
    width: scale(100), // Consider using a percentage or adjusting to a lower value for smaller screens
    height: verticalScale(30),
    marginHorizontal: scale(9),
    backgroundColor: 'white',
  },
button: {
  backgroundColor: '#007bff',
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 6,
},

buttonText: {
  color: 'white',
  fontWeight: 'bold',
}
});

export default styles;
