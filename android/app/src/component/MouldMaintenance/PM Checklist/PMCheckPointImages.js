import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles from "./PMCheckPointImagesStyle";
import { BASE_URL } from "../../Common/config/config";

const PMCheckPointImages = () => {

    const navigation = useNavigation();
    const route = useRoute();

    const { mouldID, instance } = route.params || {};

    const [images, setImages] = useState([]);

   useEffect(() => {
  if (!mouldID || !instance) {
    console.log('PMCheckPointImages: missing mouldID or instance', { mouldID, instance });
    return;
  }

  const url = `${BASE_URL}/SeperatePMApproval/get-checkpoint-images/${mouldID}/${instance}`;
  console.log('PMCheckPointImages: fetching', url);

  fetch(url)
    .then(res => res.json())
    .then(response => {
      console.log('PMCheckPointImages: raw response', response);

      // Support different possible shapes
      let imgs = [];
      if (Array.isArray(response)) {
        imgs = response;
      } else if (Array.isArray(response.data)) {
        imgs = response.data;
      }

      if (imgs.length) {
        setImages(imgs);
      } else {
        console.log('PMCheckPointImages: no images in response');
        setImages([]);
      }
    })
    .catch(err => {
      console.log('PMCheckPointImages: fetch/json error', err);
      setImages([]);
    });

}, [mouldID, instance]);

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

export default PMCheckPointImages;