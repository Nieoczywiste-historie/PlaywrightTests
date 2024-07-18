import { test as setup } from '@playwright/test';
import user from '../.auth/user.json'
import fs from 'fs' 

const authFile = '.auth/user.json'

setup('authentication', async({page, request}) =>{

    const respons = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
          "user":{"email": "mgm@moakt.cc", "password": "123456"}
        }
      })
      const responseBody = await respons.json()
      const accesToken = responseBody.user.token
      user.origins[0].localStorage[0].value = accesToken
      fs.writeFileSync(authFile, JSON.stringify(user))
      
      // re-use acces toker in test, assign acces token value to process env value 
      process.env['ACCES_TOKEN'] = accesToken
      //have to again update playwright config ts
})
//need to update playwright.config.ts