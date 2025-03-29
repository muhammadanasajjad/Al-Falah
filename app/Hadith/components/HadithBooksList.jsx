import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import HadithBooks from "../../../assets/hadiths/allBooks.json";
import HadithBook from "./HadithBook";

function HadithBooksList({} = props) {
    let allBooks = Object.keys(HadithBooks);
    return (
        <ScrollView style={styles.container}>
            {allBooks.map((book) => (
                <HadithBook book={book} />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 15,
    },
});

export default HadithBooksList;
