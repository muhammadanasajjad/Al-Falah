const abudawudMap = require("./abudawudMap.json");
const bukhariMap = require("./bukhariMap.json");
const dehlawiMap = require("./dehlawiMap.json");
const ibnmajahMap = require("./ibnmajahMap.json");
const malikMap = require("./malikMap.json");
const muslimMap = require("./muslimMap.json");
const nasaiMap = require("./nasaiMap.json");
const nawawiMap = require("./nawawiMap.json");
const qudsiMap = require("./qudsiMap.json");
const tirmidhiMap = require("./tirmidhiMap.json");

let maps = [
    abudawudMap,
    bukhariMap,
    dehlawiMap,
    ibnmajahMap,
    malikMap,
    muslimMap,
    nasaiMap,
    nawawiMap,
    qudsiMap,
    tirmidhiMap,
];

export function getHadiths() {
    return {};
}

function levenshteinDistance(a, b, maxDistance) {
    if (Math.abs(a.length - b.length) > maxDistance) {
        return maxDistance + 1;
    }

    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        let rowMin = Infinity;
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1, // insertion
                    matrix[i - 1][j] + 1 // deletion
                );
            }
            rowMin = Math.min(rowMin, matrix[i][j]);
        }
        if (rowMin > maxDistance) {
            return maxDistance + 1;
        }
    }

    return matrix[b.length][a.length];
}

function isSimilar(str1, str2, maxDistance = 3) {
    let dist = levenshteinDistance(str1, str2, maxDistance);
    return dist <= maxDistance ? dist : -1;
}

function generateVariations(word) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let variations = new Set();

    // Generate words by altering each character
    for (let i = 0; i < word.length; i++) {
        for (let j = 0; j < alphabet.length; j++) {
            variations.add(
                word.substring(0, i) + alphabet[j] + word.substring(i + 1)
            );
        }
    }

    // Generate words by inserting a character at each position
    for (let i = 0; i <= word.length; i++) {
        for (let j = 0; j < alphabet.length; j++) {
            variations.add(
                word.substring(0, i) + alphabet[j] + word.substring(i)
            );
        }
    }

    // Generate words by removing each character
    for (let i = 0; i < word.length; i++) {
        variations.add(word.substring(0, i) + word.substring(i + 1));
    }

    return Array.from(variations);
}

function sortArrayByScore(arr, ascending = false) {
    return arr.sort((a, b) =>
        ascending ? a.score - b.score : b.score - a.score
    );
}

export function searchHadiths(queryString) {
    let splitQuery = queryString.toLowerCase().split(" ");

    // let scoreHadithMap = {};
    // for (let i = 0; i < splitQuery.length; i++) {
    //     let searchWord = splitQuery[i];
    //     let hadiths = hadithsWordMap[searchWord];
    //     if (hadiths != null) {
    //         for (let j = 0; j < hadiths.length; j++) {
    //             if (!scoreHadithMap[hadiths[j]]) scoreHadithMap[hadiths[j]] = 0;
    //             scoreHadithMap[hadiths[j]]++;
    //         }
    //     }
    // }
    // console.log("created score hadith score map");

    // let unsortedResults = [];
    // for (let i = 0; i < Object.keys(scoreHadithMap).length; i++) {
    //     let hadith = Object.keys(scoreHadithMap)[i];
    //     let score = scoreHadithMap[hadith];
    //     unsortedResults.push({
    //         customReference: hadith,
    //         score,
    //     });
    // }
    // let results = sortArrayByScore(unsortedResults).slice(0, 50);

    let mapResults = {};
    for (let i = 0; i < splitQuery.length; i++) {
        let word = splitQuery[i];
        for (let j = 0; j < maps.length; j++) {
            let map = maps[j];
            if (map[word] != null) {
                for (let k = 0; k < map[word].length; k++) {
                    if (mapResults[map[word][k]] == null)
                        mapResults[map[word][k]] = 0;
                    mapResults[map[word][k]]++;
                }
            }
        }
    }

    let unsortedResults = [];
    for (let i = 0; i < Object.keys(mapResults).length; i++) {
        let hadith = Object.keys(mapResults)[i];
        let score = mapResults[hadith];
        unsortedResults.push({
            customReference: hadith,
            score,
        });
    }
    let results = sortArrayByScore(unsortedResults).slice(0, 100);

    // let scoreWordMap = {};
    // for (let i = 0; i < splitQuery.length; i++) {
    // 	let searchWord = splitQuery[i];
    // 	// console.log("on search word: " + searchWord);
    // 	let permutations = generateVariations(searchWord);
    // 	// let permutations = [searchWord];
    // 	for (let j = 0; j < permutations.length; j++) {
    // 		let permutation = permutations[j];
    // 		if (hadithsWordMap[permutation] != null) {
    // 			let score = 4 - levenshteinDistance(searchWord, permutation, 3);
    // 			if (!scoreWordMap[permutation]) scoreWordMap[permutation] = 0;
    // 			scoreWordMap[permutation] += score;
    // 		}
    // 	}
    // }
    // // console.log(scoreWordMap);

    // let resultsMap = {};
    // for (const word in scoreWordMap) {
    // 	// console.log(word);
    // 	const score = scoreWordMap[word];
    // 	// console.log(score);
    // 	for (let i = 0; i < hadithsWordMap[word].length; i++) {
    // 		let customReference = hadithsWordMap[word][i];
    // 		if (!resultsMap[customReference])
    // 			resultsMap[customReference] = { customReference, score: 0 };
    // 		resultsMap[customReference].score += score;
    // 	}
    // }

    // let results = [];
    // for (let i = 0; i < Object.keys(resultsMap).length; i++) {
    // 	let hadithReference = Object.keys(resultsMap)[i];
    // 	let hadithObj = resultsMap[hadithReference];
    // 	results.push(hadithObj);
    // }

    console.log("results: ", results);
    // results = sortArrayByScore(results);
    return results;
}
