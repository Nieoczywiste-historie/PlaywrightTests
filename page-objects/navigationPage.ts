import { Locator, Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase{
    
    //readonly page: Page do not need this as we extends class NavigationPage 

    readonly formLayoutsMenuItem: Locator
    readonly datePickerMenuItem: Locator
    readonly smartTableMeuItem: Locator
    readonly toastMenuItem: Locator
    readonly tooltipMenuItem: Locator

    constructor(page: Page){
        super(page) // if using extends we have to user this one 

        this.formLayoutsMenuItem = page.getByText("Form Layouts")
        this.datePickerMenuItem = page.getByText("Datepicker")
        this.smartTableMeuItem = page.getByText("Smart Table")
        this.toastMenuItem = page.getByText("Toastr")
        this.tooltipMenuItem = page.getByText("Tooltip")
    }

    async formLayoutsPage(){
        await this.selectGroupMenuItem("Forms")
        await this.formLayoutsMenuItem.click()
        await this.waitForNumberOfSeconds(2)

    }

    async datepickerPage(){
        await this.selectGroupMenuItem("Forms")
        await this.datePickerMenuItem.click();
    }


    async smartTablePage(){
        await this.selectGroupMenuItem("Tables & Data")
        await this.smartTableMeuItem.click(); 
    }


    async toastrPage(){
        await this.selectGroupMenuItem("Modal & Overlays")
        await this.toastMenuItem.click();
    }


    async tooltipPage(){
        await this.selectGroupMenuItem("Modal & Overlays")
        await this.tooltipMenuItem.click();
    }

    //helper method, to avoid menu collaps 
    private async selectGroupMenuItem(groupItemTitle: string){
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expendetState = await groupMenuItem.getAttribute('aria-expanded')
        if( expendetState == 'false')
        await groupMenuItem.click()
    }
}