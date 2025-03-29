// import React, { useContext, useEffect, useState } from "react";
// import {
//     Image,
//     ImageBackground,
//     StyleSheet,
//     Text,
//     View,
//     FlatList,
//     Modal,
//     Pressable,
//     Dimensions,
//     Platform,
// } from "react-native";

// import Colours from "../../utils/colours.json";
// import { LinearGradient } from "expo-linear-gradient";
// import { getIcon } from "../../utils/icon";

// import Quran from "../../../assets/quran/quran.json";
// let Surahs;
// let SurahLengths;
// if (Platform.OS == "web") {
//     Surahs = require("../../../assets/quran/surahs.json");
//     SurahLengths = require("../../../assets/quran/surahLengths.json");
// } else {
//     Surahs = require("../../../assets/quran/surahs.json");
//     SurahLengths = require("../../../assets/quran/surahLengths.json");
// }
// import ConsistentButton from "../../components/ConsistentButton";
// import AyatsContainer from "../../Read/components/AyatsContainer";
// import { GlobalContext } from "../_layout";
// import { SuperContext } from "../../_layout";
// // import { requireFromUrl } from "../../utils/requireFromUrl";

// const AyatByAyat = () => {
//     const [openedSurah, setOpenedSurah] = useState(null);
//     const [wordSelected, setWordSelected] = useState();
//     const [currentAyatNum, setCurrentAyatNum] = useState(1);
//     const getWordSelected = () => {
//         return wordSelected;
//     };
//     const [ayatEndNum, setAyatEndNum] = useState();
//     const [shouldScrollTo, setShouldScrollTo] = useState(false);
//     const [pageSoundRef, setPageSoundRef] = useContext(GlobalContext).slice(
//         4,
//         5
//     );
//     const [currentPage, setCurrentPage] = useContext(GlobalContext).slice(
//         10,
//         12
//     );

//     // console.log(currentPage, pageSoundRef, openedSurah);
//     if (
//         currentPage == "read" &&
//         pageSoundRef == "read" &&
//         openedSurah == null
//     ) {
//         setCurrentPage("readmain");
//     } else if (
//         currentPage == "readmain" &&
//         pageSoundRef == "read" &&
//         openedSurah != null
//     ) {
//         setCurrentPage("read");
//     }

//     const [, , bookmarks, setCertainBookmark] = useContext(SuperContext);

//     // console.log(currentAyatNum);

//     // reader IonIcons
//     return (
//         <>
//             <View style={styles.pageContainer}>
//                 <>
//                     <View
//                         style={[
//                             styles.salamContainer,
//                             openedSurah ? { display: "none" } : {},
//                         ]}
//                     >
//                         <Text style={styles.name}>Assalamu'alaikum</Text>
//                         {/* change to styles.salam in the future */}
//                         {/* <Text style={styles.name}>Muhammad Anas Sajjad</Text> */}
//                     </View>

//                     <LastRead
//                         verseNum={getAyatNumFromKey(
//                             bookmarks.lastReadQuran.reference
//                         )}
//                         openedSurah={openedSurah}
//                         onClick={() => {
//                             let surahNum = parseInt(
//                                 bookmarks.lastReadQuran.reference.split(":")[0]
//                             );
//                             setAyatEndNum(
//                                 Math.min(
//                                     SurahLengths.ends[surahNum],
//                                     getAyatNumFromKey(
//                                         bookmarks.lastReadQuran.reference
//                                     ) + 10
//                                 )
//                             );
//                             setOpenedSurah(surahNum);
//                             setShouldScrollTo(true);
//                         }}
//                     />

//                     <View style={openedSurah ? { display: "none" } : {}}>
//                         <Text style={styles.surahListTitle}>Surahs</Text>
//                     </View>
//                     {/* <ScrollView style={styles.surahListBigContainer}>
//                             <SurahsList setSurah={setOpenedSurah} />
//                             <SurahContainer setSurah={setOpenedSurah} surahNum={1}/>
//                         </ScrollView> */}
//                     <FlatList
//                         initialScrollIndex={
//                             parseInt(getAyatKey(currentAyatNum).split(":")[0]) -
//                             1
//                         }
//                         data={Array.from({ length: 114 }, (_, index) => (
//                             <SurahContainer
//                                 setAyatEndNum={setAyatEndNum}
//                                 setSurah={setOpenedSurah}
//                                 key={index + 1}
//                                 surahNum={index + 1}
//                             />
//                         ))}
//                         renderItem={(item) => {
//                             return item.item;
//                         }}
//                         keyExtractor={(_, index) => index}
//                         style={openedSurah ? { display: "none" } : {}}
//                     />
//                 </>
//                 <>
//                     <ConsistentButton
//                         style={{ display: openedSurah ? "flex" : "none" }}
//                         onClick={() => setOpenedSurah(null)}
//                     >
//                         {getIcon("Ionicons", "arrow-back", 35, Colours.fgGrey)}
//                     </ConsistentButton>
//                     <AyatsContainer
//                         containerStyle={{
//                             display: openedSurah ? "flex" : "none",
//                         }}
//                         ayatStartNum={
//                             ayatEndNum
//                                 ? Math.max(
//                                       ayatEndNum - 10,
//                                       SurahLengths.ends[openedSurah - 1] + 1
//                                   )
//                                 : SurahLengths.ends[openedSurah - 1] + 1
//                         }
//                         ayatEndNum={
//                             ayatEndNum
//                                 ? ayatEndNum
//                                 : Math.min(
//                                       SurahLengths.ends[openedSurah],
//                                       SurahLengths.ends[openedSurah - 1] + 10
//                                   )
//                         }
//                         increaseSurahNum={(val = openedSurah + 1) => {
//                             // console.log(val, "% 114:", val % 114);
//                             setOpenedSurah(val % 114);
//                         }}
//                         surahNum={openedSurah}
//                         header={SurahOpenedTitle}
//                         getWordSelected={getWordSelected}
//                         setWordSelected={setWordSelected}
//                         setCurrentAyatNum={setCurrentAyatNum}
//                         scrollTo={currentAyatNum}
//                         shouldScrollTo={shouldScrollTo}
//                         setShouldScrollTo={setShouldScrollTo}
//                     />
//                 </>
//             </View>
//             {/* <Modal
//                 transparent={true}
//                 visible={wordSelected != null}
//                 onRequestClose={() => setWordSelected(null)}
//             >
//                 <Pressable
//                     onPressIn={() => setWordSelected(null)}
//                     style={styles.largeModalContainer}
//                 >
//                     <View style={styles.largeModalContainer}>
//                         <View
//                             style={[
//                                 styles.modalContainer,
//                                 {
//                                     left:
//                                         getWordSelected() != null &&
//                                         parseInt(
//                                             `${getWordSelected()}`
//                                                 .split("|")[1]
//                                                 .split(",")[0]
//                                         ) <
//                                             Dimensions.get("window").width / 2
//                                             ? parseInt(
//                                                   `${getWordSelected()}`
//                                                       .split("|")[1]
//                                                       .split(",")[0]
//                                               )
//                                             : null,
//                                     right:
//                                         getWordSelected() != null &&
//                                         parseInt(
//                                             `${getWordSelected()}`
//                                                 .split("|")[1]
//                                                 .split(",")[0]
//                                         ) >=
//                                             Dimensions.get("window").width / 2
//                                             ? Dimensions.get("window").width -
//                                               parseInt(
//                                                   `${getWordSelected()}`
//                                                       .split("|")[1]
//                                                       .split(",")[0]
//                                               )
//                                             : null,
//                                     top:
//                                         getWordSelected() != null
//                                             ? parseInt(
//                                                   `${getWordSelected()}`
//                                                       .split("|")[1]
//                                                       .split(",")[1]
//                                               ) -
//                                               (Platform.OS == "web" ? 65 : 100)
//                                             : 0,
//                                 },
//                             ]}
//                         >
//                             <View
//                                 style={[
//                                     styles.translationModal,
//                                     {
//                                         borderBottomLeftRadius:
//                                             getWordSelected() != null &&
//                                             parseInt(
//                                                 `${getWordSelected()}`
//                                                     .split("|")[1]
//                                                     .split(",")[0]
//                                             ) <
//                                                 Dimensions.get("window").width /
//                                                     2
//                                                 ? 0
//                                                 : 15,
//                                         borderBottomRightRadius:
//                                             getWordSelected() != null &&
//                                             parseInt(
//                                                 `${getWordSelected()}`
//                                                     .split("|")[1]
//                                                     .split(",")[0]
//                                             ) >=
//                                                 Dimensions.get("window").width /
//                                                     2
//                                                 ? 0
//                                                 : 15,
//                                     },
//                                 ]}
//                             >
//                                 <Text style={styles.translationModalText}>
//                                     {getWordSelected() != null
//                                         ? Quran.verses[
//                                               parseInt(
//                                                   `${getWordSelected()}`
//                                                       .split("|")[0]
//                                                       .split(",")[0]
//                                               ) - 1
//                                           ].words[
//                                               parseInt(
//                                                   `${getWordSelected()}`
//                                                       .split("|")[0]
//                                                       .split(",")[1]
//                                               )
//                                           ]?.translation.text
//                                         : ""}
//                                 </Text>
//                             </View>
//                         </View>
//                     </View>
//                 </Pressable>
//             </Modal> */}
//         </>
//     );
// };

// function getAyatNumFromKey(key) {
//     for (let i = 0; i < Quran.verses.length; i++) {
//         if (Quran.verses[i].verse_key == key) {
//             return i + 1;
//         }
//     }
//     return -1;
// }

// const SurahOpenedTitle = ({
//     surahNum,
//     onPlay,
//     onStop,
//     onEndPause,
//     shouldPlay,
//     isPlaying,
//     includePlay,
//     includeBismillah,
// } = props) => {
//     if (surahNum == null) return;
//     const utilityButtonSizes = 28;
//     let ayatNum = SurahLengths.ends[surahNum - 1] + 0.5;

//     let playStopAction;
//     if (!isPlaying) {
//         playStopAction = getIcon(
//             "Ionicons",
//             "play-outline",
//             utilityButtonSizes,
//             Colours.fgColor
//         );
//     } else {
//         playStopAction = getIcon(
//             "Ionicons",
//             "stop-outline",
//             utilityButtonSizes,
//             Colours.fgColor
//         );
//     }

//     let surahNameMap = [
//         "",
//         "\u0021",
//         "\u0022",
//         "\u0023",
//         "\u0024",
//         "\u0025",
//         "\u0026",
//         "\u0027",
//         "\u0028",
//         "\u0029",
//         "\u002A",
//         "\u002B",
//         "\u002C",
//         "\u002D",
//         "\u002E",
//         "\u002F",
//         "\u0030",
//         "\u0031",
//         "\u0032",
//         "\u0033",
//         "\u0034",
//         "\u0035",
//         "\u0036",
//         "\u0037",
//         "\u0038",
//         "\u0039",
//         "\u003A",
//         "\u003B",
//         "\u003C",
//         "\u003D",
//         "\u003E",
//         "\u003F",
//         "\u0040",
//         "\u0041",
//         "\u0042",
//         "\u0043",
//         "\u0044",
//         "\u0045",
//         "\u0046",
//         "\u0047",
//         "\u0048",
//         "\u0049",
//         "\u004A",
//         "\u004B",
//         "\u004C",
//         "\u004D",
//         "\u004E",
//         "\u004F",
//         "\u0050",
//         "\u0051",
//         "\u0052",
//         "\u0053",
//         "\u0054",
//         "\u0055",
//         "\u0056",
//         "\u0057",
//         "\u0058",
//         "\u0059",
//         "\u005A",
//         "\u005B",
//         "\u005C",
//         "\u005D",
//         "\u005E",
//         "\u005F",
//         "\u0060",
//         "\u0061",
//         "\u0062",
//         "\u0063",
//         "\u0064",
//         "\u0065",
//         "\u0066",
//         "\u0067",
//         "\u0068",
//         "\u0069",
//         "\u006A",
//         "\u006B",
//         "\u006C",
//         "\u006D",
//         "\u006E",
//         "\u006F",
//         "\u0070",
//         "\u0071",
//         "\u0072",
//         "\u0073",
//         "\u0074",
//         "\u0075",
//         "\u0076",
//         "\u0077",
//         "\u0078",
//         "\u0079",
//         "\u007A",
//         "\u007B",
//         "\u007C",
//         "\u007D",
//         "\u007E",
//         "\u00A1",
//         "\u00A2",
//         "\u00A3",
//         "\u00A4",
//         "\u00A5",
//         "\u00A6",
//         "\u00A7",
//         "\u00A8",
//         "\u00A9",
//         "\u00AA",
//         "\u00AB",
//         "\u00AC",
//         "\u00AE",
//         "\u00AF",
//         "\u00B0",
//         "\u00B1",
//         "\u00B2",
//         "\u00B3",
//         "\u00B4",
//         "\u00B5",
//     ];

//     let pauseAction;
//     if (isPlaying) {
//         pauseAction = (
//             <ConsistentButton
//                 onClick={() => {
//                     onEndPause(ayatNum);
//                 }}
//             >
//                 {getIcon(
//                     "Ionicons",
//                     shouldPlay ? "pause-outline" : "pause",
//                     utilityButtonSizes,
//                     Colours.fgColor
//                 )}
//             </ConsistentButton>
//         );
//     } else {
//         pauseAction = <></>;
//     }

//     return (
//         <View style={styles.surahOpenedContainer}>
//             <LinearGradient
//                 style={styles.surahOpenedTitleBackground}
//                 colors={[Colours.fgMainBright, Colours.fgMainDark]}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//             >
//                 <View style={styles.actionsContainer}>
//                     {includePlay ? (
//                         <>
//                             <ConsistentButton
//                                 style={styles.actionButton}
//                                 onClick={() => {
//                                     if (!isPlaying) {
//                                         onPlay(ayatNum);
//                                     } else {
//                                         onStop(ayatNum);
//                                     }
//                                 }}
//                             >
//                                 {playStopAction}
//                             </ConsistentButton>
//                             {pauseAction}
//                         </>
//                     ) : (
//                         <></>
//                     )}
//                 </View>
//                 <Image
//                     style={styles.surahOpenedQuran}
//                     resizeMode="contain"
//                     source={require("../../../assets/img/quranNew.png")}
//                 />
//                 <View style={styles.surahOpenedTitleContainer}>
//                     <View style={styles.surahOpenedNameContainer}>
//                         {/* <Text
//                             style={{
//                                 fontFamily: "Surah-Arabic",
//                                 fontSize: 120,
//                                 lineHeight: 50,
//                                 color: Colours.fgColor,
//                                 marginBottom: 10,
//                             }}
//                         >
//                             {surahNameMap[surahNum]}
//                         </Text> */}
//                         <Text style={styles.surahOpenedName}>
//                             {Surahs.surahs[surahNum - 1].name_simple}
//                         </Text>
//                         <Text style={styles.surahOpenedNameTranslated}>
//                             {Surahs.surahs[surahNum - 1].translated_name.name}
//                         </Text>
//                     </View>
//                     <Text style={styles.surahOpenedDetails}>
//                         {Surahs.surahs[surahNum - 1].revelation_place ==
//                         "makkah"
//                             ? "MECCAN"
//                             : "MADNI"}{" "}
//                         - {Surahs.surahs[surahNum - 1].verses_count} AYAHS
//                     </Text>
//                     {Surahs.surahs[surahNum - 1].bismillah_pre &&
//                     includeBismillah ? (
//                         <Image
//                             resizeMode="contain"
//                             style={styles.surahOpenedBismillah}
//                             source={require("../../../assets/img/Bismillah.png")}
//                         />
//                     ) : (
//                         <></>
//                     )}
//                 </View>
//             </LinearGradient>
//         </View>
//     );
// };

// const LastRead = ({ verseNum, onClick, openedSurah } = props) => {
//     let verseKey = getAyatKey(verseNum);
//     let surahNum = verseKey.split(":")[0];
//     let ayatNum = verseKey.split(":")[1];

//     return (
//         <ConsistentButton
//             onClick={() => onClick(ayatNum)}
//             style={openedSurah ? { display: "none" } : {}}
//         >
//             <LinearGradient
//                 style={styles.lastReadBackground}
//                 colors={[Colours.fgMainBright, Colours.fgMainDark]}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//             >
//                 <Image
//                     style={styles.lastReadQuran}
//                     resizeMode="contain"
//                     source={require("../../../assets/img/quranNew.png")}
//                 />
//                 <View style={styles.lastReadContainer}>
//                     <View style={styles.lastReadTitleContainer}>
//                         {getIcon("Ionicons", "bookmark", 20, Colours.fgColor)}
//                         <Text style={styles.lastReadTitle}>Last Read</Text>
//                     </View>
//                     <View style={styles.lastReadInfoContainer}>
//                         <Text style={styles.lastReadSurah}>
//                             {Surahs.surahs[surahNum - 1].name_simple}
//                         </Text>
//                         <Text style={styles.lastReadAyat}>
//                             Ayah no. {ayatNum}
//                         </Text>
//                     </View>
//                 </View>
//             </LinearGradient>
//         </ConsistentButton>
//     );
// };

// // const SurahsList = ({ setSurah } = props) => {
// //     return <View>
// //         {Array.from({ length: 114 }, (_, index) => {
// //             return <SurahContainer setSurah={setSurah} key={index + 1} surahNum={index + 1} />
// //         })}
// //     </View>
// // }

// const SurahContainer = ({ surahNum, setSurah, setAyatEndNum } = props) => {
//     let surah = Surahs.surahs[surahNum - 1];

//     return (
//         <ConsistentButton
//             onClick={() => {
//                 setSurah(surahNum);

//                 setAyatEndNum(null);
//             }}
//         >
//             <View style={styles.surahContainer}>
//                 {Platform.OS != "web" ? (
//                     <ImageBackground
//                         source={require("../../../assets/img/starNew.png")}
//                         style={styles.surahNumberContainer}
//                         imageStyle={styles.surahNumberContainerImage}
//                         resizeMode="contain"
//                     >
//                         <Text style={styles.surahNumber}>{surah.id}</Text>
//                     </ImageBackground>
//                 ) : (
//                     <View
//                         style={[
//                             styles.surahNumberContainer,
//                             {
//                                 backgroundColor: Colours.fgMainDark,
//                                 borderRadius: 50,
//                                 width: 40,
//                                 height: 40,
//                                 justifyContent: "center",
//                                 alignItems: "center",
//                             },
//                         ]}
//                     >
//                         <Text style={styles.surahNumber}>{surah.id}</Text>
//                     </View>
//                 )}
//                 <View style={styles.surahDetailsContainer}>
//                     <View style={styles.surahDetails}>
//                         <Text style={styles.surahName}>
//                             {surah.name_simple}
//                         </Text>
//                         <Text style={styles.surahExtraDetails}>
//                             {surah.revelation_place == "makkah"
//                                 ? "MECCAN"
//                                 : "MADNI"}{" "}
//                             - {surah.verses_count} AYAHS
//                         </Text>
//                     </View>
//                     <Text style={styles.surahArabic}>{surah.name_arabic}</Text>
//                 </View>
//             </View>
//         </ConsistentButton>
//     );
// };

// const styles = StyleSheet.create({
//     pageContainer: {
//         backgroundColor: "transparent",
//         padding: 25,
//         paddingTop: 0,
//         flex: 1,
//     },
//     salamContainer: {
//         paddingBottom: 25,
//     },
//     salam: {
//         color: Colours.fgGrey,
//         fontSize: 18,
//     },
//     name: {
//         marginTop: 3,
//         color: Colours.fgColor,
//         fontSize: 24,
//         fontWeight: "bold",
//     },
//     lastReadBackground: {
//         borderRadius: 10,
//         overflow: "hidden",
//     },
//     lastReadContainer: {
//         margin: 25,
//     },
//     lastReadTitleContainer: {
//         flexDirection: "row",
//         alignItems: "center",
//     },
//     lastReadTitle: {
//         color: Colours.fgColor,
//         fontWeight: "bold",
//         paddingLeft: 10,
//     },
//     lastReadInfoContainer: {
//         marginTop: 16,
//     },
//     lastReadSurah: {
//         color: Colours.fgColor,
//         fontWeight: "bold",
//         fontSize: 32,
//         textShadowColor: Colours.bgColour,
//         textShadowRadius: 10,
//         textShadowOffset: { width: 0, height: 0 },
//     },
//     lastReadAyat: {
//         color: Colours.fgColor,
//         fontSize: 16,
//     },
//     lastReadQuran: {
//         width: 200,
//         height: 150,
//         // resizeMode: "contain",
//         position: "absolute",
//         right: -30,
//         bottom: -35,
//     },
//     surahListBigContainer: {
//         flex: 1,
//         // overflow: "scroll"
//     },
//     surahListTitle: {
//         marginTop: 25,
//         marginBottom: 5,
//         color: Colours.fgColor,
//         fontSize: 24,
//         fontWeight: "bold",
//     },
//     surahContainer: {
//         flexDirection: "row",
//         alignItems: "center",
//         paddingVertical: 10,
//         borderBottomColor: Colours.fgGrey + "55", // for transparency
//         borderBottomWidth: 1,
//     },
//     surahNumberContainer: {
//         padding: 15,
//         justifyContent: "center",
//     },
//     surahNumberContainerImage: {
//         // resizeMode: "contain",
//     },
//     surahNumber: {
//         color: Colours.fgColor,
//     },
//     surahDetailsContainer: {
//         flexGrow: 1,
//         flexDirection: "row",
//         justifyContent: "space-between",
//         paddingLeft: 10,
//     },
//     surahDetails: {},
//     surahName: {
//         color: Colours.fgColor,
//         fontWeight: "semibold",
//         fontSize: 16,
//         marginBottom: 3,
//     },
//     surahExtraDetails: {
//         color: Colours.fgGrey,
//         fontSize: 12,
//     },
//     surahArabic: {
//         color: Colours.fgMainDark,
//         fontFamily: "Uthmanic",
//         fontSize: 20,
//     },
//     surahOpenedContainer: {
//         marginTop: 15,
//         marginBottom: 25,
//     },
//     surahOpenedTitleContainer: {
//         alignItems: "center",
//         margin: 35,
//     },
//     surahOpenedTitleBackground: {
//         borderRadius: 20,
//         overflow: "hidden",
//     },
//     surahOpenedNameContainer: {
//         alignItems: "center",
//         paddingBottom: 25,
//         paddingHorizontal: 35,
//         borderBottomColor: Colours.fgColor + "55", // for transparency
//         borderBottomWidth: 1,
//     },
//     surahOpenedName: {
//         color: Colours.fgColor,
//         fontSize: 26,
//         marginBottom: 7,
//     },
//     surahOpenedNameTranslated: {
//         color: Colours.fgColor,
//         fontSize: 16,
//     },
//     surahOpenedDetails: {
//         marginTop: 20,
//         color: Colours.fgColor,
//         fontSize: 13,
//     },
//     surahOpenedBismillah: {
//         // resizeMode: "contain",
//         marginTop: 25,
//         height: 50,
//         width: 250,
//     },
//     surahOpenedQuran: {
//         // resizeMode: "contain",
//         width: 350,
//         position: "absolute",
//         bottom: -90,
//         right: -50,
//         opacity: 0.05,
//     },
//     largeModalContainer: {
//         flex: 1,
//     },
//     modalContainer: {
//         position: "absolute",
//     },
//     translationModal: {
//         height: 45,
//         padding: 15,
//         paddingVertical: 5,
//         borderRadius: 15,
//         borderColor: Colours.fgMainDark,
//         borderWidth: 3,
//         backgroundColor: Colours.bgDarkGrey,
//     },
//     translationModalText: {
//         color: Colours.fgColor,
//         fontSize: 20,
//     },
//     actionsContainer: {
//         position: "absolute",
//         top: 0,
//         right: 0,
//         padding: 15,
//         flexDirection: "row",
//     },
//     actionButton: {
//         marginLeft: 5,
//     },
// });

// function getAyatKey(ayatNum) {
//     if (ayatNum == null || isNaN(ayatNum)) {
//         return "1:1";
//     }
//     return Quran.verses[Math.round(ayatNum) - 1].verse_key;
// }

// export default AyatByAyat;

// app/read/[surahId].js
import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router"; // For dynamic routing
import { LinearGradient } from "expo-linear-gradient";
import Colours from "../../../utils/colours.json";
import ConsistentButton from "../../../components/ConsistentButton";
import AyatsContainer from "../../../Read/components/AyatsContainer";
import { GlobalContext } from "../../_layout";
import { SuperContext } from "../../../_layout";
import Surahs from "../../../../assets/quran/surahs.json";
import Quran from "../../../../assets/quran/quran.json";
import SurahLengths from "../../../../assets/quran/surahLengths.json";
import { getIcon } from "../../../utils/icon";
import { getAyatKey, LastRead, SurahOpenedTitle } from "../shared";

const SurahDetailPage = () => {
    const { surahId, ayahId } = useLocalSearchParams(); // Get the dynamic parameter (surahId)
    const surahNum = parseInt(surahId); // Convert surahId to a number
    const ayahNum = parseInt(ayahId);
    const router = useRouter(); // Initialize the router
    console.log(surahNum, ayahNum);

    const [currentAyatNum, setCurrentAyatNum] = useState(1);
    const [ayatEndNum, setAyatEndNum] = useState();
    const [shouldScrollTo, setShouldScrollTo] = useState(false);
    // const [, , bookmarks, setCertainBookmark] = useContext(SuperContext);

    return (
        <View style={styles.pageContainer}>
            <ConsistentButton onClick={() => router.back()}>
                {getIcon("Ionicons", "arrow-back", 35, Colours.fgGrey)}
            </ConsistentButton>
            <AyatsContainer
                mushafFormat={false}
                containerStyle={{ display: "flex" }}
                ayatStartNum={
                    ayatEndNum
                        ? Math.max(
                              ayatEndNum - 10,
                              SurahLengths.ends[surahNum - 1] + ayahNum
                          )
                        : SurahLengths.ends[surahNum - 1] + ayahNum
                }
                ayatEndNum={
                    ayatEndNum
                        ? ayatEndNum
                        : Math.min(
                              SurahLengths.ends[surahNum],
                              SurahLengths.ends[surahNum - 1] + ayahNum + 9
                          )
                }
                increaseSurahNum={(val = surahNum + 1) => {
                    router.push(`/read/${val % 114}/1`);
                }}
                surahNum={surahNum}
                header={SurahOpenedTitle}
                getWordSelected={() => {}}
                setWordSelected={() => {}}
                setCurrentAyatNum={setCurrentAyatNum}
                scrollTo={currentAyatNum}
                shouldScrollTo={shouldScrollTo}
                setShouldScrollTo={setShouldScrollTo}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    pageContainer: {
        backgroundColor: "transparent",
        padding: 25,
        paddingTop: 0,
        flex: 1,
    },
});

export default SurahDetailPage;
