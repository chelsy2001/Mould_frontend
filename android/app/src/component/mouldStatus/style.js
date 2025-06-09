import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f0f4f8',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    // marginBottom: 5,
  },
  dataRow: {
    flexDirection: 'row',
    // justifyContent: 'flex-start',
    // alignItems: 'center',
    // marginVertical: 6,
  },
  text: {
    fontSize: 16,
    color: '#333',
    gap:20,
    // paddingVertical: 2,
  },
  text1: {
    fontSize: 14,
    fontWeight: '500',
    // paddingVertical: 2,
  },
  inputContainer: {
    marginVertical: 2,
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
  input: {
    backgroundColor: '#fff',
    padding: 8,
    margin: 10,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
    elevation: 1,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    margin: 10,
    padding: 8,
  },
  dropdownText: {
    fontSize: 16,
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
  confirmButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 14,
  },
  confirmText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  separator: {
    height: 1,
    backgroundColor: '#d1d5db',
    alignSelf: 'stretch',
    marginVertical: 1,
    opacity: 0.6,
  },
});

export default styles;
