import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { SuperContext } from "../../_layout";
import Colours from "../../utils/colours.json";
import { getIcon } from "../../utils/icon";

import Surahs from "../../../assets/quran/surahs.json";
import ConsistentButton from "../../components/ConsistentButton";
import { getBookmarksAsync } from "../../utils/bookmarks";
import { GlobalContext } from "../_layout";
import { router } from "expo-router";

const Index = () => {
    let tempBookmarks = useContext(SuperContext)[2];
    let setCertainBookmark = useContext(SuperContext)[3];
    const currentPage = useContext(GlobalContext)[10];
    const [bookmarks, setBookmarks] = useState(tempBookmarks);
    const [removed, setRemovedActual] = useState([]); // [key, reference]
    const [goAgain, setGoAgain] = useState(false);
    const setRemoved = (val) => {
        setRemovedActual(val);
    };

    const handleLayout = () => {
        getBookmarksAsync().then((res) => {
            setBookmarks(res);
            setGoAgain(!goAgain);
        });
    };

    useEffect(() => {
        if (currentPage == "bookmarks") handleLayout();
    }, [goAgain, currentPage]);

    return (
        <ScrollView style={styles.container}>
            {getBookmarkObjects(
                removed,
                setRemoved,
                bookmarks,
                setCertainBookmark
            )}
        </ScrollView>
    );
};

function getBookmarkObjects(
    removed,
    setRemoved,
    bookmarks,
    setCertainBookmark
) {
    // console.log(bookmarks);
    let bookmarksObject = [];
    for (let i = 0; i < Object.keys(bookmarks).length; i++) {
        let k = Object.keys(bookmarks)[i];
        if (k != "lastReadQuran") {
            bookmarksObject.push(
                <View style={styles.titleContainer}>
                    {getIcon("Ionicons", "folder", 30, Colours.fgMainDark)}
                    <Text style={styles.titleText}>
                        {capitalizeFirstLetter(k)}
                    </Text>
                </View>
            );
            for (let j = 0; j < bookmarks[k].length; j++) {
                if (
                    bookmarks[k][j] != null &&
                    bookmarks[k][j].reference != "1000:1" &&
                    bookmarks[k][j].reference != "test:1" &&
                    !includesPair(removed, [k, bookmarks[k][j].reference])
                ) {
                    console.log(
                        k,
                        bookmarks[k][j].reference,
                        includesPair(removed, [k, bookmarks[k][j].reference])
                    );
                    let link =
                        k == "quran" ? "read" : k == "hadith" ? "hadiths" : k;

                    let text = getTextFromReference(
                        bookmarks[k][j].reference,
                        k
                    );
                    bookmarksObject.push(
                        <ConsistentButton
                            onClick={() => {
                                if (link == "read") {
                                    router.push(
                                        `/${link}/${
                                            bookmarks[k][j].reference.split(
                                                ":"
                                            )[0]
                                        }/${
                                            bookmarks[k][j].reference.split(
                                                ":"
                                            )[1]
                                        }`
                                    );
                                }
                            }}
                            style={styles.referenceContainer}
                        >
                            <Text style={styles.referenceText}>
                                {text[0]}
                                <Text style={styles.referenceTextNumber}>
                                    {" - " + text[1]}
                                </Text>
                            </Text>
                            <ConsistentButton
                                onClick={() => {
                                    const temp = removed;
                                    temp.push([k, bookmarks[k][j].reference]);
                                    setRemoved(temp);
                                    console.log(temp);
                                    setCertainBookmark(
                                        k,
                                        bookmarks[k][j].reference,
                                        "remove"
                                    );
                                }}
                            >
                                {getIcon(
                                    "Ionicons",
                                    "close",
                                    30,
                                    Colours.fgGrey
                                )}
                            </ConsistentButton>
                        </ConsistentButton>
                    );
                }
            }
        }
    }
    return bookmarksObject;
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    titleContainer: {
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    titleText: {
        color: Colours.fgColor,
        fontSize: 25,
        fontWeight: "bold",
        marginLeft: 15,
    },
    referenceContainer: {
        paddingLeft: 20,
        paddingVertical: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    referenceText: {
        color: Colours.fgColor,
        fontSize: 18,
        marginLeft: 15,
    },
    referenceTextNumber: {
        color: Colours.fgGrey,
    },
});

function includesPair(array, pair) {
    return array.some((item) => item[0] === pair[0] && item[1] === pair[1]);
}

const capitalizeFirstLetter = (str) => {
    return str
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(" ");
};

function getTextFromReference(reference, key) {
    if (key == "quran") {
        return [
            Surahs.surahs[parseInt(reference.split(":")[0]) - 1].name_simple,
            reference.split(":")[1],
        ];
    }
    return;
}

export default Index;
