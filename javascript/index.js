import puppeteer from 'puppeteer';
async function pyara(){
	const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();

  await page.goto('https://www.amazon.in/');
	await page.waitForSelector('#nav-link-accountList')
	await page.click('#nav-link-accountList')
	await page.waitForSelector("#ap_email")
	await page.type('#ap_email',"crysosancher")

}
pyara();