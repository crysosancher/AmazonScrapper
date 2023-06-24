import puppeteer, { Browser, Page } from "puppeteer";
import dotenv from "dotenv";
import fs from "fs";
import "tslib";

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
    try {
      const page: Page = await browser.newPage();
      console.log(process.env.websiteUrl);
      let url: string = process.env.websiteUrl || "https://www.amazon.in/";
      try {
        await page.goto(url).then(async () => {
          //click on accounts
          await page
            .click("#nav-link-accountList")
            .then(async () => {
              //Enter Email adress
              //await delay(2000);
              await page.waitForSelector("#ap_email");
              let email: string = process.env.amazonEmail || "";
              await page
                .type("#ap_email", email)
                .then(async () => {
                  //click on continue
                  await page.waitForSelector("#continue");
                  await page
                    .click("#continue")
                    .then(async () => {
                      await page.waitForSelector("#ap_password");
                      let password: string = process.env.amazonPassword || "";
                      await page
                        .type("#ap_password", password)
                        .then(async () => {
                          await page.waitForSelector("#signInSubmit");
                          await page
                            .click("#signInSubmit")
                            .then(async () => {
                              await page.waitForSelector(
                                "#twotabsearchtextbox"
                              );
                              await page
                                .click("#twotabsearchtextbox")
                                .then(async () => {
                                  await page.type(
                                    "#twotabsearchtextbox",
                                    `${process.env.productName}`
                                  );
                                  await page.waitForSelector(
                                    "#nav-search-submit-button"
                                  );
                                  await page
                                    .click("#nav-search-submit-button")
                                    .then(async () => {
                                      // await page.waitForSelector('.s-search-results .s-result-item')

                                      await delay(4000);

                                      const products: any[] =
                                        await page.evaluate(async () => {
                                          let productInfo: any[] = [];
                                          const searchResults: any =
                                            document.querySelectorAll(
                                              ".s-search-results .s-result-item"
                                            );
                                          console.log(
                                            "Search result=",
                                            searchResults
                                          );

                                          for (
                                            let i = 0;
                                            i <
                                            Math.min(10, searchResults.length);
                                            i++
                                          ) {
                                            try {
                                              let searchResult =
                                                searchResults[i];
                                              let title = searchResult
                                                .querySelector("h2 a span")
                                                .textContent.trim();
                                              let price = searchResult
                                                .querySelector(".a-price-whole")
                                                .textContent.trim();
                                              let rating = searchResult
                                                .querySelector(
                                                  ".a-icon-star-small .a-icon-alt"
                                                )
                                                .textContent.trim();
                                              let reviewCount = searchResult
                                                .querySelector(
                                                  ".a-size-small .a-link-normal"
                                                )
                                                .textContent.trim();
                                              if (i > 1 && i < 6) {
                                                console.log(
                                                  i,
                                                  "=>",
                                                  document.querySelector(
                                                    `#a-autoid-${i}-announce`
                                                  )
                                                );
                                                const k: any = searchResult
                                                  .querySelector(
                                                    ".s-atc-container .a-button-text"
                                                  )
                                                  .click();
                                                console.log(k);
                                              }
                                              productInfo.push({
                                                title,
                                                price,
                                                rating,
                                                reviewCount,
                                              });
                                            } catch (e) {
                                              console.log(
                                                "Unabled to add to the cart",
                                                e
                                              );
                                            }
                                          }

                                          return productInfo;
                                        });

                                      console.log("Top 10 search results:");
                                      console.log(products);

                                      //Go to cart
                                      await delay(2000);
                                      await page.goto(
                                        "https://www.amazon.in/gp/cart/view.html"
                                      );

                                      await page.waitForSelector(
                                        ".sc-list-item-content"
                                      );
                                      // Extract cart information
                                      const cartItems: any[] =
                                        await page.evaluate(() => {
                                          let cartInfo: any[] = [];
                                          const finalPrice: any =
                                            document.querySelector(
                                              "#sc-subtotal-amount-activecart > span"
                                            );
                                          const finalPriceText =
                                            finalPrice.textContent.trim();
                                          const cartItems =
                                            document.querySelectorAll(
                                              ".sc-list-item-content"
                                            );
                                          console.log(cartItems);

                                          for (
                                            let i = 0;
                                            i < cartItems.length;
                                            i++
                                          ) {
                                            try {
                                              let cartItem: any = cartItems[i];
                                              let title = cartItem
                                                .querySelector(
                                                  ".a-truncate-cut"
                                                )
                                                .textContent.trim();
                                              console.log(title);
                                              let price = cartItem
                                                .querySelector(
                                                  ".sc-item-price-block p span"
                                                )
                                                .textContent.trim();
                                              console.log(price);
                                              let quantity = cartItem
                                                .querySelector(
                                                  ".sc-action-quantity"
                                                )
                                                .getAttribute("data-old-value");
                                              console.log(quantity);

                                              cartInfo.push({
                                                title,
                                                price,
                                                quantity,
                                              });
                                            } catch (e) {
                                              console.log(
                                                "failed at reading cart values",
                                                e
                                              );
                                            }
                                          }
                                          cartInfo.push({
                                            finalPriceText,
                                          });

                                          return cartInfo;
                                        });

                                      console.log("Cart items:");
                                      console.log(cartItems);

                                      // Write products and cart items to files
                                      fs.writeFile(
                                        "public/products.json",
                                        JSON.stringify(products),
                                        function (err) {
                                          if (err) throw err;
                                          console.log("Products saved!");
                                        }
                                      );

                                      fs.writeFile(
                                        "public/cartItems.json",
                                        JSON.stringify(cartItems),
                                        function (err) {
                                          if (err) throw err;
                                          console.log("Cart items saved!");
                                        }
                                      );
                                    })
                                    .catch((err) => {
                                      console.log(
                                        "Search button has not been clicked,tag may have been changed",
                                        err
                                      );
                                    });
                                })
                                .catch((err) => {
                                  console.log(
                                    "Search box has not been clicked,tag has been changed",
                                    err
                                  );
                                });
                            })
                            .catch((err) => {
                              console.log("Entered Wrong password", err);
                            });
                        })
                        .catch((err) => {
                          console.log("Password has not been entered", err);
                        });
                    })
                    .catch((err) => {
                      console.log("Wrong email id", err);
                    });
                })
                .catch((err) => {
                  console.log("Email has not been entered", err);
                });
            })
            .catch((err) => {
              console.log("account Nav tag has been changed", err);
            });
        });
      } catch (error) {
        console.log("Enter the correct web adress", error);
      }
    } catch (err) {
      console.log("Browser has not been opened", err);
    } finally {
      await browser.close();
    }
  });
