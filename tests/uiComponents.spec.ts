import {test, expect} from '@playwright/test';

test.beforeEach(async({page}, testInfo) => {
    await page.goto("http://localhost:4200")
  })
  
test.describe("Form Layouts page", () => 
{

    test.beforeEach(async({page}, testInfo) => {
        await page.getByText("Forms").click();
        await page.getByText("Form Layouts").click();
      })

      test("input fields", async ({ page }) => 
      {
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})
        await usingTheGridEmailInput.fill("test@test.pl")
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially("test2@test.pl", {delay: 500}) // Simulation of writing
        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual("test2@test.pl")
        //locator assertion
        await expect(usingTheGridEmailInput).toHaveText("test2@test.pl")
     })

     test("radio buttons", async ({ page }) => 
      {
        const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})
        //await usingTheGridForm.getByLabel('Option 1').check() // css is visualy hidden and this will not work
        //First option to check
        //await usingTheGridForm.getByLabel('Option 1').check({force: true}) // have to force it
        //2nd option to check
        await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).check({force: true}) // another option to check 
        const radioStatus =  usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked()
        expect(radioStatus).toBeTruthy()

        //locator assertion
        await expect(usingTheGridForm.getByRole('radio', {name: 'Option 1'})).toBeChecked()

        await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).check({force: true}) 
        expect(await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked()).toBeFalsy()
        expect(await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).isChecked()).toBeTruthy()
     })


       
})

test("checkboxes", async ({ page }) => 
{
    await page.getByText("Modal & Overlays").click();
    await page.getByText("Toastr").click();

    await page.getByRole('checkbox', {name: "Hide on click"}).click({force: true}) //Simple click
    await page.getByRole('checkbox', {name: "Hide on click"}).check({force: true}) //Only check, if already checked then no action
    await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true})

    const allBoxes = page.getByRole('checkbox')
        for (const box of await allBoxes.all()){ //once allBoxes is not an array then we need to use all method
        await box.check({force: true})
        expect(await box.isChecked()).toBeTruthy()

    }
})

test("lists and dropdowns", async ({ page }) => 
{
   const dropdownMenu = page.locator('ngx-header nb-select')
   await dropdownMenu.click()
   
   page.getByRole('list') // when the list has a UL tag
   page.getByRole('listitem') // when the list has a LI tag

   //const optionList = page.getByRole('list').locator('nb-option')
   const optionList = page.locator('nb-option-list nb-option')
  await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
  await optionList.filter({hasText: "Cosmic"}).click()
  const header = page.locator('nb-layout-header')
  await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

  const colors = 
  {
    "Light": "rgb(255, 255, 255)",
    "Dark": "rgb(34, 43, 69)",
    "Cosmic": "rgb(50, 50, 89)",
    "Corporate": "rgb(255, 255, 255)"
  }
  
  await dropdownMenu.click()
  for(const color in colors)
  {
    await optionList.filter({hasText: color}).click()
    await expect(header).toHaveCSS('background-color', colors[color])
    if(color !="Corporate")
    await dropdownMenu.click()
    }
 
})

test("tooltips", async ({ page }) => 
{
    await page.getByText("Modal & Overlays").click();
    await page.getByText("Tooltip").click();

    const toolTipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})
    await toolTipCard.getByRole('button', {name: 'Top'}).hover()

    page.getByRole('tooltip') // if you have role tooltip created 
    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual('This is a tooltip')
})

//Browser popups 
test("dialog box", async ({ page }) =>  
{
    await page.getByText("Tables & Data").click();
    await page.getByText("Smart Table").click();

    page.on('dialog', dialog =>{
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })
    await page.getByRole('table').locator('tr', {hasText: 'mdo@gmail.com'}).locator('.nb-trash').click()

    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')

})
//tabel
test("web tables", async ({ page }) =>  
{
    await page.getByText("Tables & Data").click();
    await page.getByText("Smart Table").click();

//1 get the row by any text in this row
const targetRow = page.getByRole('row', {name: 'twitter@outlook.com'})
await targetRow.locator('.nb-edit').click()
await page.locator('input-editor').getByPlaceholder('Age').clear()
await page.locator('input-editor').getByPlaceholder('Age').fill('35')
await page.locator('.nb-checkmark').click()

//2get the row based on the value in the specific column
await page.locator('.ng2-smart-pagination-nav').getByText('2').click() //Navigation to 2nd page
const targetRowByID = page.getByRole('row', {name: '11'}).filter({has: page.locator('td').nth(1).getByText('11')})
await targetRowByID.locator('.nb-edit').click()
await page.locator('input-editor').getByPlaceholder('E-mail').clear()
await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.pl')
await page.locator('.nb-checkmark').click()
await expect(targetRowByID.locator('td').nth(5)).toHaveText('test@test.pl')


//3 test filter of the table
//test data which we want to use 
const ages = ["20", "30", "40", "200"]

//loop to loop for each above values
for( let age of ages){
    await page.locator('input-filter').getByPlaceholder('Age').clear()
    await page.locator('input-filter').getByPlaceholder('Age').fill(age)
    await page.waitForTimeout(500) // Playwright is to fast we have to slow it down
    //find all rows as result of search
    const ageRows = page.locator('tbody tr') //get all the rows

    //another loop -each for the rows
    for(let row of await ageRows.all())
    {
        const cellValue = await row.locator('td').last().textContent() // row one..two etc getting the context 
        if(age =="200")
        {
        expect(await page.getByRole('table').textContent()).toContain('No data found')
        }else
        {
        expect(cellValue).toEqual(age)
        }
            
    }
}
})

// hardcoded 
test("Date picker", async ({ page }) =>  
{
    await page.getByText("Forms").click();
    await page.getByText("Datepicker").click();

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()
    await page.locator('[class="day-cell ng-star-inserted"]').getByText('1', {exact: true}).click() // only current month/exact match
    await expect(calendarInputField).toHaveValue('Jun 1, 2024')


})

// more smart way 
test("Date picker object", async ({ page }) =>  
{
    await page.getByText("Forms").click();
    await page.getByText("Datepicker").click();

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    let date = new Date() //JS object date 
    date.setDate(date.getDate() + 89) //to date we get today's date and add 1 day extra and we set this date 
    const expectedDate = date.getDate().toString() // as this is number need to convert
    const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'}) // short version of month
    const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'}) // short version of month
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}` 

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`
 
    while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click() 
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()

    }
    await page.locator('[class="day-cell ng-star-inserted"]').getByText( expectedDate, {exact: true}).click() // only current month/exact match
    await expect(calendarInputField).toHaveValue(dateToAssert)


})

//Sliders 
test("Sliders", async ({ page }) =>  
{
    // //update attribute
    // const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle') //find a circle slider
    // // need to evaluate js to actually change cx and cy on slider , this works without UI
    // await tempGauge.evaluate( node => { 
    //     node.setAttribute('cx', '232.630')
    //     node.setAttribute('cy', '232.630')
    // })
    // await tempGauge.click()
    
    //mouse movement 
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()
    const box = await tempBox.boundingBox() // playwright create bounding box around X,Y coordinates and we can define inside a square box where to click using X and Y inside a box 
    const x = box.x + box.width / 2 // coordinates in center in the bounding box 
    const y = box.y + box.height /2 
    await page.mouse.move(x,y) //where I want to start
    await page.mouse.down() //left click of mouse
    await page.mouse.move(x + 100, y) //
    await page.mouse.move(x+100, y+100)
    await page.mouse.up()
    await expect(tempBox).toContainText('30')

})