import React, { useEffect, useState } from "react";
import { StyleSheet, Switch, View } from "react-native";
import Colours from "../utils/colours.json";
import { CustomSwitch } from "./CustomSwitch";

const ConsistentSwitch = ({
    onValueChange = () => {},
    originalValue = false,
    style = {},
}) => {
    const [value, setValue] = useState(originalValue);

    useEffect(() => {
        setValue(originalValue);
    }, [originalValue]);

    return (
        <CustomSwitch
            onSwitch={(val) => {
                setValue(val);
                onValueChange(val);
            }}
            defaultValue={originalValue}
            switchWidth={55}
            buttonPadding={4}
            buttonWidth={22}
            buttonElevation={10}
            buttonElevationColor={Colours.bgColour}
            buttonColor={Colours.fgColor}
            onSwitchBackgroundColor={Colours.fgMainDark}
            switchBackgroundColor={Colours.fgColor}
        />
        // null
    );
};

const styles = StyleSheet.create({
    switch: { margin: 0, padding: 0, height: 25 },
});

export default ConsistentSwitch;
