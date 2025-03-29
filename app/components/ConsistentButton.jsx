import React from "react";
import { Pressable } from "react-native";

function ConsistentButton({ onClick, style = {}, children } = props) {
    return (
        <Pressable onPress={onClick} style={style}>
            {children}
        </Pressable>
    );
}

export default ConsistentButton;
