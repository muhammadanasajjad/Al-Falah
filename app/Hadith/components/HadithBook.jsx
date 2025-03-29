import React from "react";
import { StyleSheet, Text, View } from "react-native";

import HadithBooks from "../../../assets/hadiths/allBooks.json";
import Hadiths from "../../../assets/hadiths/hadiths.json";
import Colours from "../../utils/colours.json";

function HadithBook({ book = "sahih-bukhari" } = props) {
    return (
        <>
            {Hadiths.hasOwnProperty(book) && (
                <View style={styles.bookContainer}>
                    <Text style={styles.bookName}>
                        {HadithBooks[book].bookName}
                    </Text>
                    <Text style={styles.detailsText}>
                        By {HadithBooks[book].writerName}
                    </Text>
                    <Text style={styles.detailsText}>
                        {HadithBooks[book].chapters_count} Chapters
                    </Text>
                    <Text style={styles.detailsText}>
                        {HadithBooks[book].hadiths_count} Hadiths
                    </Text>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    bookContainer: {
        borderRadius: 5,
        borderWidth: 3,
        borderColor: Colours.fgGrey,
        padding: 15,
        marginBottom: 15,
    },
    bookName: {
        color: "white",
        fontSize: 30,
    },
    detailsText: {
        fontSize: 20,
        color: "#808080",
    },
});

export default HadithBook;
