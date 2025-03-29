import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ConsistentButton from "./ConsistentButton";
import { LinearGradient } from "expo-linear-gradient";
import Colours from "../utils/colours.json";
import { getIcon } from "../utils/icon";

function Menu({
	pages,
	icons,
	selectedIcons,
	onSelect,
	selected,
	showNames = true,
} = props) {
	return (
		<View style={styles.container}>
			{pages.map((pageName, index) => (
					<ConsistentButton
						onClick={() => onSelect(pageName)}
						style={[
							styles.buttonContainer,
						]}
						key={index}>
						<View
							style={[styles.button,
								selected === pageName ? styles.selected : {},
								index === 0 ? styles.firstButton : {},
								index === pages.length - 1 ? styles.lastButton : {},]}>
						{selected == pageName
							? getIcon(
									selectedIcons[index].reference,
									selectedIcons[index].name,
									selectedIcons[index].size,
									Colours.fgMainDark, // "white"
							  )
							: getIcon(
									icons[index].reference,
									icons[index].name,
									icons[index].size,
									Colours.fgGrey,
							  )}
						{showNames && <Text style={styles.buttonText}>{pageName}</Text>}
						</View>
					</ConsistentButton>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
		width: "100%",
		backgroundColor: Colours.bgDarkGrey,
	},
	buttonContainer: {
		flexGrow: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 20,
	},
	button: {},
	buttonText: {
		fontWeight: "bold",
		color: "white",
		alignItems: "center",
		marginLeft: 10,
	},
	firstButton: {
		borderTopLeftRadius: 0,
	},
	lastButton: {
		borderTopRightRadius: 0,
	},
});

export default Menu;
