import React, { useEffect, useRef, useState, useContext } from "react";
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    Platform,
    ScrollView,
    Dimensions,
} from "react-native";
import AyatAndTrContainer from "./AyatAndTrContainer";
import ConsistentButton from "../../components/ConsistentButton";
import { getIcon } from "../../utils/icon";
import playVerse from "../../components/VersePlayer";
import { loadRecitations } from "../../utils/loadRecitations";

import Quran from "../../../assets/quran/quran.json";
import Colours from "../../utils/colours.json";
import SurahLengths from "../../../assets/quran/surahLengths.json";
import QuranChapters from "../../../assets/quran/surahs.json";
import { GlobalContext } from "../../(tabs)/_layout";
import { SuperContext } from "../../_layout";
import LoadingScreen from "../../components/LoadingScreen";
import { getFormattedDate } from "../../utils/stats";
import Ayat from "./Ayat";
import { getSettingsAsync } from "../../utils/settings";

const AyatsContainer = ({
    mushafFormat = false,
    ayatStartNum,
    ayatEndNum,
    surahNum,
    increaseSurahNum,
    header,
    getWordSelected,
    setWordSelected,
    setCurrentAyatNum,
    scrollTo = null,
    shouldScrollTo = false,
    setShouldScrollTo,
    containerStyle = {},
} = props) => {
    if (ayatStartNum == null || ayatEndNum == null) return;
    const [startNum, setStartNum] = useState(ayatStartNum);
    const [endNum, setEndNum] = useState(ayatEndNum);
    const flatListRef = useRef();

    const lastChangeTime = useRef(Date.now());
    // const [counter, setCounter] = useState(0);
    const counterUpdated = useRef(true);
    const currentAyahCount = useRef(0);
    const inactivityThreshold = 2500; // 5 seconds

    const setCertainBookmark = useContext(SuperContext)[3];
    const setCertainStat = useContext(SuperContext)[7];

    const onViewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCertainBookmark(
                "lastReadQuran",
                getAyatKey(
                    startNum +
                        viewableItems[Math.floor(viewableItems.length / 2)]
                            .index
                )
            );
        }
        lastChangeTime.current = Date.now();
        counterUpdated.current = false;
        currentAyahCount.current = Math.floor(viewableItems.length / 2);
        console.log("set last change time");
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (
                !counterUpdated.current &&
                Date.now() - lastChangeTime.current >= inactivityThreshold
            ) {
                console.log(currentAyahCount.current);
                // setCounter((prev) => prev + currentAyahCount.current);
                setCertainStat("ayahReadCount", currentAyahCount.current);
                counterUpdated.current = true;
                // lastChangeTime.current = Date.now(); // Reset to prevent continuous increments
            }
        }, 1000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    // useEffect(() => {
    //     if (
    //         flatListRef.current != null &&
    //         scrollTo >= startNum &&
    //         scrollTo <= ayatEndNum &&
    //         shouldScrollTo
    //     ) {
    //         console.log("scrollToIndex", scrollTo - startNum);
    //         scrollToIndex(
    //             Math.max(
    //                 Math.min(scrollTo - startNum, endNum - startNum),
    //                 0
    //             )
    //         );
    //         // setShouldScrollTo(false);
    //     }
    // }, [flatListRef.current == null]);

    const scrollToIndex = (index) => {
        if (isNaN(index)) return;
        flatListRef.current?.scrollToIndex({
            animated: true,
            index: index,
            viewPosition: 0.0,
            viewOffset: 0,
        });
    };

    const handleScroll = (event) => {
        let nativeEvent = event.nativeEvent;
        // console.log(nativeEvent);
        let posY = nativeEvent.contentOffset.y;
        let visibleHeight = nativeEvent.layoutMeasurement.height;
        let contentHeight = nativeEvent.contentSize.height;

        if (contentHeight - visibleHeight <= posY + 50)
            setEndNum(Math.min(endNum + 10, SurahLengths.ends[surahNum]));
    };

    useEffect(() => {
        setEndNum(ayatEndNum);
    }, [ayatEndNum]);

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
    // setShow(true);
    // setPageSoundRef("read");
    const [wordsI, setWordsI] = useState([0, 0, 0, 0]);
    const [finished, setActualFinished] = useState(true);
    const setFinished = (val) => {
        console.log(val);
        setActualFinished(val);
    };
    const [shouldPlay, setShouldPlay] = useState(false);

    let recitationID = useRef(7).current;
    getSettingsAsync().then((val) => {
        console.log(val.recitations.defaultRecitation.val);
        recitationID = val.recitations.defaultRecitation.val;
    });

    const [playingAyatNum, setActualActualPlayingAyatNum] = useState(1);
    const setActualPlayingAyatNum = (val) => {
        console.log(getAyatKey(val), playingAyatNum);
        setActualActualPlayingAyatNum(val);
    };
    const setPlayingAyatNum = (val) => {
        setFinished(false);
        setActualPlayingAyatNum(val);
        return val;
    };

    // useEffect(() => {
    //     if (soundRef == null) {
    //         setWordsI([0, 0, 0, 0]);
    //         setFinished(true);
    //         setShouldPlay(false);
    //     }
    // }, [soundRef == null]);

    useEffect(() => {
        if (!show && pageSoundRef == "read") {
            setWordsI([0, 0, 0, 0]);
            setFinished(true);
            setShouldPlay(false);
        }
        console.log("show", show);
    }, [show, pageSoundRef]);

    const handleUpdate = (status, ayatNum = playingAyatNum) => {
        const recitationAyah =
            loadRecitations()[recitationID + ""][ayatNum - 1];
        // console.log(ayatNum);
        findHighlightedSegment(
            status.positionMillis,
            recitationAyah,
            setWordsI
        );
    };

    const handleFinish = (ayatNum) => {
        getSettingsAsync().then((val) => {
            recitationID = val.recitations.defaultRecitation.val;
        });
        setFinished(true);
    };

    const handlePlayPressed = (ayatNum) => {
        getSettingsAsync().then((val) => {
            recitationID = val.recitations.defaultRecitation.val;
        });
        if (soundRef) {
            soundRef.unloadAsync().then(() => {
                console.log("unloaded");
            });
            // setSoundRef(null);
        }
        setPause(false);
        if (!finished) handleStopPressed(ayatNum);
        setShouldPlay(true);
        setFinished(false);
        console.log(getAyatKey(ayatNum));
        setActualPlayingAyatNum(ayatNum);
        let playAyatNum = ayatNum;
        if (ayatNum % 1 != 0) playAyatNum = 1;
        playVerse(
            recitationID,
            getSurahFromKey(getAyatKey(playAyatNum)),
            getVerseFromKey(getAyatKey(playAyatNum)),
            () => handleFinish(playAyatNum),
            (status) => {
                handleUpdate(status, playAyatNum);
            }
        ).then((sound) => {
            // console.log("soundRef", soundRef);
            setSoundRef(sound);
            setShow(true);
            setPageSoundRef("read");
            console.log(
                "----------------------------ayatNumplay pressed",
                playAyatNum,
                ayatNum
            );
            setPlayingDetails(
                QuranChapters.surahs[
                    parseInt(getAyatKey(ayatNum).split(":")[0]) - 1
                ].name_simple +
                    " | " +
                    getAyatKey(ayatNum)
            );
        });
        setCertainBookmark("lastReadQuran", getAyatKey(ayatNum));
    };

    const handleStopPressed = (ayatNum) => {
        console.log("stop pressed", soundRef);
        if (soundRef) {
            console.log("stopped");
            soundRef.unloadAsync();
            setSoundRef(null);
            setPageSoundRef("read");
            setShow(false);
            // setActualPlayingAyatNum(0);
            setWordsI([0, 0, 0, 0]);
            setFinished(true);
            setShouldPlay(false);
        }
    };

    const handleEndPausePressed = (ayatNum) => {
        if (!finished && soundRef) {
            setShouldPlay(!shouldPlay);
        }
    };

    const handlePauseOrPlayPressed = (ayatNum) => {
        if (!pause) {
            soundRef.pauseAsync().then(() => setPause(true));
        } else {
            soundRef.playAsync().then(() => setPause(false));
        }
    };

    useEffect(() => {
        // console.log("playingAyatNum: " + playingAyatNum);
    }, [playingAyatNum]);

    useEffect(() => {
        if (finished && shouldPlay) {
            const surahsEndAyatNums = getSurahEndAyatArray();
            let tempAyatNum =
                playingAyatNum != Quran.verses.length
                    ? playingAyatNum +
                      (playingAyatNum % 1 != 0 ||
                      surahsEndAyatNums.includes(playingAyatNum)
                          ? 0.5
                          : 1)
                    : 1;
            if (tempAyatNum > SurahLengths.ends[surahNum] && surahNum < 114) {
                increaseSurahNum();
            } else {
                scrollToIndex(
                    Math.max(
                        Math.min(tempAyatNum - startNum, endNum - startNum),
                        0
                    )
                );
            }
            let tempFinished = true;
            setFinished(tempFinished);
            setWordsI([0, 0, 0, 0]);
            if (
                !(
                    playingAyatNum >= SurahLengths.ends[surahNum] &&
                    surahNum >= 114
                )
            ) {
                // console.log(
                //     tempAyatNum >= SurahLengths.ends[surahNum] &&
                //         surahNum >= 114
                // );
                setActualPlayingAyatNum(tempAyatNum);
                handlePlayPressed(tempAyatNum);
            }
        }
        if (finished && !shouldPlay) {
            if (soundRef) {
                soundRef.unloadAsync();
                setSoundRef(null);
                setPageSoundRef("read");
                setShow(false);
                // setActualPlayingAyatNum(0);
                setWordsI([0, 0, 0, 0]);
                setFinished(true);
                setShouldPlay(false);
            }
        }
    }, [finished, shouldPlay, playingAyatNum]);

    const getData = () =>
        Array.from({ length: endNum - startNum + 1 }, (_, index) => {
            return { ayatNum: startNum + index };
        });

    if (!mushafFormat) {
        return (
            <>
                <FlatList
                    ref={flatListRef}
                    style={[styles.container, containerStyle]}
                    onScroll={handleScroll}
                    onScrollToIndexFailed={(originalFail) => {}}
                    data={getData()}
                    renderItem={(item) => {
                        let ayatNum = item.item.ayatNum;
                        return (
                            <AyatAndTrContainer
                                ayatNum={ayatNum}
                                finished={
                                    playingAyatNum == ayatNum ? finished : true
                                }
                                wordsI={
                                    playingAyatNum == ayatNum
                                        ? wordsI
                                        : [0, 0, 0, 0]
                                }
                                getWordSelected={getWordSelected}
                                setWordSelected={setWordSelected}
                                shouldPlay={shouldPlay}
                                onPlay={handlePlayPressed}
                                onStop={handleStopPressed}
                                onEndPause={handleEndPausePressed}
                                onPausePlay={handlePauseOrPlayPressed}
                                pause={pause}
                                setRecitationID={() => {}}
                            />
                        );
                    }}
                    keyExtractor={(item, index) => {
                        return item.ayatNum;
                    }}
                    onViewableItemsChanged={onViewableItemsChanged}
                    // snapToInterval={itemHeight}
                    ListHeaderComponent={
                        <>
                            {header({
                                surahNum: surahNum,
                                onPlay: handlePlayPressed,
                                onEndPause: handleEndPausePressed,
                                onStop: handleStopPressed,
                                isPlaying: finished
                                    ? false
                                    : playingAyatNum % 1 != 0,
                                shouldPlay: shouldPlay,
                                includePlay:
                                    startNum ==
                                    SurahLengths.ends[surahNum - 1] + 1,
                                includeBismillah:
                                    startNum ==
                                    SurahLengths.ends[surahNum - 1] + 1,
                            })}
                            {startNum > SurahLengths.ends[surahNum - 1] + 1 && (
                                <ConsistentButton
                                    onClick={() => {
                                        setStartNum(
                                            Math.max(
                                                startNum - 10,
                                                SurahLengths.ends[
                                                    surahNum - 1
                                                ] + 1
                                            )
                                        );
                                    }}
                                    style={styles.showPrevious}
                                >
                                    {/* <Text style={styles.showPreviousText}>Go back</Text> */}
                                    {getIcon(
                                        "Ionicons",
                                        "chevron-up",
                                        25,
                                        Colours.fgColor
                                    )}
                                </ConsistentButton>
                            )}
                        </>
                    }
                    ListFooterComponent={
                        endNum <
                            SurahLengths.ends[SurahLengths.ends.length - 1] &&
                        endNum == SurahLengths.ends[surahNum] ? (
                            <ConsistentButton
                                style={styles.nextSurah}
                                onClick={() => {
                                    increaseSurahNum();
                                    scrollToIndex(0);
                                }}
                            >
                                {getIcon(
                                    "Ionicons",
                                    "chevron-forward",
                                    25,
                                    Colours.fgColor
                                )}
                                <Text style={styles.nextSurahText}>
                                    Next Surah
                                </Text>
                            </ConsistentButton>
                        ) : (
                            <View>
                                <LoadingScreen
                                    iconStyle={{
                                        width: 35,
                                        height: 35,
                                        margin: 5,
                                    }}
                                />
                            </View>
                        )
                    }
                    // removeClippedSubviews={true}
                />
            </>
        );
    } else {
        return (
            <FlatList
                onScroll={handleScroll}
                data={[1]}
                renderItem={(item) => {
                    return (
                        <>
                            {header({
                                surahNum: surahNum,
                                onPlay: handlePlayPressed,
                                onEndPause: handleEndPausePressed,
                                onStop: handleStopPressed,
                                isPlaying: finished
                                    ? false
                                    : playingAyatNum % 1 != 0,
                                shouldPlay: shouldPlay,
                                includePlay:
                                    startNum ==
                                    SurahLengths.ends[surahNum - 1] + 1,
                                includeBismillah:
                                    startNum ==
                                    SurahLengths.ends[surahNum - 1] + 1,
                            })}
                            <Text style={styles.pageText}>
                                {Array(endNum - startNum + 1)
                                    .fill("")
                                    .map((_, index) => (
                                        <>
                                            <Ayat
                                                onPress={(ayatNum) =>
                                                    console.log(
                                                        "pressed",
                                                        ayatNum
                                                    )
                                                }
                                                ayatNum={startNum + index}
                                                startWord={0}
                                                endWord={undefined}
                                            />
                                            <Text>{"  "}</Text>
                                        </>
                                    ))}
                                {Platform.OS == "android" &&
                                    Array(
                                        Math.round(
                                            (40 / 411.42857142857144) *
                                                Dimensions.get("window").width
                                        )
                                    )
                                        .fill("")
                                        .map((_, index) => (
                                            <Text
                                                style={{
                                                    fontSize: 10,
                                                    color: Colours.fgColor,
                                                }}
                                            >
                                                {"a "}
                                            </Text>
                                        ))}
                            </Text>
                            {endNum <
                                SurahLengths.ends[
                                    SurahLengths.ends.length - 1
                                ] && endNum == SurahLengths.ends[surahNum] ? (
                                <ConsistentButton
                                    style={styles.nextSurah}
                                    onClick={() => {
                                        increaseSurahNum();
                                        scrollToIndex(0);
                                    }}
                                >
                                    {getIcon(
                                        "Ionicons",
                                        "chevron-forward",
                                        25,
                                        Colours.fgColor
                                    )}
                                    <Text style={styles.nextSurahText}>
                                        Next Surah
                                    </Text>
                                </ConsistentButton>
                            ) : (
                                <View>
                                    <LoadingScreen
                                        iconStyle={{
                                            width: 35,
                                            height: 35,
                                            margin: 5,
                                        }}
                                    />
                                </View>
                            )}
                        </>
                    );
                }}
            />
        );
    }
};

const styles = StyleSheet.create({
    container: {
        // marginTop: 25,
    },
    showMore: {
        flexDirection: "row",
        justifyContent: "center",
    },
    nextSurah: {
        flexDirection: "row-reverse",
        alignItems: "center",
    },
    nextSurahText: {
        color: Colours.fgColor,
        marginRight: 2,
        marginBottom: 1,
        fontSize: 18,
    },
    showPrevious: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 10,
    },
    pageText: {
        textAlign: "justify",
        writingDirection: "rtl",
        paddingLeft: "auto",
        lineHeight: 50,
    },
    // scrollToContainer: {
    //     position: "absolute",
    //     bottom: 35,
    //     right: 35,
    //     flexDirection: "row",
    //     alignItems: "center",
    //     justifyContent: "flex-end",
    //     padding: 10,
    //     borderRadius: 15,
    //     backgroundColor: Colours.fgMainDark,
    // },
    // scrollToText: {
    //     fontSize: 18,
    //     color: Colours.fgColor,
    // },
});

function getAyatNumFromKey(key) {
    for (let i = 0; i < Quran.verses.length; i++) {
        if (Quran.verses[i].verse_key == key) {
            return i + 1;
        }
    }
    return -1;
}

function getSurahEndAyatArray() {
    let arr = [];
    let ayatCount = 0;
    let surahs = QuranChapters.surahs;

    for (let i = 0; i < surahs.length; i++) {
        if (surahs[i].bismillah_pre) {
            arr.push(ayatCount);
        }
        ayatCount += surahs[i].verses_count;
    }

    return arr;
}

function getSurahFromKey(key) {
    return parseInt(key.split(":")[0]);
}

function getVerseFromKey(key) {
    return parseInt(key.split(":")[1]);
}

function getAyatKey(ayatNum) {
    if (ayatNum == null || isNaN(ayatNum)) {
        return "1:1";
    }
    if (ayatNum % 1 != 0) {
        let surah =
            Quran.verses[Math.round(ayatNum) - 1].verse_key.split(":")[0];
        let ayat =
            parseInt(
                Quran.verses[Math.round(ayatNum) - 1].verse_key.split(":")[1]
            ) - 1;
        return surah + ":" + ayat;
    }
    return Quran.verses[Math.round(ayatNum) - 1].verse_key;
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

export default AyatsContainer;
