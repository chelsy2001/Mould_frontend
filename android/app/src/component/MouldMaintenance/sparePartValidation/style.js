// style.js
import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from '../../Common/utils/scale'; // adjust path if needed


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f0ff',
    // paddingHorizontal: 16,
    // paddingTop: 10,
  },

  screenTitle: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    color: '#003366',
    textAlign: 'center',
    marginVertical: verticalScale(10),
  },

  label: {
    fontSize: moderateScale(10),
    fontWeight: '600',
    color: '#444',
    marginBottom: scale(6),
    marginLeft: scale(4),
  },

  mouldData: {
    backgroundColor: '#ffffff',
  padding: moderateScale(10),
   borderRadius: moderateScale(10),
   shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
},
  inputContainer: {
    flex: 1,
    marginBottom: scale(10),
    paddingHorizontal: scale(4),
  },

  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: moderateScale(15),
    borderWidth: 0.5,
    // borderColor: '#b3c6ff',
    // paddingVertical: 12,
    paddingVertical: moderateScale(8),
    // paddingHorizontal: 16,
    fontSize: moderateScale(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },

  currentqty: {
    backgroundColor: '#ffffff',
    borderRadius: moderateScale(15),
    borderWidth: 0.5,
    // borderColor: '#ccc',
    paddingVertical: scale(8),
    // paddingHorizontal: 16,
    textAlign: 'center',
    fontWeight: '700',
    color: '#003366',
    fontSize: moderateScale(10),
    // elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dropdown: {
    // marginVertical: 10,
    backgroundColor:'red',
    // borderRadius: scale(12),
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  confirmButton: {
    backgroundColor: '#004d99',
    paddingVertical: moderateScale(16),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    marginTop: scale(30),
    marginHorizontal: scale(20),
    shadowColor: '#003366',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    // elevation: 4,
  },
   findButton: {
    backgroundColor: '#004d99',
    paddingVertical: moderateScale(5),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    marginTop: moderateScale(30),
    marginHorizontal: scale(10),
    shadowColor: '#003366',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    // elevation: 4,
  },

  confirmText: {
    color: '#ffffff',
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default styles;
