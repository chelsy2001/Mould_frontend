import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');


//   width: width > 400 ? '40%' : '85%',
const baseCard = {
  width: width > 400 ? '38%' : '80%',
  maxWidth: 500,
  height: width > 400 ? 160 : 140,
  marginVertical: 15,
  borderRadius: 16,
  backgroundColor: '#ffffff',
  padding: 20,
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 6 },
  elevation: 10,
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
 
    menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  cardButton: {
    ...baseCard,
    backgroundColor: '#004080',
  },
  cardText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
});

export default styles;
