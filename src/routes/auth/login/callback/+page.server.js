// import { PUBLIC_DIRECTUS_API_URL } from '$env/static/public';
// import { createDirectus, authentication, rest, login, refresh } from '@directus/sdk';

// let user = null;
// export async function load({ request, url }) {
  
//     try{

//         const client = createDirectus(PUBLIC_DIRECTUS_API_URL)
//         .with(authentication("cookie", { credentials: "include" }))
//         .with(rest());
        
//         const res = await client.refresh();
//         console.log("res", res)

//         const me = await client.request(readMe());
//         console.log("me", me)
//         user = me;

//     }
//     catch(error){
//         console.log(error)
//     }
//     return {
//         user
//             };
//  }

