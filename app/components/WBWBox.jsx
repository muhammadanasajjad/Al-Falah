import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Colours from "../utils/colours.json";

function WBWBox({ getInfo } = props) {
	return (
		<View style={styles.translationBoxContainer}>
			<View style={[styles.translationBox, getInfo() == 0 && styles.hidden]}>
				<LinearGradient
					style={styles.translationBoxBackground}
					colors={[Colours.fgBright, Colours.fgDark]}>
					<Text style={styles.translationBoxText}>
						{`${getInfo()}`.split("¦")[0]}
					</Text>
				</LinearGradient>
			</View>
			<View
				style={[styles.transliterationBox, getInfo() == 0 && styles.hidden]}>
				<LinearGradient
					style={styles.transliterationBoxBackground}
					colors={["#ffffff", "#ffffff"]}>
					<Text style={styles.transliterationBoxText}>
						{`${getInfo()}`.split("¦")[3]}
					</Text>
				</LinearGradient>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	translationBoxBackground: {
		borderRadius: 15,
	},
	translationBoxContainer: {
		position: "absolute",
		bottom: 100,
		left: "50%",
		transform: [{ translateX: -100 }],
		width: 200,
		backgroundColor: "white",
		borderRadius: 10,
	},
	translationBox: {
		position: "absolute",
		bottom: 99,
		left: "50%",
		transform: [{ translateX: -100 }],
		width: 200,
		backgroundColor: "transparent",
		borderRadius: 10,
	},
	translationBoxText: {
		color: "white",
		textAlign: "center",
		margin: 10,
		marginHorizontal: 15,
		fontSize: 20,
	},
	transliterationBoxBackground: {
		borderRadius: 10,
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
	},
	transliterationBox: {
		position: "absolute",
		top: -100,
		left: "50%",
		transform: [{ translateX: -75 }],
		width: 150,
		backgroundColor: "transparent",
		borderRadius: 10,
	},
	transliterationBoxText: {
		color: "black",
		textAlign: "center",
		margin: 10,
		marginHorizontal: 15,
		fontSize: 15,
	},
	hidden: {
		display: "none",
	},
});

export default WBWBox;
