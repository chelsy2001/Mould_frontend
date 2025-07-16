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
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 15,
  },
menuItem: {
  width: width > 400 ? '30%' : '45%',
  height: 130, // slightly increased to accommodate image and text
  marginVertical: 15,
  justifyContent: 'flex-start', // align from top
  alignItems: 'center',
  backgroundColor: '#003366',
  borderRadius: 10,
  paddingVertical: 10,
  paddingHorizontal: 5,
  overflow: 'hidden',
},
  menuText: {
    marginTop: 10,
    fontSize: width > 400 ? 16 : 14, // Adjust font size for smaller screens
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
