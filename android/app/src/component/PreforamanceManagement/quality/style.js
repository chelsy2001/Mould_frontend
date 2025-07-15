import { StyleSheet ,Dimensions} from 'react-native';
// Scaling utilities
const { width, height } = Dimensions.get('window');
const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
label:{
  color: 'white'
},
  Container1:{
 backgroundColor: '#003366',
width:'98%',
marginLeft:15,
padding:10,
borderRadius: 10
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: '#004aad',
  },
  statusBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statText: {
    fontSize: 16,
  },
  bold: {
    fontWeight: 'bold',
  },

    row1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    //backgroundColor:'blue',
    width:'97%',
    marginLeft:'2%'
    
  },
     row2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
   // backgroundColor:'red',
    width:'97%',
    marginLeft:'2%',
    marginTop:'5'
    
  },
   row3: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
   // backgroundColor:'green',
    width:'95%',
    marginLeft:'2%',
   // marginRight:-20,
    marginTop:'-8'
    
  },
   input1: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor:'white',
color:'black',
    borderRadius: 6,
    padding: 3,
    width: 200,
    height:40,
    marginHorizontal: 9,
  },

  input2: {
   borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 3,
    width: 200,
    height:42,
    color:'black',
   // marginHorizontal: 9,
     backgroundColor:'white' 
    //marginRight:20
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    fontSize: 16,
  },
    input3: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 3,
    width: 952,
     height:40,
    marginHorizontal: 9,
    marginLeft:30,
     backgroundColor:'white'
   // marginRight:20
  },
  dropdown: {
    marginVertical: 6,
    borderRadius: 8,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#4a90e2',
  paddingVertical: verticalScale(10),
  paddingHorizontal: scale(7),
   borderRadius: scale(2),
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 16,
    marginRight:2,
    width:"10%"
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    backgroundColor: '#fff',
    marginVertical: 2,
    borderRadius: 4,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default styles;