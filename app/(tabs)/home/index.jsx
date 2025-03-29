import React, { useContext, useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    Text,
    Platform,
    Dimensions,
    ScrollView,
    Image,
} from "react-native";
import { saveRecitation } from "../../utils/saveRecitations";
import ConsistentButton from "../../components/ConsistentButton";

import Colours from "../../utils/colours.json";
import { getSettingsAsync } from "../../utils/settings";
import Swiper from "react-native-swiper";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { getIcon } from "../../utils/icon";
import { gradientPrayerMap, prayerTimesBackgroundImages } from "../prayerTimes";
import {
    getApproximateLocation,
    getCurrentPrayer,
    formatTime,
} from "../../utils/PrayTimes";
import { BlurView } from "expo-blur";
import { GlobalContext } from "../_layout";
import LoadingScreen from "../../components/LoadingScreen";
import {
    getLastLocationAsync,
    updateLastLocationAsync,
} from "../../utils/prevLocation";

function Home({} = props) {
    // const splitTaskInto = 30;
    // const [progresses, actualSetProgresses] = useState(
    //     Array.from({ length: splitTaskInto }, () => 2)
    // );

    // const setProgress = (value) => {
    //     actualSetProgresses(Array.from({ length: splitTaskInto }, () => value));
    // };
    const [currentPage, setCurrentPage] = useContext(GlobalContext).slice(
        10,
        12
    );

    const SwiperItem = ({
        title,
        subtitle,
        buttonActionTitle,
        href = "/(tabs)/read",
        currentPageStr,
    } = props) => {
        return (
            <LinearGradient
                colors={[Colours.fgBright, Colours.fgDark]}
                style={styles.swiperItem}
            >
                <ConsistentButton
                    onClick={() => {
                        router.push(href);
                        setCurrentPage(currentPageStr);
                    }}
                    style={styles.swiperItemButton}
                >
                    <Text style={styles.swiperItemTitle} numberOfLines={2}>
                        {title}
                    </Text>
                    <Text style={styles.swiperItemSubtitle} numberOfLines={1}>
                        {subtitle}
                    </Text>
                    <ConsistentButton
                        onClick={() => {
                            router.push(href);
                            setCurrentPage(currentPageStr);
                        }}
                        style={styles.swiperItemButtonSmall}
                    >
                        <Text style={styles.swiperItemButtonText}>
                            {buttonActionTitle}
                        </Text>
                    </ConsistentButton>
                </ConsistentButton>
            </LinearGradient>
        );
    };

    const PageCard = ({
        title,
        icon = { reference: "Ionicons", name: "alert-circle" },
        size = 0,
        href,
        currentPageStr,
    } = props) => {
        return (
            <ConsistentButton
                onClick={() => {
                    if (href) {
                        router.push(href);
                        setCurrentPage(currentPageStr);
                    }
                }}
                style={styles.pageCardContainer}
            >
                {getIcon(
                    icon.reference,
                    icon.name,
                    50 + size,
                    Colours.fgMainDark,
                    {
                        marginBottom: 5,
                        padding: 5,
                        height: 50 * 1.3,
                    }
                )}
                <Text style={styles.pageCardText}>{title}</Text>
            </ConsistentButton>
        );
    };

    const PrayerTime = ({} = props) => {
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

        const [prayer, setPrayer] = useState(getCurrentPrayer(new Date()));
        const getPrayerName = (prayer, i = 0) => {
            return Object.keys(prayer)[i];
        };

        useEffect(() => {
            if (location.isDefault && !location.isPrevious) {
                getLastLocationAsync().then((tempLocation) => {
                    if (tempLocation) {
                        tempLocation.isPrevious = true;
                        console.log("LAST LOCATION: ", tempLocation);
                        setLocation(tempLocation);
                        setPrayer(
                            getCurrentPrayer(
                                new Date(),
                                "Karachi",
                                tempLocation
                            )
                        );
                    }
                });
            }
            if (location.isDefault || location.isPrevious) {
                getApproximateLocation().then((tempLocation) => {
                    if (tempLocation) {
                        setLocation(tempLocation);
                        setPrayer(
                            getCurrentPrayer(
                                new Date(),
                                "Karachi",
                                tempLocation
                            )
                        );
                        updateLastLocationAsync(tempLocation);
                    }
                });
            }
        }, [location]);

        // useEffect(() => {
        //     setPrayer(getCurrentPrayer(new Date(), "Karachi", location));
        //     console.log("redraw");
        // }, [
        //     getPrayerName(getCurrentPrayer(new Date(), "Karachi", location)),
        //     getTimeUntilNextPrayer(),
        // ]);

        function getTimeUntilNextPrayer(startDate = new Date()) {
            console.log(
                (prayer[getPrayerName(prayer, 1)] - startDate) / 1000 / 60 / 60
            );
            let date = new Date(prayer[getPrayerName(prayer, 1)] - startDate);
            if (date < 0) date.setDate(date.getDate() + 1);
            return (
                (date.getUTCHours() > 0 ? date.getUTCHours() + "h " : "") +
                (date.getUTCMinutes() > 0 ? date.getUTCMinutes() + "m" : "")
            );
        }

        return (
            <ConsistentButton
                onClick={() => router.push("/(tabs)/prayerTimes")}
                style={styles.prayerTimeLargeContainer}
            >
                <LinearGradient
                    colors={gradientPrayerMap[getPrayerName(prayer)]}
                    start={{ x: 0.5, y: 0.0 }}
                    end={{ x: 0.5, y: 0.65 }}
                    style={styles.prayerTime}
                >
                    <View style={styles.prayerTimeLocation}>
                        {getIcon(
                            "Ionicons",
                            "location-sharp",
                            20,
                            Colours.fgMainDark
                        )}
                        <Text style={styles.prayerTimeLocationText}>
                            {location.city + ", " + location.country}
                        </Text>
                    </View>
                    <View style={styles.prayerTimeContainer}>
                        <Text style={styles.prayerTimeName}>
                            {capitalizeFirstLetters(getPrayerName(prayer))}
                        </Text>
                        <View style={styles.prayerTimeTimeContainer}>
                            <Text style={styles.prayerTimeTime}>
                                {formatTime(prayer[getPrayerName(prayer)]) +
                                    " "}
                            </Text>
                            {getIcon("Ionicons", "chevron-forward", 20)}
                            <Text style={styles.prayerTimeTime}>
                                {formatTime(prayer[getPrayerName(prayer, 1)]) +
                                    " "}
                            </Text>
                        </View>
                    </View>
                </LinearGradient>
                <Image
                    source={prayerTimesBackgroundImages[getPrayerName(prayer)]}
                    resizeMode={"cover"}
                    style={styles.prayerTimeBackground}
                />
                {Platform.OS != "android" ? (
                    <BlurView
                        blurReductionFactor={7}
                        tint={"prominent"}
                        intensity={15}
                        style={styles.prayerTimeFooter}
                    >
                        <View style={[styles.prayerTimeFooterSmallContainer]}>
                            {getIcon("Ionicons", "time-outline", 20)}
                            <Text style={styles.prayerTimeFooterText}>
                                {getTimeUntilNextPrayer()} until{" "}
                                {capitalizeFirstLetters(
                                    getPrayerName(prayer, 1)
                                )}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.prayerTimeFooterSmallContainer,
                                { justifyContent: "flex-end" },
                            ]}
                        >
                            {/* <ConsistentButton style={styles.prayerTimeButton}>
                            {getIcon("Ionicons", "checkmark", 20)}
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
                        <View style={[styles.prayerTimeFooterSmallContainer]}>
                            {getIcon("Ionicons", "time-outline", 20)}
                            <Text style={styles.prayerTimeFooterText}>
                                {getTimeUntilNextPrayer()} until{" "}
                                {capitalizeFirstLetters(
                                    getPrayerName(prayer, 1)
                                )}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.prayerTimeFooterSmallContainer,
                                { justifyContent: "flex-end" },
                            ]}
                        >
                            {/* <ConsistentButton style={styles.prayerTimeButton}>
                            {getIcon("Ionicons", "checkmark", 20)}
                        </ConsistentButton> */}
                        </View>
                    </View>
                )}
            </ConsistentButton>
        );
    };

    // return <LoadingScreen />;
    return (
        <ScrollView style={styles.container}>
            <Swiper
                loop={false}
                // autoplay={true}
                activeDotColor={Colours.fgColor}
                dotColor={Colours.fgGrey}
                activeDotStyle={{ width: 30 }}
                height={"auto"}
                containerStyle={styles.swiperContent}
            >
                <View>
                    <SwiperItem
                        title="Begin Quran Study"
                        subtitle="Read the Quran"
                        buttonActionTitle="Read"
                        href="/(tabs)/read"
                        currentPageStr="read"
                    />
                </View>
                <View>
                    <SwiperItem
                        title="Listen to Quran Albums"
                        subtitle="Immerse Yourself"
                        buttonActionTitle="Listen"
                        href="/(tabs)/albums"
                        currentPageStr="albums"
                    />
                </View>
                <View>
                    <SwiperItem
                        title="Explore Hadith Books"
                        subtitle="Discover Hadith Stories"
                        buttonActionTitle="Explore"
                        href="/(tabs)/hadiths"
                        currentPageStr="hadiths"
                    />
                </View>
            </Swiper>
            <View style={styles.pagesContainer}>
                <PageCard
                    title={"Al-Quran"}
                    href="/(tabs)/read"
                    icon={{ reference: "Custom", name: "quran-outline" }}
                    currentPageStr="read"
                />
                <PageCard
                    title={"Hadiths"}
                    href="/(tabs)/hadiths"
                    icon={{
                        reference: "Ionicons",
                        name: "library-outline",
                    }}
                    currentPageStr="hadiths"
                />
                <PageCard
                    title={"Tasbih"}
                    href="/(tabs)/tasbih"
                    icon={{ reference: "Custom", name: "tasbih-outline" }}
                />
                <PageCard
                    title={"Prayers"}
                    href="/(tabs)/prayerTimes"
                    // icon={{
                    //     reference: "Custom",
                    //     name: "praying-outline",
                    // }}
                    icon={{
                        reference: "Ionicons",
                        name: "time-outline",
                    }}
                    currentPageStr="prayerTimes"
                />
                <PageCard
                    title={"Albums"}
                    href="/(tabs)/albums"
                    icon={{ reference: "Custom", name: "albums-outline" }}
                    currentPageStr="albums"
                />
                <PageCard
                    title={"Memorise"}
                    href="/(tabs)/memorise"
                    icon={{
                        reference: "Ionicons",
                        name: "bulb-outline",
                    }}
                    currentPageStr="memorise"
                />
            </View>
            <PrayerTime />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        // padding: 25,
        // paddingTop: 10,
    },
    swiperContent: {
        // overflow: "hidden",
    },
    swiperItem: {
        borderRadius: 20,
        flex: 1,
        margin: 30,
        marginBottom: 55,
        marginTop: 10,
    },
    swiperItemButton: {
        flex: 1,
        padding: 25,
        paddingHorizontal: 25,
        // paddingBottom: 0,
    },
    swiperItemTitle: {
        color: Colours.fgColor,
        fontWeight: "bold",
        fontSize: 27,
        maxWidth: "60%",
        minWidth: 215,
        lineHeight: 27 * 1.2,
    },
    swiperItemSubtitle: {
        color: Colours.fgColor,
        fontWeight: "light",
        fontSize: 17,
        maxWidth: "60%",
        minWidth: 200,
        marginTop: 5,
    },
    swiperItemButtonSmall: {
        backgroundColor: Colours.bgColour,
        width: "auto",
        borderRadius: 100,
        paddingHorizontal: 20,
        paddingVertical: 5,
        alignItems: "center",
        position: "absolute",
        bottom: 15,
        right: 15,
    },
    swiperItemButtonText: {
        color: Colours.fgColor,
        fontSize: 20,
    },
    pagesContainer: {
        marginBottom: 20,
        paddingHorizontal: 30,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
    },
    pageCardContainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colours.bgDarkGrey,
        borderRadius: 20,
        width: "30%",
        paddingVertical: 18,
        marginBottom: 15,
    },
    pageCardText: {
        color: Colours.fgColor,
        // fontWeight: "light",
        fontSize: 16,
    },
    prayerTimeLargeContainer: {
        marginVertical: 5,
        marginHorizontal: 30,
        overflow: "hidden",
        borderRadius: 25,
    },
    prayerTime: {
        paddingTop: 20,
        paddingBottom: 220,
        overflow: "hidden",
        borderRadius: 25,
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
    prayerTimeContainer: {
        marginLeft: 30,
        marginTop: 10,
    },
    prayerTimeName: {
        fontSize: 35,
        fontWeight: "bold",
        color: Colours.fgColor,
    },
    prayerTimeTime: {
        fontSize: 20,
        color: Colours.fgColor,
    },
    prayerTimeTimeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    prayerTimeBackground: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "90%",
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
});

function sum(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    }

    return sum;
}

function mean(array) {
    return sum(array) / array.length;
}

function capitalizeFirstLetters(str) {
    return str
        .split(" ") // Split the string into an array of words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
        .join(" "); // Join the words back into a single string
}

export default Home;

// DOWNLOAD STUFF

/*
{Platform.OS != "web" ? (
                <View>
                    <View style={styles.downloaderContainer}>
                        <View style={styles.recitersButton}></View>
                        <ConsistentButton
                            onClick={() => {
                                if (
                                    mean(progresses) == 0 ||
                                    mean(progresses) >= 1
                                ) {
                                    setProgress(0);
                                    for (let i = 0; i < splitTaskInto; i++) {
                                        saveRecitation(
                                            7,
                                            actualSetProgresses,
                                            i,
                                            splitTaskInto
                                        );
                                    }
                                }
                            }}
                        >
                            <Text style={{ color: "white", margin: 5 }}>
                                Download
                            </Text>
                        </ConsistentButton>
                    </View>
                    {mean(progresses) < 1.0 && (
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progress,
                                    { width: `${mean(progresses) * 100}%` },
                                ]}
                            ></View>
                            <View style={styles.progressTextContainer}>
                                <Text style={styles.progressText}>
                                    {`${Math.round(
                                        mean(progresses) * 6236
                                    )}/6236`}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            ) : (
                <>
                    <Text style={styles.text}>Cannot download on the web</Text>
                </>
            )}
*/

// DOWNLOAD STYLES
/*
progressBar: {
    borderRadius: 3,
    width: "90%",
    height: 30,
    marginVertical: 20,
    marginHorizontal: "auto",
    backgroundColor: Colours.fgGrey,
    overflow: "hidden",
},
progress: {
    backgroundColor: Colours.fgDark,
    width: "90%",
    height: "100%",
},
progressTextContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
},
progressText: {
    color: "black",
},
text: {
    color: "white",
    marginTop: 15,
    textAlign: "center",
},
*/
