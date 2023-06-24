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

import puppeteer from "puppeteer";
import dotenv from "dotenv";

dotenv.config();

function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

puppeteer
  .launch({
    headless: false,
  })
  .then(async (browser) => {
    const page = await browser.newPage();
    console.log(process.env.website_Url);
    let url = process.env.websiteUrl || "https://www.amazon.in/";
    await page.goto(url);

    // Click on login
    await page.click("#nav-link-accountList");
    await delay(2000);

    // Select the box
    let email = process.env.amazonEmail || "";

    // Write email Id
    await page.type("#ap_email", email);

    // Click on continue
    await page.click("#continue");
    await delay(2000);

    // Write password
    let password = process.env.amazonPassword || "";
    await page.type("#ap_password", password);

    // Click on login
    await page.click("#signInSubmit");
    await delay(3000);

    // Click on search box
    await page.click("#twotabsearchtextbox");

    // Write product name
    await page.type("#twotabsearchtextbox", "iphone 11");

    // Click on search button
    await page.click("#nav-search-submit-button");
    await delay(2000);

    // Wait for page to load
    await page.waitForSelector("body");

    const products = await page.evaluate(() => {
      let productInfo = [];
      const searchResults:any = document.querySelectorAll(".sg-col-20-of-24.s-result-item.s-asin.sg-col-0-of-12.sg-col-16-of-20.sg-col.s-widget-spacing-small.sg-col-12-of-16");

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
        } catch (e) {
          console.log(e);
        }
      }

      return productInfo;
    });

    console.log(products);
  });
