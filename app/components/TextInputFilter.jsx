import React, { useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import ConsistentButton from "./ConsistentButton";

function TextInputFilter({
	mapKey,
	setMap,
	getMap,
	min,
	max,
	children,
} = props) {
	const [opened, setOpened] = useState(false);
	const [text, setText] = useState(
		getMap()[mapKey] == "none" ? "-" : getMap()[mapKey],
	);
	const inputRef = useRef(null);
	useEffect(() => {
		if (inputRef.current != null) inputRef.current.focus();
	}, [opened]);

	const handleChange = (inputText) => {
		setText(inputText);
	};

	let handleEnterPress = () => {
		if (text == "-" || isNaN(parseInt(text))) {
			setMap(mapKey, "none");
			setText("-");
		} else {
			let temp = Math.min(Math.max(parseInt(text), min), max);
			setText("" + temp);
			setMap(mapKey, temp);
		}
		setOpened(false);
	};

	let object;
	if (opened) {
		object = (
			<View
				style={[
					styles.filter,
					!(text != "-" && !isNaN(parseInt(text))) && styles.deselectedFilter,
				]}>
				<TextInput
					ref={inputRef}
					value={text}
					onChangeText={handleChange}
					onSubmitEditing={handleEnterPress}
					keyboardType="numeric"
					style={[
						styles.input,
						!(text != "-" && !isNaN(parseInt(text))) &&
							styles.deselectedFilterText,
					]}
				/>
			</View>
		);
	} else {
		object = (
			<ConsistentButton
				style={[styles.filter, text == "-" && styles.deselectedFilter]}
				onClick={() => {
					setOpened(true);
				}}>
				<View style={styles.filterInputContainer}>
					<Text
						style={[
							styles.filterText,
							text == "-" && styles.deselectedFilterText,
						]}>
						{children} {text}
					</Text>
				</View>
			</ConsistentButton>
		);
	}

	return object;
}

const styles = StyleSheet.create({
	filter: {
		backgroundColor: "white",
		paddingHorizontal: 15,
		paddingVertical: 5,
		borderRadius: 20,
		marginRight: 15,
	},
	filterInputContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	input: {
		width: 20,
		textAlign: "center",
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

export default TextInputFilter;
