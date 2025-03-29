import { Platform, StyleSheet, Text, View } from "react-native";
import React, { createContext, useEffect, useRef, useState } from "react";
import { router, Slot, Stack, Tabs } from "expo-router";

import MainBar from "./components/MainBar";
import Menu from "./components/Menu";
import Colours from "./utils/colours.json";
import { useFonts } from "expo-font";
import { getIcon } from "./utils/icon";
import {
    getDefaultSettings,
    getSettingsAsync,
    setCertainSettingAsync,
} from "./utils/settings";
import {
    getBookmarksAsync,
    getDefaultBookmarks,
    setCertainBookmarkAsync,
} from "./utils/bookmarks";
// import TabsLayout from "./(tabs)/_layout";
import * as Notifications from "expo-notifications";
import { useLocalNotification } from "./utils/localNotifications";
import { PrayTimes } from "./utils/PrayTimes";
import { schedulePrayerTimesNotifications } from "./utils/prayerTimesNotifications";
import {
    getDefaultStats,
    getFormattedDate,
    getStatsAsync,
    updateStatsAsync,
} from "./utils/stats";

export const SuperContext = createContext();

Notifications.setNotificationHandler({
    handleNotification: async (Notification) => {
        console.log(Notification.request.content);
        return {
            // priority: Notifications.AndroidNotificationPriority.HIGH,
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        };
    },
});

function RootLayout() {
    // console.log(true);
    // Notifications.scheduleNotificationAsync({
    //     content: {
    //         title: "Remember to drink water!",
    //         sticky: true,
    //         priority: "high",
    //         autoDismiss: false,
    //         interruptionLevel: "critical",
    //         body: "Remember to drink water!",
    //         subtitle: "Remember to drink water!",
    //     },
    //     trigger: {
    //         seconds: 10,
    //         repeats: false,
    //     },
    // });
    // Notifications.cancelAllScheduledNotificationsAsync();
    if (Platform.OS != "web") useLocalNotification();

    let [fontsLoaded] = loadFonts();
    const [firstRender, setFirstRender] = useState(true);
    const [settings, setSettings] = useState(getDefaultSettings());
    const getSettings = () => {
        return settings;
    };
    const setCertainSettings = (key, secondaryKey, val) => {
        let settingsTemp = settings;
        settingsTemp[key][secondaryKey].val = val;
        console.log(key, secondaryKey, settingsTemp[key][secondaryKey].val);
        if (key == "prayerTimes" && Platform.OS != "web") {
            if (settingsTemp.prayerTimes.pushNotification.val) {
                schedulePrayerTimesNotifications();
            } else {
                console.log("cancelled all scheduled notifications");
                Notifications.cancelAllScheduledNotificationsAsync();
            }
        }
        setSettings(settingsTemp);
        setCertainSettingAsync(key, secondaryKey, val);
        // setFirstRender(true);
    };

    const [stats, setStats] = useState(getDefaultStats());
    const setCertainStat = (key, value) => {
        date = getFormattedDate();
        let statsTemp = stats;
        if (!statsTemp[key]) statsTemp[key] = {};
        if (!statsTemp[key][date]) statsTemp[key][date] = 0;
        statsTemp[key][date] += value;
        setStats(statsTemp);
        console.log(statsTemp);
        updateStatsAsync(key, value);
    };

    const [bookmarks, setBookmarks] = useState(getDefaultBookmarks());
    const setCertainBookmarks = (key, reference, job) => {
        let tempBookmarks = bookmarks;
        if (key == "lastReadQuran") {
            tempBookmarks[key].reference = reference;
        } else {
            if (job == "remove") {
                let foundI = -1;
                for (let i = 0; i < tempBookmarks[key].length; i++) {
                    if (
                        tempBookmarks[key][i] != null &&
                        tempBookmarks[key][i].reference == reference
                    ) {
                        foundI = i;
                        break;
                    }
                }
                console.log("foundI in state", foundI);
                if (foundI > -1) tempBookmarks[key][foundI] = null;
            } else if (job == "add") {
                tempBookmarks[key].push({ reference: reference });
            }
        }
        setBookmarks(tempBookmarks);
        setCertainBookmarkAsync(key, reference, job);
    };

    const getCertainBookmark = (key, reference) => {
        if (bookmarks == null || bookmarks[key] == null) return null;
        for (let i = 0; i < bookmarks[key].length; i++) {
            if (
                bookmarks[key][i] != null &&
                bookmarks[key][i].reference == reference
            )
                return bookmarks[key][i];
        }
        return null;
    };

    useEffect(() => {
        if (firstRender) {
            getSettingsAsync().then((settingsTemp) => {
                // console.log(JSON.stringify(tempSettings, () => {}, 2));
                setSettings(settingsTemp);
                if (Platform.OS != "web") {
                    if (settingsTemp.prayerTimes.pushNotification.val) {
                        schedulePrayerTimesNotifications();
                    } else {
                        console.log("cancelled all scheduled notifications");
                        Notifications.cancelAllScheduledNotificationsAsync();
                    }
                }
            });
            getBookmarksAsync().then((tempBookmarks) => {
                setBookmarks(tempBookmarks);
            });
            getStatsAsync().then((tempStats) => {
                setStats(tempStats);
            });
            setFirstRender(false);
        }
    }, [firstRender]);

    // useLocalNotification();

    return (
        <SuperContext.Provider
            value={[
                settings,
                setCertainSettings,
                bookmarks,
                setCertainBookmarks,
                getCertainBookmark,
                fontsLoaded,
                stats,
                setCertainStat,
            ]}
        >
            <View style={styles.container}>
                <Stack
                    screenOptions={{
                        header: () => {},
                        freezeOnBlur: false,
                    }}
                />
            </View>
        </SuperContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colours.bgColour,
    },
});

function createDictionary(keys, values) {
    const dictionary = {};
    for (let i = 0; i < keys.length; i++) {
        dictionary[keys[i]] = values[i];
    }
    return dictionary;
}

function loadFonts() {
    const fontsPath = "../assets/fonts/";

    const fontsLoaded = useFonts({
        "Indo-Pak": require(fontsPath + "Indo-Pak.ttf"),
        Uthmanic: require(fontsPath + "Uthmanic.otf"),
        "Noto-Arabic": require(fontsPath + "NotoNaskhArabic.ttf"),
        // "Surah-Arabic": require(fontsPath + "Quran karim 114.ttf"),
        "custom-icons": require(fontsPath + "customIconFont.ttf"),
        "new-amsterdam": require(fontsPath + "NewAmsterdam-Regular.ttf"),
    });

    return fontsLoaded;
}

export default RootLayout;
