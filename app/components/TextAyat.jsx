import React from "react";
import { StyleSheet, Text } from "react-native";
import Quran from "../../assets/quran/quran.json";

function TextAyat({
	ayatNum,
	start = 0,
	end = "all",
	ayat,
	before = false,
} = props) {
	const [ayatText, ayatNumber] = getAyatTextAndNumber(
		ayatNum,
		ayat,
		start,
		end,
	);

	return (
		<>
			<Text style={[styles.ayatText, ayat != null && styles.bismillahText]}>
				{ayat != null && before ? "\n" : ""}
				{ayatText.map((word, index) => {
					return <Text key={index}>{word + "   "}</Text>;
				})}
				{ayat != null ? "\n" : ""}
				{ayatNumber[0] != "-" && (
					<Text style={styles.waqfText}>
						&#x06DD;{toArabicDigits(ayatNumber)}
					</Text>
				)}
			</Text>
		</>
	);
}

const styles = StyleSheet.create({
	ayatText: {
		backgroundColor: "transparent",
		fontFamily: "Indo-Pak",
		color: "white",
	},
	bismillahText: {
		fontSize: 26,
	},
	waqfText: {
		backgroundColor: "transparent",
		fontFamily: "sans-serif",
		fontSize: 12,
		color: "white",
	},
	highlightedText: {
		color: "#3b5998",
	},
	textContainer: {
		flexDirection: "row-reverse",
		alignItems: "center",
		flexWrap: "wrap",
	},
});

function extractWordsInRange(text, startIndex, endIndex) {
	const words = text;
	const extractedWords = words.slice(startIndex, endIndex + 1);
	return extractedWords;
}

function getAyatTextAndNumber(ayatNum, ayat, start, end) {
	let ayatText, ayatNumber;
	if (ayat == null) {
		const quranAyat = Quran.verses[ayatNum - 1];
		ayatText = quranAyat.words.map((word) => word.text_indopak);
		ayatNumber = Quran.verses[ayatNum - 1].verse_key.split(":")[1];
		ayatText = formatAyatText(ayatText);
		if (end == "all") {
			end = ayatText.length - 1;
		}
		let returnText = extractWordsInRange(ayatText, start, end);

		return [returnText, end >= ayatText.length - 2 ? ayatNumber + "" : "-"];
	} else {
		ayatText = [ayat];
		ayatNumber = "-1";

		ayatText = formatAyatText(ayatText);
		return [ayatText, ayatNumber];
	}
}

function formatAyatText(text) {
	for (let i = 0; i < text.length; i++) {
		text[i] = text[i].replace(/&#x06E1;|ۡ/g, "\u0652");
	}
	return text;
}

function toArabicDigits(string) {
	const id = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
	return string.replace(/[0-9]/g, function (w) {
		return id[+w];
	});
}

export default TextAyat;
