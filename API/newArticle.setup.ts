import { test as setup, expect } from '@playwright/test';


setup('Create new article', async({request}) =>{
    const articleRespons = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data:{
        "article":{"title":"Likes test article","description":"This is a test descrbtion","body":"body","tagList":[]}
      }
      //This code is replaced by process env
    // headers: {
    //   Authorization: `Token ${accesToken}` 
    // }
    
  })
expect(articleRespons.status()).toEqual(201)
const respons = await articleRespons.json()
const slugId = respons.article.slug
process.env['SLUGID'] = slugId
})