import React from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    Platform,
    StatusBar,
    View,
    Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colours from "../utils/colours.json";
import { getIcon } from "../utils/icon";
import { router } from "expo-router";

function MainBar({
    icon = { reference: "Ionicons", name: "home" },
    title,
    showSettings = true,
} = props) {
    StatusBar.setHidden(false);
    StatusBar.setBackgroundColor(Colours.bgColour);
    StatusBar.setBarStyle("light-content");

    return (
        <SafeAreaView style={styles.largeContainer}>
            <View style={styles.container}>
                <View style={styles.smallContainer}>
                    {icon != null &&
                        getIcon(
                            icon.reference,
                            icon.name,
                            35,
                            Colours.fgMainDark
                        )}
                    <Text style={styles.text}>{title}</Text>
                </View>
                {showSettings && (
                    <Pressable
                        onPress={() => {
                            router.push("Settings");
                        }}
                    >
                        {getIcon(
                            "Ionicons",
                            "settings-sharp",
                            32,
                            Colours.fgGrey
                        )}
                    </Pressable>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    largeContainer: {
        backgroundColor: Colours.bgColour,
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    container: {
        padding: 25,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        // backgroundColor: Colours.fgGrey,
    },
    smallContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    text: {
        fontSize: 30,
        fontWeight: "bold",
        fontFamily: "sans-serif",
        color: Colours.fgColor,
        marginLeft: 15,
    },
});

export default MainBar;
