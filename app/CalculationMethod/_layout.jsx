import { Slot } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import Colours from "../utils/colours.json";
import MainBar from "../components/MainBar";

const Layout = () => {
    return (
        <View style={styles.container}>
            <MainBar
                title={"Calculation Method"}
                icon={{ reference: "Ionicons", name: "calculator" }}
                showSettings={false}
            />
            <Slot />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colours.bgColour,
        flex: 1,
        // padding: 20,
    },
    smallContainer: {
        padding: 20,
    },
});

export default Layout;
