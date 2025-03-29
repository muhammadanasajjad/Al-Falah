import React from "react";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import * as Network from "expo-network";

import { loadRecitations } from "../utils/loadRecitations";
import { getSettingsAsync } from "../utils/settings";

function getLinkForRecitation(recitationID, verseKey) {
    if (typeof recitationID == "number") {
        let recitation = loadRecitations()[`${recitationID}`];
        for (let i = 0; i < recitation.length; i++) {
            if (recitation[i].verse_key == verseKey) return recitation[i].url;
        }
    }
    return null;
}

async function playVerse(
    recID,
    surah,
    verse,
    onFinishedPlaying = () => {},
    onUpdate = () => {}
) {
    // COME BACK TO THIS: LAGS AT THE START OF THE RECITATION WHEN USING LOCAL RECORDINGS IN ANDROID
    const recitationID = (await getSettingsAsync()).recitations
        .defaultRecitation.val;
    let actualSound = null;
    const networkStatus = await Network.getNetworkStateAsync();

    if (verse == 0) {
        surah = 1;
        verse = 1;
    }

    let filePath =
        (networkStatus.isInternetReachable || Platform.OS == "web") &&
        !(
            await FileSystem.getInfoAsync(
                FileSystem.documentDirectory +
                    `${recitationID}%20${surah}%3A${verse}.mp3`
            )
        ).exists
            ? getLinkForRecitation(recitationID, `${surah}:${verse}`)
            : FileSystem.documentDirectory +
              `${recitationID}%20${surah}%3A${verse}.mp3`;
    console.log(
        "FILEPATH:                                                                                     ",
        filePath
    );

    const handleOnPlaybackStatusUpdate = (status) => {
        onUpdate(status);
        if (status.positionMillis >= status.durationMillis) {
            if (actualSound) {
                actualSound.stopAsync();
                actualSound.unloadAsync();
            }
            onFinishedPlaying();
        }
    };

    const loadSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                { uri: filePath },
                {
                    shouldPlay: true,
                    positionMillis: 0,
                    progressUpdateIntervalMillis: 50,
                },
                handleOnPlaybackStatusUpdate
            );
            actualSound = sound;
            console.log("loadingSound", filePath);
        } catch (error) {
            console.log("Error loading sound: ", error);
        }
    };

    await loadSound();

    return actualSound;
}

export default playVerse;
