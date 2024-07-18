import { Locator, Page, expect } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class DatepickerPage extends HelperBase {
    // private readonly page: Page


    constructor(page: Page){
        super(page)}

    async selectCommonDatePickerDateFromToday(numberOfDaysFromTodays: number){
        const calendarInputField = this.page.getByPlaceholder('Form Picker')
        await calendarInputField.click()
        const dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFromTodays)
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    async selectDatePickerWithRangeFromToday(starDayFromToday: number, endDateFromToday: number){
    const calendarInputField = this.page.getByPlaceholder('Range Picker')
    await calendarInputField.click()
    const dateToAssertStart = await this.selectDateInTheCalendar(starDayFromToday)
    const dateToAssertEnd = await this.selectDateInTheCalendar(endDateFromToday)
    const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
    await expect(calendarInputField).toHaveValue(dateToAssert)

    }

    private async selectDateInTheCalendar(numberOfDaysFromTodays: number){
        let date = new Date() //JS object date 
        date.setDate(date.getDate() + numberOfDaysFromTodays) //to date we get today's date and add 1 day extra and we set this date 
        const expectedDate = date.getDate().toString() // as this is number need to convert
        const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'}) // short version of month
        const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'}) // long version of month
        const expectedYear = date.getFullYear()
        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}` 
    
        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`
    
        while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click() 
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
    
        }
        await this.page.locator('.day-cell.ng-star-inserted:not(.bounding-month)').getByText( expectedDate, {exact: true}).click() // only current month/exact match
     //   await this.page.locator('[class="day-cell ng-star-inserted"]').getByText( expectedDate, {exact: true}).click() // only current month/exact match
     
        return dateToAssert
    }

}