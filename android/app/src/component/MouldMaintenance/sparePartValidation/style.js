// style.js
import { StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "../../Common/utils/scale";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
    paddingHorizontal: scale(10),
    paddingTop: verticalScale(10),
  },

  screenTitle: {
    fontSize: moderateScale(14),
    fontWeight: "700",
    color: "#003366",
    textAlign: "center",
    marginVertical: verticalScale(12),
    letterSpacing: 0.5,
  },

  label: {
    fontSize: moderateScale(11),
    fontWeight: "600",
    color: "#2F3E46",
    marginBottom: verticalScale(4),
    marginLeft: scale(4),
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: moderateScale(12),
    borderRadius: moderateScale(12),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: verticalScale(12),
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "#D0D9E6",
    paddingVertical: moderateScale(10),
    paddingHorizontal: scale(12),
    fontSize: moderateScale(11),
    color: "#333",
  },

  dropdown: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "#D0D9E6",
    paddingVertical: moderateScale(8),
    paddingHorizontal: scale(10),
  },

  infoBox: {
    backgroundColor: "#FFFFFF",
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: "#E2EAF6",
    marginBottom: verticalScale(10),
  },
  infoText: {
    color: "#003366",
    fontWeight: "700",
    fontSize: moderateScale(12),
  },

  tableCard: {
    backgroundColor: "#FFFFFF",
    padding: moderateScale(10),
    borderRadius: moderateScale(12),
    marginTop: verticalScale(6),
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: "#E8EEF8",
  },

  tableHeader: {
    fontSize: moderateScale(12),
    fontWeight: "700",
    color: "#1F3A93",
    marginBottom: verticalScale(8),
  },

  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(10),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(8),
  },

  tableRowActive: {
    backgroundColor: "#E7F7EA", // light green
    borderWidth: 1,
    borderColor: "#9EE4A6",
  },

  tableRowBlocked: {
    backgroundColor: "#F5F7FA", // light gray
    borderWidth: 1,
    borderColor: "#DFE8F5",
  },

  tableRowDepleted: {
    backgroundColor: "#FFF5F5", // very light red/pink to indicate depleted
    borderWidth: 1,
    borderColor: "#F3C6C6",
  },

  tableCellWrap: {
    flex: 1,
  },

  tableCellTitle: {
    fontSize: moderateScale(12),
    fontWeight: "700",
    color: "#22324A",
  },

  tableCellSub: {
    fontSize: moderateScale(12),
    color: "#050505ff",
    marginTop: verticalScale(4),
  },

  tableInput: {
    width: scale(80),
    textAlign: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: "#DDE7F7",
    paddingVertical: moderateScale(8),
    paddingHorizontal: scale(8),
    fontSize: moderateScale(11),
  },

  fifoNote: {
    fontSize: moderateScale(10),
    color: "#6B7A90",
    marginTop: verticalScale(6),
    fontStyle: "italic",
  },

  confirmButton: {
    backgroundColor: "#003D80",
    paddingVertical: moderateScale(14),
    borderRadius: moderateScale(12),
    alignItems: "center",
    marginTop: verticalScale(20),
    marginHorizontal: scale(20),
    shadowColor: "#003366",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },

  confirmText: {
    color: "#FFFFFF",
    fontSize: moderateScale(12),
    fontWeight: "700",
    letterSpacing: 0.6,
  },
});

export default styles;
