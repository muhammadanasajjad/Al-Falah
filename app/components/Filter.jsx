import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import ConsistentButton from "./ConsistentButton";

function Filter({ mapKey, setMap, getMap, children } = props) {
	useEffect(() => {}, [getMap()]);
	const value = children;

	return (
		<ConsistentButton
			onClick={() => {
				if (getMap()[mapKey] != value) setMap(mapKey, value);
				else setMap(mapKey, "none");
			}}
			style={[
				styles.filter,
				getMap()[mapKey] != value && styles.deselectedFilter,
			]}>
			<Text
				style={[
					styles.filterText,
					getMap()[mapKey] != value && styles.deselectedFilterText,
				]}>
				{children}
			</Text>
		</ConsistentButton>
	);
}

const styles = StyleSheet.create({
	filter: {
		backgroundColor: "white",
		paddingHorizontal: 15,
		paddingVertical: 5,
		borderRadius: 20,
		marginRight: 15,
	},
	filterText: {
		color: "black",
		fontSize: 16,
	},
	deselectedFilter: {
		backgroundColor: "transparent",
		borderWidth: 1,
		borderColor: "white",
	},
	deselectedFilterText: {
		color: "white",
	},
});

export default Filter;
