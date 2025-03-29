import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Platform, Text } from "react-native";

import Ayat from "./Ayat";
import AyatTranslation from "./AyatTranslation";
import ConsistentButton from "../../components/ConsistentButton";
import DefaultModal from "../../components/Modal";

import Colours from "../../utils/colours.json";
import Reciters from "../../../assets/quran/reciters.json";
import Quran from "../../../assets/quran/quran.json";
import SurahLengths from "../../../assets/quran/surahLengths.json";
import { getIcon } from "../../utils/icon";
import { SuperContext } from "../../_layout";
import { GlobalContext } from "../../(tabs)/_layout";
import { getBookmarksAsync } from "../../utils/bookmarks";

function AyatAndTrContainer({
    ayatNum,
    ayat,
    ayatWordsObject,
    translation,
    finished,
    wordsI,
    getWordSelected,
    setWordSelected,
    onPlay,
    onStop,
    onEndPause,
    onPausePlay,
    pause: isPaused,
    shouldPlay,
    setRecitationID = (id) => {
        console.log(id);
    },
} = props) {
    const [optionsOpen, setOptionsOpen] = useState(false);
    const [pressEvent, setPressEvent] = useState({ pageX: 0, pageY: 0 });
    const [tempBookmark, setTempBookmark] = useState(getBookmarkIndex() != -1);
    const utilityButtonSizes = 30;

    const settings = useContext(SuperContext)[0];
    const tempBookmarks = useContext(SuperContext)[2];
    const setCertainBookmark = useContext(SuperContext)[3];
    const currentPage = useContext(GlobalContext)[10];

    const [goAgain, setGoAgain] = useState(false);
    const [bookmarks, setBookmarks] = useState(tempBookmarks);
    const handleLayout = () => {
        setTimeout(() => {
            getBookmarksAsync().then((res) => {
                // console.log("res: ", res);
                let tempBook = false;
                for (let i = 0; i < res.quran.length; i++) {
                    if (
                        res.quran[i] &&
                        res.quran[i].reference == getAyatKey(ayatNum)
                    )
                        tempBook = true;
                }
                setTempBookmark(tempBook);
                setBookmarks(res);
                setGoAgain(!goAgain);
            });
        }, 500);
    };

    useEffect(() => {
        if (currentPage == "read") handleLayout();
    }, [goAgain, currentPage]);

    function getBookmarkIndex() {
        if (!bookmarks) return -1;
        for (let i = 0; i < bookmarks.quran.length; i++) {
            if (
                bookmarks.quran[i] != null &&
                bookmarks.quran[i].reference == getAyatKey(ayatNum)
            ) {
                return i;
            }
        }
        return -1;
    }

    return (
        <View style={styles.container}>
            <View style={styles.ayatActionsContainer}>
                <View style={styles.ayatNumberContainer}>
                    <Text style={styles.ayatNumber}>
                        {getAyatKey(ayatNum).split(":")[1]}
                    </Text>
                </View>
                <View style={styles.actualActionsContainer}>
                    <ConsistentButton
                        style={styles.actionButton}
                        onClick={() => {
                            let playAyatNum = ayatNum;
                            if (SurahLengths.ends.includes(playAyatNum - 1)) {
                                playAyatNum -= 0.5;
                            }
                            if (finished) {
                                onPlay(playAyatNum);
                            } else {
                                onStop(playAyatNum);
                            }
                        }}
                    >
                        {finished
                            ? getIcon(
                                  "Ionicons",
                                  "play-outline",
                                  utilityButtonSizes,
                                  Colours.fgMainDark
                              )
                            : getIcon(
                                  "Ionicons",
                                  "stop-outline",
                                  utilityButtonSizes,
                                  Colours.fgMainDark
                              )}
                    </ConsistentButton>
                    {/* {(wordsI[0] != 0 || wordsI[1] != 0) && (
                        <ConsistentButton
                            onClick={() => {
                                onEndPause(ayatNum);
                            }}
                        >
                            {getIcon(
                                "MaterialCommunityIcons",
                                shouldPlay ? "play-pause" : "play-pause",
                                utilityButtonSizes,
                                Colours.fgDark
                            )}
                        </ConsistentButton>
                    )} */}
                    {!finished && (
                        <ConsistentButton
                            onClick={() => {
                                onPausePlay(ayatNum);
                            }}
                        >
                            {getIcon(
                                "Ionicons",
                                isPaused ? "play-outline" : "pause-outline",
                                utilityButtonSizes,
                                Colours.fgDark
                            )}
                        </ConsistentButton>
                    )}
                    <ConsistentButton
                        style={styles.actionButton}
                        onClick={() => {
                            if (!tempBookmark)
                                setCertainBookmark(
                                    "quran",
                                    getAyatKey(ayatNum),
                                    "add"
                                );
                            else
                                setCertainBookmark(
                                    "quran",
                                    getAyatKey(ayatNum),
                                    "remove"
                                );
                            setTempBookmark(!tempBookmark);
                        }}
                    >
                        {getIcon(
                            "Ionicons",
                            tempBookmark ? "bookmark" : "bookmark-outline",
                            utilityButtonSizes - 3,
                            Colours.fgMainDark
                        )}
                    </ConsistentButton>
                </View>
            </View>
            <View style={styles.ayatContainer}>
                <Ayat
                    ayatWordsObject={ayatWordsObject}
                    ayatNum={ayatNum % 1 == 0 ? ayatNum : 1}
                    ayat={ayat}
                    wordsI={wordsI}
                    getWordSelected={getWordSelected}
                    setWordSelected={setWordSelected}
                />
                {settings.quran.translationShow && (
                    <AyatTranslation
                        ayatNum={ayatNum % 1 == 0 ? ayatNum : 1}
                        translation={translation}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderBottomColor: Colours.fgGrey + "55", // for transparency
        borderBottomWidth: 1,
        paddingBottom: 25,
        marginBottom: 25,
        // flexDirection: "row",
        // justifyContent: "space-between",
    },
    ayatActionsContainer: {
        backgroundColor: Colours.bgDarkGrey,
        marginBottom: 15,
        padding: 10,
        borderRadius: 15,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
    },
    ayatNumberContainer: {
        borderRadius: 30,
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colours.fgMainDark,
    },
    ayatNumber: {
        color: Colours.fgColor,
    },
    actualActionsContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    actionButton: {
        marginLeft: 5,
    },
});

function getAyatKey(ayatNum) {
    return Quran.verses[Math.round(ayatNum) - 1].verse_key;
}

export default AyatAndTrContainer;
