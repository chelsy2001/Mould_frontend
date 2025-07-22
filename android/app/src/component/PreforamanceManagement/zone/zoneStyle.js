import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

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

const zoneStyles = StyleSheet.create({
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
  
  menuItem: {
    width: '47%', // Two blocks in a row with spacing
    aspectRatio: 1, // Keeps cards square-shaped
    borderRadius: 16,
    backgroundColor: '#ffffff',
    marginBottom: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  sectionTitle: {
    width: '100%',
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  menuItem: {
    ...baseCard,
    backgroundColor:'#004080'
  },
  menuText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    // color: '#34495e',
    color:'white',
    textAlign: 'center',
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },  
});

export default zoneStyles;
