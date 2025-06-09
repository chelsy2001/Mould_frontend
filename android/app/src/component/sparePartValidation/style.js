// style.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#003366',
    textAlign: 'center',
    marginVertical: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
    marginLeft: 4,
  },

  inputContainer: {
    flex: 1,
    marginBottom: 16,
    paddingHorizontal: 4,
  },

  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#b3c6ff',
    paddingVertical: 12,
    // paddingHorizontal: 16,
    fontSize: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  currentqty: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ccc',
    paddingVertical: 12,
    // paddingHorizontal: 16,
    textAlign: 'center',
    fontWeight: '700',
    color: '#003366',
    fontSize: 16,
    elevation: 1,
  },

  dropdown: {
    marginVertical: 10,
    backgroundColor:'#ffffff',
    borderRadius: 12,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  confirmButton: {
    backgroundColor: '#004d99',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: 20,
    shadowColor: '#003366',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },

  confirmText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default styles;
