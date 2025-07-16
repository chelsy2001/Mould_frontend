
import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e9f5', // Soft gray background
    padding: 16,
    justifyContent: 'center', // Centers content vertically
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: '50%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.40,
    shadowRadius: 10,
    elevation: 10,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },

  modalSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },

  button: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
    elevation: 2,
  },

  breakdownButton: {
    backgroundColor: '#e74c3c',
  },

  notInUseButton: {
    backgroundColor: '#f1c40f',
  },

  normalButton: {
    backgroundColor: '#2ecc71',
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  closeButton: {
    marginTop: 10,
    alignSelf: 'center',
    alignItems:'center',
     backgroundColor:'lightgrey',
     width:'20%',
     elevation:10
  },

  closeButtonText: {
    color: '#2980b9',
    fontSize: 20,
    fontWeight: '600',
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


  export default styles;