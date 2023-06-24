import puppeteer, { Browser, Page } from "puppeteer";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

function delay(time: number): Promise<void> {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

puppeteer
  .launch({
    headless: false,
  })
  .then(async (browser: Browser) => {
    const page: Page = await browser.newPage();
    console.log(process.env.websiteUrl);
    let url: string = process.env.websiteUrl || "https://www.amazon.in/";
    await page.goto(url);

    // Click on login
    await page.click("#nav-link-accountList");
    await delay(2000);

    // Select the box
    let email: string = process.env.amazonEmail || "";

    // Write email Id
    await page.type("#ap_email", email);

    // Click on continue
    await page.click("#continue");
    await delay(2000);

    // Write password
    let password: string = process.env.amazonPassword || "";
    await page.type("#ap_password", password);

    // Click on login
    await page.click("#signInSubmit");
    await delay(3000);

    // Click on search box
    await page.click("#twotabsearchtextbox");

    // Write product name
    await page.type("#twotabsearchtextbox", "toothpaste");

    // Click on search button
    await page.click("#nav-search-submit-button");
    await delay(2000);

    // Wait for page to load
    await page.waitForSelector("body");

    const products: any[] = await page.evaluate(async () => {
      let productInfo: any[] = [];
      const searchResults: any = document.querySelectorAll(
        ".s-search-results .s-result-item"
      );

      for (let i = 0; i < Math.min(10, searchResults.length); i++) {
        try {
					setTimeout(() =>(2000));
          let searchResult = searchResults[i];
          let title = searchResult
            .querySelector("h2 a span")
            .textContent.trim();
          let price = searchResult
            .querySelector(".a-price-whole")
            .textContent.trim();
          let rating = searchResult
            .querySelector(".a-icon-star-small .a-icon-alt")
            .textContent.trim();
          let reviewCount = searchResult
            .querySelector(".a-size-small .a-link-normal")
            .textContent.trim();
          if (i > 1 && i < 6) {
						console.log(i,"=>",document
						.querySelector(`#a-autoid-${i}-announce`));
            const k:any=document
              .querySelector(`#a-autoid-${i}-announce`)
							console.log(k);
							k.click();

              
          }

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

    //Go to cart
		await delay(2000);
    await page.goto("https://www.amazon.in/gp/cart/view.html");
    
await page.waitForSelector(".sc-list-item-content");
    // Extract cart information
    const cartItems: any[] = await page.evaluate(() => {
      let cartInfo: any[] = [];
			const finalPrice:any=document.querySelector("#sc-subtotal-amount-activecart > span")
			const finalPriceText=finalPrice.textContent.trim();
      const cartItems = document.querySelectorAll(".sc-list-item-content");
			console.log(cartItems);

      for (let i = 0; i < cartItems.length; i++) {
        try {
          let cartItem:any = cartItems[i];
          let title = cartItem.querySelector(".a-truncate-cut").textContent.trim();
          let price = cartItem.querySelector(".sc-item-price-block p span").textContent.trim();
          let quantity = cartItem.querySelector('.sc-action-quantity').getAttribute("data-old-value")

          cartInfo.push({
            title,
            price,
            quantity,
          });
        } catch (e) {
          console.log(e);
        }
      }
			cartInfo.push({
				finalPriceText
			})

      return cartInfo;
    });

    console.log("Cart items:");
    console.log(cartItems);

    // Write products and cart items to files
    fs.writeFile("public/products.json", JSON.stringify(products), function (err) {
      if (err) throw err;
      console.log("Products saved!");
    });

    fs.writeFile("public/cartItems.json", JSON.stringify(cartItems), function (err) {
      if (err) throw err;
      console.log("Cart items saved!");
    });

    //await browser.close();
  })
  .catch((err) => {
    console.log(err);
  });
