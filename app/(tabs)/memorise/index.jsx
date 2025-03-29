import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Ayat from "../../Read/components/Ayat";
// import ConsistentButton from "../../components/ConsistentButton";
import VersePages from "../../../assets/quran/versesByPage.json";
import { FlatList } from "react-native-web";

const Index = () => {
    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <Text style={{ color: "white" }}>Coming Soon...</Text>
        </View>
    );
    let maxPage = 1;
    let pages = Array.from({ length: maxPage }, (_, index) => 1 + index);
    let pageNum = 9;
    let page = VersePages[`page${pageNum}Verses`];
    let startWordIndex = page[0].startNum;
    let startAyatIndex = page[0].ayatNum;
    let endAyatIndex = page[page.length - 1].ayatNum;
    let endWordIndex = page[page.length - 1].endNum;

    return (
        <Text style={styles.pageText}>
            {Array(endAyatIndex - startAyatIndex + 1)
                .fill("")
                .map((_, index) => (
                    <>
                        <Ayat
                            onPress={(ayatNum) =>
                                console.log("pressed", ayatNum)
                            }
                            ayatNum={startAyatIndex + index}
                            startWord={index == 0 ? startWordIndex : 0}
                            endWord={
                                index == endAyatIndex - startAyatIndex
                                    ? endWordIndex
                                    : undefined
                            }
                        />
                        <Text>{"  "}</Text>
                    </>
                ))}
            {Platform.OS == "android" && (
                <Text>
                    {
                        "                                                                                                                                        "
                    }
                </Text>
            )}
        </Text>
        // <FlatList
        //     style={styles.container}
        //     contentContainerStyle={styles.contentContainer}
        //     data={pages}
        //     initialNumToRender={15}
        //     renderItem={({ item }) => {
        //         let page = VersePages[`page${item}Verses`];
        //         let startWordIndex = page[0].startNum;
        //         let startAyatIndex = page[0].ayatNum;
        //         let endAyatIndex = page[page.length - 1].ayatNum;
        //         let endWordIndex = page[page.length - 1].endNum;
        //         return (
        //                 <Text style={styles.pageText}>
        //                     {Array(endAyatIndex - startAyatIndex + 1)
        //                         .fill("")
        //                         .map((_, index) => (
        //                             <>
        //                                 <Ayat
        //                                     onPress={(ayatNum) =>
        //                                         console.log("pressed", ayatNum)
        //                                     }
        //                                     ayatNum={startAyatIndex + index}
        //                                     startWord={
        //                                         index == 0 ? startWordIndex : 0
        //                                     }
        //                                     endWord={
        //                                         index ==
        //                                         endAyatIndex - startAyatIndex
        //                                             ? endWordIndex
        //                                             : undefined
        //                                     }
        //                                 />
        //                                 <Text>{"  "}</Text>
        //                             </>
        //                         ))}
        //                     {Platform.OS == "android" && (
        //                         <Text>
        //                             {
        //                                 "                                                                                                                                        "
        //                             }
        //                         </Text>
        //                     )}
        //                 </Text>
        //         );
        //     }}
        // />
        // <FlatList
        //     style={styles.container}
        //     contentContainerStyle={styles.contentContainer}
        // >
    );
};

const styles = StyleSheet.create({
    container: {
        height: 500,
        padding: 20,
    },
    contentContainer: {
        // flex: 1,
        // backgroundColor: "grey",
        minHeight: "100%",
        justifyContent: "center",
    },
    pageText: {
        textAlign: "justify",
        writingDirection: "rtl",
        paddingLeft: "auto",
        lineHeight: 50,
        borderBottomColor: "white",
        borderBottomWidth: 2,
    },
    text: {
        color: "white",
        fontSize: 20,
    },
});

export default Index;
