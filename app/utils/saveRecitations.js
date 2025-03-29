import { loadRecitations } from "./loadRecitations";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

const downloadFile = async (uri, destination, callback = () => {}, params) => {
    try {
        const exists = (
            await FileSystem.getInfoAsync(
                FileSystem.documentDirectory + destination
            )
        ).exists;
        if (!exists) {
            const downloadResumable = FileSystem.createDownloadResumable(
                uri,
                FileSystem.documentDirectory + destination
            );
            const { uri: localUri } = await downloadResumable.downloadAsync();
        } else {
            console.log("downloaded already");
        }
        // console.log(
        //     "Downloaded to",
        //     localUri,
        //     "suppposed to save to",
        //     destination,
        // );
        params.setProgress((prevStateArray) => {
            const newStateArray = [...prevStateArray];
            newStateArray[params.progressNumber] =
                (params.downloadedCount + 1) / (params.maxI - params.startI);
            return newStateArray;
        });
        callback(
            params.recitations,
            params.id,
            params.i + 1,
            params.setProgress,
            params.progressNumber,
            params.downloadedCount + 1,
            params.maxI,
            params.startI
        );
    } catch (error) {
        console.error("Error downloading file:", error);
    }
};

async function downloadRecitations(
    recitations,
    id,
    i,
    setProgress,
    progressNumber = 0,
    downloadedCount = 0,
    maxI = recitations[id].length,
    startI = i
) {
    if (i > maxI) {
        console.log(i);
        return;
    }
    let file = recitations[id][i];
    return downloadFile(
        file.url,
        id +
            "%20" +
            file.verse_key.split(":")[0] +
            "%3A" +
            file.verse_key.split(":")[1] +
            ".mp3",
        downloadRecitations,
        {
            recitations: recitations,
            id: id,
            i: i,
            setProgress: setProgress,
            progressNumber: progressNumber,
            downloadedCount: downloadedCount,
            maxI: maxI,
            startI: startI,
        }
    );
}

export async function saveRecitation(
    id,
    setProgress,
    progressNumber,
    totalProgresses
) {
    let recitations = loadRecitations();
    if (Platform.OS != "web")
        return downloadRecitations(
            recitations,
            id,
            Math.floor(recitations[id].length / totalProgresses) *
                progressNumber,
            setProgress,
            progressNumber,
            0,
            Math.ceil(recitations[id].length / totalProgresses) *
                (progressNumber + 1)
        );

    // .then((audioFiles) => {
    // 	let downloadedCount = 0;
    // 	let singleReciterFiles = audioFiles[id];
    // 	for (let i = 0; i < singleReciterFiles.length; i++) {
    // 		let file = singleReciterFiles[i];
    // 		downloadFile(file.url, id + " " + file.verse_key + ".mp3").then(() => {
    // 			downloadedCount++;
    // 			setProgress(downloadedCount / singleReciterFiles.length);
    // 		});
    // 	}
    // });
}
