import { getPrayerTimes, formatTime } from "./PrayTimes";
import { getSettingsAsync } from "./settings";
import * as Notifications from "expo-notifications";

// export async function schedulePrayerTimesNotifications() {
//     const prayTimes = new PrayTimes(
//         (await getSettingsAsync()).prayerTimes.calculationMethod
//     );
//     // const prayerTimes = prayTimes.getTimes(
//     //     new Date(),
//     //     [51.75222, -1.25596],
//     //     new Date().getTimezoneOffset()
//     // );
//     const prayerTimes = [
//         {
//             asr: "8:26 pm",
//         },
//     ];

//     await Notifications.scheduleNotificationAsync({
//         content: {
//             title: "Push notifications enabled!",
//             body: `Pray`,
//         },
//         trigger: null,
//     });

//     await Notifications.cancelAllScheduledNotificationsAsync();

//     const today = new Date().getDay();

//     // Loop through each day and schedule notifications
//     prayerTimes.forEach((times, index) => {
//         for (const [prayer, time] of Object.entries(times)) {
//             const notificationTime = parseTimeToTodayDate(time);

//             // Adjust date for the correct day of the week
//             let dayOffset = index - today;

//             // If it's the same day (index matches today's day), no need to adjust
//             if (dayOffset < 0) {
//                 dayOffset += 7; // Schedule for the next week
//             }

//             notificationTime.setDate(notificationTime.getDate() + dayOffset);

//             // Schedule the notification
//             Notifications.scheduleNotificationAsync({
//                 content: {
//                     title: `Time for ${prayer}`,
//                     body: `It's time for ${prayer} at ${time}`,
//                     sound: true,
//                 },
//                 trigger: notificationTime,
//             });
//         }
//     });
// }

// function getHours(time) {
//     let add = time.split(" ")[1] == "am" ? 0 : 12;
//     return parseInt(time.split(":")[0]) + add;
// }

// function getMinutes(time) {
//     return parseInt(time.split(" ")[0].split(":")[1]);
// }

// Request permissions to send notifications
async function requestNotificationPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
}

// Helper function to parse time strings (like "3:30 AM") into Date objects
function parseTimeToTodayDate(timeString) {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    // Convert 12-hour format to 24-hour format
    if (modifier.toLowerCase() === "pm" && hours < 12) {
        hours += 12;
    }

    if (modifier.toLowerCase() === "am" && hours === 12) {
        hours = 0; // Convert "12:00 AM" to "00:00"
    }

    const now = new Date();
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(0);
    now.setMilliseconds(0);

    return now;
}

export async function schedulePrayerTimesNotifications() {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
        console.log("Notification permissions not granted");
        return;
    }

    // Cancel all previously scheduled notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    const today = new Date().getDay();

    const prayerTimes = generatePrayerTimesArray(
        (await getSettingsAsync()).prayerTimes.calculationMethod.val
    );

    // Loop through each day and schedule notifications
    prayerTimes.forEach((times, index) => {
        for (const [prayer, time] of Object.entries(times)) {
            // if (
            //     prayer == "sunset" ||
            //     prayer == "sunrise" ||
            //     prayer == "midnight" ||
            //     prayer == "imsak"
            // )
            //     break;
            // const notificationTime = parseTimeToTodayDate(time);

            // // let dayOffset = index - today;
            // // console.log(dayOffset, index, today);

            // // if (dayOffset < 0) {
            // //     dayOffset += 7;
            // // }

            // notificationTime.setDate(notificationTime.getDate() + index);

            const triggerTime = time.getTime() - Date.now();

            // console.log(triggerTime / 1000 / 60 / 60);

            if (triggerTime > 0) {
                Notifications.scheduleNotificationAsync({
                    content: {
                        title: `${
                            prayer[0].toUpperCase() + prayer.slice(1)
                        } Time`,
                        body: `It's time for ${
                            prayer[0].toUpperCase() + prayer.slice(1)
                        } - ${formatTime(time)}`,
                        sound: true,
                        interruptionLevel: "timeSensitive",
                        priority: "max",
                    },
                    trigger: {
                        seconds: triggerTime / 1000,
                    },
                });
            }
        }
    });

    console.log("Notifications scheduled successfully");
}

function generatePrayerTimesArray(calculationMethod = "Karachi", n = 100) {
    // return [
    //     {
    //         asr: "10:06 pm",
    //     },
    // ];
    console.log(calculationMethod);
    const prayerTimesArray = [];
    const today = new Date();

    for (let i = 0; i < n; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const prayerTimes = getPrayerTimes(date, calculationMethod, [
            "fajr",
            "dhuhr",
            "asr",
            "maghrib",
            "isha",
        ]);
        // date.setHours(1, 16, 0, 0);
        // const prayerTimesNew = {
        //     asr: date,
        // };

        console.log(prayerTimes);
        prayerTimesArray.push(prayerTimes);
    }

    return prayerTimesArray;
}
