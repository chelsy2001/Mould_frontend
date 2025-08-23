import { StyleSheet } from 'react-native';

import { Dimensions } from 'react-native';
// Scaling utilities
// const { width, height } = Dimensions.get('window');
// const scale = (size) => (width / 375) * size;
// const verticalScale = (size) => (height / 812) * size;
// const moderateScale = (size, factor = 0.5) =>
//     size + (scale(size) - size) * factor;

import { scale, verticalScale, moderateScale } from '../../Common/utils/scale'; 

const SeperatePMApprovalStyle = StyleSheet.create({

    container: {
        padding: 20,
        backgroundColor: '#e0e9f5',
        height:'100%'
    },
    label: {
        color: 'black'
    },
    Container1: {
        backgroundColor: '#fff',
        shadowColor: '#ffff',
        shadowOpacity: 0.05,
        width: '97%',
        width: '98%',
        marginLeft: 15,
        padding: 10,
        borderRadius: 10,
         marginBottom: 20, // 👈 adds space between boxes
  elevation: 5, // for shadow on Android

},
    title: {
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 16,
        color: '#004aad',
    },
    row1: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    row2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '5'

    },
   row3: {
        flexDirection: 'row',
        alignItems: 'End',
        justifyContent: 'flex-end',
        width: '97%',
        marginLeft: '2%',
        marginTop: '5'

    },
    input1: {
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f0f0f0',
        color: 'black',
        borderRadius: 6,
        padding: 3,
        width: 200,
        height: 40,
        marginHorizontal: 9
    },
    input2: {
        borderWidth: 1,
           borderColor: '#ccc',
        backgroundColor: '#f0f0f0',
        borderRadius: 6,
        padding: 3,
        height: 42,
        color: 'black',
        marginRight:70,
         marginHorizontal:9 
    },

    button: {
    backgroundColor: '#3883ceff',
  paddingVertical: verticalScale(6),
  paddingHorizontal: scale(4),
   borderRadius: scale(2),
    alignItems: 'center',
    width:"10%"
  },
  buttonText: {
    // color: '#fff',
    color :'black',
    fontWeight: '600',
    fontSize: 16,
  },
   dropdownContainer: {
    marginVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    paddingBottom: 5,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dropdownBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    // paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  dropdownInput: {
    fontSize: 15,
    color: '#333',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 15,
    color: '#444',
  },

});


export default SeperatePMApprovalStyle;