import { test, expect, request } from '@playwright/test';
import tags from '../test-data/tags.json'

test.beforeEach(async ({page})=>{
//create a mock
await page.route('*/**/api/tags', async route => {
  //our new response is here
  await route.fulfill({
  body: JSON.stringify(tags)
  })
})

await page.goto('https://conduit.bondaracademy.com/')
})

test('has title', async ({ page }) => {
  await page.waitForResponse('*/**/api/articles*')
  await page.route('*//**/api/articles*', async route => {
    //create a mock for title 
    const response = await route.fetch()
    const responseBody = await response.json()
    responseBody.articles[0].title = "this is a MOCK test title"
    responseBody.articles[0].description = "This is a MOCK description"
  
    await route.fulfill({
      body: JSON.stringify(responseBody)
    })
  })
  await page.getByText('Global Feed').click()
  await expect(page.locator('.navbar-brand')).toHaveText('conduit');
  await expect(page.locator('app-article-list h1').first()).toContainText("this is a MOCK test title")
  await expect(page.locator('app-article-list p').first()).toContainText("This is a MOCK description")
});


test('Create article using API and UI delete article', async ({ page, request }) => {
  //Below code is replaced by process env
  // const respons = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
  //   data: {
  //     "user":{"email": "mgm@moakt.cc", "password": "123456"}
  //   }
  // })
  // const responseBody = await respons.json()
  // const accesToken = responseBody.user.token


  const articleRespons = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data:{
        "article":{"title":"This is a test tile","description":"This is a test descrbtion","body":"body","tagList":[]}
      }
      //This code is replaced by process env
    // headers: {
    //   Authorization: `Token ${accesToken}` 
    // }
    
  })
expect(articleRespons.status()).toEqual(201)

await page.getByText('Global Feed').click()
await page.getByText("This is a test tile").click()
await page.getByRole('button', {name: "Delete Article"}).first().click()

 await expect(page.locator('app-article-list h1').first()).not.toContainText("This is a test tile") 
})



test('create article and DELETE using API', async ({ page, request }) => {
  await page.getByText('New Article').click()
  await page.getByRole('textbox', {name: 'Article Title'}).fill('Playwright test title')
  await page.getByRole('textbox', {name: "What's this article about?"}).fill('Playwright test about field')
  await page.getByRole('textbox', {name: "Write your article (in markdown)"}).fill('Playwright test full text')
  await page.getByRole('button', {name: 'Publish Article'}).click()
  const articleRespons = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
  const articleResponseBody = await articleRespons.json()
  const slugId = articleResponseBody.article.slug

  await expect(page.locator('.article-page h1')).toContainText("Playwright test title") 
  await page.getByText('Home').click()
  await page.getByText('Global Feed').click()
  await expect(page.locator('app-article-list h1').first()).toContainText("Playwright test title") 
  
  //code replaced by process env
  //login token
  // const respons = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
  //   data: {
  //     "user":{"email": "mgm@moakt.cc", "password": "123456"}
  //   }
  // })
  // const responseBody = await respons.json()
  // const accesToken = responseBody.user.token

  //delet request
const deleteArticleRespons = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
//Repplaced by process env
// headers: {
//        Authorization: `Token ${accesToken}` 
//   }  
})
expect(deleteArticleRespons.status()).toEqual(204)
})