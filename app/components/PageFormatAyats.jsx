import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Text, ScrollView, Platform } from "react-native";
import Swiper from "react-native-swiper";
import TextAyat from "./TextAyat";
import Pages from "../../assets/quran/versesByPage.json";
import QuranChapters from "../../assets/quran/surahs.json";
import surahEnds from "../../assets/quran/surahLengths.json";

function PageFormatAyats({ getSurah } = props) {
	const pages = loadPages();

	const pageSwiper = useRef(null);

	useEffect(() => {}, [getSurah()]);

	return (
		<Swiper
			ref={pageSwiper}
			loop={false}
			showsPagination={false}
			loadMinimal={true}
			loadMinimalSize={2}
			index={pages.length - getSurahPage(getSurah())}>
			{pages}
		</Swiper>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "black",
		flex: 1,
		justifyContent: "center",
		padding: 15,
	},
	pageContainer: {
		alignContent: "center",
	},
	pageText: {
		borderTopColor: "black",
		borderWidth: 10,
		textAlign: "center",
		lineHeight: 38,
		fontSize: 20,
	},
	lineFiller: {
		color: "transparent",
	},
});

function getLineFiller() {
	return "";
}

function getSurahPage(num) {
	let ayatNum = surahEnds.ends[num - 1] + 1;
	let pageNum = getAyatPage(ayatNum);
	// console.log(pageNum, num, ayatNum);
	return pageNum;
}

function getAyatPage(num) {
	for (let i = 1; i <= Pages.size; i++) {
		let ayats = loadPageAyatNums(i);
		for (let j = 0; j < ayats.length; j++) {
			let ayatNum = ayats[j].ayatNum;
			if (ayatNum == num) {
				return i;
			}
		}
	}
	return -1;
}

function loadPageAyatNums(num) {
	var verses = Pages[`page${num}Verses`];
	return verses;
}

function loadPages() {
	var allPages = [];
	for (let i = Pages.size; i >= 1; i--) {
		allPages.push(loadPage(i));
	}
	return allPages;
}

function loadPage(num) {
	var verses = Pages[`page${num}Verses`];
	var ayats = loadAyats(verses);

	return (
		<View style={styles.container} key={num}>
			<View style={styles.pageContainer}>
				<Text
					style={styles.pageText}
					numberOfLines={15}
					adjustsFontSizeToFit={true}>
					{ayats}
				</Text>
			</View>
		</View>
	);
}

function loadAyats(verses) {
	const Ayats = [];
	const surahsEndAyatNums = getSurahEndAyatArray();

	for (let i = 0; i < verses.length; i++) {
		if (surahsEndAyatNums.includes(verses[i].ayatNum - 1)) {
			Ayats.push(
				<>
					<TextAyat before={i != 0} ayat={getBismillah()} />
					<TextAyat
						ayatNum={verses[i].ayatNum}
						start={verses[i].startNum}
						end={verses[i].endNum}
					/>
					,
				</>,
			);
		} else {
			Ayats.push(
				<TextAyat
					ayatNum={verses[i].ayatNum}
					start={verses[i].startNum}
					end={verses[i].endNum}
				/>,
			);
		}
	}
	return Ayats;
}

function getSurahEndAyatArray() {
	let arr = [];
	let ayatCount = 0;
	let surahs = QuranChapters.surahs;

	for (let i = 0; i < surahs.length; i++) {
		if (surahs[i].bismillah_pre) {
			arr.push(ayatCount);
		}
		ayatCount += surahs[i].verses_count;
	}

	return arr;
}

function getBismillah() {
	return "﷽";
}

export default PageFormatAyats;
