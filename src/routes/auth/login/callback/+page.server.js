// import { PUBLIC_DIRECTUS_API_URL } from '$env/static/public';
// import { createDirectus, authentication, rest } from '@directus/sdk';

// let user = null;
// export async function load() {
//     try{
//         const client = createDirectus(PUBLIC_DIRECTUS_API_URL)
//         .with(authentication("session", { credentials: "include" }))
//         .with(rest({ credentials: "include" }));

//         const result = await client.refresh();
//         console.log(result)
//         //now it should be logged in the session
//         const my_user = await fetch(`${PUBLIC_DIRECTUS_API_URL}/users/me`, {
//             method: 'GET',
//             credentials: 'include',
//             headers: {
//                 'Accept': 'application/json',
//             },
//         });
//         const my_data = await my_user.json();
//         if(my_data.data)
//                 user = my_data.data;
//         console.log(my_data)

//     }
//     catch(error){
//         console.log(error)
//     }
//     return {
//         user
//             };
//  }