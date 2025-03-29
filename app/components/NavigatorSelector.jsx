import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, Text, Dimensions } from "react-native";
import Colours from "../utils/colours.json";
import Quran from "../../assets/quran/quran.json";

function NavigatorSelector({
	startAyat,
	endAyat,
	setAyatStartNum,
	getAyatStartNum,
} = props) {
	const [text, setText] = useState("" + (getAyatStartNum() - startAyat));

	let handleChange = (inputText) => {
		setText(inputText);
	};
	let handleEnterPress = () => {
		setAyatStartNum(
			Math.max(Math.min(parseInt(text) + startAyat, endAyat), startAyat + 1),
		);
	};

	const handleFocus = () => {
		setText("" + (getAyatStartNum() - startAyat));
	};
	const handleBlur = () => {
		setText("" + (getAyatStartNum() - startAyat));
	};

	useEffect(() => {
		setText("" + (getAyatStartNum() - startAyat));
	}, [getAyatStartNum()]);

	console.log(getAyatKey(getAyatStartNum()));

	return (
		<View style={styles.container}>
			<Text style={styles.navigatorText}>
				{getAyatKey(getAyatStartNum()).split(":")[0] + ":"}
			</Text>
			<TextInput
				style={styles.navigatorTextInput}
				value={text}
				onChangeText={handleChange}
				onSubmitEditing={handleEnterPress}
				onFocus={handleFocus}
				onBlur={handleBlur}
				keyboardType="numeric"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	navigatorTextInput: {
		color: Colours.fgDark,
		fontSize: 20,
		width: Dimensions.get("window").width / 9,
		textAlign: "left",
		borderBottomColor: "grey",
		borderBottomWidth: 1,
	},
	navigatorText: {
		color: Colours.fgDark,
		fontSize: 20,
		width: Dimensions.get("window").width / 9,
		textAlign: "right",
		borderBottomColor: "transparent",
		borderBottomWidth: 1,
	},
});

function createArray(a, b) {
	if (a > b) {
		return [];
	}
	var array = [];
	for (var i = a; i <= b; i++) {
		array.push(i);
	}
	return array;
}

function getAyatKey(ayatNum) {
	return Quran.verses[ayatNum - 1].verse_key;
}

export default NavigatorSelector;
