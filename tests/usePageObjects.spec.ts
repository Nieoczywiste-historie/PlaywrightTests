import {test, expect} from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';
import {faker} from '@faker-js/faker'

//No longer needed as everything is in PageManager PO
// import {NavigationPage} from '../page-objects/navigationPage'
// import { FormLayoutsPage } from '../page-objects/formLayoutsPage';
// import { DatepickerPage } from '../page-objects/datepickerPage';

test.beforeEach(async({page}, testInfo) => {
  // this mean that in playwright.config there is a baseURL configured 
    await page.goto("/")
  })

  test("navigate to form page", async ({ page }) => 
      {
        const pm = new PageManager(page)
        await pm.navigateTo().formLayoutsPage()
        await pm.navigateTo().datepickerPage()
        await pm.navigateTo().smartTablePage()
        await pm.navigateTo().toastrPage()
        await pm.navigateTo().tooltipPage()
        
     })

 test("parametrized methods", async ({ page }) => 
    {
      //Old version \/ 
      //  const navigateTo = new NavigationPage(page)
      //  const onFormLayoutsPage = new FormLayoutsPage(page)
      //  const onDatePickerPage = new DatepickerPage(page)
      const pm = new PageManager(page)
      //using faker generator prepare a fake data 
      const randomFullName = faker.person.fullName()
      const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`

       await pm.navigateTo().formLayoutsPage()
       await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialAndSelectOption('test@test.pl', 'pass1', 'Option 1')
       //screenshot
       await page.screenshot({path: 'screenshots/formsLayoutsPage.png'})

       await pm.onFormLayoutsPage().submitInLineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
      //screenshot for selected object on page
      await page.locator('nb-card', {hasText: "Inline form"}).screenshot({path: 'screenshots/inlineForm.png'})
      const buffer = await page.screenshot() // screenshot saved into const
       await pm.navigateTo().datepickerPage()
       await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(5)
       await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(6, 15)

    })

  