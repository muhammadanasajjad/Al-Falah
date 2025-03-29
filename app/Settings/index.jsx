import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Colours from "../utils/colours.json";
import ConsistentSwitch from "../components/ConsistentSwitch";
import { SuperContext } from "../_layout";
import ConsistentPicker from "../components/ConsistentPicker";
import { getIcon } from "../utils/icon";
import { router } from "expo-router";
import ConsistentButton from "../components/ConsistentButton";
import { saveRecitation } from "../utils/saveRecitations";
import { loadRecitations } from "../utils/loadRecitations";
import Reciters from "../../assets/quran/reciters.json";

const Index = () => {
    const [settings, setCertainSettings] = useContext(SuperContext);
    const splitTaskInto = 35;
    const [progresses, actualSetProgresses] = useState(
        Array.from({ length: splitTaskInto }, () => 2)
    );
    const [selectedRecitation, setSelectedRecitation] = useState(7);
    const [scrollY, setScrollY] = useState(0);
    const handleScroll = (event) => {
        console.log(event.nativeEvent);
        setScrollY(event.nativeEvent.contentOffset.y);
    };

    const setProgress = (value) => {
        actualSetProgresses(Array.from({ length: splitTaskInto }, () => value));
    };

    return (
        <ScrollView
            style={styles.container}
            nestedScrollEnabled={true}
            onScroll={handleScroll}
        >
            <View>
                {Object.keys(settings).map((key, i) => {
                    let category = settings[key];
                    return (
                        <View style={styles.categoryContainer}>
                            {Object.keys(category).map((secondaryKey, j) => {
                                let secondary = category[secondaryKey];
                                if (secondary.options == "custom") {
                                    if (
                                        key == "prayerTimes" &&
                                        secondaryKey == "calculationMethod"
                                    ) {
                                        return (
                                            <Pressable
                                                onPress={() => {
                                                    router.push(
                                                        "../CalculationMethod"
                                                    );
                                                }}
                                                style={styles.customContainer}
                                            >
                                                <Text
                                                    style={styles.customTitle}
                                                >
                                                    Select Prayer Method
                                                </Text>
                                                {getIcon(
                                                    "Ionicons",
                                                    "open",
                                                    25,
                                                    Colours.fgMainDark
                                                )}
                                            </Pressable>
                                        );
                                    }
                                }
                                if (
                                    key == "recitations" &&
                                    secondaryKey == "title"
                                ) {
                                    return (
                                        <>
                                            <View style={styles.categoryTitle}>
                                                <Text
                                                    style={
                                                        styles.categoryTitletext
                                                    }
                                                >
                                                    {secondary}
                                                </Text>
                                            </View>
                                            <View
                                                style={{
                                                    padding: 10,
                                                    paddingLeft: 15,
                                                    flexDirection: "row",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <ConsistentPicker
                                                    extraStyles={{
                                                        maxWidth: "50%",
                                                    }}
                                                    options={getReciters()}
                                                    originalValue={
                                                        selectedRecitation
                                                    }
                                                    onValueChange={
                                                        setSelectedRecitation
                                                    }
                                                    scrollOffset={scrollY}
                                                />
                                                <ConsistentButton
                                                    onClick={() => {
                                                        if (
                                                            mean(progresses) ==
                                                                0 ||
                                                            mean(progresses) >=
                                                                1
                                                        ) {
                                                            setProgress(0);
                                                            for (
                                                                let i = 0;
                                                                i <
                                                                splitTaskInto;
                                                                i++
                                                            ) {
                                                                saveRecitation(
                                                                    selectedRecitation,
                                                                    actualSetProgresses,
                                                                    i,
                                                                    splitTaskInto
                                                                );
                                                            }
                                                        }
                                                    }}
                                                    style={{
                                                        borderWidth: 2,
                                                        borderColor:
                                                            Colours.fgMainDark,
                                                        // backgroundColor: Colours.fgMainDark,
                                                        padding: 2,
                                                        paddingHorizontal: 10,
                                                        borderRadius: 30,
                                                        flexDirection: "row",
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: Colours.fgColor,
                                                            margin: 5,
                                                            marginRight: 10,
                                                            fontSize: 16,
                                                        }}
                                                    >
                                                        Download
                                                    </Text>
                                                    {getIcon(
                                                        "Ionicons",
                                                        "download",
                                                        25,
                                                        Colours.fgMainDark
                                                    )}
                                                </ConsistentButton>
                                            </View>
                                            {mean(progresses) < 1.0 && (
                                                <View
                                                    style={styles.progressBar}
                                                >
                                                    <View
                                                        style={[
                                                            styles.progress,
                                                            {
                                                                width: `${
                                                                    mean(
                                                                        progresses
                                                                    ) * 100
                                                                }%`,
                                                            },
                                                        ]}
                                                    ></View>
                                                    <View
                                                        style={
                                                            styles.progressTextContainer
                                                        }
                                                    >
                                                        <Text
                                                            style={
                                                                styles.progressText
                                                            }
                                                        >
                                                            {`${Math.round(
                                                                mean(
                                                                    progresses
                                                                ) * 6236
                                                            )}/6236`}
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}
                                        </>
                                    );
                                }
                                if (secondaryKey == "title") {
                                    return (
                                        <View style={styles.categoryTitle}>
                                            <Text
                                                style={styles.categoryTitletext}
                                            >
                                                {secondary}
                                            </Text>
                                        </View>
                                    );
                                } else if (typeof secondary.val == "boolean") {
                                    return (
                                        <View
                                            style={
                                                styles.trueFalseOptionContainer
                                            }
                                        >
                                            <Text
                                                style={
                                                    styles.trueFalseOptionTitle
                                                }
                                            >
                                                {secondary.title}
                                            </Text>
                                            <ConsistentSwitch
                                                originalValue={secondary.val}
                                                onValueChange={(val) => {
                                                    setCertainSettings(
                                                        key,
                                                        secondaryKey,
                                                        val
                                                    );
                                                }}
                                            />
                                        </View>
                                    );
                                } else {
                                    return (
                                        <View
                                            style={
                                                styles.multipleChoiceOptionContainer
                                            }
                                        >
                                            <Text
                                                style={
                                                    styles.multipleChoiceOptionTitle
                                                }
                                            >
                                                {secondary.title}
                                            </Text>
                                            <ConsistentPicker
                                                extraStyles={{
                                                    maxWidth: "50%",
                                                    // marginTop: 18,
                                                    // marginLeft: 8,
                                                }}
                                                options={secondary.options}
                                                originalValue={secondary.val}
                                                onValueChange={(val) => {
                                                    setCertainSettings(
                                                        key,
                                                        secondaryKey,
                                                        val
                                                    );
                                                }}
                                                scrollOffset={scrollY}
                                                // color={Colours.fgColor}
                                            />
                                        </View>
                                    );
                                }
                            })}
                        </View>
                    );
                })}

                {/* {Platform.OS != "asdf" ? (
                    <>
                        <View style={styles.categoryTitle}>
                            <Text style={styles.categoryTitletext}>
                                {"Recitations"}
                            </Text>
                        </View>
                        <View
                            style={{
                                padding: 10,
                                paddingLeft: 15,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <ConsistentPicker
                                extraStyles={{
                                    maxWidth: "50%",
                                }}
                                options={getReciters()}
                                originalValue={selectedRecitation}
                            />
                            <ConsistentButton
                                onClick={() => {
                                    if (
                                        mean(progresses) == 0 ||
                                        mean(progresses) >= 1
                                    ) {
                                        setProgress(0);
                                        for (
                                            let i = 0;
                                            i < splitTaskInto;
                                            i++
                                        ) {
                                            saveRecitation(
                                                selectedRecitation,
                                                actualSetProgresses,
                                                i,
                                                splitTaskInto
                                            );
                                        }
                                    }
                                }}
                                style={{
                                    borderWidth: 2,
                                    borderColor: Colours.fgMainDark,
                                    // backgroundColor: Colours.fgMainDark,
                                    padding: 2,
                                    paddingHorizontal: 10,
                                    borderRadius: 30,
                                    flexDirection: "row",
                                }}
                            >
                                <Text
                                    style={{
                                        color: Colours.fgColor,
                                        margin: 5,
                                        marginRight: 10,
                                        fontSize: 16,
                                    }}
                                >
                                    Download
                                </Text>
                                {getIcon(
                                    "Ionicons",
                                    "download",
                                    25,
                                    Colours.fgMainDark
                                )}
                            </ConsistentButton>
                        </View>
                        {mean(progresses) < 1.0 && (
                            <View style={styles.progressBar}>
                                <View
                                    style={[
                                        styles.progress,
                                        {
                                            width: `${mean(progresses) * 100}%`,
                                        },
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
                    </>
                ) : (
                    <>
                        <Text style={styles.text}>
                            Cannot download on the web
                        </Text>
                    </>
                )} */}
            </View>
        </ScrollView>
    );
};

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

function getReciters() {
    const reciters = [];
    for (let i = 0; i < Reciters.reciters.length; i++) {
        reciters.push({
            name:
                Reciters.reciters[i].reciter_name +
                (Reciters.reciters[i].style
                    ? " - " + Reciters.reciters[i].style
                    : ""),
            val: Reciters.reciters[i].id,
        });
    }
    return reciters;
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },
    categoryContainer: {
        marginBottom: 15,
    },
    categoryTitle: {
        backgroundColor: Colours.bgDarkGrey,
        padding: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    categoryTitletext: {
        color: Colours.fgColor,
        fontSize: 20,
    },
    trueFalseOptionContainer: {
        padding: 10,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    trueFalseOptionTitle: {
        fontSize: 16,
        color: Colours.fgColor,
    },
    multipleChoiceOptionContainer: {
        padding: 10,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
    },
    multipleChoiceOptionTitle: {
        fontSize: 16,
        color: Colours.fgColor,
        flex: 1,
    },
    customContainer: {
        padding: 10,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    customTitle: {
        fontSize: 16,
        color: Colours.fgColor,
    },
    progressBar: {
        borderRadius: 30,
        width: "90%",
        height: 30,
        marginBottom: 20,
        marginHorizontal: "auto",
        // backgroundColor: Colours.fgGrey,
        borderWidth: 2,
        borderColor: Colours.fgMainDark,
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
        color: Colours.fgColor,
    },
    text: {
        color: "white",
        marginTop: 15,
        textAlign: "center",
    },
});

export default Index;

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
