import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

const statsUri = "stats.json";

// Default stats structure
export function getDefaultStats() {
    return {
        ayahReadCount: {
            "01/03/2025": 0, // Example default data
        },
        tasbihCount: {
            "01/03/2025": 0,
        },
    };
}

export function getFormattedDate(date = new Date()) {
    const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero if necessary
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-indexed, so add 1) and pad with leading zero
    const year = date.getFullYear(); // Get full year

    return `${day}/${month}/${year}`; // Combine into the desired format
}

// Function to get stats
export async function getStatsAsync() {
    const defaultStats = getDefaultStats();
    if (Platform.OS === "web") return defaultStats;

    let ret;

    // Check if the stats file exists
    let fileInfo = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory + statsUri
    );

    if (!fileInfo.exists) {
        // If the file doesn't exist, create it with default stats
        await createStatsAsync(JSON.stringify(defaultStats, null, 2));
        ret = defaultStats;
    } else {
        // If the file exists, read and parse it
        let string = await FileSystem.readAsStringAsync(
            FileSystem.documentDirectory + statsUri
        );
        let storedStats = JSON.parse(string);

        // Check if the stored stats are outdated (missing keys)
        let storedIsOld = false;
        if (
            Object.keys(storedStats).length !== Object.keys(defaultStats).length
        ) {
            storedIsOld = true;
        }

        for (let key of Object.keys(defaultStats)) {
            if (!storedStats[key]) {
                storedIsOld = true;
                break;
            }
        }

        if (storedIsOld) {
            // If the stored stats are outdated, overwrite with default stats
            console.log("Stored stats are outdated, resetting to default.");
            await createStatsAsync(JSON.stringify(defaultStats, null, 2));
            ret = defaultStats;
        } else {
            // Otherwise, return the stored stats
            ret = storedStats;
        }
    }

    return ret;
}

// Function to update stats
export async function updateStatsAsync(key, value) {
    let date = getFormattedDate();
    const currentStats = await getStatsAsync();

    // Ensure the key exists in the stats object
    if (!currentStats[key]) {
        currentStats[key] = {};
    }

    // Update the value for the specific date
    if (!currentStats[key][date]) {
        currentStats[key][date] = 0;
        // console.log("key", key, "date", date);
    }
    currentStats[key][date] += value;

    // Save the updated stats
    await createStatsAsync(JSON.stringify(currentStats, null, 2));
}

// Function to create or overwrite stats
async function createStatsAsync(
    string,
    uri = FileSystem.documentDirectory + statsUri
) {
    if (Platform.OS === "web") return;

    try {
        await FileSystem.writeAsStringAsync(uri, string);
    } catch (error) {
        console.error("Error writing stats file:", error);
    }
}
