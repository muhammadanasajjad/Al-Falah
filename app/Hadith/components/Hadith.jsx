import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getIcon } from "../../utils/icon";
import ConsistentButton from "../../components/ConsistentButton";

import Colours from "../../utils/colours.json";
// import Books from "../../assets/hadiths/allBooks.json";

let abudawud = require("../../../assets/hadiths/abudawud.json");
let bukhari = require("../../../assets/hadiths/bukhari.json");
let dehlawi = require("../../../assets/hadiths/dehlawi.json");
let ibnmajah = require("../../../assets/hadiths/ibnmajah.json");
let malik = require("../../../assets/hadiths/malik.json");
let muslim = require("../../../assets/hadiths/muslim.json");
let nasai = require("../../../assets/hadiths/nasai.json");
let nawawi = require("../../../assets/hadiths/nawawi.json");
let qudsi = require("../../../assets/hadiths/qudsi.json");
let tirmidhi = require("../../../assets/hadiths/tirmidhi.json");

function Hadith({ book = "bukhari", number = 1 } = props) {
    const [arabicOpen, setArabicOpen] = useState(false);

    const onArabicOpen = () => {
        setArabicOpen(!arabicOpen);
    };

    let hadith = findHadithFromNumber(getBook(book), number);
    // console.log(hadith);

    function getIconText(name) {
        const words = name.split(/[\s-]+/);
        const firstLetter = words[0][0];
        const lastLetter = words[words.length - 1][0];
        return firstLetter + lastLetter;
    }

    return (
        <View style={styles.hadithContainer}>
            <View style={styles.hadithTopContainer}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={styles.bookIcon}>
                        <Text style={styles.bookIconText}>
                            {getIconText(hadith.book.name)}
                        </Text>
                    </View>
                    <Text style={styles.hadithNarrator} numberOfLines={3}>
                        {hadith.englishNarrator
                            ? hadith.englishNarrator
                            : hadith.hadithEnglish.split(":").length > 1
                            ? hadith.hadithEnglish.split(":")[0]
                            : ""}
                    </Text>
                </View>
                <View>
                    <ConsistentButton>
                        {getIcon(
                            "Ionicons",
                            "bookmark-outline",
                            26,
                            Colours.fgMainDark
                        )}
                    </ConsistentButton>
                </View>
            </View>
            <Text style={styles.hadithText} numberOfLines={arabicOpen ? 0 : 10}>
                {hadith.hadithEnglish}
            </Text>
            <View
                style={[
                    styles.arabicContainer,
                    arabicOpen ? {} : { marginTop: 0 },
                ]}
            >
                {arabicOpen && (
                    <Text style={[styles.hadithText, styles.arabic]}>
                        {hadith.hadithArabic}
                    </Text>
                )}
            </View>
            <ConsistentButton
                style={{ alignItems: "center" }}
                onClick={onArabicOpen}
            >
                {getIcon(
                    "Ionicons",
                    arabicOpen ? "chevron-up" : "chevron-down"
                )}
            </ConsistentButton>
            <View style={styles.detailsContainer}>
                {Array.from({ length: hadith.grades.length }, (_, i) => {
                    return (
                        <Text
                            style={[
                                styles.detailsContainer,
                                { color: Colours.fgMainDark },
                            ]}
                        >
                            {hadith.grades[i].name}: {hadith.grades[i].grade}
                        </Text>
                    );
                })}
                <Text style={styles.detailsText}>
                    {hadith.book.name +
                        " " +
                        hadith.hadithnumber +
                        " [" +
                        hadith.reference.book +
                        ":" +
                        hadith.reference.hadith +
                        "]"}
                </Text>
            </View>
        </View>
    );
}

function getBook(bookSlug) {
    if (bookSlug == "abudawud") return abudawud;
    if (bookSlug == "bukhari") return bukhari;
    if (bookSlug == "dehlawi") return dehlawi;
    if (bookSlug == "ibnmajah") return ibnmajah;
    if (bookSlug == "malik") return malik;
    if (bookSlug == "muslim") return muslim;
    if (bookSlug == "nasai") return nasai;
    if (bookSlug == "nawawi") return nawawi;
    if (bookSlug == "qudsi") return qudsi;
    if (bookSlug == "tirmidhi") return tirmidhi;
}

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function findHadithFromNumber(hadiths, number) {
    for (let i = 0; i < hadiths.length; i++) {
        if (hadiths[i].hadithnumber == number) {
            return hadiths[i];
        }
    }
    return {};
}

const styles = StyleSheet.create({
    arabic: {
        fontFamily: "Noto-Arabic",
    },
    arabicContainer: {
        marginTop: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    hadithTopContainer: {
        borderRadius: 10,
        padding: 15,
        paddingHorizontal: 20,
        backgroundColor: Colours.bgDarkGrey,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    bookIcon: {
        marginRight: 5,
        padding: 10,
        borderRadius: 10,
        backgroundColor: Colours.fgMainDark,
    },
    bookIconText: {
        color: Colours.fgColor,
    },
    hadithNarrator: {
        color: Colours.fgGrey,
        fontSize: 17,
        marginLeft: 10,
        width: 200,
    },
    hadithText: {
        color: "white",
        fontSize: 18,
        marginTop: 15,
    },
    hadithContainer: {
        // backgroundColor: Colours.fgGrey,
        marginBottom: 15,
        borderRadius: 5,
    },
    detailsContainer: {
        // position: "absolute",
        // bottom: 0,
        // left: 0,
    },
    detailsText: {
        color: "#808080",
    },
});

export default Hadith;
