// DTDetailsStyle.js
import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from '../../Common/utils/scale';

const DTDetailsstyles = StyleSheet.create({
  container: {
    padding: scale(16),
    backgroundColor: '#f0f4f8',
    flex: 1,
  },
  Container1: {
    backgroundColor: '#003366',
    width: '95%',
    alignSelf: 'center',
    padding: scale(10),
    borderRadius: scale(10),
    marginVertical: verticalScale(10),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: verticalScale(5),
  },
  label: {
    color: 'white',
    fontSize: moderateScale(14),
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    color: 'black',
    borderRadius: scale(6),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(6),
    flex: 3,
    height: verticalScale(40),

  }
});

export default DTDetailsstyles;
