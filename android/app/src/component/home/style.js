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
    width: width > 400 ? '30%' : '45%', // Adjusting based on screen width
    height: width > 400 ? 120 : 100, // Adjust height based on screen size
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000080',
    borderRadius: 10,
    padding: 15,
  },
  menuText: {
    marginTop: 10,
    fontSize: width > 400 ? 16 : 14, // Adjust font size for smaller screens
    fontWeight: '500',
    color: 'white',
  },
  icon: {
    width: width > 400 ? 80 : 60, // Adjust icon size based on screen width
    height: width > 400 ? 80 : 60,
  },
});

export default styles;
