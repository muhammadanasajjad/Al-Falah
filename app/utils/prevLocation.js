import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

const locationUri = "lastLocation.json";

// Default lastLocation structure
export function getDefaultLastLocation() {
    return {
        status: "success",
        country: "United Kingdom",
        countryCode: "GB",
        region: "ENG",
        regionName: "England",
        city: "Reading",
        zip: "RG1",
        lat: 51.4566,
        lon: -0.968,
        timezone: "Europe/London",
    };
}

// Function to get lastLocation
export async function getLastLocationAsync() {
    const defaultLastLocation = getDefaultLastLocation();
    if (Platform.OS === "web") return defaultLastLocation;

    let ret;

    // Check if the lastLocation file exists
    let fileInfo = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory + locationUri
    );

    if (!fileInfo.exists) {
        // If the file doesn't exist, create it with default lastLocation
        await createLastLocationAsync(
            JSON.stringify(defaultLastLocation, null, 2)
        );
        ret = defaultLastLocation;
    } else {
        // If the file exists, read and parse it
        let string = await FileSystem.readAsStringAsync(
            FileSystem.documentDirectory + locationUri
        );
        let storedLastLocation = JSON.parse(string);

        // Check if the stored lastLocation is outdated (missing keys)
        let storedIsOld = false;
        if (
            Object.keys(storedLastLocation).length !==
            Object.keys(defaultLastLocation).length
        ) {
            storedIsOld = true;
        }

        for (let key of Object.keys(defaultLastLocation)) {
            if (!storedLastLocation[key]) {
                storedIsOld = true;
                break;
            }
        }

        if (storedIsOld) {
            // If the stored lastLocation is outdated, overwrite with default lastLocation
            console.log(
                "Stored lastLocation is outdated, resetting to default."
            );
            await createLastLocationAsync(
                JSON.stringify(defaultLastLocation, null, 2)
            );
            ret = defaultLastLocation;
        } else {
            // Otherwise, return the stored lastLocation
            ret = storedLastLocation;
        }
    }

    return ret;
}

// Function to update lastLocation
export async function updateLastLocationAsync(newLocation) {
    const currentLastLocation = await getLastLocationAsync();

    // Update the lastLocation
    const updatedLastLocation = { ...currentLastLocation, ...newLocation };

    // Save the updated lastLocation
    await createLastLocationAsync(JSON.stringify(updatedLastLocation, null, 2));
}

// Function to create or overwrite lastLocation
async function createLastLocationAsync(
    string,
    uri = FileSystem.documentDirectory + locationUri
) {
    if (Platform.OS === "web") return;

    try {
        await FileSystem.writeAsStringAsync(uri, string);
    } catch (error) {
        console.error("Error writing lastLocation file:", error);
    }
}
