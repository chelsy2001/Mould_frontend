import { StyleSheet, Dimensions } from 'react-native';
import { scale, verticalScale, moderateScale } from '../../Common/utils/scale'; // adjust path if needed

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(2),
    backgroundColor: '#f0f4f8',
  },

  label: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#222',
  },

  dataRow: {
    flexDirection: 'row',
  },

  text: {
    fontSize: moderateScale(10),
    color: '#333',
    gap: moderateScale(10),
  },

  text1: {
    fontSize: moderateScale(10),
    fontWeight: '500',
  },

  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(10),
    padding: scale(5),
    marginRight: scale(15),
    marginLeft: scale(15),
    marginVertical: verticalScale(15),
    // elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 5 },
  },

  dataLabel: {
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    color: '#1e293b',
    width:'40%',
  },

  dataValue: {
    fontSize: moderateScale(12),
    color: '#334155',
    width: '50%',
    textAlign: 'right',
  },
 input: {
    backgroundColor: '#f0f0f0',
    // borderRadius: moderateScale(8),
    // padding: moderateScale(10),
    fontSize: moderateScale(10),
    color: '#333',
  },

  dropdown: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(10),
    borderColor: '#ccc',
    borderWidth: 1,
    margin: moderateScale(10),
    paddingRight: moderateScale(10),
    paddingLeft: moderateScale(10),
    padding: moderateScale(2),
    paddingBottom: moderateScale(10),
  },

  dropdownText: {
    fontSize: moderateScale(16),
  },

  mouldData: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    width: '90%',
    borderRadius: moderateScale(16),
    padding: moderateScale(12),
    paddingTop: verticalScale(10),
    marginVertical: verticalScale(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

   confirmButton: {
    backgroundColor: '#004d99',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
    alignSelf: 'center',
    flexDirection: 'row',
    // elevation: 3,
  },

  confirmText: {
    color: 'white',
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

   separator: {
    height: 2,
    width: '90%',
    backgroundColor: '#d1d5db',
    alignSelf: 'center',
    opacity: 0.10,
  },
});

export default styles;
