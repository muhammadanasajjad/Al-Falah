import React, { useContext, useEffect, useRef, useState } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    FlatList,
    ImageBackground,
    Pressable,
    Platform,
    Dimensions,
} from "react-native";
import {
    getPrayerTimes,
    formatTime,
    getApproximateLocation,
} from "../../utils/PrayTimes";

import Colours from "../../utils/colours.json";
import prayerMethods from "../../utils/prayerMethods.json";
import { getIcon } from "../../utils/icon";
import { LinearGradient } from "expo-linear-gradient";
import { SuperContext } from "../../_layout";
import { getSettingsAsync } from "../../utils/settings";
import { BlurView } from "expo-blur";
import ConsistentButton from "../../components/ConsistentButton";
import {
    getLastLocationAsync,
    updateLastLocationAsync,
} from "../../utils/prevLocation";

export let prayerMapBottomColor = {
    fajr: "#000910",
    sunrise: "#011a16",
    dhuhr: "#245168",
    asr: "#2b416e",
    maghrib: "#170515",
    isha: "#010508",
};
export let gradientPrayerMap = {
    fajr: ["#142e32", "#1e3837", "#345246"],
    sunrise: ["#2e574e", "#94814b", "#edc448"],
    dhuhr: ["#46acda", "#6ec1e1", "#a9e0eb"], //["#1d569a", "#4a9dd5", "#cfe7ee"],
    asr: ["#7c77cb", "#9997c3", "#b3c9f6"],
    maghrib: ["#b55138", "#e68b3b", "#f7c553"], //6746fb
    isha: ["#03111c", "#030f1b", "#0c1a23"],
};
export let prayerTimesBackgroundImages = {
    fajr: require("../../../assets/img/prayerMasjidsFajr.png"),
    sunrise: require("../../../assets/img/prayerMasjidsSunrise.png"),
    dhuhr: require("../../../assets/img/prayerMasjidsDhuhr.png"),
    asr: require("../../../assets/img/prayerMasjidsAsr.png"),
    maghrib: require("../../../assets/img/prayerMasjidsMaghrib.png"),
    isha: require("../../../assets/img/prayerMasjidsIsha.png"),
};
let nextPrayerMap = {
    fajr: "sunrise",
    sunrise: "dhuhr",
    dhuhr: "asr",
    asr: "maghrib",
    maghrib: "isha",
    isha: "fajr",
};
let currentPrayerMap = {
    fajr: 0,
    sunrise: 1,
    dhuhr: 2,
    asr: 3,
    maghrib: 4,
    isha: 5,
};
let prayerList = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

function PrayerTimes({} = props) {
    // const [settingsOpen, setSettingsOpen] = useState(false);
    const settings = useContext(SuperContext)[0];
    const [location, setLocation] = useState({
        isDefault: true,
        status: "success",
        country: "United Kingdom",
        countryCode: "GB",
        region: "ENG",
        regionName: "England",
        city: "Reading",
        zip: "RG1",
        lat: 51.4566,
        lon: -0.968,
        timezone: "Europe/London",
    });
    useEffect(() => {
        if (location.isDefault && !location.isPrevious) {
            getLastLocationAsync().then((tempLocation) => {
                if (tempLocation) {
                    tempLocation.isPrevious = true;
                    console.log("LAST LOCATION: ", tempLocation);
                    setLocation(tempLocation);
                }
            });
        }
        if (location.isDefault || location.isPrevious) {
            getApproximateLocation().then((tempLocation) => {
                if (tempLocation) {
                    setLocation(tempLocation);
                    updateLastLocationAsync(tempLocation);
                }
            });
        }
    }, [location]);

    const [calcMethod, setCalcMethod] = useState(
        settings.prayerTimes.calculationMethod.val
    );

    useEffect(() => {
        setCalcMethod(settings.prayerTimes.calculationMethod.val);
        // console.log(settings.prayerTimes.calculationMethod.val);
    }, [settings.prayerTimes.calculationMethod.val]);

    let {
        data: timesObjects,
        prayer: currentPrayerIndex,
        prayerTimes: prayerTimes,
    } = getPrayerTimeObjects(calcMethod, location);
    // const currentPrayerIndex = "asr";
    // const [currentPrayerIndex, setCurrentPrayerIndex] = useState(
    //     tempPrayerIndex
    // )

    const [blurMethodAndroid, setBlurMethodAndroid] = useState("none");

    const handleBlurViewLayout = ({ nativeEvent }) => {
        setBlurMethodAndroid("dimezisBlurView");
    };

    const getTimeUntilNextPrayer = () => {
        let now = new Date();
        let nextPrayer = nextPrayerMap[currentPrayerIndex];
        let startDate = prayerTimes[nextPrayer];

        let date = new Date(startDate - now);

        if (date < 0) date.setDate(date.getDate() + 1);
        return (
            (date.getUTCHours() > 0 ? date.getUTCHours() + "h " : "") +
            (date.getUTCMinutes() > 0 ? date.getUTCMinutes() + "m" : "")
        );
    };

    return (
        <View style={styles.mainContent}>
            <>
                {/* <View style={styles.settingsContainer}>
                        <Text style={styles.settingsText}>
                            Calculation Method: {calcMethod}
                        </Text>
                        <Pressable
                            onPress={() => {
                                setSettingsOpen(!settingsOpen);
                            }}
                        >
                            {getIcon("Ionicons", "settings-sharp", 25, "white")}
                        </Pressable>
                    </View> */}
                <FlatList
                    ListHeaderComponent={
                        <>
                            <LinearGradient
                                start={{ x: 0.5, y: 0.0 }}
                                end={{ x: 0.5, y: 0.65 }}
                                colors={gradientPrayerMap[currentPrayerIndex]}
                            >
                                <ImageBackground
                                    source={
                                        prayerTimesBackgroundImages[
                                            currentPrayerIndex
                                        ]
                                    }
                                    resizeMode="cover"
                                    // imageStyle={{
                                    //     resizeMode: "cover",
                                    // }}
                                    style={{
                                        height:
                                            Dimensions.get("window").height *
                                            0.6,
                                        overflow: "visible",
                                    }}
                                >
                                    <View style={styles.currentPrayerContainer}>
                                        <View style={styles.prayerTimeLocation}>
                                            {getIcon(
                                                "Ionicons",
                                                "location-sharp",
                                                20,
                                                Colours.fgMainDark
                                            )}
                                            <Text
                                                style={
                                                    styles.prayerTimeLocationText
                                                }
                                            >
                                                {location.city +
                                                    ", " +
                                                    location.country}
                                            </Text>
                                        </View>
                                        <Text style={styles.currentPrayer}>
                                            {capitalizeFirstLetters(
                                                currentPrayerIndex
                                            )}
                                        </Text>
                                        <View style={styles.currentPrayerTime}>
                                            <Text
                                                style={
                                                    styles.currentPrayerTimeText
                                                }
                                            >
                                                {formatTime(
                                                    prayerTimes[
                                                        currentPrayerIndex
                                                    ]
                                                ) + " "}
                                            </Text>
                                            {getIcon(
                                                "Ionicons",
                                                "chevron-forward",
                                                18
                                            )}
                                            <Text
                                                style={
                                                    styles.currentPrayerTimeText
                                                }
                                            >
                                                {" " +
                                                    formatTime(
                                                        prayerTimes[
                                                            prayerList[
                                                                (currentPrayerMap[
                                                                    currentPrayerIndex
                                                                ] +
                                                                    1) %
                                                                    prayerList.length
                                                            ]
                                                        ]
                                                    )}
                                            </Text>
                                        </View>
                                    </View>
                                </ImageBackground>
                                {Platform.OS != "android" ? (
                                    <BlurView
                                        blurReductionFactor={7}
                                        tint={"prominent"}
                                        intensity={15}
                                        style={styles.prayerTimeFooter}
                                    >
                                        <View
                                            style={[
                                                styles.prayerTimeFooterSmallContainer,
                                            ]}
                                        >
                                            {getIcon(
                                                "Ionicons",
                                                "time-outline",
                                                20
                                            )}
                                            <Text
                                                style={
                                                    styles.prayerTimeFooterText
                                                }
                                            >
                                                {getTimeUntilNextPrayer()} until{" "}
                                                {capitalizeFirstLetters(
                                                    currentPrayerIndex
                                                )}
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                styles.prayerTimeFooterSmallContainer,
                                                { justifyContent: "flex-end" },
                                            ]}
                                        >
                                            {/* <ConsistentButton
                                            style={styles.prayerTimeButton}
                                        >
                                            {getIcon(
                                                "Ionicons",
                                                "checkmark",
                                                20
                                            )}
                                        </ConsistentButton> */}
                                        </View>
                                    </BlurView>
                                ) : (
                                    <View
                                        style={[
                                            styles.prayerTimeFooter,
                                            { backgroundColor: "#ffffff11" },
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.prayerTimeFooterSmallContainer,
                                            ]}
                                        >
                                            {getIcon(
                                                "Ionicons",
                                                "time-outline",
                                                20
                                            )}
                                            <Text
                                                style={
                                                    styles.prayerTimeFooterText
                                                }
                                            >
                                                {getTimeUntilNextPrayer()} until{" "}
                                                {capitalizeFirstLetters(
                                                    currentPrayerIndex
                                                )}
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                styles.prayerTimeFooterSmallContainer,
                                                { justifyContent: "flex-end" },
                                            ]}
                                        >
                                            {/* <ConsistentButton
                                            style={styles.prayerTimeButton}
                                        >
                                            {getIcon(
                                                "Ionicons",
                                                "checkmark",
                                                20
                                            )}
                                        </ConsistentButton> */}
                                        </View>
                                    </View>
                                )}
                                <BlurView
                                    experimentalBlurMethod={blurMethodAndroid}
                                    blurReductionFactor={7}
                                    onLayout={handleBlurViewLayout}
                                    tint={"prominent"}
                                    intensity={15}
                                    style={styles.prayerTimeFooter}
                                ></BlurView>
                            </LinearGradient>
                        </>
                    }
                    style={styles.mainContent}
                    data={timesObjects}
                    renderItem={({ item, index }) => {
                        return item;
                    }}
                />
            </>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContent: {
        flex: 1,
    },
    prayerTimeLocation: {
        marginHorizontal: "auto",
        backgroundColor: Colours.bgColour,
        borderRadius: 100,
        paddingHorizontal: 4,
        paddingLeft: 8,
        paddingVertical: 6,
        flexDirection: "row",
        alignItems: "center",
    },
    prayerTimeLocationText: {
        color: Colours.fgColor,
        fontSize: 14,
        marginLeft: 2,
        marginRight: 8,
    },
    prayerTimeFooter: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        borderTopColor: Colours.fgColor + "55",
    },
    prayerTimeFooterSmallContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    prayerTimeButton: {
        backgroundColor: Colours.fgMainDark,
        borderRadius: 100,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    prayerTimeFooterText: {
        color: Colours.fgColor,
        marginLeft: 5,
        fontSize: 14,
    },
    prayerTimeContainer: {
        padding: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    name: {
        color: "white",
        fontSize: 35,
    },
    time: {
        color: "white",
        fontSize: 20,
        fontWeight: "100",
    },
    nameArabic: {
        color: "white",
        fontFamily: "Indo-Pak",
        fontSize: 45,
    },
    smallImageGradient: {
        height: 85,
        width: "40%",
        borderRadius: 5,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        borderColor: Colours.fgGrey + "55",
        borderWidth: 1,
    },
    currentPrayerContainer: {
        margin: 25,
    },
    currentPrayer: {
        fontSize: 35,
        fontWeight: "bold",
        color: Colours.fgColor,
    },
    currentPrayerTime: {
        flexDirection: "row",
        alignItems: "center",
    },
    currentPrayerTimeText: {
        fontSize: 20,
        color: Colours.fgColor,
    },
    end: {
        // marginBottom: 0,
    },
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
        // borderRadius: 5,
        marginBottom: 15,
    },
    prayerMethodName: {
        color: "white",
        fontSize: 25,
    },
    prayerMethodDetails: {
        color: "white",
    },
});

function getPrayerTimeObjects(method, location) {
    const prayerTimes = getPrayerTimes(
        new Date(),
        method,
        ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"],
        location
    );
    // console.log(prayerTimes);
    // console.log(prayerTimes);

    let arr = [null, null, null, null, null, null];
    let indexMap = {
        5: "isha",
        4: "maghrib",
        3: "asr",
        2: "dhuhr",
        1: "sunrise",
        0: "fajr",
    };
    let alreadyPassed = false;
    let currentPrayer = "";

    for (let i = arr.length - 1; i >= 0; i--) {
        let prayer = indexMap[i];
        let time = prayerTimes[prayer];
        // console.log(prayer, time);
        if (new Date() > time && !alreadyPassed) {
            currentPrayer = prayer;
            alreadyPassed = true;
        }
    }

    currentPrayer = currentPrayer == "" ? indexMap["5"] : currentPrayer;

    for (let i = arr.length - 1; i >= 0; i--) {
        let prayer = indexMap[i];
        let time = prayerTimes[prayer];
        if (prayer == currentPrayer) {
            // arr[i] = (
            //     <View
            //         style={{
            //             overflow: "hidden",
            //             borderRadius: 5,
            //             padding: 0,
            //             margin: 0,
            //             marginBottom: 15,
            //         }}
            //     >
            //         <ImageBackground
            //             source={
            //                 Platform.OS == "web"
            //                     ? { uri: `../../../assets/img/${prayer}.png` }
            //                     : images[prayer]
            //             }
            //         >
            //             <View
            //                 style={[
            //                     styles.prayerTimeContainer,
            //                     {
            //                         margin: 0,
            //                         padding: 0,
            //                         borderWidth: 0,
            //                         height: 200,
            //                     },
            //                     i == arr.length - 1 ? styles.end : {},
            //                 ]}
            //             >
            //                 <View
            //                     style={[
            //                         {
            //                             backgroundColor: Colours.fgDark,
            //                             margin: 0,
            //                             padding: 10,
            //                             paddingHorizontal: 15,
            //                             justifyContent: "center",
            //                             height: "100%",
            //                         },
            //                     ]}
            //                 >
            //                     <Text style={[styles.name]}>
            //                         {capitalizeFirstLetters(prayer)}
            //                     </Text>
            //                     <Text style={[styles.time]}>{time}</Text>
            //                 </View>
            //             </View>
            //         </ImageBackground>
            //     </View>
            // );
        } else {
            // arr[i] = (
            //     <View
            //         style={[
            //             styles.prayerTimeContainer,
            //             i == arr.length - 1 ? styles.end : {},
            //         ]}
            //     >
            //         <View>
            //             <Text style={styles.name}>
            //                 {capitalizeFirstLetters(prayer)}
            //             </Text>
            //             <Text style={styles.time}>{time}</Text>
            //         </View>
            //         <Image
            //             source={
            //                 Platform.OS == "web"
            //                     ? { uri: `../../../assets/img/${prayer}.png` }
            //                     : images[prayer]
            //             }
            //             style={styles.image}
            //         />
            //     </View>
            // );
        }
        arr[i] = (
            <View
                style={[
                    styles.prayerTimeContainer,
                    i == arr.length - 1 ? styles.end : {},
                ]}
            >
                <View>
                    <Text
                        style={[
                            styles.name,
                            {
                                color:
                                    prayer == currentPrayer
                                        ? Colours.fgMainDark
                                        : Colours.fgColor,
                            },
                        ]}
                    >
                        {capitalizeFirstLetters(prayer)}
                    </Text>
                    <Text style={styles.time}>{formatTime(time)}</Text>
                </View>
                <LinearGradient
                    start={{ x: 0.5, y: 0.0 }}
                    end={{ x: 0.5, y: 1.0 }}
                    style={styles.smallImageGradient}
                    colors={gradientPrayerMap[prayer]}
                >
                    <Image
                        style={{ width: "100%", height: "100%" }}
                        source={prayerTimesBackgroundImages[prayer]}
                        resizeMode={"cover"}
                    />
                </LinearGradient>
            </View>
        );
    }

    return { data: arr, prayer: currentPrayer, prayerTimes };
}

function capitalizeFirstLetters(str) {
    return str
        .split(" ") // Split the string into an array of words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
        .join(" "); // Join the words back into a single string
}

export default PrayerTimes;
