import { StyleSheet ,Dimensions} from 'react-native';
// Scaling utilities
const { width, height } = Dimensions.get('window');
const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const ReworkDetailsStyle = StyleSheet.create({

      container: {
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
    Container1:{
 backgroundColor: '#003366',
width:'98%',
marginLeft:15,
padding:10,
borderRadius: 10
  },
    row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor:'blue',
    width:'30%',
    marginLeft:'2%'
    
  },
    label: {
    color: 'white',
  },
   input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor:'white',
color:'black',
    borderRadius: 6,
    padding: 3,
    width: 1000,
    height:40,
    marginHorizontal: 9,
  }
})
export default ReworkDetailsStyle;