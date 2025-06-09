import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#e0e9f5',
  },

  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
    // fontWeight: '600',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },

  // mouldData: {
  //   backgroundColor: '#ffffff',
  //   padding: 12,
  //   borderRadius: 14,
  //   marginVertical: 12,
  //   alignItems: 'flex-start',
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 3 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   elevation: 3,
  // },

  confirmText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  errorText: {
    color: '#dc2626',
    fontSize: 15,
    marginTop: 6,
    fontWeight: '500',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 20,
    gap: 12,
  },

  iconButton: {
    backgroundColor: '#2980b9',
    borderRadius: 50,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  confirmButton: {
    backgroundColor: '#2980b9',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
    alignSelf: 'center',
    flexDirection:'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  cameraButton: {
    backgroundColor: '#2980b9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    width: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },

  cameraButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 26,
  },

  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
    gap: 12,
  },

  // previewImage: {
  //   width: 120,
  //   height: 100,
  //   borderRadius: 10,
  //   resizeMode: 'cover',
  //   marginTop: 10,
  //   marginHorizontal: 8,
  //   borderWidth: 1,
  //   borderColor: '#d1d5db',
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   elevation: 2,
  // },
  inputContainer: {
    // margin: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    elevation: 2,
    // width:'60%',
    shadowColor: '#ffff',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  icon:{
    paddingLeft:10,
  },
  mouldData: {
    backgroundColor: '#fff',
    marginRight:20,
    marginLeft:200,
    width:'60%',
    alignContent:'center',
    justifyContent:'center',
    borderRadius: 16,
    padding: 12,
    paddingTop:10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  separator: {
    height: 1,
    width:'60%',
    backgroundColor: '#d1d5db', // Tailwind's gray-300
    alignSelf: 'stretch',
    marginVertical: 1,
    opacity: 0.6,
  },
  
  dataRow: {
    flexDirection: 'row',
    // justifyContent: 'flex-start',
    // alignItems: 'center',
    // marginVertical: 6,
  },
  
  dataLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    width: '20%',
  },
  
  dataValue: {
    fontSize: 16,
    color: '#334155',
    flexShrink: 2,
    // textAlign: 'right',
  },
  
  previewImage: {
    width: '30%',
    height: 100,
    borderRadius: 12,
    marginTop: 16,
    resizeMode: 'cover',
    borderColor: '#cbd5e1',
    borderWidth: 1,
  },
  
});

export default styles;
