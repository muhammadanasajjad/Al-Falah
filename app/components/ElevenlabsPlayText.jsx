import React, { useEffect, useRef } from "react";
import { Text, TouchableOpacity } from "react-native";
import { StyleSheet, View } from "react-native";
import WebView from "react-native-webview";
import { getIcon } from "../utils/icon";
import Colours from "../utils/colours.json";

const ElevenlabsPlayText = ({
    text = "تحويل حروف عربية إلى أمثلة",
    button = getIcon("Ionicons", "volume-high", 30, Colours.fgGrey),
} = props) => {
    const setText = (textToSay) => `
    (() => {
        // Wait for the page to fully load
        // Get the textarea element
        const textarea = document.getElementsByTagName("textarea")[0];
    
        // Set the desired text
        const textToSet = "${textToSay}";
    
        // Simulate typing to update React's internal state
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
        nativeInputValueSetter.call(textarea, textToSet);
    
        // Dispatch React's onChange event to update the component's state
        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);
    })()
    `;

    const pressPlay = () => `
    (() => {
        // Find and click the play button
        let button = document.getElementsByTagName("button")[34];
        if (button) {
            button.click();
        }
    })()
        `;

    const webViewRef = useRef();

    useEffect(() => {
        if (webViewRef.current) {
            webViewRef.current.injectJavaScript(setText(text));
        }
    }, [text]);

    const runInjectedJS = () => {
        if (webViewRef.current) {
            webViewRef.current.injectJavaScript(pressPlay());
        }
    };

    return (
        <View>
            <WebView
                ref={webViewRef}
                style={{ width: "100%", height: 900, display: "none" }}
                originWhitelist={["*"]}
                source={{ uri: "https://elevenlabs.io" }}
                injectedJavaScript={setText(text)}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                mediaPlaybackRequiresUserAction={false}
            />
            <TouchableOpacity onPress={runInjectedJS}>
                {button}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({});

export default ElevenlabsPlayText;
