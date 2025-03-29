import React, { useContext, useEffect, useState } from "react";
import { Text, StyleSheet, View, FlatList, Platform } from "react-native";

// import WBWTranslation from "../../assets/quran/allWords/en/words.json";
import Colours from "../../utils/colours.json";
import ConsistentButton from "../../components/ConsistentButton";
import { SuperContext } from "../../_layout";
var Quran = require("../../../assets/quran/quran.json");

function Ayat({
    ayatNum,
    ayat,
    ayatWordsObject,
    startWord = 0,
    endWord = undefined,
    wordsI = [0, 0, 0, 0],
    getWordSelected = () => {},
    setWordSelected = () => {},
    onPress = () => {},
} = props) {
    // const [refresh, setRefresh] = useState(false);

    // LOADING THE ARABIC TEXT
    const [ayatWordsTexts, ayatNumber, actualLength] = getAyatTextAndNumber(
        ayatNum,
        ayat,
        ayatWordsObject,
        getWordSelected,
        setWordSelected,
        wordsI,
        startWord,
        endWord
    );

    const [withTransliteration, setWithTransliteration] = useState(false);
    const settings = useContext(SuperContext)[0];
    useEffect(() => {
        if (
            settings != null &&
            settings.quran.transliterationShow != withTransliteration
        ) {
            setWithTransliteration(settings.quran.transliterationShow.val);
        }
    }, [settings]);

    const [ayatWordsTextsTransliteration, ayatNumberTransliteration] =
        getAyatTextAndNumberTransliteration(
            ayatNum,
            ayat,
            ayatWordsObject,
            getWordSelected,
            setWordSelected,
            wordsI,
            startWord,
            endWord
        );

    // useEffect(() => {
    //     setRefresh(!refresh);
    // }, [settings]);

    // CREATING THE TOUCHABLE TEXTS AND LOADING WBW TRANSLATION
    // const ayatWordsTexts = getAyatWordsTexts(
    // 	ayatNum,
    // 	ayatText,
    // 	ayatWordsObject,
    // 	getInfo,
    // 	setInfo,
    // );
    if (endWord == undefined || endWord >= actualLength) {
        ayatWordsTexts.push(
            <Text style={styles.waqfText}>{toArabicDigits(ayatNumber)}</Text>
        );
        ayatWordsTextsTransliteration.push(
            <Text>{"(" + ayatNumber + ")"}</Text>
        );
    }
    // CREATING THE AYAT
    return (
        // <FlatList
        //     style={styles.textContainer}
        //     initialNumToRender={5}
        //     data={ayatWordsTexts}
        //     renderItem={({ item }) => <View>{item}</View>}
        //     disableIntervalMomentum={true}
        //     keyExtractor={(item, index) => index.toString()}
        // />
        // <FlatList
        //     data={ayatWordsTexts}
        //     renderItem={(item) => {
        //         // console.log(item);
        //         return <View>{item.item}</View>;
        //     }}
        //     // removeClippedSubviews={true}
        //     style={styles.textContainer}
        //     initialNumToRender={15}
        //     viewabilityConfig={{
        //         minimumViewTime: 100,
        //         viewAreaCoveragePercentThreshold: 5,
        //         waitForInteraction: true,
        //     }}
        // />
        <>
            <Text
                onPress={() => onPress(ayatNum)}
                style={[
                    styles.ayatText,
                    !withTransliteration ? { marginBottom: 25 } : {},
                ]}
            >
                {ayatWordsTexts}
            </Text>
            {withTransliteration && (
                <Text style={[styles.ayatTextTransliteration]}>
                    {ayatWordsTextsTransliteration}
                </Text>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    ayatText: {
        backgroundColor: "transparent",
        fontFamily: "Indo-Pak",
        fontSize: 25,
        color: Colours.fgColor,
    },
    ayatTextTransliteration: {
        backgroundColor: "transparent",
        fontSize: 16,
        color: Colours.fgGrey,
        marginVertical: 15,
    },
    waqfText: {
        backgroundColor: "transparent",
        fontFamily: "Uthmanic",
        fontSize: 25,
        color: Colours.fgColor,
        // color: "red",
    },
    highlightedText: {
        color: Colours.fgDark,
    },
    textContainer: {
        flexDirection: "row-reverse",
        flexWrap: "wrap",
    },
});

function getAyatTextAndNumber(
    ayatNum,
    ayat,
    ayatWordsObject,
    getWordSelected,
    setWordSelected,
    wordsI,
    startWord,
    endWord
) {
    let ayatText, ayatNumber;
    if (ayat == null) {
        const quranAyat = Quran.verses[ayatNum - 1];
        ayatText = quranAyat.words.map((word) => word.text_indopak);
        ayatNumber = Quran.verses[ayatNum - 1].verse_key.split(":")[1];
    } else {
        ayatText = [ayat];
        ayatNumber = "";
    }
    ayatText = formatAyatText(ayatText);

    const ayatWordsTexts = [];
    for (let i = 0; i < ayatText.length; i++) {
        ayatWordsTexts.push(
            <Text
                style={[
                    `${ayatNum},${i}` == `${getWordSelected()}`.split("|")[0]
                        ? styles.highlightedText
                        : {},
                    createArray(wordsI[0], wordsI[1]).includes(i)
                        ? styles.highlightedText
                        : {},
                ]}
            >
                {ayatText[i] + "  "}
            </Text>
        );
    }
    return [
        ayatWordsTexts.slice(startWord, endWord),
        ayatNumber,
        ayatWordsTexts.length - 1,
    ];
}

function getAyatTextAndNumberTransliteration(
    ayatNum,
    ayat,
    ayatWordsObject,
    getWordSelected,
    setWordSelected,
    wordsI,
    startWord,
    endWord
) {
    let ayatText, ayatNumber;
    if (ayat == null) {
        const quranAyat = Quran.verses[ayatNum - 1];
        // console.log(quranAyat.words[0]);
        ayatText = quranAyat.words.map((word, i) => {
            return word.transliteration.text;
        });
        ayatNumber = Quran.verses[ayatNum - 1].verse_key.split(":")[1];
    } else {
        ayatText = [ayat];
        ayatNumber = "";
    }
    // ayatText = formatAyatText(ayatText);

    const ayatWordsTexts = [];
    for (let i = 0; i < ayatText.length - 1; i++) {
        ayatWordsTexts.push(
            <Text
                style={[
                    `${ayatNum},${i}` == `${getWordSelected()}`.split("|")[0]
                        ? styles.highlightedText
                        : {},
                    createArray(wordsI[0], wordsI[1]).includes(i)
                        ? styles.highlightedText
                        : {},
                ]}
            >
                {i == 0
                    ? capitalizeFirstLetter(ayatText[i] + " ")
                    : ayatText[i] + " "}
            </Text>
        );
    }
    return [
        ayatWordsTexts.slice(startWord, endWord),
        ayatNumber,
        ayatWordsTexts.length - 1,
    ];
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatAyatText(arrtext) {
    for (let i = 0; i < arrtext.length; i++) {
        arrtext[i] = arrtext[i].replace(/&#x06E1;|ۡ/g, "\u0652");
    }
    return arrtext;
}

function toArabicDigits(string) {
    const id = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return string.replace(/[0-9]/g, function (w) {
        return id[+w];
    });
}

function createArray(min, max, step = 1) {
    let array = [];
    for (let i = min; i < max; i += step) {
        array.push(i);
    }
    return array;
}

export default Ayat;
