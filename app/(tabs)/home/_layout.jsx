import { Slot, useFocusEffect } from "expo-router";
import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import Colours from "../../utils/colours.json";
import { GlobalContext } from "../_layout";

const Layout = () => {
    const [currentPage, setCurrentPage] = useContext(GlobalContext).slice(
        10,
        12
    );
    useFocusEffect(() => {
        setCurrentPage("home");
    });
    return (
        <View style={styles.container}>
            <Slot />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colours.bgColour,
        flex: 1,
    },
});

export default Layout;
