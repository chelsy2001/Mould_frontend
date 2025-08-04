import { StyleSheet, Dimensions } from 'react-native';
import { scale, verticalScale } from '../../Common/utils/scale';

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    backgroundColor: '#f0f4f8',
    minHeight: '100%',
  },
  label: {
    color: 'white',
    fontSize: scale(12),
    marginBottom: verticalScale(4),
  },
  Container1: {
    backgroundColor: '#003366',
    width: '98%',
    alignSelf: 'center',
    padding: scale(10),
    borderRadius: scale(10),
    marginTop: scale(6),
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
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: scale(8),
  width: '100%',
  marginTop: verticalScale(6),
},

  row2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: scale(8),
    width: '100%',
    marginTop: verticalScale(2),
  },
  row4: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: scale(10),
    width: '100%',
    marginTop: verticalScale(4),
  },
  row5: {
    width: '100%',
    marginTop: verticalScale(-6),
  },
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(5),
    flexWrap: 'wrap',
    gap: scale(10),
  },
  // Add these in your existing StyleSheet

  fieldGroup: {
    width: screenWidth < 360 ? '100%' : '48%',
  },
  labelWithMargin: {
    color: 'white',
    fontSize: scale(12),
    marginBottom: verticalScale(2),
    marginLeft: scale(2),
  },
  dropdownWrapper: {
    backgroundColor: 'white',
    borderRadius: scale(6),
    //paddingHorizontal: scale(3),
  },

  remarkInput: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: scale(6),
    padding: scale(8),
    minHeight: verticalScale(40),
  },
inputWithIcon: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#ccc',
  backgroundColor: 'white',
  borderRadius: scale(6),
  paddingHorizontal: scale(5),
  marginRight: scale(6),
  width: screenWidth < 360 ? '100%' : screenWidth < 420 ? '75%' : '70%',
}
,
  iconContainer: {
    position: 'absolute',
    right: scale(5),
    top: verticalScale(8),
    zIndex: 1,
  },
  input12: {
    flex: 1,
    height: verticalScale(30),
    backgroundColor: '#fff',
    paddingHorizontal: scale(5),
    color: 'black',
  },
  input1: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    color: 'black',
    borderRadius: scale(6),
    padding: scale(6),
    width: screenWidth < 360 ? '100%' : '30%',
    height: verticalScale(40),
    marginBottom: verticalScale(10),
  },
  input2: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: scale(6),
    padding: scale(6),
    width: '100%',
    height: verticalScale(30),
    color: 'black',
    backgroundColor: 'white',
    marginBottom: verticalScale(10),
    marginTop:verticalScale(-8)
  },
 fieldContainer: {
  width: screenWidth < 360 ? '100%' : screenWidth < 420 ? '48%' : '48%',
  marginBottom: verticalScale(10),
},

input3: {
  height: verticalScale(35),
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: scale(6),
  paddingHorizontal: scale(8),
  color: 'black',
},

  button: {
    backgroundColor: '#007bff',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(16),
    borderRadius: scale(6),
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: scale(14),
  },
  flexItem: {
  width: '24%',
  marginBottom: verticalScale(10),
},
});

export default styles;
