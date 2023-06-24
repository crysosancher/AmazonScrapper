// import puppeteer from "puppeteer";
// import dotenv from "dotenv";

// dotenv.config();

// function delay(time: number) {
//   return new Promise(function (resolve) {
//     setTimeout(resolve, time);
//   });
// }

// puppeteer
//   .launch({
//     headless: false,
//   })
//   .then(async (browser) => {
//     const page = await browser.newPage();
//     console.log(process.env.website_Url);
//     let url = process.env.websiteUrl || "https://www.amazon.in/";
//     await page.goto(url);

//     // Click on login
//     await page.click("#nav-link-accountList");
//     await delay(2000);

//     // Select the box
//     let email = process.env.amazonEmail || "";

//     // Write email Id
//     await page.type("#ap_email", email);

//     // Click on continue
//     await page.click("#continue");
//     await delay(2000);

//     // Write password
//     let password = process.env.amazonPassword || "";
//     await page.type("#ap_password", password);

//     // Click on login
//     await page.click("#signInSubmit");
//     await delay(3000);

//     // Click on search box
//     await page.click("#twotabsearchtextbox");

//     // Write product name
//     await page.type("#twotabsearchtextbox", "iphone 11");

//     // Click on search button
//     await page.click("#nav-search-submit-button");
//     await delay(2000);

//     // Wait for page to load
//     await page.waitForSelector("body");
    

//     const products = await page.evaluate(() => {
//       let productInfo = [];
//       const searchResults:any = document.querySelectorAll(".sg-col-20-of-24.s-result-item.s-asin.sg-col-0-of-12.sg-col-16-of-20.sg-col.s-widget-spacing-small.sg-col-12-of-16");

//       for (const searchResult of searchResults) {
//         try {
//           let title = searchResult.querySelector("h2 a span").textContent.trim();
//           let price = searchResult.querySelector("span.a-price span").textContent.trim();
//           let rating = searchResult.querySelector("span.a-icon-alt").textContent.trim();
//           let reviewCount = searchResult.querySelector("span.a-size-base").textContent.trim();

//           productInfo.push({
//             title,
//             price,
//             rating,
//             reviewCount,
//           });
//         } catch (e) {
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
    await page.type("#twotabsearchtextbox", process.env.productName || "");

    // Click on search button
    await page.click("#nav-search-submit-button");
    await delay(2000);

    // Wait for page to load
    await page.waitForSelector("body");

    const products = await page.evaluate(() => {
      let productInfo = [];
      const searchResults:any = document.querySelectorAll(
        ".sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(n+7)"
      );

      for (let i = 0; i < Math.min(10, searchResults.length); i++) {
        try {
          let searchResult = searchResults[i];
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

    console.log("Top 10 search results:");
    console.log(products);
    //write to a file
    const fs = require("fs");
    fs.writeFile("public/products.json", JSON.stringify(products), function (err: any) {
      if (err) throw err;
      console.log("Saved!");
    });

    // Add top 4 products to cart
    for (let i = 0; i < Math.min(4, products.length); i++) {
      const product = products[i];

      // Click on the product
      await page.click(`.sg-col-20-of-24:nth-child(${i + 1}) .a-link-normal.a-text-normal`);

      // Wait for page to load
      await delay(2000);

      // Add to cart
      // await page.click("#add-to-cart-button");
      // await delay(2000);

      // // Go back to search results
      // await page.goBack();
      // await delay(2000);
    }

    // Go to cart
    // await page.goto("https://www.amazon.in/gp/cart/view.html");
    // await delay(2000);

    // // Extract information from the cart
    // const cartItems = await page.evaluate(() => {
    //   let cartInfo = [];
    //   const cartItems:any = document.querySelectorAll(".sc-list-item-content");

    //   for (const cartItem of cartItems) {
    //     try {
    //       let title = cartItem.querySelector(".sc-product-title a").textContent.trim();
    //       let price = cartItem.querySelector(".sc-price span").textContent.trim();
    //       let quantity = cartItem.querySelector(".sc-quantity-textfield input").value.trim();
    //       let total = cartItem.querySelector(".sc-product-price").textContent.trim();

    //       cartInfo.push({
    //         title,
    //         price,
    //         quantity,
    //         total,
    //       });
    //     } catch (e) {
    //       console.log(e);
    //     }
    //   }

    //   return cartInfo;
    // });

    // console.log("Cart items:");
    // console.log(cartItems);

    // await browser.close();
  });