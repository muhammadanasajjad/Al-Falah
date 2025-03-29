import React, { act, useContext, useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, View, Text, ScrollView } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import Colours from "../../utils/colours.json";
import { SuperContext } from "../../_layout";
import { getFormattedDate } from "../../utils/stats";
import Swiper from "react-native-swiper";

const Index = () => {
    const stats = useContext(SuperContext)[6];

    let today = new Date();

    let activityData = {};
    for (const date in stats.ayahReadCount) {
        if (!activityData[date]) activityData[date] = 0;
        activityData[date] += stats.ayahReadCount[date];
    }
    for (const date in stats.tasbihCount) {
        if (!activityData[date]) activityData[date] = 0;
        activityData[date] += stats.tasbihCount[date];
    }

    let totalAyahsRead = 0;
    for (const date in stats.ayahReadCount) {
        totalAyahsRead += stats.ayahReadCount[date];
    }
    let totalTasbihRead = 0;
    for (const date in stats.tasbihCount) {
        totalTasbihRead += stats.tasbihCount[date];
    }

    // const today = new Date();

    // Define labels for days (starting from Monday)
    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"]; // Sunday to Saturday
    let ayahsReadThisWeek = 0;
    const ayahReadData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - (6 - i)); // Get past 7 days
        const formattedDate = getFormattedDate(date); // Use existing function
        ayahsReadThisWeek += stats.ayahReadCount[formattedDate] || 0;
        return {
            value: stats.ayahReadCount[formattedDate] || 0, // Default to 0 if no data
            label: daysOfWeek[date.getDay()], // Get the correct day name
        };
    });

    let tasbihReadThisWeek = 0;
    const tasbihReadData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - (6 - i)); // Get past 7 days
        const formattedDate = getFormattedDate(date); // Use existing function
        tasbihReadThisWeek += stats.tasbihCount[formattedDate] || 0;
        return {
            value: stats.tasbihCount[formattedDate] || 0, // Default to 0 if no data
            label: daysOfWeek[date.getDay()], // Get the correct day name
        };
    });

    const [tasbihReadThisWeekState, setTasbihReadThisWeekState] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            if (tasbihReadThisWeekState < tasbihReadThisWeek) {
                setTasbihReadThisWeekState(
                    (prevCount) =>
                        prevCount +
                        Math.max(
                            Math.floor((tasbihReadThisWeek - prevCount) / 3),
                            1
                        )
                );
            }
        }, 20);
    }, [tasbihReadThisWeekState]);

    const [totalTasbihReadState, setTotalTasbihReadState] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            if (totalTasbihReadState < totalTasbihRead) {
                setTotalTasbihReadState(
                    (prevCount) =>
                        prevCount +
                        Math.max(
                            Math.floor((totalTasbihRead - prevCount) / 3),
                            1
                        )
                );
            }
        }, 20);
    }, [totalTasbihReadState]);

    const [ayahsReadThisWeekState, setAyahsReadThisWeekState] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            if (ayahsReadThisWeekState < ayahsReadThisWeek) {
                setAyahsReadThisWeekState(
                    (prevCount) =>
                        prevCount +
                        Math.max(
                            Math.floor((ayahsReadThisWeek - prevCount) / 3),
                            1
                        )
                );
            }
        }, 10);
    }, [ayahsReadThisWeekState]);

    const [totalAyahsReadState, setTotalAyahsReadState] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            if (totalAyahsReadState < totalAyahsRead) {
                setTotalAyahsReadState(
                    (prevCount) =>
                        prevCount +
                        Math.max(
                            Math.floor((totalAyahsRead - prevCount) / 3),
                            1
                        )
                );
            }
        }, 10);
    }, [totalAyahsReadState]);

    // const [swiperIndex, setSwiperIndex] = useState(6);

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>Activity</Text>
                {/* <View style={styles.headerContainer}>
                    <View style={styles.headerSplitter}>
                        <Text style={styles.containerLabel}>All time</Text>
                        <Text style={styles.containerCount}>
                            {10}
                        </Text>
                    </View>
                    <View style={styles.headerSplitter}>
                        <Text style={styles.containerLabel}>This Week</Text>
                        <Text style={styles.containerCount}>
                            {10}
                        </Text>
                    </View>
                </View> */}
                <Swiper
                    loop={false}
                    index={6}
                    // onIndexChanged={(index) => setSwiperIndex(index)}
                    height={"auto"}
                    dotColor={Colours.bgDarkGrey}
                    activeDotColor={Colours.fgMainDark}
                >
                    <MonthlyChart data={activityData} monthsAgo={6} />
                    <MonthlyChart data={activityData} monthsAgo={5} />
                    <MonthlyChart data={activityData} monthsAgo={4} />
                    <MonthlyChart data={activityData} monthsAgo={3} />
                    <MonthlyChart data={activityData} monthsAgo={2} />
                    <MonthlyChart data={activityData} monthsAgo={1} />
                    <MonthlyChart data={activityData} monthsAgo={0} />
                </Swiper>
                <Text style={styles.title}>Ayahs Read</Text>
                <View style={styles.headerContainer}>
                    <View style={styles.headerSplitter}>
                        <Text style={styles.containerLabel}>All time</Text>
                        <Text style={styles.containerCount}>
                            {totalAyahsReadState}
                        </Text>
                    </View>
                    <View style={styles.headerSplitter}>
                        <Text style={styles.containerLabel}>This Week</Text>
                        <Text style={styles.containerCount}>
                            {ayahsReadThisWeekState}
                        </Text>
                    </View>
                </View>
                <BarChart
                    showFractionalValues={false}
                    parentWidth={Dimensions.get("window").width - 30}
                    // width={Dimensions.get("window").width - 30}
                    disableScroll
                    // disablePress
                    adjustToWidth
                    data={ayahReadData}
                    barWidth={
                        (Dimensions.get("window").width - 30 - 20 * 8 - 20) /
                        7.5
                    }
                    spacing={20}
                    initialSpacing={10}
                    endSpacing={10}
                    isAnimated
                    animationDuration={300}
                    showGradient
                    cappedBars
                    capThickness={4}
                    capColor={Colours.fgMainDark}
                    gradientColor={Colours.fgMainDark + "35"}
                    frontColor={Colours.fgMainDark + "00"}
                    xAxisThickness={2}
                    xAxisColor={Colours.fgGrey}
                    xAxisLabelTextStyle={{ color: Colours.fgColor }}
                    yAxisThickness={0}
                    yAxisTextStyle={{ color: Colours.fgGrey }}
                    hideOrigin
                    hideRules
                    noOfSections={4}
                />
            </View>
            <View style={styles.container}>
                <Text style={styles.title}>Tasbih Read</Text>
                <View style={styles.headerContainer}>
                    <View style={styles.headerSplitter}>
                        <Text style={styles.containerLabel}>All time</Text>
                        <Text style={styles.containerCount}>
                            {totalTasbihReadState}
                        </Text>
                    </View>
                    <View style={styles.headerSplitter}>
                        <Text style={styles.containerLabel}>This Week</Text>
                        <Text style={styles.containerCount}>
                            {tasbihReadThisWeekState}
                        </Text>
                    </View>
                </View>
                <BarChart
                    showFractionalValues={false}
                    parentWidth={Dimensions.get("window").width - 30}
                    // width={Dimensions.get("window").width - 30}
                    disableScroll
                    // disablePress
                    adjustToWidth
                    data={tasbihReadData}
                    barWidth={
                        (Dimensions.get("window").width - 30 - 20 * 8 - 20) /
                        7.5
                    }
                    spacing={20}
                    initialSpacing={10}
                    endSpacing={10}
                    isAnimated
                    animationDuration={300}
                    showGradient
                    cappedBars
                    capThickness={4}
                    capColor={Colours.fgMainDark}
                    gradientColor={Colours.fgMainDark + "35"}
                    frontColor={Colours.fgMainDark + "00"}
                    xAxisThickness={2}
                    xAxisColor={Colours.fgGrey}
                    xAxisLabelTextStyle={{ color: Colours.fgColor }}
                    yAxisThickness={0}
                    yAxisTextStyle={{ color: Colours.fgGrey }}
                    hideOrigin
                    hideRules
                    noOfSections={4}
                />
            </View>
        </ScrollView>
    );
};

const MonthlyChart = ({ data, monthsAgo }) => {
    function getDaysInMonth(month, year) {
        return new Date(year, month, 0).getDate(); // Last day of month = total days
    }

    function padNumber(num) {
        return num.toString().padStart(2, "0"); // Ensures two digits (01, 02, ..., 31)
    }

    let actualMonth = 0;
    let actualYear = 0;
    let max = 0;
    function convertToMonthArray(stats) {
        const today = new Date();
        today.setMonth(today.getMonth() - monthsAgo);
        const month = today.getMonth() + 1; // JS months are 0-based, so add 1
        actualMonth = month;
        const year = today.getFullYear();
        actualYear = year;

        const daysInMonth = getDaysInMonth(month, year);

        // Generate an array of days with default value 0
        const monthArray = Array.from({ length: daysInMonth }, (_, i) => {
            const formattedDate = `${padNumber(i + 1)}/${padNumber(
                month
            )}/${year}`;
            max = Math.max(max, stats[formattedDate] || 0);
            return stats[formattedDate] || 0;
        });

        return monthArray;
    }
    const monthArray = convertToMonthArray(data);

    console.log(monthArray, max);
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    return (
        <View
            style={{
                paddingHorizontal: 15,
            }}
        >
            <Text style={styles.containerLabel}>
                {months[actualMonth - 1] + " " + actualYear}
            </Text>
            <View
                style={{
                    marginVertical: 15,
                    marginBottom: 50,
                    flexDirection: "row",
                    // justifyContent: "space-between",
                    width: "100%",
                    flexWrap: "wrap",
                    gap: 7,
                }}
            >
                {monthArray.map((t, index) => {
                    return (
                        <View
                            style={{
                                width: 25,
                                height: 25,
                                backgroundColor:
                                    index + 1 > new Date().getDate() || t == 0
                                        ? Colours.bgDarkGrey
                                        : Colours.fgMainDark +
                                          Math.floor(
                                              (255 + (t / max) * 255) / 2
                                          )
                                              .toString(16)
                                              .padStart(2, "0"),
                                borderRadius: 5,
                            }}
                        ></View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "auto",
        padding: 15,
        paddingTop: 0,
    },
    title: {
        color: Colours.fgColor,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "left",
        marginBottom: 10,
        width: "100%",
        marginLeft: 25,
        marginTop: 10,
    },
    headerContainer: {
        width: "100%",
        padding: 10,
        marginBottom: 10,
        flexDirection: "row",
    },
    headerSplitter: {
        width: "50%",
    },
    containerCount: {
        color: Colours.fgColor,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "left",
    },
    containerLabel: {
        color: Colours.fgGrey,
        fontSize: 15,
        textAlign: "left",
    },
});

export default Index;
