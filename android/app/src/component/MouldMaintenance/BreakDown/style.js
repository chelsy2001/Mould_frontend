import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from '../../Common/utils/scale'; // Adjust path

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaf3fb',
  },

  section: {
    backgroundColor: '#ffffff',
    borderRadius: moderateScale(16),
    padding: moderateScale(10),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(5) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(2),
    // elevation: 4,
  },

  dropdownsection: {
    backgroundColor: '#ffffff',
    borderRadius: moderateScale(12),
    padding: moderateScale(8),
    marginVertical: verticalScale(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
  },

  sectionTitle: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: 'black',
    marginBottom: verticalScale(8),
  },

  dropdown: {
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
  },

  inputGroup: {
    marginTop: verticalScale(5),
    gap: scale(24),
  },

  inputview: {
    flexDirection: 'row',
    gap: scale(16),
    alignItems: 'center',
  },

  input: {
    backgroundColor: '#f1f5f9',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: moderateScale(10),
    fontSize: moderateScale(12),
    color: '#101111ff',
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  label: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#2563eb',
    marginTop: verticalScale(2),
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: verticalScale(20),
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: verticalScale(12),
    width: '40%',
    justifyContent: 'center',
    borderRadius: moderateScale(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(4),
  },

  buttonIcon: {
    marginRight: scale(6),
  },

  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: moderateScale(14),
  },
});

export default styles;
