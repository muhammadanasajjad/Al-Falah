// const languageCodes = require("../../assets/languages.json");
// const fetch = require("node-fetch");
// const fs = require("fs");
import data from "../../assets/quran/audioFileUrls.json";

// const allCodes = Object.keys(languageCodes);

export function loadRecitations() {
	return data;
}

// async function downloadRecitations() {
// 	const recitationsWithCopies = [];

// 	for (let i = 0; i < allCodes.length; i++) {
// 		await fetch(
// 			"https://api.quran.com/api/v4/resources/recitations?language=" +
// 				allCodes[i],
// 		)
// 			.then((response) => {
// 				if (!response.ok) {
// 					throw new Error("Network response was not ok");
// 				}
// 				return response.json();
// 			})
// 			.then((data) => {
// 				let rec = data.recitations;
// 				recitationsWithCopies.push(...rec);
// 			})
// 			.catch((error) => {
// 				console.error("There was a problem with the fetch operation:", error);
// 			});
// 	}

// 	// console.log("Finished loading in all recitations");

// 	const reciters = [];
// 	const seenIds = {};
// 	for (let i = 0; i < recitationsWithCopies.length; i++) {
// 		let recitation = recitationsWithCopies[i];
// 		if (seenIds[recitation.id + ""] == null) {
// 			reciters.push(recitation);
// 			seenIds[recitation.id + ""] = 0;
// 			console.log(
// 				recitation.reciter_name +
// 					(recitation.style ? " - " + recitation.style : "") +
// 					" #" +
// 					recitation.id,
// 			);
// 		}
// 	}

// 	// console.log("Loaded reciters");
// 	console.log(reciters);

// 	const audioFiles = {};
// 	for (let i = 0; i < reciters.length; i++) {
// 		for (let juz = 1; juz <= 30; juz++) {
// 			await fetch(
// 				`https://api.quran.com/api/v4/verses/by_juz/${juz}?audio=${reciters[i].id}&per_page=1000`,
// 			)
// 				.then((response) => {
// 					if (!response.ok) {
// 						throw new Error("Network response was not ok");
// 					}
// 					return response.json();
// 				})
// 				.then((data) => {
// 					if (audioFiles[reciters[i].id] == null)
// 						audioFiles[reciters[i].id] = [];
// 					// console.log(data.verses);
// 					for (let j = 0; j < data.verses.length; j++) {
// 						let file = data.verses[j].audio;
// 						if (file.url.substring(0, 2) == "//") {
// 							file.url = "https://" + file.url.substring(2);
// 						} else {
// 							file.url = "https://verses.quran.com/" + file.url;
// 						}
// 						file.verse_key = data.verses[j].verse_key;
// 						audioFiles[reciters[i].id].push(file);
// 					}
// 				})
// 				.catch((error) => {
// 					console.error("There was a problem with the fetch operation:", error);
// 				});
// 		}
// 	}

// 	// console.log(audioFiles);
// 	return audioFiles;
// }
// const saveJSON = (data, filename) => {
// 	const json = JSON.stringify(data);
// 	fs.writeFileSync(filename, json);
// };

// downloadRecitations().then((files) => {
// 	saveJSON(files, "audioFileUrls.json");
// });

// downloadRecitations();
