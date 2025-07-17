import { StyleSheet, Dimensions } from 'react-native';
import { scale, verticalScale, moderateScale } from '../../Common/utils/scale'; // adjust path if needed


export default StyleSheet.create({
  header: {
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    borderRadius: verticalScale(12),
    marginHorizontal: verticalScale(8),
    marginTop: verticalScale(6),
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    backgroundColor: '#0059b3',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(4),
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sideIcon: {
    width: verticalScale(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: scale(16),
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  subTitle: {
    color: 'white',
    fontSize: scale(12),
    fontWeight: '400',
    textAlign: 'left',
    
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
     maxWidth: undefined,      // remove limit
  flex: 1,                  // allow it to expand
  justifyContent: 'flex-end',
  },
});
