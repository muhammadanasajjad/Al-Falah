import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import ConsistentButton from "../../components/ConsistentButton";

import HadithBooks from "../../../assets/hadiths/books.json";
import Colours from "../../utils/colours.json";
import HadithList from "./HadithList";
import { getIcon } from "../../utils/icon";

const HadithsBooks = ({ setIsMainPage, setHadiths, isMainPage } = props) => {
    const [hadithBook, setHadithBook] = useState(null);

    if (isMainPage) {
        return (
            <>
                <ScrollView
                    stickyHeaderIndices={hadithBook ? [0] : []}
                    style={styles.hadithBooksContainer}
                >
                    {hadithBook && (
                        <ConsistentButton
                            style={styles.backToBooks}
                            onClick={() => {
                                setHadithBook(null);
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                {getIcon(
                                    "Ionicons",
                                    "chevron-back",
                                    20,
                                    Colours.fgColor,
                                    { width: 20, height: 20 }
                                )}
                                <Text
                                    style={{
                                        color: Colours.fgColor,
                                        fontSize: 18,
                                        marginLeft: 10,
                                    }}
                                >
                                    Back to Books
                                </Text>
                            </View>
                        </ConsistentButton>
                    )}

                    {hadithBook == null
                        ? Array.from(
                              { length: Object.keys(HadithBooks).length },
                              (_, index) => {
                                  let bookSlug =
                                      Object.keys(HadithBooks)[index];
                                  if (
                                      HadithBooks[bookSlug].last_hadithnumber >
                                      0
                                  )
                                      return (
                                          <HadithBookContainer
                                              bookSlug={bookSlug}
                                              onClick={(bookSlug) =>
                                                  setHadithBook(bookSlug)
                                              }
                                          />
                                      );
                                  return <></>;
                              }
                          )
                        : Array.from(
                              {
                                  length: Object.keys(
                                      HadithBooks[hadithBook].sections
                                  ).length,
                              },
                              (_, i) => {
                                  let section = Object.keys(
                                      HadithBooks[hadithBook].sections
                                  )[i];
                                  return (
                                      <BookSection
                                          bookSlug={hadithBook}
                                          section={section}
                                          onClick={(sect) => {
                                              let tempSection = sect;

                                              setHadiths(
                                                  Array.from(
                                                      {
                                                          length:
                                                              HadithBooks[
                                                                  hadithBook
                                                              ].section_details[
                                                                  tempSection
                                                              ]
                                                                  .hadithnumber_last -
                                                              HadithBooks[
                                                                  hadithBook
                                                              ].section_details[
                                                                  tempSection
                                                              ]
                                                                  .hadithnumber_first,
                                                      },
                                                      (_, i) => {
                                                          let hadithNumber =
                                                              HadithBooks[
                                                                  hadithBook
                                                              ].section_details[
                                                                  tempSection
                                                              ]
                                                                  .hadithnumber_first +
                                                              i;
                                                          return {
                                                              book: hadithBook,
                                                              number: hadithNumber,
                                                          };
                                                      }
                                                  )
                                              );
                                              setIsMainPage(false);
                                          }}
                                      />
                                  );
                              }
                          )}
                </ScrollView>
            </>
        );
    }
    return;
};

const BookSection = ({
    bookSlug,
    section = "1",
    onClick = () => {},
} = props) => {
    let book = HadithBooks[bookSlug];

    if (book.sections[section] != "") {
        function HadithDetailsContainer({} = props) {
            return (
                <>
                    <Text
                        style={[
                            styles.hadithName,
                            { marginHorizontal: 10, maxWidth: "70%" },
                        ]}
                    >
                        {book.sections[section]}
                    </Text>
                    <Text
                        style={[
                            styles.hadithCount,
                            {
                                marginLeft: "auto",
                            },
                        ]}
                    >
                        {book.section_details[section].hadithnumber_last -
                            book.section_details[section].hadithnumber_first}
                    </Text>
                </>
            );
        }

        return (
            <ConsistentButton
                style={styles.hadithContainer}
                onClick={() => onClick(section)}
            >
                <View style={styles.hadithNameIconContainer}>
                    <Text style={styles.hadithIconText}>
                        {section.padStart(2, "0")}
                    </Text>
                </View>
                <HadithDetailsContainer />
            </ConsistentButton>
        );
    }
    return;
};

const HadithBookContainer = ({ bookSlug, onClick = () => {} } = props) => {
    let book = HadithBooks[bookSlug];

    function getIconText(name) {
        const words = name.split(/[\s-]+/);
        const firstLetter = words[0][0];
        const lastLetter = words[words.length - 1][0];
        return firstLetter + lastLetter;
    }

    return (
        <ConsistentButton
            onClick={() => onClick(bookSlug)}
            style={styles.hadithContainer}
        >
            <View style={styles.hadithNameIconContainer}>
                <Text style={styles.hadithIconText}>
                    {getIconText(book.name)}
                </Text>
            </View>
            <View style={styles.hadithDetailsContainer}>
                <View style={styles.hadithDetails}>
                    <Text style={styles.hadithName}>{book.name}</Text>
                    <Text style={styles.hadithExtraDetails}>
                        {
                            // truncateText(hadith.writerName.toUpperCase(), 20) +
                            //     " - " +
                            Object.keys(book.sections).length + " CHAPTERS"
                        }
                    </Text>
                </View>
                <Text style={styles.hadithCount}>{book.last_hadithnumber}</Text>
            </View>
        </ConsistentButton>
    );
};

const styles = StyleSheet.create({
    hadithContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomColor: Colours.fgGrey + "55", // for transparency
        borderBottomWidth: 1,
        paddingHorizontal: 10,
    },
    hadithNumberContainer: {
        padding: 15,
        justifyContent: "center",
    },
    hadithNumberContainerImage: {
        // resizeMode: "contain",
    },
    hadithNumber: {
        color: Colours.fgColor,
    },
    hadithDetailsContainer: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 10,
        alignItems: "center",
    },
    hadithDetails: {
        maxWidth: "70%",
    },
    hadithName: {
        color: Colours.fgColor,
        fontWeight: "semibold",
        fontSize: 16,
        marginBottom: 3,
    },
    hadithExtraDetails: {
        color: Colours.fgGrey,
        fontSize: 12,
    },
    hadithCount: {
        color: Colours.fgMainDark,
        fontFamily: "Uthmanic",
        fontSize: 25,
        fontWeight: "bold",
        maxWidth: "80%",
    },
    hadithBooksContainer: {
        margin: 15,
    },
    hadithNameIconContainer: {
        borderRadius: 10,
        backgroundColor: Colours.fgMainDark,
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    hadithIconText: {
        color: "white",
    },
    backToBooks: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: Colours.bgDarkGrey,
        flexDirection: "row-reverse",
        alignItems: "center",
    },
});

export default HadithsBooks;
