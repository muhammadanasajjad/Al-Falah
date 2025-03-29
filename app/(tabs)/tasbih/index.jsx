import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Animated,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
    ImageBackground,
} from "react-native";
import Colours from "../../utils/colours.json";
import { Audio } from "expo-av";
import { SuperContext } from "../../_layout";

const Index = () => {
    const [counter, setCounter] = useState(0);
    const [sound, setSound] = useState();
    const setCertainStat = useContext(SuperContext)[7];

    async function playSound() {
        if (sound) await sound.replayAsync();
        else {
            const { sound: tempSound } = await Audio.Sound.createAsync(
                require("../../../assets/sounds/click.mp3")
            );
            setSound(tempSound);
            await tempSound.playAsync();
        }
    }

    // useEffect(() => {
    //     return sound
    //         ? () => {
    //               console.log("Unloading Sound");
    //               sound.unloadAsync();
    //           }
    //         : undefined;
    // }, [sound]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Count your{"\n"}Tasbih!</Text>
            <Text style={styles.counter}>
                {(counter + "").padStart(3, "0")}
            </Text>
            <SqueezableButton
                onClick={() => {
                    setCounter(counter + 1);
                    playSound();
                    setCertainStat("tasbihCount", 1);
                }}
                style={styles.button}
            />
        </View>
    );
};

const SqueezableButton = ({ onClick, style } = props) => {
    const scaleValue = useRef(new Animated.Value(1)).current;
    const w = 170;
    const mult = 0.8;

    const onPressIn = () => {
        Animated.spring(scaleValue, {
            toValue: mult,
            useNativeDriver: true,
            speed: 100,
            bounciness: 10,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
            speed: 100,
            bounciness: 10,
        }).start();
    };

    const bgImage = require("../../../assets/img/squeesableButtonBackground.png");

    return (
        <Pressable
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={onClick}
        >
            <ImageBackground
                source={bgImage}
                style={[
                    styles.squeezableBackground,
                    { width: w / mult, height: w / mult },
                ]}
                imageStyle={{ opacity: 0.5 }}
            >
                <Animated.View
                    style={[
                        style,
                        { width: w, height: w },
                        { transform: [{ scale: scaleValue }] },
                    ]}
                />
            </ImageBackground>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 36,
        textAlign: "center",
        fontWeight: "bold",
        color: Colours.fgColor,
    },
    counter: {
        fontFamily: "new-amsterdam",
        fontSize: 128,
        lineHeight: 128 * (Platform.OS == "web" ? 0.75 : 1.0),
        color: Colours.fgColor,
        marginTop: 35,
        marginBottom: 65,
    },
    button: {
        borderRadius: 85,
        backgroundColor: Colours.fgMainDark,
        // shadowColor: Colours.fgMainDark,
        // shadowOffset: {
        //     width: 0,
        //     height: 0,
        // },
        // shadowRadius: 35,
    },
    squeezableBackground: {
        // position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        // borderRadius: 85,
    },
});

export default Index;
