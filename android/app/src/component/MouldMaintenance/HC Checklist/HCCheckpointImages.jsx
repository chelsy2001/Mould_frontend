import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles from "./PMCheckPointImagesStyle";
import { BASE_URL } from "../../Common/config/config";

const HCCheckPointImages = () => {

    const navigation = useNavigation();
    const route = useRoute();

    const { mouldID, instance } = route.params || {};

    const [images, setImages] = useState([]);

   useEffect(() => {

  fetch(`${BASE_URL}SeperateHCApproval/get-checkpoint-images/${mouldID}/${instance}`)
    .then(res => res.json())
    .then(response => {
      if (response.status === 200) {
        setImages(response.data);
      }
    })
    .catch(err => console.log(err));

}, []);

   const renderItem = ({ item }) => (
  <View style={styles.imageBox}>
    <Image
      source={{ uri: `data:image/jpeg;base64,${item.image}` }}
      style={styles.image}
    />
  </View>
);

    return (
        <View style={styles.container}>

            <Text style={styles.title}>Checkpoint Images</Text>

            <FlatList
                data={images}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={4}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20, marginRight: 30 }}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

export default HCCheckPointImages;