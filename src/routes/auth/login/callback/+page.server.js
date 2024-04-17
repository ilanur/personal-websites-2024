// import { PUBLIC_DIRECTUS_API_URL } from '$env/static/public';
// import { createDirectus, authentication, rest, login, refresh } from '@directus/sdk';

// let user = null;
// export async function load({ request, url }) {
//     try {

//         console.log("request", request)
//         console.log("url", url)
//         const data = await request.json();
//         const idToken = data.idToken;
//         console.log("idToken", idToken)
//         console.log("data", data)
    
//         } catch (error) {
//         console.error('Error during token validation and user session setup:', error);
//     }
//     return {
//         user
//     };
//     try{
//         console.log("data", data)

//         return null;
//         //get id_token from the url


//         const client = createDirectus(PUBLIC_DIRECTUS_API_URL)
//         .with(authentication("session", { credentials: "include" }))
//         .with(rest({ credentials: "include" }));
//         //console.log("client", client)

//         const refreshe_response = await fetch(`${PUBLIC_DIRECTUS_API_URL}/auth/refresh`, {
//             method: 'POST',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//             },
//             credentials: 'include',
//             body: JSON.stringify({
//                 mode:'session'
//             }),
//         });
//         const refresh_data = await refreshe_response.json();
//         console.log("refresh_data", refresh_data)


//         const result2 = await client.request(refresh( 'session') );
//         console.log("result2", result2)

//         //const result = await client.refresh();
//         //console.log(result)
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
//         console.log("my_data", my_data)
        

//     }
//     catch(error){
//         console.log(error)
//     }
//     return {
//         user
//             };
//  }


//  function getHashParams() {
//     const hash = window.location.hash.substr(1);
//     return hash.split('&').reduce(function (result, item) {
//         const parts = item.split('=');
//         result[parts[0]] = decodeURIComponent(parts[1]);
//         return result;
//     }, {});
// }
