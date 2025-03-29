import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

const fileUri = "settings.json";

export async function setCertainSettingAsync(key, secondaryKey, val) {
    const currentSettings = await getSettingsAsync();
    currentSettings[key][secondaryKey].val = val;
    createSettingsAsync(JSON.stringify(currentSettings, null, 2));
}

export function getDefaultSettings() {
    return {
        quran: {
            title: "Qur'an",
            translationShow: { val: true, title: "Show Translation" },
            transliterationShow: { val: false, title: "Show Transliteration" },
            WBWShow: { val: false, title: "Show Word by Word Translation" },
            // something: { val: true, title: "Something" },
        },
        albums: {
            title: "Albums",
            defaultBackground: {
                val: 2,
                title: "Default Background",
                options: [
                    { val: 0, name: "Star Field" },
                    { val: 1, name: "Black Hole" },
                    { val: 2, name: "Wind" },
                    { val: 3, name: "Expanding" },
                ],
            },
        },
        prayerTimes: {
            title: "Prayer Times",
            calculationMethod: {
                val: "Karachi",
                title: "Calculation Method",
                options: "custom",
            },
            pushNotification: { val: false, title: "Push Notification" },
            // something: { val: true, title: "Something" },
        },
        recitations: {
            title: "Recitations",
            defaultRecitation: {
                val: 7,
                title: "Default Reciter",
                options: [
                    {
                        val: 1,
                        name: "AbdulBaset AbdulSamad - Mujawwad",
                    },
                    {
                        val: 2,
                        name: "AbdulBaset AbdulSamad - Murattal",
                    },
                    { val: 3, name: "Abdur-Rahman as-Sudais" },
                    { val: 4, name: "Abu Bakr al-Shatri" },
                    { val: 5, name: "Hani ar-Rifai" },
                    { val: 6, name: "Mahmoud Khalil Al-Husary" },
                    { val: 7, name: "Mishari Rashid al-`Afasy" },
                    {
                        val: 8,
                        name: "Mohamed Siddiq al-Minshawi - Mujawwad",
                    },
                    {
                        val: 9,
                        name: "Mohamed Siddiq al-Minshawi - Murattal",
                    },
                    { val: 10, name: "Sa`ud ash-Shuraym" },
                    { val: 11, name: "Mohamed al-Tablawi" },
                    {
                        val: 12,
                        name: "Mahmoud Khalil Al-Husary - Muallim",
                    },
                ],
            },
            // something: { val: true, title: "Something" },
        },
    };
}

export async function getSettingsAsync() {
    const defaultSettings = getDefaultSettings();
    if (Platform.OS == "web") return defaultSettings;
    let ret;

    let fileInfo = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory + fileUri
    );

    if (!fileInfo.exists) {
        await createSettingsAsync(JSON.stringify(defaultSettings, null, 1));
        ret = defaultSettings;
    } else {
        let string = await FileSystem.readAsStringAsync(
            FileSystem.documentDirectory + fileUri
        );
        let stored = JSON.parse(string);
        // console.log("stored: ", stored);
        let storedIsOld = false;

        for (let i = 0; i < Object.keys(defaultSettings).length; i++) {
            let key = Object.keys(defaultSettings)[i];
            // console.log(key);
            let obj = defaultSettings[key];
            let objStored = stored[key];

            if (objStored == null) storedIsOld = true;
            else if (Object.keys(objStored).length != Object.keys(obj).length)
                storedIsOld = true;
            else {
                for (let j = 0; j < Object.keys(obj).length; j++) {
                    let secondaryKey = Object.keys(obj)[j];
                    if (objStored[secondaryKey] == null) storedIsOld = true;
                }
            }
        }

        if (storedIsOld) {
            console.log("storedIsOld");
            await createSettingsAsync(JSON.stringify(defaultSettings, null, 1));
            ret = defaultSettings;
        } else {
            ret = stored;
        }
    }
    return ret;
}

async function createSettingsAsync(
    string,
    uri = FileSystem.documentDirectory + fileUri
) {
    try {
        await FileSystem.writeAsStringAsync(uri, string);
    } catch (error) {
        console.error("Error writing file:", error);
    }
    return false;
}
