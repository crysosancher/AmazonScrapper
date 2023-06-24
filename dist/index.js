"use strict";
// import puppeteer from "puppeteer";
// import dotenv from "dotenv";
// import cheerio from 'cheerio';
// dotenv.config();
// function delay(time: number) {
//   return new Promise(function(resolve) { 
//       setTimeout(resolve, time)
//   });
// }
// puppeteer
//   .launch({
//     headless: false,
//   })
//   .then(async (browser) => {
//     const page = await browser.newPage();
// 		console.log(process.env.website_Url);
// 		let url=process.env.websiteUrl||"https://www.amazon.in/";
//     await page.goto(
//       url
//     );
// 		//Click on login
// 		await page.click("#nav-link-accountList");
//     await delay(2000);
// 		//select the box
//     let email=process.env.amazonEmail||"";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//    // await page.waitForSelector("body");
//    //Write email Id
//     await page.type("#ap_email", email);
// //Click on continue
//     await page.click("#continue");
//     await delay(2000);
//     //Write password
//     let password=process.env.amazonPassword||"";
//     await page.type("#ap_password", password);
//     //Click on login
//     await page.click("#signInSubmit");
//     await delay(3000);
//     //Click on search box
//     await page.click("#twotabsearchtextbox");
//     //Write product name
//     await page.type("#twotabsearchtextbox", "iphone 11");
//     //Click on search button
//     await page.click("#nav-search-submit-button");
//     await delay(2000);
//     //wait for page to load
//     await page.waitForSelector("body");
//     const products = await page.evaluate(() => {
//       let productInfo = [];
//       const searchResults:any = document.getElementsByClassName("sg-col-20-of-24 s-result-item s-asin sg-col-0-of-12 sg-col-16-of-20 sg-col s-widget-spacing-small sg-col-12-of-16")
//       const $=cheerio.load(searchResults);
//       for(const i in searchResults){
//         try{
//           let tittle= $(searchResults[i]).find("h2 a").text();
//           let price= $(searchResults[i]).find("span.a-price span").text();
//           let rating= $(searchResults[i]).find("span.a-icon-alt").text();
//           let reviewCount= $(searchResults[i]).find("span.a-size-base").text();
//           productInfo.push({
//             tittle,
//             price,
//             rating,
//             reviewCount
//           });
//         }catch(e){
//           console.log(e);
//         }
//       }
//       return productInfo;
//     });
//     console.log(products);
//   });
const puppeteer_1 = __importDefault(require("puppeteer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}
puppeteer_1.default
    .launch({
    headless: false,
})
    .then((browser) => __awaiter(void 0, void 0, void 0, function* () {
    const page = yield browser.newPage();
    console.log(process.env.website_Url);
    let url = process.env.websiteUrl || "https://www.amazon.in/";
    yield page.goto(url);
    // Click on login
    yield page.click("#nav-link-accountList");
    yield delay(2000);
    // Select the box
    let email = process.env.amazonEmail || "";
    // Write email Id
    yield page.type("#ap_email", email);
    // Click on continue
    yield page.click("#continue");
    yield delay(2000);
    // Write password
    let password = process.env.amazonPassword || "";
    yield page.type("#ap_password", password);
    // Click on login
    yield page.click("#signInSubmit");
    yield delay(3000);
    // Click on search box
    yield page.click("#twotabsearchtextbox");
    // Write product name
    yield page.type("#twotabsearchtextbox", "iphone 11");
    // Click on search button
    yield page.click("#nav-search-submit-button");
    yield delay(2000);
    // Wait for page to load
    yield page.waitForSelector("body");
    const products = yield page.evaluate(() => {
        let productInfo = [];
        const searchResults = document.querySelectorAll(".sg-col-20-of-24.s-result-item.s-asin.sg-col-0-of-12.sg-col-16-of-20.sg-col.s-widget-spacing-small.sg-col-12-of-16");
        for (const searchResult of searchResults) {
            try {
                let title = searchResult.querySelector("h2 a span").textContent.trim();
                let price = searchResult.querySelector("span.a-price span").textContent.trim();
                let rating = searchResult.querySelector("span.a-icon-alt").textContent.trim();
                let reviewCount = searchResult.querySelector("span.a-size-base").textContent.trim();
                productInfo.push({
                    title,
                    price,
                    rating,
                    reviewCount,
                });
            }
            catch (e) {
                console.log(e);
            }
        }
        return productInfo;
    });
    console.log(products);
}));
