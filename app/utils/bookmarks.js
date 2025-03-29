import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

const fileUri = "bookmarks.json";

export async function setCertainBookmarkAsync(key, reference, job) {
    // job = "add"/"remove"
    const currentBookmarks = await getBookmarksAsync();
    if (key == "lastReadQuran") {
        currentBookmarks[key].reference = reference;
    } else {
        if (job == "remove") {
            for (let i = 0; i < currentBookmarks[key].length; i++) {
                if (
                    currentBookmarks[key][i] != null &&
                    currentBookmarks[key][i].reference == reference
                ) {
                    currentBookmarks[key][i] = null;
                }
            }
        } else if (job == "add") {
            currentBookmarks[key].push({ reference: reference });
        }
    }
    let endBookmarks = {};
    for (let i = 0; i < Object.keys(currentBookmarks).length; i++) {
        let k = Object.keys(currentBookmarks)[i];
        if (k != "lastReadQuran") {
            endBookmarks[k] = [];
            let v = currentBookmarks[k];
            for (let j = 0; j < v.length; j++) {
                if (v[j] != null) endBookmarks[k].push(v[j]);
            }
        } else {
            endBookmarks[k] = currentBookmarks[k];
        }
    }
    console.log(endBookmarks);
    createBookmarksAsync(JSON.stringify(endBookmarks, null, 2));
}

export function getDefaultBookmarks() {
    return {
        lastReadQuran: {
            reference: "1:1",
        },
        quran: [{ reference: "1000:1" }],
        hadith: [{ reference: "test:1" }],
        // random: [{ reference: "test:1" }],
    };
}

export async function getBookmarksAsync() {
    const defaultBookmarks = getDefaultBookmarks();
    if (Platform.OS == "web") return defaultBookmarks;
    let ret;

    let fileInfo = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory + fileUri
    );

    if (!fileInfo.exists) {
        await createBookmarksAsync(JSON.stringify(defaultBookmarks, null, 1));
        ret = defaultBookmarks;
    } else {
        let string = await FileSystem.readAsStringAsync(
            FileSystem.documentDirectory + fileUri
        );
        let stored = JSON.parse(string);
        // console.log("stored: ", stored);
        let storedIsOld = false;

        if (Object.keys(stored).length != Object.keys(defaultBookmarks).length)
            storedIsOld = true;

        for (let i = 0; i < Object.keys(defaultBookmarks).length; i++) {
            let key = Object.keys(defaultBookmarks)[i];
            // console.log(key);
            let obj = defaultBookmarks[key];
            let objStored = stored[key];

            if (objStored == null) storedIsOld = true;
        }

        if (storedIsOld) {
            console.log("storedIsOld");
            await createBookmarksAsync(
                JSON.stringify(defaultBookmarks, null, 1)
            );
            ret = defaultBookmarks;
        } else {
            ret = stored;
        }
    }
    return ret;
}

async function createBookmarksAsync(
    string,
    uri = FileSystem.documentDirectory + fileUri
) {
    if (Platform.OS == "web") return;
    try {
        FileSystem.writeAsStringAsync(uri, string);
    } catch (error) {
        console.error("Error writing file:", error);
    }
}
