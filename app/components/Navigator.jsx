import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import ConsistentButton from "./ConsistentButton";
import { MaterialIcons } from "@expo/vector-icons";
import NavigatorSelector from "./NavigatorSelector";

function Navigator({ allProps } = props) {
	let {
		// maxAyats,
		setAyatStartNum,
		getAyatStartNum,
		// setActualSurah,
		surahsLengths,
		surah,
		showArrows = true,
		goLeft,
		goRight,
	} = allProps;

	useEffect(() => {}, [getAyatStartNum()]);

	return (
		<View style={styles.navigatorContainer}>
			{showArrows && (
				<ConsistentButton
					onClick={() => {
						goLeft();
					}}
					style={styles.arrowButton}>
					<MaterialIcons name="arrow-back" size={30} color="#000" />
				</ConsistentButton>
			)}
			<NavigatorSelector
				startAyat={surahsLengths[surah - 1]}
				endAyat={surahsLengths[surah]}
				setAyatStartNum={setAyatStartNum}
				getAyatStartNum={getAyatStartNum}
			/>
			{showArrows && (
				<ConsistentButton
					onClick={() => {
						goRight();
					}}
					style={styles.arrowButton}>
					<MaterialIcons name="arrow-forward" size={30} color="#000" />
				</ConsistentButton>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	navigatorContainer: {
		backgroundColor: "black",
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 10,
		borderTopColor: "grey",
		borderTopWidth: 2,
	},
	arrowButton: {
		backgroundColor: "white",
		justifyContent: "center",
		alignItems: "center",
		height: 40,
		padding: 5,
		borderRadius: 15,
	},
});

export default Navigator;
