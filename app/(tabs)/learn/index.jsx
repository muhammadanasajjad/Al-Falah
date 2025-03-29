import React, { useEffect, useRef, useState } from "react";
import { Animated, ScrollView, StyleSheet, Text, View } from "react-native";
import Swiper from "react-native-swiper";
import Colours from "../../utils/colours.json";
import { getIcon } from "../../utils/icon";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";
import ElevenlabsPlayText from "../../components/ElevenlabsPlayText";

const letters = require("../../utils/quiz.json");

const Index = () => {
    return (
        <Swiper loop={false}>
            <View></View>
            <Quiz />
            <Lesson
                title="Letters"
                icon="📚"
                content={[
                    { type: "text", value: "Something" },
                    { type: "letterCards", value: { start: 0, end: 5 } },
                ]}
            />
        </Swiper>
    );
};

function Lesson({ title, icon, content } = props) {
    const letterCards = Object.keys(letters).map((letter, i) => {
        var letter = Object.keys(letters)[i];
        return (
            <LetterCard
                key={i}
                arabicLetter={letter}
                name={letters[letter].name}
                pronounciationLetter={letters[letter].pronounciationLetter}
                exampleWord={letters[letter].exampleWord}
            />
        );
    });

    const [quizOpened, setQuizOpened] = useState(false);

    return (
        <>
            <ScrollView
                stytle={[
                    { marginBottom: 50 },
                    quizOpened ? { display: "none" } : { display: "flex" },
                ]}
            >
                <View style={styles.titleContainer}>
                    <LinearGradient
                        colors={[Colours.fgBright, Colours.fgDark]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.titleIconContainer}
                    >
                        {/* <Text style={styles.titleIcon}>{icon}</Text> */}
                    </LinearGradient>
                    <Text style={styles.title}>{title}</Text>
                </View>
                {/* <View>
                    {content.map((obj, i) => {
                        let key = obj.type;
                        let value = obj.value;
                        if (key == "text") {
                            return (
                                <Text style={styles.text} key={i}>
                                    {value}
                                </Text>
                            );
                        } else if (key == "letterCards") {
                            return letterCards.slice(value.start, value.end);
                        }
                    })}
                </View> */}
            </ScrollView>
        </>
    );

    // return (
    //     <>
    //         <ScrollView
    //             style={[
    //                 { marginBottom: 50 },
    //                 quizOpened ? { display: "none" } : { display: "flex" },
    //             ]}
    //         >
    //             <View style={styles.titleContainer}>
    //                 <LinearGradient
    //                     colors={[Colours.fgBright, Colours.fgDark]}
    //                     start={{ x: 0, y: 0 }}
    //                     end={{ x: 1, y: 1 }}
    //                     style={styles.titleIconContainer}
    //                 >
    //                     {typeof icon == "string" ? (
    //                         <Text style={styles.titleIcon}>{icon}</Text>
    //                     ) : (
    //                         icon
    //                     )}
    //                 </LinearGradient>
    //                 <Text style={styles.title}>{title}</Text>
    //             </View>
    //             <View>
    //                 {content.map((obj, i) => {
    //                     let key = obj.type;
    //                     let value = obj.value;
    //                     if (key == "text") {
    //                         return (
    //                             <Text style={styles.text} key={i}>
    //                                 {value}
    //                             </Text>
    //                         );
    //                     } else if (key == "letterCards") {
    //                         return letterCards.slice(value.start, value.end);
    //                     }
    //                 })}
    //             </View>
    //             <TouchableOpacity
    //                 style={{
    //                     marginHorizontal: 30,
    //                     paddingBottom: 20,
    //                 }}
    //                 onPress={() => setQuizOpened(!quizOpened)}
    //             >
    //                 <Text
    //                     style={{
    //                         textAlign: "center",
    //                         color: Colours.fgMainDark,
    //                         fontSize: 20,
    //                     }}
    //                 >
    //                     Quiz yourself
    //                 </Text>
    //             </TouchableOpacity>
    //         </ScrollView>
    //         {quizOpened && (
    //             <>
    //                 <View
    //                     style={{
    //                         width: "100%",
    //                         borderBottomColor: Colours.fgGrey + "55",
    //                         borderBottomWidth: 1,
    //                         flexDirection: "row",
    //                     }}
    //                 >
    //                     <TouchableOpacity
    //                         style={{
    //                             width: 75,
    //                             height: 50,
    //                             // justifyContent: "center",
    //                             alignItems: "center",
    //                         }}
    //                         onPress={() => setQuizOpened(false)}
    //                     >
    //                         {getIcon("Ionicons", "close-outline", 35)}
    //                     </TouchableOpacity>
    //                     <Text
    //                         style={{
    //                             color: Colours.fgColor,
    //                             // marginVertical: "auto",
    //                             fontSize: 20,
    //                             paddingTop: 5,
    //                         }}
    //                     >
    //                         {title}
    //                     </Text>
    //                 </View>
    //                 <Quiz
    //                     onFinish={(answers) => {
    //                         setQuizOpened(false);
    //                     }}
    //                     questions={shuffle(
    //                         content.flatMap((obj, i) => {
    //                             let key = obj.type;
    //                             let value = obj.value;
    //                             if (key == "letterCards") {
    //                                 let arr = [];
    //                                 for (
    //                                     let j = value.start;
    //                                     j < value.end;
    //                                     j++
    //                                 ) {
    //                                     arr.push({
    //                                         questionType: "letterFromName",
    //                                         start: 0,
    //                                         end: value.end,
    //                                         originalCorrectLetter:
    //                                             Object.keys(letters)[j],
    //                                     });
    //                                     arr.push({
    //                                         questionType:
    //                                             "pronounciationFromLetter",
    //                                         start: 0,
    //                                         end: value.end,
    //                                         originalCorrectLetter:
    //                                             Object.keys(letters)[j],
    //                                     });
    //                                 }
    //                                 return arr;
    //                             }
    //                             return [];
    //                         })
    //                     )}
    //                 />
    //             </>
    //         )}
    //     </>
    // );
}

function Quiz({
    questions = [
        {
            questionType: "letterFromName",
            start: 0,
            end: 5,
            originalCorrectLetter: getRandLetter(0, 1)[0],
        },
    ],
    onFinish = (answers) => {},
} = props) {
    const LetterFromName = ({
        start = 0,
        end = 5,
        originalCorrectLetter = getRandLetter(start, end)[0],
        optionCount = 4,
        onAnswer = (correct) => {},
    } = props) => {
        let correctLetter = originalCorrectLetter;
        let arr = [correctLetter];

        while (arr.length < Math.min(end - start, optionCount)) {
            let letter = getRandLetter(start, end, arr)[0];
            arr.push(letter);
        }

        return (
            <>
                <Text
                    style={{
                        color: Colours.fgColor,
                        fontSize: 25,
                        marginBottom: 20,
                    }}
                >
                    Which of the following is the letter{" "}
                    {letters[correctLetter].name.toLowerCase()}?
                </Text>
                <QuizCardOptions
                    options={shuffle(
                        arr.map((letter) => ({
                            name: letter,
                            val: letter,
                        }))
                    )}
                    font="Indo-Pak"
                    fontSize={28}
                    onValueChange={(val) => {
                        onAnswer(val == correctLetter);
                    }}
                />
            </>
        );
    };

    const PronounciationFromLetter = ({
        start = 0,
        end = 5,
        originalCorrectLetter = getRandLetter(start, end)[0],
        optionCount = 4,
        onAnswer = (correct) => {},
    } = props) => {
        let correctLetter = originalCorrectLetter;
        let arr = [correctLetter];

        while (arr.length < Math.min(end - start, optionCount)) {
            let letter = getRandLetter(start, end, arr)[0];
            arr.push(letter);
        }

        return (
            <>
                <Text
                    style={{
                        color: Colours.fgColor,
                        fontSize: 25,
                        marginBottom: 20,
                    }}
                >
                    How do you pronounce the letter{" "}
                    <Text
                        style={{
                            fontFamily: "Indo-Pak",
                            fontSize: 28,
                        }}
                    >
                        {correctLetter}
                    </Text>
                    ?
                </Text>
                <QuizCardOptions
                    options={shuffle(
                        arr.map((letter) => ({
                            name: letters[letter].pronounciationLetter,
                            val: letter,
                        }))
                    )}
                    fontSize={28}
                    onValueChange={(val) => {
                        onAnswer(val == correctLetter);
                    }}
                />
            </>
        );
    };

    const currentAnswer = useRef(null);
    const onCurrentAnswerChange = (val) => {
        currentAnswer.current = val;
        animateBars();
    };

    const [answers, setAnswers] = useState([]);
    const onAnswerSubmit = (
        correct = currentAnswer.current,
        callback = () => {
            currentAnswer.current = null;
        }
    ) => {
        animateBars();
        setAnswers([...answers, correct]);
        callback();
    };

    const getAnswerAmount = (localAnswers = answers) => {
        let correctCount = 0;
        localAnswers.forEach((answer) => {
            if (answer) {
                correctCount++;
            }
        });
        return [correctCount, localAnswers.length - correctCount];
    };

    const animatedWidth1 = useRef(new Animated.Value(0)).current;
    const animatedWidth2 = useRef(new Animated.Value(0)).current;

    const animateBars = () => {
        const totalQuestions = questions.length;

        const progress1 =
            totalQuestions === 0
                ? 0
                : (getAnswerAmount()[0] / totalQuestions) * 100;
        const progress2 =
            totalQuestions === 0
                ? 0
                : ((getAnswerAmount()[0] + getAnswerAmount()[1]) /
                      totalQuestions) *
                  100;

        // Animate the first bar width
        Animated.timing(animatedWidth1, {
            toValue: progress1,
            duration: 500,
            useNativeDriver: false,
        }).start();

        // Animate the second bar width
        Animated.timing(animatedWidth2, {
            toValue: progress2,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    useEffect(() => {
        animateBars();
    }, [answers]);

    // useEffect(() => {
    //     if (answers.length == questions.length) {
    //         onFinish(answers);
    //     }
    // }, [answers]);

    return (
        <>
            <View
                style={{
                    paddingHorizontal: 30,
                    paddingVertical: 20,
                    display:
                        answers.length < questions.length ? "flex" : "none",
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ color: Colours.fgGrey, fontSize: 20 }}>
                        <Text style={{ color: Colours.fgMainDark }}>
                            {getAnswerAmount()[0]}
                        </Text>
                        /{answers.length}
                    </Text>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: Colours.bgDarkGrey,
                            height: 10,
                            borderRadius: 5,
                            marginLeft: 15,
                            overflow: "hidden",
                        }}
                    >
                        <Animated.View
                            style={{
                                backgroundColor: Colours.fgDarkRed,
                                position: "absolute",
                                height: "100%",
                                width: animatedWidth2.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: ["0%", "100%"],
                                }),
                                borderRadius: 5,
                            }}
                        />
                        <Animated.View
                            style={{
                                backgroundColor: Colours.fgMainDark,
                                position: "absolute",
                                height: "100%",
                                width: animatedWidth1.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: ["0%", "100%"],
                                }),
                                borderRadius: 5,
                            }}
                        />
                    </View>
                </View>
            </View>
            {questions.map((question, i) => {
                if (question == null) return;
                if (question.questionType == "letterFromName") {
                    return (
                        <ScrollView
                            style={{
                                marginHorizontal: 30,
                                display: i == answers.length ? "flex" : "none",
                            }}
                            contentContainerStyle={{ flexGrow: 1 }}
                        >
                            <LetterFromName
                                key={i}
                                {...question}
                                onAnswer={onCurrentAnswerChange}
                            />
                        </ScrollView>
                    );
                } else if (
                    question.questionType == "pronounciationFromLetter"
                ) {
                    return (
                        <ScrollView
                            style={{
                                marginHorizontal: 30,
                                display: i == answers.length ? "flex" : "none",
                            }}
                            contentContainerStyle={{ flexGrow: 1 }}
                        >
                            <PronounciationFromLetter
                                key={i}
                                {...question}
                                onAnswer={onCurrentAnswerChange}
                            />
                        </ScrollView>
                    );
                }
            })}
            <TouchableOpacity
                style={{
                    margin: 30,
                    marginTop: 20,
                    padding: 10,
                    backgroundColor: Colours.fgMainDark,
                    borderRadius: 10,
                    display:
                        answers.length < questions.length ? "flex" : "none",
                }}
                onPress={() =>
                    onAnswerSubmit(currentAnswer.current, onCurrentAnswerChange)
                }
            >
                <Text
                    style={{
                        color: Colours.fgColor,
                        fontSize: 25,
                        fontWeight: "bold",
                        textAlign: "center",
                    }}
                >
                    Next
                </Text>
            </TouchableOpacity>
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    display:
                        answers.length == questions.length ? "flex" : "none",
                }}
            >
                <View
                    style={{
                        backgroundColor: Colours.bgDarkGrey,
                        padding: 20,
                        borderRadius: 10,
                    }}
                >
                    <Text
                        style={{
                            color: Colours.fgColor,
                            fontSize: 75,
                            fontWeight: "bold",
                            textAlign: "center",
                        }}
                    >
                        {answers.length > 0
                            ? Math.floor(
                                  (getAnswerAmount()[0] / answers.length) * 100
                              )
                            : 0}
                        %
                    </Text>
                    <Text
                        style={{
                            color: Colours.fgColor,
                            fontSize: 16,
                            textAlign: "center",
                            maxWidth: "60%",
                            alignSelf: "center",
                            marginBottom: 20,
                        }}
                    >
                        Well done
                        {getAnswerAmount()[0] / answers.length < 0
                            ? " but can you do better?"
                            : "."}
                    </Text>
                    <TouchableOpacity
                        style={{
                            padding: 10,
                            backgroundColor: Colours.fgMainDark,
                            borderRadius: 10,
                        }}
                        onPress={() => onFinish(answers)}
                    >
                        <Text
                            style={{
                                color: Colours.fgColor,
                                fontSize: 20,
                                fontWeight: "bold",
                                textAlign: "center",
                            }}
                        >
                            Finish
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}

function QuizCardOptions({
    options = [
        { name: "a", val: "a" },
        { name: "b", val: "b" },
        { name: "c", val: "c" },
        { name: "d", val: "d" },
    ],
    onValueChange = (val) => {},
    initialValue = null,
    font,
    fontSize,
} = props) {
    const [value, setValue] = useState(initialValue);
    return (
        <View
            style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                flex: 1,
            }}
        >
            {options.map((option, i) => (
                <TouchableOpacity
                    style={{
                        // flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                        borderColor:
                            (option.val ? option.val : option.name) === value
                                ? Colours.fgMainDark
                                : Colours.fgGrey + "55",
                        borderWidth: 3,
                        width: "45%",
                        height: `${100 / (options.length / 2) - 10}%`,
                        marginBottom: "10%",
                    }}
                    onPress={() => {
                        setValue(option.val ? option.val : option.name);
                        onValueChange(option.val ? option.val : option.name);
                    }}
                >
                    <View
                        style={{
                            width: 25,
                            height: 25,
                            borderRadius: 12.5,
                            borderColor:
                                (option.val ? option.val : option.name) ===
                                value
                                    ? Colours.fgMainDark
                                    : Colours.fgGrey + "55",
                            borderWidth: 3,
                            position: "absolute",
                            top: 10,
                            left: 10,
                            // justifyContent: "center",
                            // alignItems: "center",
                        }}
                    >
                        <View
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: 6,
                                backgroundColor:
                                    (option.val ? option.val : option.name) ===
                                    value
                                        ? Colours.fgMainDark
                                        : "transparent",
                                margin: "auto",
                            }}
                        />
                    </View>
                    <Text
                        style={[
                            {
                                fontSize: fontSize ? fontSize : 20,
                                color: Colours.fgColor,
                            },
                            font != null ? { fontFamily: font } : {},
                        ]}
                    >
                        {option.name}
                    </Text>
                    {/* <View style={{ position: "absolute", top: 10, right: 10 }}>
                        <ElevenlabsPlayText text={letters[option.name]} />
                    </View> */}
                </TouchableOpacity>
            ))}
        </View>
    );
}

function QuizTextOptions({
    options = [
        { name: "a", val: "a" },
        { name: "b", val: "b" },
        { name: "c", val: "c" },
        { name: "d", val: "d" },
    ],
    onValueChange = (val) => {},
    initialValue = null,
    font,
    fontSize,
} = props) {
    const [value, setValue] = useState(initialValue);
    return options.map((option, i) => (
        <TouchableOpacity
            style={{
                flexDirection: "row",
                paddingVertical: 5,
                alignItems: "center",
            }}
            onPress={() => {
                setValue(option.val ? option.val : option.name);
                onValueChange(option.val ? option.val : option.name);
            }}
        >
            <View
                style={{
                    width: 25,
                    height: 25,
                    borderRadius: 12.5,
                    borderColor:
                        (option.val ? option.val : option.name) === value
                            ? Colours.fgMainDark
                            : Colours.fgGrey + "55",
                    borderWidth: 3,
                    // justifyContent: "center",
                    // alignItems: "center",
                }}
            >
                <View
                    style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor:
                            (option.val ? option.val : option.name) === value
                                ? Colours.fgMainDark
                                : "transparent",
                        margin: "auto",
                    }}
                />
            </View>
            <Text
                style={[
                    {
                        fontSize: fontSize ? fontSize : 20,
                        marginLeft: 10,
                        color: Colours.fgColor,
                    },
                    font != null ? { fontFamily: font } : {},
                ]}
            >
                {option.name}
            </Text>
        </TouchableOpacity>
    ));
}

function getRandLetter(
    start = 0,
    end = Object.keys(letters).length,
    unincludedLetters = []
) {
    let i = Math.floor(Math.random() * (end - start)) + start;
    let letter = Object.keys(letters)[i];

    while (unincludedLetters.includes(letter)) {
        i = Math.floor(Math.random() * (end - start));
        letter = Object.keys(letters)[i];
    }
    return [letter, letters[letter]];
}

function shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }
    return array;
}

function LetterCard({
    arabicLetter,
    name,
    pronounciationLetter,
    exampleWord,
} = props) {
    const Details = () => (
        <Text>
            <Text style={{ color: Colours.fgMainDark, fontSize: 25 }}>
                {name}
            </Text>
            {"\n"}
            <Text
                style={[
                    {
                        color: Colours.fgColor,
                        marginTop: 5,
                        paddingHorizontal: 5,
                        fontSize: 18,
                    },
                ]}
            >
                {pronounciationLetter} - Pronounciation
            </Text>
            {"\n"}
            {createExampleLetter(exampleWord)}
        </Text>
    );

    return (
        <View style={styles.letterCard}>
            {/* <Text
                style={[
                    styles.arabicText,
                    {
                        color: Colours.fgMainDark,
                        fontSize: 35,
                        marginRight: 25,
                    },
                ]}
            >
                {arabicLetter}
            </Text> */}
            {/* <Details /> */}
            {/* <View style={{ position: "absolute", top: 10, right: 10 }}>
                <ElevenlabsPlayText text={letters[arabicLetter].arabicName} />
            </View> */}
        </View>
    );
}

const createExampleLetter = (inputString) => {
    // Split the input string by the single quote
    const parts = inputString.split("'");

    if (parts.length !== 3 && inputString.split(" ").length == 1) {
        throw new Error(
            "Input string must be in the format 'f'a'ther' not " + inputString
        );
    }

    const [before, exampleLetter, after] = parts;

    return (
        <Text
            style={{
                color: Colours.fgGrey,
                marginTop: 0,
                paddingHorizontal: 5,
                fontSize: 16,
            }}
        >
            {inputString.split(" ").length == 1 ? (
                <>
                    Example: '
                    <Text>
                        {before}
                        <Text
                            style={{
                                textDecorationLine: "underline",
                                color: Colours.fgMainDark,
                            }}
                        >
                            {exampleLetter}
                        </Text>
                        {after}'
                    </Text>
                </>
            ) : (
                inputString
            )}
        </Text>
    );
};

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 30,
    },
    titleIconContainer: {
        width: 45,
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    titleIcon: {
        color: Colours.fgColor,
        fontSize: 25,
        // fontFamily: "Indo-Pak",
    },
    title: {
        fontSize: 25,
        color: Colours.fgColor,
        marginLeft: 15,
    },
    text: {
        fontSize: 18,
        color: Colours.fgColor,
        marginHorizontal: 30,
        marginTop: 15,
        marginBottom: 20,
    },
    backgroundText: {
        color: Colours.fgGrey,
    },
    arabicText: {
        fontFamily: "Indo-Pak",
    },
    letterCard: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 30,
        marginBottom: 20,
        backgroundColor: Colours.bgDarkGrey,
        borderRadius: 10,
        paddingLeft: 25,
        paddingRight: 15,
        paddingVertical: 10,
    },
    letterPronounciation: {
        fontSize: 16,
        color: Colours.fgColor,
    },
});

export default Index;
