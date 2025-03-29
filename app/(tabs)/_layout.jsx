import React, { Suspense, lazy } from "react";
import { Stack, Tabs } from "expo-router";
import { getIcon } from "../utils/icon";
import MainBar from "../components/MainBar";
import Colours from "../utils/colours.json";
import { Text, View, StyleSheet } from "react-native";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import ConsistentButton from "../components/ConsistentButton";
import { SuperContext } from "../_layout";
import LoadingScreen from "../components/LoadingScreen";
import SurahEnds from "../../assets/quran/surahLengths.json";
import Surahs from "../../assets/quran/surahs.json";
import playVerse from "../components/VersePlayer";
import parseErrorStack from "react-native/Libraries/Core/Devtools/parseErrorStack";

export const GlobalContext = createContext();

export const allPagesSelectedIcons = {
    home: {
        reference: "Ionicons",
        name: "home",
        size: 32,
    },
    read: {
        reference: "Custom",
        name: "quran",
        size: 32,
    },
    hadiths: {
        reference: "Ionicons",
        name: "library",
        size: 32,
    },
    stats: {
        reference: "Ionicons",
        name: "bar-chart",
        size: 32,
    },
    // {
    // 	reference: "Ionicons",
    // 	name: "bulb",
    // 	size: 32,
    // },
    albums: {
        reference: "Custom",
        name: "albums",
        size: 32,
    },
    prayerTimes: {
        reference: "Ionicons",
        name: "time",
        size: 42,
    },
    tasbih: {
        reference: "Custom",
        name: "tasbih",
        size: 32,
    },
    memorise: {
        reference: "Ionicons",
        name: "bulb",
        size: 32,
    },
    learn: {
        reference: "Ionicons",
        name: "school",
        size: 32,
    },
    bookmarks: {
        reference: "Ionicons",
        name: "bookmarks",
        size: 32,
    },
};

function getNextAyah(key) {
    let surah = parseInt(key.split(":")[0]);
    let ayah = parseInt(key.split(":")[1]) + 1;

    if (ayah > SurahEnds.ends[surah]) {
        ayah = 0;
        surah += 1;
    }

    if (surah > 114) {
        surah = 1;
        ayah = 1;
    }

    return `${surah}:${ayah}`;
}

export default function TabLayout({} = props) {
    const [soundRef, setSoundRef] = useState();
    const [show, setShow] = useState(false);
    const [pageSoundRef, setPageSoundRef] = useState(null);
    const [currentPage, setCurrentPage] = useState("home");
    const [playingDetails, setPlayingDetails] = useState("-");
    const [pause, setPause] = useState(false);
    const [finishedSound, setFinishedSound] = useState(false);
    const soundBarHeight = 60;

    useEffect(() => {
        if (soundRef && pageSoundRef != currentPage && pageSoundRef != null) {
            soundRef.setOnPlaybackStatusUpdate((status) => {
                if (status.playableDurationMillis <= status.positionMillis) {
                    setFinishedSound(true);
                    setPageSoundRef(null);
                }
            });
        }
    }, [soundRef, pageSoundRef, currentPage]);

    useEffect(() => {
        console.log("finish Changed to", finishedSound);
        if (finishedSound) {
            let ayatKey = playingDetails.split(" | ")[1];
            ayatKey = getNextAyah(ayatKey);
            setPlayingDetails(
                Surahs.surahs[parseInt(ayatKey.split(":")[0]) - 1].name_simple +
                    " | " +
                    ayatKey
            );
            setFinishedSound(false);
            playVerse(
                7,
                parseInt(ayatKey.split(":")[0]),
                parseInt(ayatKey.split(":")[1]),
                () => {
                    console.log("finished");
                    setFinishedSound(true);
                },
                () => {}
            ).then((val) => {
                setSoundRef(val);
            });
        }
    }, [finishedSound]);
    //test
    // const [, , firstRender, setFirstRender] = useContext(SuperContext);
    // const [unmount, setUnmount] = useState(firstRender);

    // useEffect(() => {
    //     setUnmount(firstRender);
    // }, [firstRender]);

    function shouldShow() {
        return show && pageSoundRef != currentPage;
    }

    return (
        <GlobalContext.Provider
            value={[
                soundRef, //0
                setSoundRef, //1
                show, //2
                setShow, //3
                pageSoundRef, //4
                setPageSoundRef, //5
                playingDetails, //6
                setPlayingDetails, //7
                pause, //8
                setPause, //9
                currentPage, //10
                setCurrentPage, //11
            ]}
        >
            <View
                style={{
                    position: "absolute",
                    display: shouldShow() ? "flex" : "none",
                    backgroundColor: Colours.bgColour,
                    borderTopColor: Colours.fgMainDark,
                    borderTopWidth: 2,
                    height: soundBarHeight,
                    width: "100%",
                    bottom: 75,
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    zIndex: 10,
                }}
            >
                <View
                    style={{
                        marginHorizontal: 15,
                    }}
                >
                    <Text
                        style={{
                            color: Colours.fgColor,
                            fontSize: 18,
                        }}
                    >
                        {playingDetails.split("|")[0]}
                        <Text style={{ color: Colours.fgGrey }}>
                            -{playingDetails.split("|")[1]}
                        </Text>
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        marginHorizontal: 10,
                    }}
                >
                    <ConsistentButton
                        onClick={() => {
                            if (soundRef) {
                                soundRef.unloadAsync();
                                setSoundRef(null);
                                setShow(false);
                            }
                        }}
                        style={{ marginHorizontal: 5 }}
                    >
                        {getIcon(
                            "Ionicons",
                            "stop-outline",
                            30,
                            Colours.fgMainDark
                        )}
                    </ConsistentButton>
                    <ConsistentButton
                        style={{ marginHorizontal: 5 }}
                        onClick={() => {
                            if (soundRef) {
                                if (!pause) {
                                    soundRef.pauseAsync().then(() => {
                                        setPause(true);
                                    });
                                } else {
                                    soundRef.playAsync().then(() => {
                                        setPause(false);
                                    });
                                }
                            }
                        }}
                    >
                        {getIcon(
                            "Ionicons",
                            pause ? "play-outline" : "pause-outline",
                            30,
                            Colours.fgMainDark
                        )}
                    </ConsistentButton>
                    <ConsistentButton style={{ marginHorizontal: 5 }}>
                        {getIcon(
                            "Ionicons",
                            "bookmark-outline",
                            30,
                            Colours.fgMainDark
                        )}
                    </ConsistentButton>
                </View>
            </View>
            <Tabs
                screenOptions={{
                    header: ({ navigation, route, options }) => {
                        return (
                            <MainBar
                                title={options.title}
                                icon={allPagesSelectedIcons[route.name]}
                            />
                        );
                    },
                    tabBarStyle: {
                        height: 75,
                        backgroundColor: Colours.bgDarkGrey,
                        borderTopWidth: 0,
                    },
                    tabBarLabelStyle: { display: "none" },
                    tabBarHideOnKeyboard: true,
                    unmountOnBlur: true,
                    freezeOnBlur: false,
                    lazy: false,
                    // unmountOnBlur: unmount,
                }}
                initialRouteName={"home"}
                screenListeners={{
                    tabPress: (e) => {
                        setCurrentPage(e.target.split("-")[0]);
                    },
                }}
                sceneContainerStyle={{
                    marginBottom: shouldShow() ? soundBarHeight : 0,
                }}
                backBehavior={"history"}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: "Home",
                        tabBarIcon: ({ focused }) => {
                            // if (focused) setCurrentPage("home");
                            return getIcon(
                                "Ionicons",
                                focused ? "home" : "home-outline",
                                35,
                                focused ? Colours.fgDark : Colours.fgGrey
                            );
                        },
                    }}
                />
                <Tabs.Screen
                    name="stats"
                    options={{
                        title: "Stats",
                        tabBarIcon: ({ focused }) => {
                            // if (focused) setCurrentPage("home");
                            return getIcon(
                                "Ionicons",
                                focused ? "bar-chart" : "bar-chart-outline",
                                35,
                                focused ? Colours.fgDark : Colours.fgGrey
                            );
                        },
                    }}
                />
                <Tabs.Screen
                    name="read"
                    options={{
                        href: null,
                        title: "Qur'an",
                        tabBarIcon: ({ focused }) => {
                            // if (focused) setCurrentPage("read");
                            return getIcon(
                                "Custom",
                                focused ? "quran" : "quran-outline",
                                35,
                                focused ? Colours.fgDark : Colours.fgGrey
                            );
                        },
                    }}
                />
                <Tabs.Screen
                    name="hadiths"
                    options={{
                        component: () => (
                            <Suspense fallback={<Text>Loading...</Text>}>
                                <Hadiths />
                            </Suspense>
                        ),
                        href: null,
                        title: "Hadiths",
                        tabBarIcon: ({ focused }) => {
                            // if (focused) setCurrentPage("hadiths");
                            return getIcon(
                                "Ionicons",
                                focused ? "library" : "library-outline",
                                35,
                                focused ? Colours.fgDark : Colours.fgGrey
                            );
                        },
                    }}
                />
                <Tabs.Screen
                    name="albums"
                    options={{
                        href: null,
                        title: "Albums",
                        tabBarIcon: ({ focused }) => {
                            // if (focused) setCurrentPage("albums");
                            return getIcon(
                                "Custom",
                                focused ? "albums" : "albums-outline",
                                35,
                                focused ? Colours.fgDark : Colours.fgGrey
                            );
                        },
                    }}
                />
                <Tabs.Screen
                    name="prayerTimes"
                    options={{
                        href: null,
                        title: "Times",
                        tabBarIcon: ({ focused }) => {
                            // if (focused) setCurrentPage("prayerTimes");
                            // return getIcon(
                            //     "Custom",
                            //     focused ? "praying" : "praying-outline",
                            //     35,
                            //     focused ? Colours.fgDark : Colours.fgGrey
                            // );
                            return getIcon(
                                "Ionicons",
                                focused ? "time" : "time-outline",
                                40,
                                focused ? Colours.fgDark : Colours.fgGrey
                            );
                        },
                    }}
                />
                <Tabs.Screen
                    name="tasbih"
                    options={{
                        href: null,
                        title: "Tasbih",
                        tabBarIcon: ({ focused }) => {
                            // if (focused) setCurrentPage("prayerTimes");
                            return getIcon(
                                "Custom",
                                focused ? "tasbih" : "tasbih-outline",
                                35,
                                focused ? Colours.fgDark : Colours.fgGrey
                            );
                        },
                    }}
                />
                <Tabs.Screen
                    name="learn"
                    options={{
                        href: null,
                        title: "Learn",
                        tabBarIcon: ({ focused }) => {
                            // if (focused) setCurrentPage("home");
                            return getIcon(
                                "Ionicons",
                                focused ? "school" : "school-outline",
                                35,
                                focused ? Colours.fgDark : Colours.fgGrey
                            );
                        },
                    }}
                />
                <Tabs.Screen
                    name="bookmarks"
                    options={{
                        title: "Bookmarks",
                        tabBarIcon: ({ focused }) => {
                            // if (focused) setCurrentPage("prayerTimes");
                            return getIcon(
                                "Ionicons",
                                focused ? "bookmarks" : "bookmarks-outline",
                                35,
                                focused ? Colours.fgDark : Colours.fgGrey
                            );
                        },
                    }}
                />
                <Tabs.Screen
                    name="memorise"
                    options={{
                        href: null,
                        title: "Memorise",
                        tabBarIcon: ({ focused }) => {
                            // if (focused) setCurrentPage("prayerTimes");
                            return getIcon(
                                "Ionicons",
                                focused ? "bulb" : "bulb-outline",
                                35,
                                focused ? Colours.fgDark : Colours.fgGrey
                            );
                        },
                    }}
                />
                {/* <Tabs.Screen
        name="home"
        options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => {getIcon("Ionicons", "home")},
            }}
            /> */}
            </Tabs>
        </GlobalContext.Provider>
    );
}

const styles = StyleSheet.create({});
