import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const baseCard = {
  width: width > 400 ? '40%' : '85%',
  maxWidth: 300,
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

const mainstyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 30,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  cardButton: {
    ...baseCard,
    backgroundColor:'#004080',
  },
  cardButtonDisabled: {
    ...baseCard,
    backgroundColor: '#ecf0f1',
  },
  cardText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  cardTextDisabled: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#7f8c8d',
    textAlign: 'center',
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
});

export default mainstyles;
