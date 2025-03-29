import React, { useRef, useState } from "react";
import { FlatList, ScrollView, StyleSheet } from "react-native";
import Hadith from "./Hadith";

function HadithList({
    hadiths = [
        { book: "sahih-bukhari", number: "1" },
        { book: "sahih-bukhari", number: "2" },
    ],
} = props) {
    const [maxIndex, setMaxIndex] = useState(20);

    const handleScroll = (event) => {
        let nativeEvent = event.nativeEvent;

        let posY = nativeEvent.contentOffset.y;
        let visibleHeight = nativeEvent.layoutMeasurement.height;
        let contentHeight = nativeEvent.contentSize.height;

        if (
            contentHeight - visibleHeight <= posY + 50 &&
            maxIndex < hadiths.length
        ) {
            setMaxIndex(maxIndex + 10);
        }
    };

    return (
        <FlatList
            style={styles.scrollView}
            onScroll={handleScroll}
            data={hadiths.map((hadith, i) => {
                if (i > maxIndex) return;
                return (
                    <Hadith key={i} book={hadith.book} number={hadith.number} />
                );
            })}
            renderItem={(item) => {
                return item.item;
            }}
        />
        //     {hadiths.map((hadith, i) => {
        //         if (i > maxIndex) return;
        //         return (
        //             <Hadith key={i} book={hadith.book} number={hadith.number} />
        //         );
        //     })}
        // </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        padding: 15,
    },
});

export default HadithList;
