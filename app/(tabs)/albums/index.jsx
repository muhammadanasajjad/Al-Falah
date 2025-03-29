import React from "react";
import { StyleSheet, View } from "react-native";
import Album from "../../Albums/components/Album";
import Swiper from "react-native-swiper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Colours from "../../utils/colours.json";

function Albums({} = props) {
    return (
        <GestureHandlerRootView>
            <View style={styles.container}>
                <Album />
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colours.bgColour,
    },
});

export default Albums;
