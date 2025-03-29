// const puppeteer = require("puppeteer");

// async function automateElevenLabs(text) {
//     // Launch a new browser instance
//     const browser = await puppeteer.launch({ headless: false }); // set to true if you don't need to see the browser
//     const page = await browser.newPage();

//     // Navigate to the ElevenLabs demo page
//     await page.goto("https://elevenlabs.io");

//     // Wait for the textarea to be available
//     await page.waitForSelector("textarea");

//     // Type the Arabic text into the textarea
//     await page.type("textarea", text);

//     // Navigate to the parent div, then to its last child, and then its last child and press the button
//     await page.evaluate(() => {
//         const textarea = document.querySelector("textarea");
//         const parentDiv = textarea.closest("div");
//         const lastChildButton = parentDiv.lastElementChild.lastElementChild;
//         lastChildButton.click();
//     });

//     // Optionally, wait for some time to see the result
//     await page.waitForTimeout(5000);

//     // Close the browser
//     await browser.close();
// }

// // Define the Arabic text you want to insert
// const arabicText = "مرحبا كيف حالك";

// // Run the automation function with the Arabic text
// automateElevenLabs(arabicText);
