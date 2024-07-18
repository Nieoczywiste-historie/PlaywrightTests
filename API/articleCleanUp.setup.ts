import { test as setup, expect } from '@playwright/test';



setup('Delete article', async({request}) =>{
    const deleteArticleRespons = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${process.env.SLUGID}`) 
    expect(deleteArticleRespons.status()).toEqual(204)
})