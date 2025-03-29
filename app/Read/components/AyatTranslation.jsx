import React from "react";
import { Text, StyleSheet } from "react-native";

import QuranTranslation from "../../../assets/quran/allTranslations/en/DrMustafaKhattab.json";
import Quran from "../../../assets/quran/quran.json";
import Colours from "../../utils/colours.json";

function AyatTranslation({
    ayatNum,
    translation,
    marginTop = 0,
    includeAyatKey = false,
} = props) {
    let translationText = "asdf";
    if (translation == null) {
        const ayatTranslation = QuranTranslation.translations[ayatNum - 1];
        translationText = ayatTranslation.text;
    } else {
        translationText = translation;
    }
    translationText = formatTranslationText(translationText);

    return (
        <Text style={[styles.translationText, { marginTop: marginTop }]}>
            {translationText + " "}
            {includeAyatKey ? (
                <Text style={styles.waqfText}>
                    {"[" + getAyatKey(ayatNum) + "]"}
                </Text>
            ) : (
                <></>
            )}
        </Text>
    );
}

function removeSupTags(inputString) {
    return inputString.replace(/<sup[^>]*>.*?<\/sup>/g, "");
}

function formatTranslationText(text) {
    return removeSupTags(text);
}

const styles = StyleSheet.create({
    translationText: {
        fontSize: 16,
        color: Colours.fgGrey,
    },
    waqfText: {
        backgroundColor: "transparent",
        color: Colours.fgDark,
    },
});

function getAyatKey(ayatNum) {
    return Quran.verses[ayatNum - 1].verse_key;
}

export default AyatTranslation;
