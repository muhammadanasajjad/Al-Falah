import React, { useState } from "react";
import { View, StyleSheet, Text, Button, Pressable } from "react-native";
import AlbumText from "./AlbumText";
import AlbumBackground from "./AlbumBackground";

function Album({} = props) {
    const [textBackground, setTextBackground] = useState(true);
    const [switchBackground, setSwitchBackground] = useState(false);

    const handleSketchSelected = (data) => {
        setTextBackground(data.textBackground);
    };

    const handleHold = () => {
        setSwitchBackground(true);
    };

    const handleDoubleLeftTap = () => {
        console.log("left");
    };

    const handleDoubleRightTap = () => {
        console.log("right");
    };

    return (
        <View style={styles.container}>
            <AlbumBackground
                onSketchSelected={handleSketchSelected}
                switchBackground={switchBackground}
                setSwitchBackground={() => {}}
            />
            <AlbumText
                textBackground={textBackground}
                onHold={handleHold}
                onDoubleLeftTap={handleDoubleLeftTap}
                onDoubleRightTap={handleDoubleRightTap}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        width: "100%",
        backgroundColor: "transparent",
    },
});

export default Album;
