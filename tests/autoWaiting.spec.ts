import {test, expect} from '@playwright/test';

test.beforeEach(async({page}, testInfo) => {
  await page.goto("http://www.uitestingplayground.com/ajax")
  await page.getByAltText('Button Triggering AJAX Request').click()
//  testInfo.setTimeout(testInfo.timeout + 2000) //add 2s to all test overwrite timeouts setup


})

test("auto waiting", async ({ page }) => {
    const succesButton = page.locator('.bg-sucess')
    await succesButton.click()
    const text = await succesButton.textContent()
    //const text = await succesButton.allTextContents -allTextContent does not have auto-waiting
    expect(text).toEqual('Data loaded with AJAX get request.')
})

test("alternative waits ", async ({ page }) => {
    const succesButton = page.locator('.bg-sucess')
    //wait for element
    await page.waitForSelector('bg-sucess')

    //const text = await succesButton.allTextContents //allTextContent does not have auto-waiting
    //expect(text).toEqual('Data loaded with AJAX get request.')

    //wait for particular respons
    await page.waitForResponse('http://www.uitestingplayground.com/ajaxdata')

    //waiting for networks calls to be completed (not recomended)
    await page.waitForLoadState('networkidle')

})

test("timeouts ", async ({ page }) => {
    test.slow()
    test.setTimeout(10000)

    const succesButton = page.locator('.bg-sucess')
    await succesButton.click()

})