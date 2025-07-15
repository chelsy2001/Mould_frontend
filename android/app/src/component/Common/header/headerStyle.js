import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const scaleFont = (size) => size * (width / 375);
const scaleSize = (size) => size * (width / 375);

export default StyleSheet.create({
  header: {
    paddingVertical: scaleSize(8),
    paddingHorizontal: scaleSize(12),
    borderRadius: scaleSize(12),
    marginHorizontal: scaleSize(8),
    marginTop: scaleSize(6),
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
    marginBottom: scaleSize(4),
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sideIcon: {
    width: scaleSize(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: scaleFont(16),
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  subTitle: {
    color: 'white',
    fontSize: scaleFont(12),
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
