import React, { useContext, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SuperContext } from "../_layout";
import prayerMethods from "../utils/prayerMethods.json";
import Colours from "../utils/colours.json";
import { CalculationMethod } from "adhan";

const Index = () => {
    const settings = useContext(SuperContext)[0];
    const setCertainSettings = useContext(SuperContext)[1];
    const [currentCalcMethod, setCurrentCalcMethod] = useState(
        settings.prayerTimes.calculationMethod.val
    );
    return (
        <>
            {/* <View
                style={[
                    styles.settingsContainer,
                    { justifyContent: "flex-start" },
                ]}
            >
                <Pressable
                        onPress={() => {
                            // setSettingsOpen(!settingsOpen);
                        }}
                    >
                        {getIcon("Ionicons", "chevron-back", 25, "white")}
                    </Pressable>
                <Text style={[styles.settingsText, { marginLeft: 10 }]}>
                    Select a calculation method
                </Text>
            </View> */}
            <FlatList
                style={styles.mainContent}
                contentContainerStyle={{ padding: 20 }}
                data={
                    getPrayerMethodsObjects(currentCalcMethod, (val) => {
                        setCurrentCalcMethod(val);
                        setCertainSettings(
                            "prayerTimes",
                            "calculationMethod",
                            val
                        );
                    }).data
                }
                renderItem={({ item, index }) => {
                    return item;
                }}
            />
        </>
    );
};

const styles = StyleSheet.create({
    settingsContainer: {
        marginHorizontal: 15,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    settingsText: {
        color: "white",
        fontSize: 20,
    },
    prayerMethodContainer: {
        // borderColor: Colours.fgGrey,
        // borderWidth: 3,
        padding: 15,
        borderRadius: 5,
        marginBottom: 15,
        overflow: "hidden",
    },
    prayerMethodName: {
        color: "white",
        fontSize: 25,
    },
    prayerMethodDetails: {
        color: "white",
    },
});

function getPrayerMethodsObjects(calcMethod, setCalcMethod) {
    let index = -1;
    let arr = [];
    let keys = Object.keys(CalculationMethod);

    for (let i = 0; i < keys.length; i++) {
        if (calcMethod == keys[i]) {
            index = i;
        }
        if (keys[i] == "Other") break;
        arr.push(
            <Pressable
                onPress={() => {
                    setCalcMethod(keys[i]);
                }}
            >
                <View
                    style={[
                        styles.prayerMethodContainer,
                        calcMethod == keys[i]
                            ? {
                                  backgroundColor: Colours.fgDark,
                                  //   borderWidth: 0,
                              }
                            : {},
                    ]}
                >
                    <Text style={[styles.prayerMethodName]}>
                        {addSpaceBeforeUppercase(keys[i])}
                    </Text>
                    <Text style={styles.prayerMethodDetails}>
                        {"Fajr: " +
                            CalculationMethod[keys[i]]().fajrAngle +
                            "°" +
                            "   "}
                        {"Isha: " +
                            CalculationMethod[keys[i]]().ishaAngle +
                            "°" +
                            "   "}
                        {CalculationMethod[keys[i]]().maghribAngle != 0
                            ? "Maghrib: " +
                              CalculationMethod[keys[i]]().maghribAngle +
                              "m" +
                              "   "
                            : ""}
                        {/* {"Isha: " +
                            prayerMethods[keys[i]].params.isha +
                            (typeof prayerMethods[keys[i]].params.isha ==
                            "number"
                                ? "°"
                                : "") +
                            "   "}
                        {prayerMethods[keys[i]].params.maghrib != "0 min" &&
                            "Maghrib: " +
                                prayerMethods[keys[i]].params.maghrib +
                                "   "} */}
                    </Text>
                </View>
            </Pressable>
        );
    }

    return { data: arr, index: index };
}

function addSpaceBeforeUppercase(str) {
    // Use a regular expression to find uppercase letters and add a space before them
    return str.replace(/([A-Z])/g, " $1").trim();
}

export default Index;
