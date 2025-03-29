import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    TextInput,
    View,
    Text,
    ScrollView,
    Image,
} from "react-native";
import HadithList from "../../Hadith/components/HadithList";
import { getIcon } from "../../utils/icon";

import Colours from "../../utils/colours.json";
import ConsistentButton from "../../components/ConsistentButton";
import { searchHadiths } from "../../utils/searchHadiths";
import { LinearGradient } from "expo-linear-gradient";
import HadithsBooks from "../../Hadith/components/HadithsBooks";

function Hadiths({} = props) {
    const [isMainPage, setIsMainPage] = useState(true);
    const [hadiths, setActualHadiths] = useState(null);
    const [currentSearchValue, setCurrentSearchValue] = useState(null);
    const [searchPrompt, setSearchPrompt] = useState(null);
    const [dailyHadithOpen, setDailyHadithOpen] = useState(true);

    const setHadiths = (val) => {
        setActualHadiths(val);
    };

    useEffect(() => {
        if (hadiths) {
            console.log("loadedHadiths: " + hadiths[0]);
        }
        if (searchPrompt != null) {
            search(searchPrompt, setHadiths);
        }
    }, [searchPrompt]);

    const handleSearch = () => {
        if (currentSearchValue != searchPrompt) {
            setDailyHadithOpen(false);
            setIsMainPage(false);
            setHadiths(null);
            setSearchPrompt(currentSearchValue);
        }
    };

    return (
        <>
            <View
                style={[styles.container, !isMainPage ? { marginleft: 5 } : {}]}
            >
                {!isMainPage && (
                    <ConsistentButton
                        onClick={() => {
                            setIsMainPage(true);
                        }}
                        style={styles.backButton}
                    >
                        {getIcon("Ionicons", "chevron-back")}
                    </ConsistentButton>
                )}
                <View style={styles.searchContainer}>
                    <TextInput
                        onChangeText={(val) => {
                            setCurrentSearchValue(val);
                        }}
                        onSubmitEditing={handleSearch}
                        placeholder="Search for Hadiths"
                        placeholderTextColor={Colours.fgGrey}
                        style={styles.searchInput}
                    />
                    <ConsistentButton onClick={handleSearch}>
                        {getIcon("Ionicons", "search", 25)}
                    </ConsistentButton>
                </View>
            </View>
            <InterestingHadith isOpen={dailyHadithOpen} forcedOpen={false} />
            {/* <Hadith /> */}

            <HadithsBooks
                isMainPage={isMainPage}
                setIsMainPage={(val) => {
                    setDailyHadithOpen(val);
                    setIsMainPage(false);
                }}
                setHadiths={setHadiths}
            />
            {!isMainPage &&
                (hadiths == null ? (
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <ActivityIndicator />
                    </View>
                ) : (
                    <HadithList hadiths={hadiths.length != 0 ? hadiths : []} />
                ))}
        </>
    );
}

const InterestingHadith = ({ isOpen = true, forcedOpen = false } = props) => {
    const [open, setOpen] = useState(isOpen || forcedOpen);
    // console.log(open);

    useEffect(() => {
        if (isOpen == false && forcedOpen == false) setOpen(false);
    }, [isOpen]);

    return (
        <LinearGradient
            style={[
                styles.interestingHadithContainer,
                open ? {} : { paddingVertical: 10 },
            ]}
            colors={[Colours.fgMainBright, Colours.fgMainDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {open && (
                <Image
                    style={{
                        position: "absolute",
                        height: "100%",
                        // width: "auto",
                        bottom: 0,
                        left: 0,
                        opacity: 0.5,
                    }}
                    resizeMode={"contain"}
                    // resizeMethod="scale"
                    source={require("../../../assets/img/books.png")}
                />
            )}
            <View style={styles.interestingHadithTitleContainer}>
                <View style={{ alignItems: "center", flexDirection: "row" }}>
                    {getIcon("Ionicons", "reader", 20, Colours.fgColor)}
                    <Text
                        style={{
                            color: Colours.fgColor,
                            marginLeft: 7,
                            fontSize: 17,
                        }}
                    >
                        Interesting Hadith
                    </Text>
                </View>
                {!forcedOpen && (
                    <ConsistentButton
                        onClick={() => {
                            setOpen(!open);
                        }}
                    >
                        {open
                            ? getIcon(
                                  "Ionicons",
                                  "chevron-up",
                                  20,
                                  Colours.fgColor
                              )
                            : getIcon(
                                  "Ionicons",
                                  "chevron-down",
                                  20,
                                  Colours.fgColor
                              )}
                    </ConsistentButton>
                )}
            </View>
            {open && (
                <>
                    <Text
                        style={{
                            marginTop: 10,
                            color: Colours.fgColor,
                            fontSize: 25,
                            fontWeight: "bold",
                            lineHeight: 25,
                        }}
                    >
                        {"Sahih Bukhari\n"}
                        <Text
                            style={{
                                color: Colours.fgColor,
                                fontSize: 20,
                                fontWeight: "100",
                                lineHeight: 20,
                            }}
                        >
                            35
                        </Text>
                    </Text>
                    <Text
                        numberOfLines={4}
                        style={{
                            color: Colours.fgColor,
                            fontSize: 16,
                            marginTop: 15,
                            textShadowColor: Colours.bgColour,
                            textShadowOffset: { width: 0, height: 0 },
                            textShadowRadius: 20,
                            width: "85%",
                        }}
                    >
                        Cool Hadith about the prophet should be inserted here it
                        shouldn't bee too long but not to short either sadly
                        this might be too long so we might need to cut it off at
                        cuattro or four or fier or quatre lines
                    </Text>
                </>
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 0,
        margin: 15,
        marginBottom: 0,
        flexDirection: "row",
        alignItems: "center",
    },
    searchContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 5,
        paddingHorizontal: 15,
        borderRadius: 30,
        backgroundColor: Colours.bgDarkGrey,
    },
    searchInput: {
        height: 40,
        color: "white",
        fontSize: 20,
        width: "80%",
        position: "relative",
    },
    interestingHadithContainer: {
        margin: 15,
        marginBottom: 0,
        padding: 20,
        borderRadius: 10,
        overflow: "hidden",
    },
    interestingHadithTitleContainer: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
    },
    backButton: {
        padding: 10,
    },
});

async function search(searchQuery, setHadiths) {
    let results = searchHadiths(searchQuery);

    let fixedResults = [];
    for (let i = 0; i < results.length; i++) {
        let obj = {
            book: results[i].customReference.split(":")[0],
            number: results[i].customReference.split(":")[1],
        };
        fixedResults.push(obj);
    }
    setHadiths(fixedResults);
    // const index = new FlexSearch.Document({
    // 	document: {
    // 		id: "customReference",
    // 		index: [
    // 			{
    // 				field: "actualReference",
    // 				preset: "performance",
    // 				optimize: true,
    // 				cache: true,
    // 				fastupdate: true,
    // 			},
    // 			{
    // 				field: "hadithEnglish",
    // 				preset: "performance",
    // 				optimize: true,
    // 				cache: true,
    // 				fastupdate: true,
    // 			},
    // 			{
    // 				field: "englishNarrator",
    // 				preset: "performance",
    // 				optimize: true,
    // 				cache: true,
    // 				fastupdate: true,
    // 			},
    // 		],
    // 	},
    // });

    // let hadiths = [];
    // for (let i = 0; i < Object.keys(HadithBooks).length; i++) {
    // 	let currentHadiths = HadithBooks[Object.keys(HadithBooks)[i]];
    // 	for (let hadithIndex in currentHadiths) {
    // 		let hadith = currentHadiths[hadithIndex];
    // 		hadith.customReference = hadith.bookSlug + ":" + hadith.hadithNumber;
    // 		hadith.actualReference = hadith.book.bookName + " " + hadith.hadithNumber;
    // 		hadiths.push(hadith);
    // 	}
    // }
    // console.log("created hadiths array");
    // hadiths.forEach((hadith) => index.add(hadith));

    // index.searchAsync(searchQuery).then((searchResult) => {
    // 	console.log("foundSearchResults");
    // 	if (searchResult.length > 0) {
    // 		let result = searchResult[0].result;
    // 		// console.log(result);

    // 		let resultsFound = [];
    // 		result.forEach((val, i) => {
    // 			let obj = { book: val.split(":")[0], number: val.split(":")[1] };
    // 			resultsFound.push(obj);
    // 		});

    // 		setHadiths(resultsFound);
    // 	} else {
    // 		setHadiths([]);
    // 	}
    // });

    // var index = elasticlunr(function () {
    // 	this.addField("bookSlug");
    // 	this.addField("hadithEnglish");
    // 	this.addField("hadithNumber");
    // 	this.addField("englishNarrator");
    // 	this.setRef("hadithNumber");
    // });

    // let results = {};

    // let options = {
    // 	keys: [
    // 		"bookSlug",
    // 		"hadithEnglish",
    // 		"hadithNumber",
    // 		"englishNarrator",
    // 		"book.bookName",
    // 		"chapter.chapterNumber",
    // 	],
    // };
    // const fuse = new Fuse.default(hadiths, options);
    // results[book] = fuse.search(searchQuery);
    // console.log(results[book]);
    // let resultsArray = getResultsArray(results);
    // resultsArray.push(...currentResults);
    // setHadiths(sortResultsArray(resultsArray));
}

function getResultsArray(data) {
    const result = [];
    for (const bookName in data) {
        if (data.hasOwnProperty(bookName)) {
            data[bookName].forEach((item) => {
                result.push({
                    book: bookName,
                    number: item.ref,
                    score: item.score,
                });
            });
        }
    }
    console.log(result);
    return result;
}

function sortResultsArray(results) {
    return results.sort((a, b) => b.score - a.score);
}

export default Hadiths;
