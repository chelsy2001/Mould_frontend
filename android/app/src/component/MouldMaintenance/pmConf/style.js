import { StyleSheet, Dimensions } from 'react-native';
import { scale, verticalScale, moderateScale } from '../../Common/utils/scale'; // adjust path if needed

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(10),
    backgroundColor: '#e0e9f5',
  },

  label: {
    fontSize: moderateScale(12),
    color: '#333',
    marginBottom: verticalScale(2),
    fontWeight: 'bold',
  },

  input: {
    backgroundColor: '#f0f0f0',
    // borderRadius: moderateScale(8),
    // padding: moderateScale(10),
    fontSize: moderateScale(10),
    color: '#333',
  },

  confirmText: {
    color: 'white',
    fontSize: moderateScale(12),
    fontWeight: '500',
    letterSpacing: 0.5,
  },

  errorText: {
    color: '#dc2626',
    fontSize: moderateScale(15),
    marginTop: verticalScale(6),
    fontWeight: '500',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: verticalScale(20),
    gap: scale(12),
  },

  iconButton: {
    backgroundColor: '#004d99',
    borderRadius: 50,
    padding: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
    // elevation: 2,
  },

  confirmButton: {
    backgroundColor: '#004d99',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(5),
    paddingHorizontal: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
    alignSelf: 'center',
    flexDirection: 'row',
    // elevation: 3,
  },

  cameraButton: {
    backgroundColor: '#2980b9',
    borderRadius: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(5),
    width: '45%',
    // elevation: 4,
  },

  cameraButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: moderateScale(10),
  },

  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: verticalScale(18),
    gap: scale(12),
  },

  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(10),
    padding: scale(5),
    marginRight: scale(15),
    marginLeft: scale(15),
    marginVertical: verticalScale(12),
    // elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 5 },
  },

  icon: {
    paddingLeft: scale(10),
  },

  mouldData: {
    backgroundColor: '#fff',
    // marginHorizontal: '5%',
    // width: '100%',
    alignSelf: 'center',
    borderRadius: moderateScale(16),
    padding: moderateScale(10),
    marginVertical: verticalScale(5),
    // elevation: 4,
  },

  separator: {
    height: 2,
    width: '90%',
    backgroundColor: '#d1d5db',
    alignSelf: 'center',
    opacity: 0.10,
  },

  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: verticalScale(2),
  },

  dataLabel: {
    fontSize: moderateScale(10),
    fontWeight: 'bold',
    color: '#1e293b',
    width: '30%',
  },

  dataValue: {
    fontSize: moderateScale(10),
    color: '#334155',
    width: '70%',
    textAlign: 'right',
  },

  previewImage: {
    width: width * 0.3,
    height: verticalScale(50),
    borderRadius: moderateScale(12),
    marginTop: verticalScale(16),
    resizeMode: 'cover',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSection: {
  alignItems: 'flex-start',
  // marginTop: 20,
  marginBottom: 10,
},

imageRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: verticalScale(5),
  gap: scale(12),
},
takeImageText: {
  fontSize: moderateScale(10),
  color: '#555',
  marginLeft: scale(100),
  fontWeight: '500',
},

imagePlaceholder: {
  height: 50,
  width: 50,
  borderRadius: 5,
  borderWidth: 1,
  borderColor: '#ccc',
  justifyContent: 'flex-start',
  alignItems: 'center',
  backgroundColor: '#fffefeff',
},

imageControls: {
  flexDirection: 'row',
  justifyContent: 'center',
  // gap: 20,
},

smallButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#2c3e50',
  paddingVertical: 10,
  paddingHorizontal: 8,
  borderRadius: 10,
  marginHorizontal: 5,
  marginTop: 20,
},

smallButtonText: {
  color: '#fff',
  marginLeft: 6,
  fontSize: moderateScale(12),
},
});

export default styles;
