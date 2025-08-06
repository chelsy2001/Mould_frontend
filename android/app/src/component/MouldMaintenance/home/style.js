import { StyleSheet, Dimensions } from 'react-native';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#e0e9f5',
  },
  menuContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between', // Better than space-around for alignment
  alignItems: 'center',
  paddingTop: 15,
},

menuItem: {
  width: '46%', // Almost 2 per row with margin
  height: 130,
  marginVertical: 10,
  marginHorizontal: '2%', // horizontal gap between two boxes
  justifyContent: 'flex-start',
  alignItems: 'center',
  backgroundColor: '#003366',
  borderRadius: 10,
  paddingVertical: 10,
  paddingHorizontal: 5,
  overflow: 'hidden',
},

  menuText: {
    marginTop: 10,
    fontSize: width > 400 ? 14 : 14, // Adjust font size for smaller screens
    height: 50, 
    fontWeight: '500',
    color: 'white',
    alignItems:'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
icon: {
  width: 50,
  height: 50,
  resizeMode: 'contain',
  marginBottom: 8,
},
labelWrapper: {
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
},
});

export default styles;
