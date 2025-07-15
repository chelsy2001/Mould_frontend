import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: { paddingBottom: 20, backgroundColor: '#f0f4f8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    padding: 20,
    justifyContent: 'space-between',
    elevation: 5,
    borderRadius: 20,
  },
  dateText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  shiftButton: {
    backgroundColor: '#007ACC',
    paddingHorizontal: 50,
    paddingVertical: 6,
    borderRadius: 10,
    elevation: 2,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  picker: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderRadius: 10,
    width: 150,
    padding: 4,
  },
  chartSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 16,
    flexWrap: 'wrap',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  chartPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004080',
  },
  chartTitle: {
    marginTop: 6,
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
  },
  headerBox: {
    backgroundColor: '#007ACC',
    color: 'white',
    padding: 10,
    borderRadius: 10,
    fontWeight: 'bold',
    minWidth: 250,
    textAlign: 'center',
  },

  assignBtn: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    elevation: 3,
    
  },

  section: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    backgroundColor: '#003366',
    color: 'white',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'flex-start',
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 6,
    width: 90,
    marginHorizontal: 9,
  },
  input2:{
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 6,
    width: "70%",
    marginHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
    // justifyContent: 'space-between',
  },
  detailsBtn: {
    backgroundColor: 'black',
    color: 'white',
    paddingVertical: 8,
    paddingHorizontal: 40,
    borderRadius: 10,
   // marginTop: 2,
    alignSelf: 'center',
    elevation: 3,
  },
  
});

export default styles;