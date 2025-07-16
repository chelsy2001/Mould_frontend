import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e9f5', // Soft gray background
    padding: 16,
    justifyContent: 'center', // Centers content vertically
  },
  inputContainer: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    width:'88%',
    shadowColor: '#ffff',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
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
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  statusButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 4,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize:13
  },
  confirmButton: {
    backgroundColor: '#2980b9',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  confirmText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon:{
    paddingLeft:10,
  }
});
