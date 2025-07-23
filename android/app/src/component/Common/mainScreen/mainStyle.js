import { StyleSheet, Dimensions } from 'react-native';
import { scale, verticalScale, moderateScale } from '../../Common/utils/scale'; // Adjust path

const baseCard = {
  width: scale('85%'),
  maxWidth: 300,
  marginVertical: moderateScale(15),
  backgroundColor: '#fff',
  borderRadius: verticalScale(20),
  paddingVertical: verticalScale(25),
  paddingHorizontal: verticalScale(16),
  alignItems: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 5 },
  elevation: 8,
};

const mainstyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: moderateScale(30),
    paddingBottom: verticalScale(20),
  },
  // sectionTitle: {
  //   fontSize: scale(24),
  //   fontWeight: '700',
  //   color: '#2c3e50',
  //   textAlign: 'center',
  //   marginTop: verticalScale(20),
  //   marginBottom: verticalScale(10),
  // },
  cardButton: {
    ...baseCard,
    backgroundColor:'#004080',
  },
  cardButtonDisabled: {
    ...baseCard,
    backgroundColor: '#ecf0f1',
  },
  cardText: {
    marginTop: moderateScale(12),
    fontSize: scale(16),
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  cardTextDisabled: {
    marginTop: moderateScale(12),
    fontSize: scale(15),
    fontWeight: '500',
    color: '#7f8c8d',
    textAlign: 'center',
  },
  icon: {
    width: scale(60),
    height: scale(60),
    resizeMode: 'contain',
  },
});

export default mainstyles;
