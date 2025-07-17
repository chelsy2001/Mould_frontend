import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from '../../Common/utils/scale'; // adjust path if needed

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e9f5', // Soft gray background
    padding: moderateScale(16),
    justifyContent: 'center', // Centers content vertically
  },
  inputContainer: {
    margin: moderateScale(20),
    backgroundColor: '#fff',
    borderRadius: verticalScale(12),
    padding: moderateScale(12),
    elevation: 2,
    width:scale('88%'),
    shadowColor: '#ffff',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontSize: scale(10),
    color: '#333',
    marginBottom: verticalScale(6),
    // fontWeight: '600',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: moderateScale(8),
    padding: moderateScale(10),
    fontSize: scale(10),
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: verticalScale(20),
  },
  statusButton: {
    flex: 1,
    padding: moderateScale(10),
    marginHorizontal: verticalScale(4),
    borderRadius: verticalScale(10),
    alignItems: 'center',
    elevation: 2,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize:scale(10)
  },
  confirmButton: {
    backgroundColor: '#2980b9',
    padding: moderateScale(12),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    marginTop: verticalScale(10),
    elevation: 3,
  },
  confirmText: {
    color: '#fff',
    fontSize: scale(10),
    fontWeight: 'bold',
  },
  icon:{
    paddingLeft:verticalScale(10),
  }
});
