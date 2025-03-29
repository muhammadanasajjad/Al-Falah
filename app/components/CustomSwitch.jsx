import React, { useState, useEffect, useRef } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    Animated,
    LayoutAnimation,
    Platform,
    UIManager,
} from "react-native";

if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

function hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `rgb(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(
              result[3],
              16
          )})`
        : null;
}

export function CustomSwitch({
    buttonWidth,
    buttonPadding,
    buttonColor,
    buttonBorderWidth,
    buttonBorderColor,
    buttonText,
    buttonTextStyle,
    buttonElevation,
    buttonElevationColor,
    switchWidth,
    switchBackgroundColor,
    switchBorderWidth,
    switchBorderColor,
    switchLeftText,
    switchLeftTextStyle,
    switchRightText,
    switchRightTextStyle,
    onSwitch,
    onSwitchReverse,
    onSwitchButtonText,
    onSwitchButtonTextStyle,
    onSwitchBackgroundColor,
    animationSpeed,
    defaultValue,
    disabled,
}) {
    const [value, setValue] = useState(defaultValue);

    const colorAnim = useRef(new Animated.Value(0)).current;
    const colorAnimInterpolation =
        onSwitchBackgroundColor &&
        useRef(
            colorAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [
                    switchBackgroundColor
                        ? hexToRgb(switchBackgroundColor)
                        : hexToRgb("#BBD8B3"),
                    hexToRgb(onSwitchBackgroundColor),
                ],
            })
        ).current;

    const layoutAnim = {
        Opacity: () =>
            LayoutAnimation.configureNext(
                LayoutAnimation.create(
                    animationSpeed
                        ? animationSpeed
                        : defaultValues.animationSpeed,
                    LayoutAnimation.Types.easeOut,
                    LayoutAnimation.Properties.opacity
                )
            ),
    };

    const changeToggle = () => {
        setValue(!value);
    };

    const changeColor = () => {
        if (value) {
            Animated.timing(colorAnim, {
                toValue: 1,
                duration: animationSpeed
                    ? animationSpeed
                    : defaultValues.animationSpeed,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(colorAnim, {
                toValue: 0,
                duration: animationSpeed
                    ? animationSpeed
                    : defaultValues.animationSpeed,
                useNativeDriver: false,
            }).start();
        }
    };

    useEffect(() => {
        if (value != null) {
            onSwitch(value);
        }
        if (onSwitchBackgroundColor) {
            changeColor();
        }
    }, [value]);

    const defaultValues = {
        button: {
            size: {
                width: 20,
                height: 20,
            },
            padding: 0,
            color: {
                backgroundColor: "#FFFFFF",
            },
        },
        switch: {
            size: {
                width: 50,
            },
            color: {
                backgroundColor: "#D4EDE1",
            },
        },
        animationSpeed: 150,
    };

    const buttonStyle = {
        height: buttonWidth
            ? buttonWidth
            : !buttonWidth && switchWidth
            ? switchWidth / 2
            : defaultValues.button.size.width,
        width: buttonWidth
            ? buttonWidth
            : !buttonWidth && switchWidth
            ? switchWidth / 2
            : defaultValues.button.size.width,
        backgroundColor: buttonColor
            ? buttonColor
            : defaultValues.button.color.backgroundColor,
        borderWidth: buttonBorderWidth ? buttonBorderWidth : 0,
        borderColor: buttonBorderColor ? buttonBorderColor : null,
        borderRadius: buttonWidth
            ? buttonWidth / 2
            : !buttonWidth && switchWidth
            ? switchWidth
            : defaultValues.button.size.width / 2,
        elevation: buttonElevation ? buttonElevation : 0,
        shadowColor: buttonElevationColor ? buttonElevationColor : "black",
    };

    const toggleStyle = {
        flexDirection: switchLeftText || switchRightText ? "row" : null,
        justifyContent: switchLeftText
            ? "space-between"
            : switchRightText && !switchLeftText
            ? value
                ? "flex-end"
                : "space-between"
            : null,
        alignItems:
            !switchLeftText && !switchRightText
                ? value
                    ? "flex-end"
                    : "flex-start"
                : "center",
        width:
            buttonWidth && !switchWidth
                ? buttonWidth * 2
                : buttonWidth >= switchWidth * 0.75
                ? buttonWidth * 1.1
                : switchWidth
                ? switchWidth
                : defaultValues.switch.size.width,
        backgroundColor: onSwitchBackgroundColor
            ? colorAnimInterpolation
            : switchBackgroundColor && !onSwitchBackgroundColor
            ? switchBackgroundColor
            : defaultValues.switch.color.backgroundColor,
        borderWidth: switchBorderWidth ? switchBorderWidth : 0,
        borderColor: switchBorderColor ? switchBorderColor : null,
        padding: buttonPadding ? buttonPadding : defaultValues.button.padding,
        borderRadius:
            buttonWidth && buttonPadding
                ? (buttonWidth + buttonPadding / 2) * 2
                : buttonWidth && !buttonPadding
                ? (buttonWidth + defaultValues.button.padding / 2) * 2
                : !buttonWidth && buttonPadding
                ? (defaultValues.button.size.width + buttonPadding / 2) * 2
                : switchWidth && !buttonWidth
                ? switchWidth * 2
                : (defaultValues.button.size.width +
                      defaultValues.button.padding / 2) *
                  2,
    };

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                !disabled ? (changeToggle(), layoutAnim.Opacity()) : null;
            }}
        >
            <Animated.View style={toggleStyle}>
                {switchLeftText && value && (
                    <View
                        style={{
                            width:
                                toggleStyle.width -
                                buttonStyle.width -
                                toggleStyle.padding * 2,
                        }}
                    >
                        <Text style={[styles.switchText, switchLeftTextStyle]}>
                            {switchLeftText}
                        </Text>
                    </View>
                )}
                <View style={[styles.button, buttonStyle]}>
                    {buttonText && onSwitchButtonText ? (
                        value ? (
                            <Text style={onSwitchButtonTextStyle}>
                                {onSwitchButtonText}
                            </Text>
                        ) : (
                            <Text style={buttonTextStyle}>{buttonText}</Text>
                        )
                    ) : onSwitchButtonText && !buttonText && value ? (
                        <Text style={onSwitchButtonTextStyle}>
                            {onSwitchButtonText}
                        </Text>
                    ) : buttonText ? (
                        <Text style={buttonTextStyle}>{buttonText}</Text>
                    ) : null}
                </View>
                {switchRightText && !value && (
                    <View
                        style={{
                            width:
                                toggleStyle.width -
                                buttonStyle.width -
                                toggleStyle.padding * 2,
                        }}
                    >
                        <Text style={[styles.switchText, switchRightTextStyle]}>
                            {switchRightText}
                        </Text>
                    </View>
                )}
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    button: {
        justifyContent: "center",
        alignItems: "center",
    },
    switchText: {
        textAlign: "center",
    },
});
