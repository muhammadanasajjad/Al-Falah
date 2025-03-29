// app/read/index.js
import React, { useContext, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Platform,
    Image,
    TextInput,
} from "react-native";
import { useRouter } from "expo-router"; // For navigation
import Colours from "../../utils/colours.json";
import ConsistentButton from "../../components/ConsistentButton";
import { GlobalContext } from "../_layout";
import { SuperContext } from "../../_layout";
import Surahs from "../../../assets/quran/surahs.json";
import { ImageBackground } from "react-native-web";
import CustomImageBackground from "../../components/CustomImageBackground";
import { getAyatKey, LastRead } from "./shared";
import { getIcon } from "../../utils/icon";
import { search } from "../../utils/search";
import SurahLengths from "../../../assets/quran/surahLengths.json";
const starImg = require("../../../assets/img/starNew.png");

const ReadPage = () => {
    const router = useRouter(); // Initialize the router
    const bookmarks = useContext(SuperContext)[2];
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(null);

    const searchedSurahs = search(
        searchQuery,
        Surahs.surahs.map((surah) => surah.name_simple)
    );
    const surahs = searchedSurahs.map((index) => Surahs.surahs[index]);

    const handleSurahPress = (surahNum) => {
        // Navigate to the surah detail page

        // console.log("surahPress");
        // console.log(getAyatKey(SurahLengths.ends[surahNum - 1] + 1));
        router.push(`/read/${surahNum}/1`);
    };

    let lastReadAyatNum = 0;
    for (
        let i = 0;
        i < parseInt(bookmarks.lastReadQuran.reference.split(":")[0]) - 1;
        i++
    ) {
        lastReadAyatNum += Surahs.surahs[i].verses_count;
    }
    lastReadAyatNum += parseInt(
        bookmarks.lastReadQuran.reference.split(":")[1]
    );

    // console.log(bookmarks.lastReadQuran.reference, getAyatKey(lastReadAyatNum));

    return (
        <View style={styles.pageContainer}>
            <LastRead
                verseNum={lastReadAyatNum}
                onClick={() => {
                    router.push(
                        `/read/${
                            bookmarks.lastReadQuran.reference.split(":")[0]
                        }/${bookmarks.lastReadQuran.reference.split(":")[1]}`
                    );
                }}
            />
            <View style={styles.surahListTitleContainer}>
                {searchOpen ? (
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        placeholderTextColor={Colours.fgGrey}
                        autoFocus={true}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                        }}
                    />
                ) : (
                    <>
                        <Text style={styles.surahListTitle}>Surahs</Text>
                        <ConsistentButton
                            style={{ padding: 10 }}
                            onClick={() => {
                                setSearchOpen(true);
                                console.log("search");
                            }}
                        >
                            {getIcon("Ionicons", "search", 20, Colours.fgColor)}
                        </ConsistentButton>
                    </>
                )}
            </View>
            <FlatList
                data={surahs}
                renderItem={({ item }) => (
                    <SurahContainer
                        surahNum={item.id}
                        onPress={() => handleSurahPress(item.id)}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const SurahContainer = ({ surahNum, onPress } = props) => {
    let surah = Surahs.surahs[surahNum - 1];

    return (
        <ConsistentButton onClick={onPress}>
            <View style={styles.surahContainer}>
                {Platform.OS != "web" ? (
                    <CustomImageBackground
                        source={starImg}
                        imageStyle={styles.surahNumberContainer}
                        // resizeMode="stretch"
                        // overlayColors={["rgba(0, 0, 0, 0.5)", "transparent"]} // Add a gradient overlay
                    >
                        <Text style={styles.surahNumber}>{surah.id}</Text>
                    </CustomImageBackground>
                ) : (
                    <View
                        style={[
                            styles.surahNumberContainer,
                            {
                                backgroundColor: Colours.fgMainDark,
                                borderRadius: 50,
                                width: 40,
                                height: 40,
                                justifyContent: "center",
                                alignItems: "center",
                            },
                        ]}
                    >
                        <Text style={styles.surahNumber}>{surah.id}</Text>
                    </View>
                )}
                <View style={styles.surahDetailsContainer}>
                    <View style={styles.surahDetails}>
                        <Text style={styles.surahName}>
                            {surah.name_simple}
                        </Text>
                        <Text style={styles.surahExtraDetails}>
                            {surah.revelation_place == "makkah"
                                ? "MECCAN"
                                : "MADNI"}{" "}
                            - {surah.verses_count} AYAHS
                        </Text>
                    </View>
                    <Text style={styles.surahArabic}>{surah.name_arabic}</Text>
                </View>
            </View>
        </ConsistentButton>
    );
};

const styles = StyleSheet.create({
    pageContainer: {
        backgroundColor: "transparent",
        padding: 25,
        paddingTop: 0,
        flex: 1,
    },
    surahContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomColor: Colours.fgGrey + "55",
        borderBottomWidth: 1,
    },
    surahNumberContainer: {
        padding: 15,
        width: 50,
        height: 50,
    },
    surahNumber: {
        color: Colours.fgColor,
    },
    surahDetailsContainer: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 10,
    },
    surahName: {
        color: Colours.fgColor,
        fontWeight: "semibold",
        fontSize: 16,
        marginBottom: 3,
    },
    surahExtraDetails: {
        color: Colours.fgGrey,
        fontSize: 12,
    },
    surahArabic: {
        color: Colours.fgMainDark,
        fontFamily: "Uthmanic",
        fontSize: 20,
    },
    surahListTitleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 25,
        marginBottom: 5,
    },
    surahListTitle: {
        color: Colours.fgColor,
        fontSize: 24,
        fontWeight: "bold",
        width: "40%",
    },
    searchInput: {
        width: "100%",
        height: 40,
        borderRadius: 10,
        paddingHorizontal: 10,
        color: "#fff",
        borderBottomColor: Colours.fgColor,
        borderBottomWidth: 1,
    },
});

export default ReadPage;
