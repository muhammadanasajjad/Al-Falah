import React, { createContext, useContext, useState } from "react";
import { View, StyleSheet, Text } from "react-native";

import WBWBox from "../components/WBWBox";
import SurahSelector from "../components/SurahSelector";
import PageFormatAyats from "../components/PageFormatAyats";

import SurahLengths from "../../assets/quran/surahLengths.json";

const MemoriseContext = createContext();

function Memorise(props) {
	const surahsLengths = SurahLengths.ends;
	const [surah, setActualSurah] = useState(1);
	const getSurah = () => {
		return surah;
	};
	const setSurah = (surah) => {
		setActualSurah(surah);
		setAyatStartNum(surahsLengths[surah - 1] + 1);
	};

	const maxAyats = 10;
	const [ayatStartNum, setAyatStartNum] = useState(
		surahsLengths[surah - 1] + 1,
	);
	const getAyatStartNum = () => {
		return ayatStartNum;
	};

	const ayatEndNum = Math.min(
		ayatStartNum - 1 + maxAyats,
		surahsLengths[surah],
	);

	let [info, setActualInfo] = useState(0);
	const getInfo = () => {
		return info;
	};
	const setInfo = (info) => {
		setActualInfo(info);
	};

	return (
		<MemoriseContext.Provider value={{ getInfo, setInfo }}>
			<View style={styles.container}>
				<>
					<SurahSelector
						setInfo={setInfo}
						getSurah={getSurah}
						setSurah={setSurah}
					/>
					<View style={styles.mainContent}>
						<PageFormatAyats getSurah={getSurah} />
					</View>
					<WBWBox getInfo={getInfo}></WBWBox>
				</>
			</View>
		</MemoriseContext.Provider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
	},
	mainContent: {
		flex: 1,
		backgroundColor: "black",
		justifyContent: "center",
	},
});

export const useMemoriseContext = () => useContext(MemoriseContext);

export default Memorise;
