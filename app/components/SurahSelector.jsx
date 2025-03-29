import React, { useState } from "react";
import Surahs from "../../assets/quran/surahs.json";
import {
	Dimensions,
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import ConsistentButton from "./ConsistentButton";
import { MaterialIcons } from "@expo/vector-icons";
import Filter from "./Filter";
import TextInputFilter from "./TextInputFilter";
import Colours from "../utils/colours.json";

function SurahSelector({
	getSurah,
	setSurah,
	setInfo,
	isMushaf = true,
} = props) {
	const surahs = Surahs.surahs;
	const [opened, setActualOpened] = useState(false);
	const setOpened = (value) => {
		setActualOpened(value);
	};

	const [map, setActualMap] = useState({
		revelationPlace: "none",
		juz: "none",
		sortBy: "Surah Number",
	});

	let allSurahObjects = createArrayOfCopies([], 114);
	let filteredSurahObjects = createArrayOfCopies([], 114);
	var namesOrder = objectToArray(getNameOrder());
	var revelationsOrder = getRevelationOrder();
	var verseCountOrder = objectToArray(getVerseCountOrder());
	for (let i = 0; i < surahs.length; i++) {
		const surah = surahs[i];
		let simple = surah.name_simple;
		let complex = surah.name_complex;
		let arabic = surah.name_arabic;
		let ayats = surah.verses_count;
		let revelationPlace = surah.revelation_place;
		let revelationOrder = surah.revelation_order;
		let verseCount = surah.verses_count;
		let juzs = surah.juz;

		let filtersMap = {
			revelationPlace: revelationPlace,
		};
		allSurahObjects[i] = [
			<Text style={styles.surahText}>
				<Text style={styles.surahNum}>{i + 1}</Text>
				{" - " + simple + "  "}
				<Text style={styles.surahLength}>{ayats}</Text>
			</Text>,
			<Text style={[styles.surahText, styles.arabicText]}>{arabic}</Text>,
		];
		if (
			filtersApply(filtersMap, map) &&
			(map.juz == "none" || juzs.includes(map.juz))
		) {
			let filteredI = i;
			if (map.sortBy == "Surah Number") {
				filteredI = i;
			} else if (map.sortBy == "Name") {
				filteredI = namesOrder[i];
			} else if (map.sortBy == "Revelation Order") {
				filteredI = revelationsOrder[i] - 1;
			} else if (map.sortBy == "Number of Ayats") {
				filteredI = verseCountOrder[i];
			}
			filteredSurahObjects[filteredI] = [
				<Text style={styles.surahText} surah={surah.id}>
					<Text style={styles.surahNum}>{surah.id}</Text>
					{" - " + simple + "  "}
					<Text style={styles.surahLength}>{ayats}</Text>
				</Text>,
				<Text style={[styles.surahText, styles.arabicText]}>{arabic}</Text>,
			];
		}
	}

	let object;
	if (opened) {
		object = (
			<>
				<View style={styles.surahListContainer}>
					<FlatList
						initialNumToRender={10}
						data={filteredSurahObjects}
						renderItem={({ item, index }) => (
							<ConsistentButton
								onClick={() => {
									setSurah(item[0].props.surah);
									setOpened(false);
								}}
								style={[
									styles.surahContainer,
									item.length == 0 && styles.hidden,
								]}
								key={index}>
								{item}
							</ConsistentButton>
						)}
						keyExtractor={(item, index) => {
							return index;
						}}
					/>
				</View>
				<View style={styles.keepAyatsAway}></View>
			</>
		);
	} else {
		object = (
			<View style={styles.surahOpenerContainer}>
				<ConsistentButton
					onClick={() => {
						setOpened(true);
						if (isMushaf) {
							setInfo(0);
						}
					}}
					style={styles.surahContainer}>
					{allSurahObjects[getSurah() - 1][0]}
					<View style={styles.dropDown}>
						{allSurahObjects[getSurah() - 1][1]}
						<MaterialIcons name="arrow-drop-down" size={20} color="white" />
					</View>
				</ConsistentButton>
			</View>
		);
	}

	const getMap = () => {
		return map;
	};
	const setMap = (key, value) => {
		if (!(key == "sortBy" && value == "none")) {
			let tempMap = { ...map };
			tempMap[key] = value;
			setActualMap(tempMap);
		}
	};

	let filters = (
		<View>
			<ScrollView
				style={[styles.filtersContainer, { borderBottomWidth: 0 }]}
				horizontal={true}>
				<Text style={styles.filterTitleText}>Sort By: </Text>
				<Filter mapKey={"sortBy"} setMap={setMap} getMap={getMap}>
					Surah Number
				</Filter>
				<Filter mapKey={"sortBy"} setMap={setMap} getMap={getMap}>
					Name
				</Filter>
				<Filter mapKey={"sortBy"} setMap={setMap} getMap={getMap}>
					Revelation Order
				</Filter>
				<Filter mapKey={"sortBy"} setMap={setMap} getMap={getMap}>
					Number of Ayats
				</Filter>
			</ScrollView>
			<ScrollView style={styles.filtersContainer} horizontal={true}>
				<Text style={styles.filterTitleText}>Filters: </Text>
				<Filter mapKey={"revelationPlace"} setMap={setMap} getMap={getMap}>
					Madinah
				</Filter>
				<Filter mapKey={"revelationPlace"} setMap={setMap} getMap={getMap}>
					Makkah
				</Filter>
				<TextInputFilter
					min={1}
					max={30}
					mapKey={"juz"}
					setMap={setMap}
					getMap={getMap}>
					Juz
				</TextInputFilter>
			</ScrollView>
		</View>
	);

	return <>{[opened && filters, object]}</>;
}

const styles = StyleSheet.create({
	hidden: {
		display: "none",
	},
	surahOpenerContainer: {
		flexDirection: "row",
		width: "100%",
		alignItems: "center",
	},
	surahListContainer: {
		overflow: "scroll",
		height: "100%",
		paddingBottom: 100,
	},
	dropDown: {
		paddingHorizontal: 10,
		flexDirection: "row",
		alignItems: "center",
	},
	surahContainer: {
		backgroundColor: "black",
		borderBottomColor: "grey",
		borderBottomWidth: 2,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		flex: 1,
	},
	surahText: {
		color: Colours.fgDark,
		fontSize: 18,
		marginVertical: 10,
		marginHorizontal: 10,
	},
	surahLength: {
		color: "grey",
	},
	surahNum: {
		color: "white",
	},
	arabicText: {
		fontFamily: "Indo-Pak",
	},
	filterTitleText: {
		marginVertical: 7,
		marginHorizontal: 5,
		marginRight: 15,
		color: "white",
	},
	filtersContainer: {
		paddingHorizontal: 15,
		paddingVertical: 9,
		backgroundColor: "black",
		borderBottomColor: "grey",
		borderBottomWidth: 2,
	},
	keepAyatsAway: {
		backgroundColor: "black",
		transform: [{ translateY: -110 }],
		height: Dimensions.get("window").height + 110,
	},
});

function filtersApply(filtersMap, appliedFilters) {
	return isSubset(filtersMap, appliedFilters);
}

function isSubset(subsetObject, object) {
	let keys = Object.keys(subsetObject);
	for (let i = 0; i < keys.length; i++) {
		let key = keys[i];
		if (
			subsetObject[key].toLowerCase() != object[key].toLowerCase() &&
			object[key] != "none"
		) {
			return false;
		}
	}
	return true;
}

function createArrayOfCopies(object, n) {
	const array = [];
	for (let i = 0; i < n; i++) {
		array.push(object); // Creating a copy of the object
	}
	return array;
}

function getNameOrder() {
	return [
		22, 16, 65, 73, 46, 12, 9, 14, 91, 112, 100, 113, 75, 101, 30, 67, 37, 42,
		103, 110, 13, 27, 49, 74, 24, 83, 69, 62, 6, 77, 102, 80, 11, 108, 97, 111,
		79, 109, 96, 99, 98, 84, 95, 2, 38, 10, 104, 21, 31, 106, 3, 93, 68, 60, 76,
		64, 26, 51, 29, 53, 78, 40, 54, 85, 89, 86, 52, 59, 28, 45, 105, 39, 57, 50,
		63, 35, 55, 66, 72, 0, 88, 34, 56, 36, 18, 90, 8, 25, 19, 15, 81, 44, 1, 82,
		92, 5, 58, 17, 94, 4, 61, 87, 7, 32, 23, 107, 47, 43, 41, 71, 48, 33, 20,
		70,
	];
}

function getRevelationOrder() {
	return [
		5, 87, 89, 92, 112, 55, 39, 88, 113, 51, 52, 53, 96, 72, 54, 70, 50, 69, 44,
		45, 73, 103, 74, 102, 42, 47, 48, 49, 85, 84, 57, 75, 90, 58, 43, 41, 56,
		38, 59, 60, 61, 62, 63, 64, 65, 66, 95, 111, 106, 34, 67, 76, 23, 37, 97,
		46, 94, 105, 101, 91, 109, 110, 104, 108, 99, 107, 77, 2, 78, 79, 71, 40, 3,
		4, 31, 98, 33, 80, 81, 24, 7, 82, 86, 83, 27, 36, 8, 68, 10, 35, 26, 9, 11,
		12, 28, 1, 25, 100, 93, 14, 30, 16, 13, 32, 19, 29, 17, 15, 18, 114, 6, 22,
		20, 21,
	];
}

function objectToArray(obj, start = 0, end = 114) {
	let array = [];
	for (let i = start; i < end; i++) {
		array[i] = obj[i];
	}
	return array;
}

function getVerseCountOrder() {
	return [
		11, 113, 110, 108, 102, 107, 111, 82, 105, 96, 103, 98, 60, 67, 95, 104, 98,
		97, 94, 106, 100, 85, 101, 79, 84, 112, 92, 89, 80, 76, 52, 48, 81, 71, 62,
		87, 109, 89, 82, 88, 71, 70, 91, 75, 55, 53, 56, 45, 30, 62, 76, 65, 78, 73,
		85, 93, 45, 38, 40, 26, 27, 19, 19, 30, 24, 24, 48, 67, 67, 61, 43, 43, 35,
		74, 57, 51, 66, 57, 64, 59, 45, 32, 54, 41, 38, 29, 32, 42, 48, 35, 28, 37,
		19, 13, 13, 32, 5, 13, 13, 19, 19, 13, 0, 18, 5, 3, 11, 0, 9, 0, 5, 3, 5, 9,
	];
}

export default SurahSelector;
