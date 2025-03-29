import React, { useEffect, useRef } from "react";
import { Animated, Easing, Image, StyleSheet, View } from "react-native";

const LoadingScreen = ({ iconStyle = {} }) => {
    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 5000,
                useNativeDriver: true,
                easing: Easing.linear,
            })
        ).start();
    }, [rotation]);

    const rotateInterpolate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <View style={styles.container}>
            <View style={styles.iconLargeContainer}>
                <View style={[styles.iconContainer, iconStyle]}>
                    <Animated.Image
                        style={[
                            {
                                transform: [
                                    {
                                        translateY: iconStyle.margin
                                            ? -iconStyle.margin / 3
                                            : -5,
                                    },
                                    { scale: 0.9 },
                                ],
                            },
                            styles.image,
                        ]}
                        source={require("../../assets/img/kaabahLogoPart.png")}
                    />
                    <Animated.Image
                        style={[
                            styles.image,
                            { transform: [{ rotate: rotateInterpolate }] },
                        ]}
                        source={require("../../assets/img/outsideLogoPart.png")}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    iconLargeContainer: {
        backgroundColor: "white",
        borderRadius: 45,
    },
    iconContainer: {
        margin: 15,
        width: 100,
        height: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: "100%",
        height: "100%",
        position: "absolute",
    },
});

export default LoadingScreen;
