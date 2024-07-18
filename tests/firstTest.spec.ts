import {test, expect} from '@playwright/test';

test.beforeEach(async({page}) => {
  await page.goto("http://localhost:4200")
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();

})

test("Navigate to Form Layouts", async ({ page }) => {
 
await page.getByText("Form Layouts").click();
})

// test("Navigate to datapicker page", async ({ page }) => {
 
//   await page.getByText("Datepicker").click();
//   })

  test("Locator syntax rules", async ({ page }) => {
 
    await page.getByText("Datepicker").click();
    await page.getByText("Form Layouts").click();
    //by Tag nem
    await page.locator('imput')

    //by ID
    await page.locator('#id')
    //by class
    page.locator('.shape-rectangle')

    //by attribute
    page.locator('[placeholder="Email"]')

    //by Class value (full)
    page.locator('[class="imput-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //combine different selectors
    page.locator('input[placeholder="Email"][nbinput]')

    //by Xpath
    page.locator('//*[@id="inputEmail1"]')

    //by partial text match
    page.locator(':text("Using")')

    // by exact text match
    page.locator(':text-is("Using the Grid")')

    })

     test("User facing locators", async ({ page }) => {
      //get by Role
      await page.getByRole("textbox", {name: "Email"}).first().click() //"Role specified in documentation", value 
      await page.getByRole("button", {name: "Sign in"}).first().click()

      //get by Lable
      await page.getByLabel("Email").first().click()
      //get by placeholder
      await page.getByPlaceholder("Jane Doe").click()
      //get by text
      await page.getByText("Using the Grid").click()
      await page.getByTitle("IoT Dashboard").click()
      //get by TestID
      await page.getByTestId("SignIn") // Reserved by Playwright, can be change 
    })

    test("Locating child elements", async ({ page }) => {
      await page.locator("nb-card nb-radio :text-is('Option 1')").click()
     //possible to chain 
     await page.locator("nb-card").locator("nb-radio").locator(":text-is('Option 2')").click()

     //posible to chain normal locator and user locator
     await page.locator('nb-card').getByRole("button", {name: 'Sign in'}).first().click()

     //index of elements
     await page.locator('nb-card').nth(3).getByRole("button").click()

    })

    test("Locating parent elements", async ({ page }) => {
      await page.locator("nb-card", {hasText: 'Using the Grid'}).getByRole("textbox", {name: "Email"}).click() //find by text under locator
      await page.locator("nb-card", {has: page.locator('#inputEmail1')}).getByRole("textbox", {name: "Email"}).click()

      await page.locator("nb-card").filter({hasText: "Basic form"}).getByRole("textbox", {name: "Email"}).click()
      await page.locator("nb-card").filter({has: page.locator('.status-danger')}).getByRole("textbox", {name: "Password"}).click()
      await page.locator("nb-card").filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole("textbox", {name: "Email"}).click()
      // locator .. -going one level up
      await page.locator(':text-is("Using the grid")').locator("..").getByRole("textbox", {name: "Email"}).click()
    })

    test("Reusing the locators", async ({ page }) => {
      const basicForm = page.locator("nb-card").filter({hasText: "Basic form"})
      const emailField = basicForm.getByRole("textbox", {name: "Email"})
      await emailField.fill("test@test.pl")
      await basicForm.getByRole("textbox", {name: "Password"}).fill("Welcome123")
      await basicForm.locator('nb-checkbox').click()
      await basicForm.getByRole("button").click()
      await expect(emailField).toHaveValue('test@test.pl')
    })


    test("Extracting values", async ({ page }) => {
      //single text value 
      const basicForm = page.locator("nb-card").filter({hasText: "Basic form"})
      const buttonText = await basicForm.locator('button').textContent() // playwright will grab text and assign to const 
      expect(buttonText).toEqual('Submit')

      //all text values
      const allRadioButtonsLable = await page.locator('nb-radio').allTextContents()
      expect(allRadioButtonsLable).toContain('Option 1')

      //input value
      const emailField = basicForm.getByRole('textbox', {name: "Email"})
      await emailField.fill("test@test.pl")
      const emailValue = await emailField.inputValue()
      expect(emailValue).toEqual('test@test.pl')
      const placeHolder = await emailField.getAttribute('placeholder')
      expect(placeHolder).toEqual('Email')


    })

    test("assertions", async ({ page }) => {
      const basicFormButton = page.locator("nb-card").filter({hasText: "Basic form"}).locator('button')
      
      //General assertion
      const value = 5 
      expect(value).toEqual(5)

      const text = await basicFormButton.textContent()
      expect(text).toEqual("Submit")
      
      //locator assertion -here we need to add await
      await expect(basicFormButton).toHaveText('Submit')

      //Soft assertion
      await expect.soft(basicFormButton).toHaveText('Submit') //soft give possibility to run test even if assertion failed 
      
    })