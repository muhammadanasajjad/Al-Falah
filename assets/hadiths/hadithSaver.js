const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

async function loadBooks() {
    let books;
    await fetch(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions.json`
    )
        .then((response) => {
            if (!response.ok)
                throw new Error(
                    "Network response was not ok " + response.statusText
                );
            return response.json();
        })
        .then((data) => {
            books = Object.keys(data);
        })
        .catch((error) =>
            console.error("There was a problem with loading books:\n" + error)
        );

    return books;
}

async function loadAllHadith() {
    let booksSlugs = await loadBooks();
    let hadiths = {};
    //https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-abudawud.json
    for (let i = 0; i < booksSlugs.length; i++) {
        let bookSlug = booksSlugs[i];
        await fetch(
            `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-${bookSlug}.json`
        )
            .then((response) => {
                if (!response.ok)
                    throw new Error(
                        "Network response was not ok " + response.statusText
                    );
                return response.json();
            })
            .then((data) => {
                let metadata = data.metadata;
                metadata.bookName = metadata.name;
                let bookHadiths = data.hadiths;
                for (let i = 0; i < bookHadiths.length; i++) {
                    let hadith = bookHadiths[i];
                    // console.log(hadith);
                    hadith.hadithEnglish =
                        hadith.text.split(":").length > 1
                            ? hadith.text
                                  .split(":")
                                  .splice(1, hadith.text.split(":").length)
                                  .join(":")
                            : hadith.text;
                    hadith.englishNarrator =
                        hadith.text.split(":").length > 1
                            ? hadith.text.split(":")[0] + ":"
                            : null;
                    hadith.text = null;
                    hadith.book = data.metadata;
                    hadith.book.sections = null;
                    hadith.book.section_details = null;
                    hadith.bookSlug = bookSlug;
                }
                hadiths[bookSlug] = data.hadiths;
            })
            .catch((error) => {
                console.error("Could not load " + bookSlug + ":\n" + error);
            });
        await fetch(
            `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-${bookSlug}.json`
        )
            .then((response) => {
                if (!response.ok)
                    throw new Error(
                        "Network response was not ok " + response.statusText
                    );
                return response.json();
            })
            .then((data) => {
                let metadata = data.metadata;
                metadata.bookName = metadata.name;
                let bookHadiths = data.hadiths;
                for (let i = 0; i < bookHadiths.length; i++) {
                    let hadith = bookHadiths[i];
                    // console.log(hadith);
                    hadiths[bookSlug][i].hadithArabic = hadith.text;
                }
            })
            .catch((error) => {
                console.error("Could not load " + bookSlug + ":\n" + error);
            });
    }
    return hadiths;
}

// loadAllHadith().then((hadiths) => {
//     for (let i = 0; i < Object.keys(hadiths).length; i++) {
//         let bookSlug = Object.keys(hadiths)[i];
//         const bookString = JSON.stringify(hadiths[bookSlug], null, 1);
//         const filePath = path.join(__dirname, bookSlug + ".json");

//         fs.writeFile(filePath, bookString, (err) => {
//             if (err) {
//                 console.error("Failed to write file: " + err.message);
//             }
//             console.log("Data successfully saved to " + filePath);
//         });
//     }
// });

async function loadAllBooks() {
    //https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/info.json
    let books = {};
    await fetch(
        "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/info.json"
    )
        .then((response) => {
            if (!response.ok)
                throw new Error(
                    "Network response was not ok " + response.statusText
                );
            return response.json();
        })
        .then((data) => {
            let bookSlugs = Object.keys(data);
            for (let i = 0; i < bookSlugs.length; i++) {
                let bookSlug = bookSlugs[i];
                books[bookSlug] = data[bookSlug].metadata;
            }
        });
    return books;
}

loadAllBooks().then((books) => {
    let booksString = JSON.stringify(books, null, 1);
    let filePath = path.join(__dirname, "books.json");
    fs.writeFile(filePath, booksString, (err) => {
        if (err) {
            console.error("Failed to save");
        }
    });
});

// const HadithAPIkey =
//     "$2y$10$KflglnIayXz66rQ4IaAohu95Ql2lt2dyQxsHj2jYIsfWvst3jz0g";

// async function loadBooks() {
//     let books;
//     await fetch(`https://hadithapi.com/api/books?apiKey=${HadithAPIkey}`)
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error(
//                     "Network response was not ok " + response.statusText
//                 );
//             }
//             return response.json();
//         })
//         .then((data) => {
//             books = data;
//         })
//         .catch((error) => {
//             console.error(
//                 "There was a problem with the fetch operation:",
//                 error
//             );
//         });

//     return books;
// }

// async function loadAllHadith(bookDetails) {
//     let allBooks = {};
//     let i = 0;
//     while (i < bookDetails.length) {
//         let bookSlug = bookDetails[i].bookSlug;
//         let lastPage = 0;
//         // https://hadithapi.com/public/api/hadiths?apiKey=$2y$10$KflglnIayXz66rQ4IaAohu95Ql2lt2dyQxsHj2jYIsfWvst3jz0g&book=sahih-bukhari&page=1
//         let link = `https://hadithapi.com/public/api/hadiths?apiKey=${HadithAPIkey}&book=${bookSlug}&page=1&paginate=50000`;
//         await fetch(link)
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error(
//                         "Network response was not ok " + response.statusText
//                     );
//                 }
//                 return response.json();
//             })
//             .then((data) => {
//                 lastPage = data.hadiths.last_page;
//                 allBooks[bookSlug] = [];
//                 i++;
//             })
//             .catch((error) => {
//                 console.error(
//                     "There was a problem with the fetch operation:",
//                     error
//                 );
//                 i++;
//             });
//         let page = 1;
//         while (page <= lastPage) {
//             link = `https://hadithapi.com/public/api/hadiths?apiKey=${HadithAPIkey}&book=${bookSlug}&page=${page}&paginate=50000`;

//             await fetch(link)
//                 .then((response) => {
//                     if (!response.ok) {
//                         throw new Error(
//                             "Network response was not ok " + response.statusText
//                         );
//                     }
//                     return response.json();
//                 })
//                 .then((data) => {
//                     console.log(page, "/", lastPage);
//                     allBooks[bookSlug].push(...data.hadiths.data);
//                     page++;
//                 })
//                 .catch((error) => {
//                     console.error(
//                         "There was a problem with the fetch operation:",
//                         error
//                     );
//                 });
//         }
//     }
//     const allBooksString = JSON.stringify(allBooks, null, 2);
//     const filePath = path.join(__dirname, "hadiths.json");

//     fs.writeFile(filePath, allBooksString, (err) => {
//         if (err) {
//             console.error("Failed to write file: " + err.message);
//         }
//         console.log("Data successfully saved to " + filePath);
//     });
// }

// loadBooks().then((books) => {
//     loadAllHadith(books.books);
// });
