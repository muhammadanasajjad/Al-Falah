// const HadithBooks = {};
// const fs = require("fs");
// const path = require("path");

// let files = [
//     "abudawud.json",
//     "bukhari.json",
//     "dehlawi.json",
//     "ibnmajah.json",
//     "malik.json",
//     "muslim.json",
//     "nasai.json",
//     "nawawi.json",
//     "qudsi.json",
//     "tirmidhi.json",
// ];

// for (let i = 0; i < files.length; i++) {
//     console.log("loading book " + files[i]);
//     HadithBooks[files[i].split(".")[0]] = JSON.parse(
//         fs.readFileSync(
//             path.join(__dirname, "../../assets/hadiths/" + files[i])
//         )
//     );
// }
// console.log("loaded books");
// // console.log(HadithBooks.abudawud[0]);

// let books = {};
// for (let i = 0; i < Object.keys(HadithBooks).length; i++) {
//     let currentHadiths = HadithBooks[Object.keys(HadithBooks)[i]];
//     books[Object.keys(HadithBooks)[i]] = [];
//     console.log("fixing references for " + Object.keys(HadithBooks)[i]);
//     for (let hadithIndex in currentHadiths) {
//         let hadith = currentHadiths[hadithIndex];
//         // if (hadith.status.toLowerCase() != "sahih") console.log("sahih");
//         console.log("fixing references for " + hadith.hadithnumber);
//         hadith.customReference =
//             Object.keys(HadithBooks)[i] + ":" + hadith.hadithnumber;
//         if (hadithIndex == 0) console.log(hadith);
//         hadith.actualReference = hadith.book.name + " " + hadith.hadithnumber;
//         books[Object.keys(HadithBooks)[i]].push(hadith);
//     }
//     console.log("fixed references for " + Object.keys(HadithBooks)[i]);
// }

// let maxKey = "";
// let maxSize = 0;

// const maxAmount = 10000;

// for (let i = 0; i < Object.keys(books).length; i++) {
//     let wordsMap = {};
//     let bookSlug = Object.keys(books)[i];
//     let hadiths = books[bookSlug];
//     for (let j = 0; j < hadiths.length; j++) {
//         let hadith = hadiths[j];
//         // console.log(hadith);
//         let customReference = hadith.customReference;

//         //factors
//         let hadithEnglish =
//             hadith.hadithEnglish == null ? [] : hadith.hadithEnglish.split(" ");
//         let actualReference =
//             hadith.actualReference == null
//                 ? []
//                 : hadith.actualReference.split(" ");
//         let englishNarrator =
//             hadith.englishNarrator == null
//                 ? []
//                 : hadith.englishNarrator.split(" ");
//         let grades = hadith.grades == null ? [] : hadith.grades;

//         for (let i = 0; i < grades; i++) {
//             let status = grades[i].grade;

//             if (wordsMap[status] == null) {
//                 wordsMap[status] = [];
//             }
//             if (wordsMap[status].length < maxAmount)
//                 wordsMap[status].push(customReference);

//             if (wordsMap[status].length > maxSize) {
//                 maxSize = wordsMap[status].length;
//                 maxKey = status;
//             }
//         }

//         // console.log(hadith.actualReference);
//         for (let k = 0; k < actualReference.length; k++) {
//             let word = actualReference[k].toLowerCase();

//             if (wordsMap[word] == null) wordsMap[word] = [];
//             if (wordsMap[word].length < maxAmount)
//                 wordsMap[word].push(customReference);
//             if (wordsMap[word].length > maxSize) {
//                 maxSize = wordsMap[word].length;
//                 maxKey = word;
//             }
//         }
//         for (let k = 0; k < hadithEnglish.length; k++) {
//             let word = hadithEnglish[k].toLowerCase();

//             if (wordsMap[word] == null) {
//                 wordsMap[word] = [];
//             }
//             if (wordsMap[word].length < maxAmount)
//                 wordsMap[word].push(customReference);
//             if (wordsMap[word].length > maxSize) {
//                 maxSize = wordsMap[word].length;
//                 maxKey = word;
//             }
//         }
//         for (let k = 0; k < englishNarrator.length; k++) {
//             let word = englishNarrator[k].toLowerCase();

//             if (wordsMap[word] == null) {
//                 wordsMap[word] = [];
//             }
//             if (wordsMap[word].length < maxAmount)
//                 wordsMap[word].push(customReference);
//             if (wordsMap[word].length > maxSize) {
//                 maxSize = wordsMap[word].length;
//                 maxKey = word;
//             }
//         }
//     }
//     console.log("finished creating WordsMap");
//     fs.writeFile(bookSlug + "Map.json", JSON.stringify(wordsMap), () =>
//         console.log("finished saving " + bookSlug + "Map.json")
//     );
// }
// console.log(maxKey);
// console.log(maxSize);

// // console.log(wordsMap["0"]);
