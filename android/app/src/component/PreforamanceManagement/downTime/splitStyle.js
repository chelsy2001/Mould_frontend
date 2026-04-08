import { StyleSheet } from "react-native";
import { scale, verticalScale } from "../../Common/utils/scale";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fb",
    padding: scale(10),
  },

  title: {
    fontSize: scale(18),
    fontWeight: "bold",
    marginBottom: verticalScale(10),
    textAlign: "center",
  },

  card: {
    backgroundColor: "#fff",
    padding: scale(12),
    borderRadius: 10,
    marginBottom: verticalScale(12),
    elevation: 3,
  },

  cardTitle: {
    fontSize: scale(14),
    fontWeight: "bold",
    marginBottom: verticalScale(8),
    color: "#1e3a8a",
  },

  label: {
    fontSize: scale(12),
    marginTop: verticalScale(6),
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: scale(8),
    marginTop: 4,
    fontSize: scale(12),
    backgroundColor: "#fafafa",
  },

  splitBtn: {
    backgroundColor: "#1e3a8a",
    padding: scale(12),
    borderRadius: 8,
    alignItems: "center",
    marginTop: verticalScale(10),
  },

  btnText: {
    color: "#fff",
    fontSize: scale(14),
    fontWeight: "bold",
  },
}); 