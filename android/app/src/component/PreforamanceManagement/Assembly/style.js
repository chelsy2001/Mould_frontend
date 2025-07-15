import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const baseCard = {
//   width: width > 400 ? '40%' : '85%',
width: '70%',
//   maxWidth: 300,
  marginVertical: 15,
  backgroundColor: '#fff',
  borderRadius: 20,
  paddingVertical: 25,
  paddingHorizontal: 16,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 5 },
  elevation: 8,
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexDirection: 'column',
    // flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    paddingBottom: 20,
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
