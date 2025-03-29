import React, { useEffect, useRef, useState, useContext } from "react";
import {
    Text,
    View,
    StyleSheet,
    Pressable,
    Animated,
    Platform,
    Dimensions,
} from "react-native";
import playVerse from "../../components/VersePlayer";
import { loadRecitations } from "../../utils/loadRecitations";
import {
    Gesture,
    GestureDetector,
    Swipeable,
} from "react-native-gesture-handler";

import Translation from "../../../assets/quran/allTranslations/en/DrMustafaKhattab.json";
import Quran from "../../../assets/quran/quran.json";
import surahLengths from "../../../assets/quran/surahLengths.json";
import surahs from "../../../assets/quran/surahs.json";
import Colours from "../../utils/colours.json";
import { getIcon } from "../../utils/icon";
import ConsistentButton from "../../components/ConsistentButton";
import { GlobalContext } from "../../(tabs)/_layout";
import { LinearGradient } from "expo-linear-gradient";
import { SuperContext } from "../../_layout";
import { getSettingsAsync } from "../../utils/settings";

function AlbumText({
    textBackground,
    onHold,
    onDoubleLeftTap,
    onDoubleRightTap,
} = props) {
    const swipeable = useRef();
    const [pageIndex, setPageIndex] = useState(0);
    const [direction, setDirection] = useState("");
    const [finished, setFinished] = useState(true);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [
        soundRef,
        setSoundRef,
        show,
        setShow,
        pageSoundRef,
        setPageSoundRef,
        playingDetails,
        setPlayingDetails,
        pause,
        setPause,
    ] = useContext(GlobalContext);

    const bookmarks = useContext(SuperContext)[2];
    const setCertainBookmark = useContext(SuperContext)[3];
    // setShow(true);
    // setPageSoundRef("albums");

    let recitationID = useRef(7).current;
    // console.log(loadRecitations());

    const [verseKeyPages, setVerseKeyPages] = useState({ 0: "55:0" });
    const [wordsI, setWordsI] = useState([0, 0, 0, 0]);
    const [isUthmanic, setIsUthmanic] = useState(false);

    const getBookmarks = (arr) => {
        return arr.reduce((acc, obj) => {
            if (obj != null && obj.reference) {
                acc[obj.reference] = true;
            }
            return acc;
        }, {});
    };

    const [bookmarked, setBookmarked] = useState(getBookmarks(bookmarks.quran));
    const [currentBookmarked, setCurrentBookmarked] = useState(false);
    const setLocalCertainBookmarked = (key, val = true) => {
        const temp = bookmarked;
        temp[key] = val;
        setBookmarked(temp);
        setCurrentBookmarked(val);
        return temp;
    };

    useEffect(() => {
        let val = bookmarked[verseKeyPages[pageIndex + ""]];
        val = val == null ? false : val;
        setCurrentBookmarked(val);
    }, [pageIndex, verseKeyPages[pageIndex + ""]]);

    const setIthVerseKey = (val, index) => {
        let temp = verseKeyPages;
        temp[index] = val;
        setVerseKeyPages(temp);
        return temp;
    };

    const maxAllowedWords = 10;
    let ayah = getAyahFromKey(verseKeyPages[pageIndex]);
    let translation = getTranslationFromKey(
        verseKeyPages[pageIndex],
        maxAllowedWords,
        wordsI,
        ayah
    );
    let arabic = getArabic(ayah, isUthmanic, wordsI, maxAllowedWords);

    const handleUpdate = (status) => {
        const recitationAyah = getAyahRecitationFromKey(
            recitationID,
            verseKeyPages[pageIndex]
        );
        findHighlightedSegment(
            status.positionMillis,
            recitationAyah,
            setWordsI
        );
    };

    // const goToNextAyah = () => {
    //     let tempKey = verseKeyPages[pageIndex];
    //     if (
    //         parseInt(tempKey.split(":")[1]) + 1 <=
    //         surahLengths.ends[parseInt(tempKey.split(":")[0])]
    //     ) {
    //         tempKey =
    //             tempKey.split(":")[0] +
    //             ":" +
    //             (parseInt(tempKey.split(":")[1]) + 1);
    //     } else {
    //         tempKey =
    //             parseInt(tempKey.split(":")[0]) + 1 > 114
    //                 ? 1
    //                 : parseInt(tempKey.split(":")[0]) + 1 + ":" + "1";
    //     }
    //     setIthVerseKey(tempKey, pageIndex);
    //     setWordsI([0, 0, 0, 0]);
    // };

    const handleSwipeableOpen = (dir) => {
        setDirection(dir);
    };

    const handleSwipeableClose = (dir) => {
        setDirection("");
    };

    const handleOnFinishedPlaying = () => {
        setFinished(true);
    };

    useEffect(() => {
        if (soundRef == null) {
            // setFinished(true);
            // setIsFirstRender(true);
        }
    }, [soundRef == null]);

    useEffect(() => {
        getSettingsAsync().then((val) => {
            recitationID = val.recitations.defaultRecitation.val;
        });
        if (finished && pageSoundRef == "albums") {
            // console.log("on finish direction:", direction);
            setFinished(false);
            let tempPageIndex = pageIndex;
            let tempVerseKeyPages = verseKeyPages;
            if (!isFirstRender) {
                if (direction == "") {
                    let tempKey = verseKeyPages[pageIndex];
                    if (
                        parseInt(tempKey.split(":")[1]) + 1 <=
                        surahs.surahs[parseInt(tempKey.split(":")[0]) - 1]
                            .verses_count
                    ) {
                        tempKey =
                            tempKey.split(":")[0] +
                            ":" +
                            (parseInt(tempKey.split(":")[1]) + 1);
                    } else {
                        tempKey = getVerseKey(
                            parseInt(tempKey.split(":")[0]) + 1 > 114
                                ? 1
                                : parseInt(tempKey.split(":")[0]) + 1
                        );
                    }
                    tempVerseKeyPages = setIthVerseKey(tempKey, pageIndex);
                    setWordsI([0, 0, 0, 0]);
                } else if (direction == "left") {
                    if (pageIndex > 0) {
                        tempPageIndex--;
                        setPageIndex(pageIndex - 1);
                        setWordsI([0, 0, 0, 0]);
                    }
                    if (swipeable.current != null) swipeable.current.close();
                } else if (direction == "right") {
                    if (verseKeyPages[pageIndex + 1] == null) {
                        let surahNum = Math.floor(Math.random() * 114) + 1;

                        tempVerseKeyPages = setIthVerseKey(
                            getVerseKey(surahNum),
                            pageIndex + 1
                        );
                        setWordsI([0, 0, 0, 0]);

                        setPageIndex(pageIndex + 1);
                    } else {
                        setPageIndex(pageIndex + 1);
                    }
                    tempPageIndex++;
                    if (swipeable.current != null) swipeable.current.close();
                }
            } else {
                setIsFirstRender(false);
            }
            playVerse(
                recitationID,
                parseInt(tempVerseKeyPages[tempPageIndex].split(":")[0]),
                parseInt(tempVerseKeyPages[tempPageIndex].split(":")[1]),
                handleOnFinishedPlaying,
                handleUpdate
            ).then((sound) => {
                setSoundRef(sound);
                setPlayingDetails(
                    surahs.surahs[
                        parseInt(verseKeyPages[pageIndex].split(":")) - 1
                    ].name_simple +
                        " | " +
                        verseKeyPages[pageIndex + ""]
                );
                setShow(true);
                setPageSoundRef("albums");
                setPause(false);
            });
        }
    }, [direction, finished, pageSoundRef]);

    // const singleTap = Gesture.Tap()
    //     .maxDuration(250)
    //     .numberOfTaps(2)
    //     .onEnd((event) => {
    //         if (event.x < Dimensions.get("window").width / 2) {
    //             onDoubleLeftTap();
    //         } else {
    //             onDoubleRightTap();
    //         }
    //     });

    // const longPress = Gesture.LongPress().onStart((event) => {
    //     console.log()
    //     onHold();
    // });

    function AyahText({} = props) {
        return (
            <Animated.View style={[styles.ayahContainer]}>
                <Pressable
                    style={styles.ayahPressable}
                    onLongPress={() => {
                        setIsUthmanic(!isUthmanic);
                        arabic = getArabic(
                            ayah,
                            !isUthmanic,
                            wordsI,
                            maxAllowedWords
                        );
                    }}
                >
                    <Text
                        onLongPress={() => {
                            setIsUthmanic(!isUthmanic);
                            arabic = getArabic(
                                ayah,
                                !isUthmanic,
                                wordsI,
                                maxAllowedWords
                            );
                        }}
                        style={[
                            styles.arabic,
                            !isUthmanic && { fontFamily: "Indo-Pak" },
                            textBackground
                                ? { backgroundColor: "rgba(0, 0, 0, 0.8)" }
                                : {},
                        ]}
                    >
                        {arabic}
                    </Text>
                </Pressable>
                <Text
                    style={[
                        styles.translation,
                        textBackground
                            ? { backgroundColor: "rgba(0, 0, 0, 0.8)" }
                            : {},
                    ]}
                >
                    {translation}
                </Text>
            </Animated.View>
        );
    }

    function AyahDetails({} = props) {
        return (
            <View
                style={[
                    styles.details,
                    {
                        display:
                            show && pageSoundRef != "albums" ? "none" : "flex",
                    },
                ]}
            >
                <Text style={styles.detailsName}>
                    {
                        surahs.surahs[
                            parseInt(verseKeyPages[pageIndex].split(":")) - 1
                        ].name_simple
                    }
                    <Text style={styles.detailsKey}>
                        {" - "}
                        {verseKeyPages[pageIndex]}
                    </Text>
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <ConsistentButton
                        onClick={() => {
                            if (soundRef) {
                                if (pause) {
                                    soundRef.playAsync().then((status) => {
                                        setShow(true);
                                        // console.log("play", status);
                                        setPause(false);
                                    });
                                } else {
                                    soundRef.pauseAsync().then((status) => {
                                        setShow(false);
                                        // console.log("pause", status);
                                        setPause(true);
                                    });
                                }
                            } else {
                                setFinished(true);
                                setPageSoundRef("albums");
                            }
                        }}
                        style={{
                            marginRight: 10,
                        }}
                    >
                        {getIcon(
                            "Ionicons",
                            pause || soundRef == null
                                ? "play-outline"
                                : "pause-outline",
                            30,
                            Colours.fgMainDark
                        )}
                    </ConsistentButton>
                    <ConsistentButton
                        onClick={() => {
                            if (
                                bookmarked[verseKeyPages[pageIndex + ""]] ||
                                currentBookmarked
                            ) {
                                setLocalCertainBookmarked(
                                    verseKeyPages[pageIndex + ""],
                                    false
                                );
                                setCertainBookmark(
                                    "quran",
                                    verseKeyPages[pageIndex + ""],
                                    "remove"
                                );
                            } else {
                                setLocalCertainBookmarked(
                                    verseKeyPages[pageIndex + ""],
                                    true
                                );
                                setCertainBookmark(
                                    "quran",
                                    verseKeyPages[pageIndex + ""],
                                    "add"
                                );
                            }
                        }}
                    >
                        {getIcon(
                            "Ionicons",
                            bookmarked[verseKeyPages[pageIndex + ""]] ||
                                currentBookmarked
                                ? "bookmark"
                                : "bookmark-outline",
                            30,
                            Colours.fgMainDark
                        )}
                    </ConsistentButton>
                </View>
                {/* <Text style={styles.detailsArabic}>
                    {
                        surahs.surahs[
                            parseInt(verseKeyPages[pageIndex].split(":")) - 1
                        ].name_arabic
                    }
                </Text> */}
            </View>
        );
    }

    return (
        <>
            <LinearGradient
                colors={[
                    Colours.bgColour,
                    "transparent",
                    "transparent",
                    "transparent",
                    Colours.bgDarkGrey,
                ]}
                style={styles.linearGradientView}
            ></LinearGradient>
            <Swipeable
                ref={swipeable}
                containerStyle={styles.container}
                childrenContainerStyle={styles.childrenContainer}
                renderLeftActions={pageIndex > 0 && leftButton}
                renderRightActions={rightButton}
                overshootLeft={false}
                overshootRight={false}
                onSwipeableOpen={handleSwipeableOpen}
                onSwipeableClose={handleSwipeableClose}
            >
                <AyahText />
                <AyahDetails />
            </Swipeable>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        // flex: 1,
        width: "100%",
        height: "100%",
    },
    childrenContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
    },
    details: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colours.bgColour + "cc",
        borderTopColor: Colours.fgMainDark,
        borderTopWidth: 2,
        padding: 15,
        paddingVertical: 0,
        height: 60,
    },
    detailsName: {
        color: Colours.fgColor,
        fontSize: 18,
    },
    detailsKey: {
        color: Colours.fgGrey,
    },
    ayahContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    ayahPressable: {
        margin: "auto",
        marginBottom: 0,
    },
    arabic: {
        color: "white",
        fontFamily: "Uthmanic",
        fontSize: 25,
        textAlign: "center",
        margin: "auto",
        padding: 15,
    },
    highlightedText: {
        color: Colours.fgDark,
    },
    translation: {
        color: "white",
        fontFamily: "sans-serif",
        fontSize: 18,
        textAlign: "center",
        textShadowColor: "transparent",
        textShadowRadius: 0,
        margin: "auto",
        marginTop: 25,
        padding: 15,
    },
    linearGradientView: {
        position: "absolute",
        width: "100%",
        height: "100%",
        // backgroundColor: "red",
    },
});

function getVerseKey(surah = Math.floor(Math.random() * 114) + 1) {
    let verseNum = 0;
    if (!surahs.surahs[surah - 1].bismillah_pre) {
        verseNum = 1;
    }
    return `${surah}:${verseNum}`;
}

function leftButton(progress, dragX) {
    const trans = dragX.interpolate({
        inputRange: [0, 50, 100, 101],
        outputRange: [-50, 0, 0, 1],
    });
    return (
        <Animated.View
            style={[
                { backgroundColor: "transparent", width: 50 },
                {
                    transform: [{ translateX: trans }],
                },
            ]}
        >
            <View style={{ margin: "auto" }}>
                {getIcon("AntDesign", "caretleft", 25, "white")}
            </View>
        </Animated.View>
    );
}

function rightButton(progress, dragX) {
    const trans = dragX.interpolate({
        inputRange: [-101, -100, -50, 0],
        outputRange: [-1, 0, 0, 50],
    });
    return (
        <Animated.View
            style={[
                { backgroundColor: "transparent", width: 50 },
                {
                    transform: [{ translateX: trans }],
                },
            ]}
        >
            <View style={{ margin: "auto" }}>
                {getIcon("AntDesign", "caretright", 25, "white")}
            </View>
        </Animated.View>
    );
}

function getArabic(ayah, uthamic, wordsI, maxAllowedWords) {
    let array = [];
    for (let i = 0; i < ayah.words.length; i++) {
        let words = ayah.words[i];

        if (
            i >= Math.floor(wordsI[0] / maxAllowedWords) * maxAllowedWords &&
            i <
                Math.floor(wordsI[0] / maxAllowedWords) * maxAllowedWords +
                    maxAllowedWords
        ) {
            let word = uthamic
                ? words.text_uthmani
                : formatIndoPakText(words.text_indopak);
            let space = uthamic ? " " : "    ";
            if (i < ayah.words.length - 2) word += space;

            if (i == ayah.words.length - 1)
                array.push(
                    <Text key={i} style={{ fontFamily: "Uthmanic" }}>
                        {word}
                    </Text>
                );
            else if (createArray(wordsI[0], wordsI[1]).includes(i))
                array.push(
                    <Text key={i} style={styles.highlightedText}>
                        {word}
                    </Text>
                );
            else {
                array.push(<Text key={i}>{word}</Text>);
            }
        }
    }
    return array;
}

function getTranslationFromKey(key, maxAllowedWords, wordsI, ayah) {
    let verses = Quran.verses;
    let translation = {};

    if (key.split(":")[1] == "0") {
        translation = Translation.translations[0];
    } else {
        for (let i = 0; i < verses.length; i++) {
            if (verses[i].verse_key == key) {
                translation = Translation.translations[i];
                break;
            }
        }
    }

    return translation.text
        .split(" ")
        .slice(
            ((Math.floor(wordsI[0] / maxAllowedWords) * maxAllowedWords) /
                ayah.words.length) *
                translation.text.split(" ").length,
            ((Math.floor(wordsI[0] / maxAllowedWords) * maxAllowedWords +
                maxAllowedWords) /
                ayah.words.length) *
                translation.text.split(" ").length
        )
        .join(" ");
}

function getAyahFromKey(key) {
    let verses = Quran.verses;
    if (key.split(":")[1] == "0") return verses[0];

    let verse = {};
    for (let i = 0; i < verses.length; i++) {
        if (verses[i].verse_key == key) {
            verse = verses[i];
            break;
        }
    }

    return verse;
}

function getAyahRecitationFromKey(recitationID, key) {
    let verses = loadRecitations()[recitationID];
    if (key.split(":")[1] == "0") return verses[0];

    let verse = {};
    for (let i = 0; i < verses.length; i++) {
        if (verses[i].verse_key == key) {
            verse = verses[i];
            break;
        }
    }
    return verse;
}

function findHighlightedSegment(currentPosition, recitationAyah, callback) {
    let segments = recitationAyah.segments;
    let succesfulSeg = [];
    for (let i = 0; i < segments.length; i++) {
        let seg = segments[i];
        if (currentPosition > seg[2] && currentPosition < seg[3]) {
            callback(seg);
            succesfulSeg = seg;
        }
    }
    return succesfulSeg;
}

function formatIndoPakText(text) {
    text = text.replace(/&#x06E1;|ۡ/g, "\u0652");
    return text;
}

function createArray(min, max, step = 1) {
    let array = [];
    for (let i = min; i < max; i += step) {
        array.push(i);
    }
    return array;
}

export default AlbumText;
