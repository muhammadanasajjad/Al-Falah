import prayerMethods from "./prayerMethods.json";
import {
    CalculationMethod,
    Coordinates,
    HighLatitudeRule,
    Madhab,
    PrayerTimes,
} from "adhan";
import { Platform } from "react-native";
import * as Location from "expo-location";

const defaultLocation = {
    status: "false",
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

export async function getApproximateLocation() {
    // const GEOCODE_API_KEY = "66df63c06b181322764960snh809054";

    if (Platform.OS == "web") {
        // let ret = await (await fetch("http://ip-api.com/json/")).json();
        // console.log("ret: ", ret);
        // if (ret.status === "success") return ret;
        // return defaultLocation;
    } else {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            setErrorMsg("Permission to access location was denied");
            return;
        }

        let phoneLocation = await Location.getCurrentPositionAsync({});
        const location = {
            lat: phoneLocation.coords.latitude,
            lon: phoneLocation.coords.longitude,
        };

        let reverseGeocode = (
            await Location.reverseGeocodeAsync({
                latitude: location.lat,
                longitude: location.lon,
            })
        )[0];
        // console.log(reverseGeocode);
        location.country = reverseGeocode.country;
        location.city = reverseGeocode.city
            ? reverseGeocode.city
            : reverseGeocode.district
            ? reverseGeocode.district
            : reverseGeocode.subregion
            ? reverseGeocode.subregion
            : reverseGeocode.region;
        return location;
    }
}

export function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();

    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (hours < 10) {
        hours = "0" + hours;
    }

    return `${hours}:${minutes}`;
}

export function getPrayerTimes(
    date,
    method = "Karachi",
    prayers = ["fajr", "dhuhr", "asr", "maghrib", "isha", "sunrise"],
    location = defaultLocation
) {
    const coordinates = new Coordinates(location.lat, location.lon);
    const params = CalculationMethod[method]();
    params.madhab = Madhab.Hanafi;
    params.highLatitudeRule = HighLatitudeRule.TwilightAngle;

    return getTimesFromPrayerTimes(
        new PrayerTimes(coordinates, date, params),
        prayers
    );
}

export function getCurrentPrayer(
    date,
    method = "Karachi",
    location = defaultLocation
) {
    const nextPrayerMap = {
        fajr: "sunrise",
        sunrise: "dhuhr",
        dhuhr: "asr",
        asr: "maghrib",
        maghrib: "isha",
        isha: "fajr",
    };
    const coordinates = new Coordinates(location.lat, location.lon);
    const params = CalculationMethod[method]();
    params.madhab = Madhab.Hanafi;
    params.highLatitudeRule = HighLatitudeRule.TwilightAngle;

    const prayerTimes = new PrayerTimes(coordinates, date, params);
    let currentPrayer =
        prayerTimes.currentPrayer() == "none"
            ? "isha"
            : prayerTimes.currentPrayer();
    let ret = getTimesFromPrayerTimes(prayerTimes, [
        currentPrayer,
        nextPrayerMap[currentPrayer],
    ]);
    // ret.currentTime = formatTime(date);
    // console.log(ret);
    return ret;
}

function getTimesFromPrayerTimes(
    prayerTimes,
    prayers = ["fajr", "dhuhr", "asr", "maghrib", "isha", "sunrise"]
) {
    const times = {};
    for (const prayer in prayers) {
        times[prayers[prayer]] = prayerTimes.timeForPrayer(prayers[prayer]);
    }
    return times;
}

// export class PrayTimes {
//     constructor(method) {
//         this.timeNames = {
//             imsak: "Imsak",
//             fajr: "Fajr",
//             sunrise: "Sunrise",
//             dhuhr: "Dhuhr",
//             asr: "Asr",
//             sunset: "Sunset",
//             maghrib: "Maghrib",
//             isha: "Isha",
//             midnight: "Midnight",
//         };

//         this.methods = prayerMethods;

//         this.calcMethod = "MWL";

//         this.setting = {
//             imsak: "10 min",
//             dhuhr: "0 min",
//             asr: "Hanafi",
//             highLats: "AngleBased",
//         };

//         this.timeFormat = "12h";
//         this.timeSuffixes = ["am", "pm"];
//         this.invalidTime = "-----";

//         this.numIterations = 1;
//         this.offset = {};

//         this.lat;
//         this.lng;
//         this.elv;

//         this.timeZone = undefined;
//         this.timestamp = undefined;
//         this.jDate = undefined;

//         this.init(method);
//     }

//     init(method) {
//         this.setMethod(method);
//         for (var o in this.timeNames) {
//             this.offset[o] = 0;
//         }
//     }

//     setMethod(method) {
//         if (this.methods[method]) {
//             this.adjust(this.methods[method].params);
//             this.calcMethod = method;
//         }
//     }

//     adjust(params) {
//         for (var id in params) {
//             this.setting[id] = params[id];
//         }
//     }

//     tune(timeOffsets) {
//         for (var i in timeOffsets) {
//             this.offset[i] = timeOffsets[i];
//         }
//     }

//     getTimes(date, coords, timezone, dst, format) {
//         this.lat = +coords[0];
//         this.lng = +coords[1];
//         this.elv = coords[2] ? +coords[2] : 0;
//         this.timeFormat = format || this.timeFormat;

//         if (date.constructor === Date) {
//             date = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
//         }

//         if (typeof timezone === "undefined" || timezone === "auto") {
//             timezone = this.getTimeZone(date);
//         }

//         if (typeof dst === "undefined" || dst === "auto") {
//             dst = this.getDst(date);
//         }

//         this.timeZone = +timezone + (+dst ? 1 : 0);
//         this.timestamp = new Date(
//             Date.UTC(date[0], date[1] - 1, date[2])
//         ).getTime();
//         this.jDate = this.julian(date[0], date[1], date[2]) - this.lng / 360;

//         return this.computeTimes();
//     }

//     getFormattedTime(time, format, suffixes) {
//         if (isNaN(time)) {
//             return this.invalidTime;
//         }

//         if (format === "Float") {
//             return time;
//         }

//         if (format === "Timestamp") {
//             return (
//                 this.timestamp +
//                 Math.floor((time - this.timeZone) * 60 * 60 * 1000)
//             );
//         }

//         suffixes = suffixes || this.timeSuffixes;
//         time = this.dMathfixHour(time + 0.5 / 60); // add 0.5 minutes to round

//         var hours = Math.floor(time);
//         var minutes = Math.floor((time - hours) * 60);
//         hours = hours < 12 ? hours + 12 : hours - 12;
//         var suffix = format === "12h" ? suffixes[hours < 12 ? 0 : 1] : "";
//         var hour =
//             format === "24h"
//                 ? this.twoDigitsFormat(hours)
//                 : ((hours + 12 - 1) % 12) + 1;

//         return (
//             hour +
//             ":" +
//             this.twoDigitsFormat(minutes) +
//             (suffix ? " " + suffix : "")
//         );
//     }

//     midDay(time) {
//         return this.dMathfixHour(
//             12 - this.sunPosition(this.jDate + time).equation
//         );
//     }

//     sunAngleTime(angle, time, direction) {
//         var decl = this.sunPosition(this.jDate + time).declination;
//         var noon = this.midDay(time);
//         var t =
//             (1 / 15) *
//             this.dMathArcCos(
//                 (-this.dMathSin(angle) -
//                     this.dMathSin(decl) * this.dMathSin(this.lat)) /
//                     (this.dMathCos(decl) * this.dMathCos(this.lat))
//             );

//         return noon + (direction === "ccw" ? -t : t);
//     }

//     asrTime(factor, time) {
//         var decl = this.sunPosition(this.jDate + time).declination;
//         var angle = -this.dMathArcCot(
//             factor + this.dMathTan(Math.abs(this.lat - decl))
//         );
//         return this.sunAngleTime(angle, time);
//     }

//     sunPosition(jd) {
//         var D = jd - 2451545.0;
//         var g = this.dMathfixAngle(357.529 + 0.98560028 * D);
//         var q = this.dMathfixAngle(280.459 + 0.98564736 * D);
//         var L = this.dMathfixAngle(
//             q + 1.915 * this.dMathSin(g) + 0.02 * this.dMathSin(2 * g)
//         );
//         // var R = 1.00014 - 0.01671 * this.dMathCos(g) - 0.00014 * this.dMathCos(2 * g);
//         var e = 23.439 - 0.00000036 * D;
//         var RA =
//             this.dMathArcTan2(
//                 this.dMathCos(e) * this.dMathSin(L),
//                 this.dMathCos(L)
//             ) / 15;

//         return {
//             declination: this.dMathArcSin(this.dMathSin(e) * this.dMathSin(L)),
//             equation: q / 15 - this.dMathfixHour(RA),
//         };
//     }

//     julian(year, month, day) {
//         if (month <= 2) {
//             year -= 1;
//             month += 12;
//         }

//         var A = Math.floor(year / 100);
//         var B = 2 - A + Math.floor(A / 4);

//         return (
//             Math.floor(365.25 * (year + 4716)) +
//             Math.floor(30.6001 * (month + 1)) +
//             day +
//             B -
//             1524.5
//         );
//     }

//     computePrayerTimes(hours) {
//         var times = this.dayPortions(hours);

//         return {
//             imsak: this.sunAngleTime(
//                 this.value(this.setting.imsak),
//                 times.imsak,
//                 "ccw"
//             ),
//             fajr: this.sunAngleTime(
//                 this.value(this.setting.fajr),
//                 times.fajr,
//                 "ccw"
//             ),
//             sunrise: this.sunAngleTime(
//                 this.riseSetAngle(),
//                 times.sunrise,
//                 "ccw"
//             ),
//             dhuhr: this.midDay(times.dhuhr),
//             asr: this.asrTime(this.asrFactor(this.setting.asr), times.asr),
//             sunset: this.sunAngleTime(this.riseSetAngle(), times.sunset),
//             maghrib: this.sunAngleTime(
//                 this.value(this.setting.maghrib),
//                 times.maghrib
//             ),
//             isha: this.sunAngleTime(this.value(this.setting.isha), times.isha),
//         };
//     }

//     computeTimes() {
//         // default times
//         var times = {
//             imsak: 5,
//             fajr: 5,
//             sunrise: 6,
//             dhuhr: 12,
//             asr: 13,
//             sunset: 18,
//             maghrib: 18,
//             isha: 18,
//         };

//         // main iterations
//         for (var i = 1; i <= this.numIterations; i++) {
//             times = this.computePrayerTimes(times);
//         }

//         times = this.adjustTimes(times);

//         // add midnight time
//         times.midnight =
//             this.setting.midnight === "Jafari"
//                 ? times.sunset +
//                   this.timeDiff(times.sunset, times.fajr + 24) / 2
//                 : times.sunset +
//                   this.timeDiff(times.sunset, times.sunrise + 24) / 2;

//         times = this.tuneTimes(times);

//         return this.modifyFormats(times);
//     }

//     adjustTimes(times) {
//         var params = this.setting;

//         for (var i in times) {
//             times[i] += this.timeZone - this.lng / 15;
//         }

//         if (params.highLats !== "None") {
//             times = this.adjustHighLats(times);
//         }

//         if (this.isMin(params.imsak)) {
//             times.imsak = times.fajr - this.value(params.imsak) / 60;
//         }

//         if (this.isMin(params.maghrib)) {
//             times.maghrib = times.sunset + this.value(params.maghrib) / 60;
//         }

//         if (this.isMin(params.isha)) {
//             times.isha = times.maghrib + this.value(params.isha) / 60;
//         }

//         times.dhuhr += this.value(params.dhuhr) / 60;

//         return times;
//     }

//     asrFactor(asrParam) {
//         var factor = { Standard: 1, Hanafi: 2 }[asrParam];
//         return factor || this.value(asrParam);
//     }

//     riseSetAngle() {
//         // var earthRad = 6371009; // in meters
//         // var angle = this.dMathArcCos(earthRad/(earthRad + this.elv));

//         var angle = 0.0347 * Math.sqrt(this.elv); // an approximation

//         return 0.833 + angle;
//     }

//     tuneTimes(times) {
//         for (var i in times) {
//             times[i] += this.offset[i] / 60;
//         }

//         return times;
//     }

//     modifyFormats(times) {
//         for (var i in times) {
//             times[i] = this.getFormattedTime(times[i], this.timeFormat);
//         }

//         return times;
//     }

//     adjustHighLats(times) {
//         var params = this.setting;
//         var nightTime = this.timeDiff(times.sunset, times.sunrise);

//         times.imsak = this.adjustHLTime(
//             times.imsak,
//             times.sunrise,
//             this.value(params.imsak),
//             nightTime,
//             "ccw"
//         );
//         times.fajr = this.adjustHLTime(
//             times.fajr,
//             times.sunrise,
//             this.value(params.fajr),
//             nightTime,
//             "ccw"
//         );
//         times.isha = this.adjustHLTime(
//             times.isha,
//             times.sunset,
//             this.value(params.isha),
//             nightTime
//         );
//         times.maghrib = this.adjustHLTime(
//             times.maghrib,
//             times.sunset,
//             this.value(params.maghrib),
//             nightTime
//         );

//         return times;
//     }

//     adjustHLTime(time, base, angle, night, direction) {
//         var portion = this.nightPortion(angle, night);

//         var timeDiff =
//             direction === "ccw"
//                 ? this.timeDiff(time, base)
//                 : this.timeDiff(base, time);

//         if (isNaN(time) || timeDiff > portion) {
//             time = base + (direction === "ccw" ? -portion : portion);
//         }

//         return time;
//     }

//     nightPortion(angle, night) {
//         var method = this.setting.highLats;
//         var portion = 1 / 2; // MidNight

//         if (method === "AngleBased") {
//             portion = (1 / 60) * angle;
//         }

//         if (method === "OneSeventh") {
//             portion = 1 / 7;
//         }

//         return portion * night;
//     }

//     dayPortions(hours) {
//         for (var i in hours) {
//             hours[i] /= 24;
//         }
//         return hours;
//     }

//     getTimeZone(date) {
//         return Math.min(
//             this.gmtOffset([date[0], 0, 1]),
//             this.gmtOffset([date[0], 6, 1])
//         );
//     }

//     getDst(date) {
//         return 1 * (this.gmtOffset(date) !== this.getTimeZone(date));
//     }

//     gmtOffset(date) {
//         var localDate = new Date(date[0], date[1] - 1, date[2], 12, 0, 0, 0);
//         var GMTString = localDate.toGMTString();
//         var GMTDate = new Date(
//             GMTString.substring(0, GMTString.lastIndexOf(" ") - 1)
//         );
//         return (localDate - GMTDate) / (1000 * 60 * 60);
//     }

//     value(str) {
//         return 1 * (str + "").split(/[^0-9.+-]/)[0];
//     }

//     isMin(arg) {
//         return (arg + "").indexOf("min") !== -1;
//     }

//     timeDiff(time1, time2) {
//         return this.dMathfixHour(time2 - time1);
//     }

//     twoDigitsFormat(num) {
//         return num < 10 ? "0" + num : num;
//     }

//     // dtr
//     dMathDTR(d) {
//         return (d * Math.PI) / 180.0;
//     }

//     // rtd
//     dMathRTD(r) {
//         return (r * 180.0) / Math.PI;
//     }

//     // sin
//     dMathSin(d) {
//         return Math.sin(this.dMathDTR(d));
//     }

//     // cos
//     dMathCos(d) {
//         return Math.cos(this.dMathDTR(d));
//     }

//     // tan
//     dMathTan(d) {
//         return Math.tan(this.dMathDTR(d));
//     }

//     // arcsin
//     dMathArcSin(d) {
//         return this.dMathRTD(Math.asin(d));
//     }

//     // arccos
//     dMathArcCos(d) {
//         return this.dMathRTD(Math.acos(d));
//     }

//     // arctan
//     dMathArcTan(d) {
//         return this.dMathRTD(Math.atan(d));
//     }

//     // arccot
//     dMathArcCot(x) {
//         return this.dMathRTD(Math.atan(1 / x));
//     }

//     // arctan2
//     dMathArcTan2(y, x) {
//         return this.dMathRTD(Math.atan2(y, x));
//     }

//     // fixAngle
//     dMathfixAngle(a) {
//         return this.dMathFix(a, 360);
//     }

//     // fixHour
//     dMathfixHour(a) {
//         return this.dMathFix(a, 24);
//     }

//     // fix
//     dMathFix(a, b) {
//         a = a - b * Math.floor(a / b);
//         return a < 0 ? a + b : a;
//     }
// }
