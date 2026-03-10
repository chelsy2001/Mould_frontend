import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

container: {
flex: 1,
backgroundColor: '#f5f5f5',
padding: 20,
},

title: {
fontSize: 24,
fontWeight: 'bold',
marginBottom: 20,
},

imageBox: {
width: '23%',
aspectRatio: 1,
marginBottom: 15,
backgroundColor: '#e0e0e0',
justifyContent: 'center',
alignItems: 'center'
},

image: {
width: '100%',
height: '100%',
borderRadius: 8
},

button: {
backgroundColor: '#007bff',
paddingVertical: 10,
paddingHorizontal: 20,
borderRadius: 5,
},

buttonText: {
color: '#fff',
fontSize: 16,
}

});

export default styles;