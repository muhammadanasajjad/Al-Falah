import { Slot, Stack, useFocusEffect } from "expo-router";
import React, { lazy, Suspense, useContext } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Colours from "../../utils/colours.json";
import { GlobalContext } from "../_layout";
import LoadingScreen from "../../components/LoadingScreen";

const Screen = lazy(
    () =>
        new Promise(
            (resolve) => setTimeout(() => resolve(import("./index")), 3000) // Add 3 second delay
        )
);

const Layout = () => {
    const [currentPage, setCurrentPage] = useContext(GlobalContext).slice(
        10,
        12
    );
    useFocusEffect(() => {
        setCurrentPage("read");
    });
    return (
        <Suspense fallback={<LoadingScreen />}>
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: styles.container,
                }}
            >
                <Stack.Screen name="read" options={{ headerShown: false }} />
                <Stack.Screen
                    name="[surahId]"
                    options={{ headerShown: false }}
                />
            </Stack>
        </Suspense>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colours.bgColour,
        flex: 1,
    },
    text: {
        color: Colours.fgColor,
        fontSize: 50,
    },
});

export default Layout;
