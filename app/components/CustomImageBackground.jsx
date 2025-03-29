import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const CustomImageBackground = ({
    source,
    style,
    imageStyle,
    children,
    resizeMode = "contain",
    overlayColors,
}) => {
    return (
        <View style={[styles.container, style]}>
            <Image
                source={source}
                style={[styles.image, imageStyle]}
                resizeMode={resizeMode}
            />
            {overlayColors && (
                <LinearGradient colors={overlayColors} style={styles.overlay} />
            )}
            <View style={styles.childrenContainer}>{children}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // overflow: "hidden",
        position: "relative",
    },
    image: {
        position: "static",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    childrenContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default CustomImageBackground;
