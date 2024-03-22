export async function handle({ event, resolve }) {
	console.log('HOOK');
	return await resolve(event, {
		filterSerializedResponseHeaders: (key, value) => {
			return key.toLowerCase() === 'content-type';
		}
	});
}


/////CODE EXTRACTED FROM DIFFERENT PROJECT, NEEDS ADJUSTMENTS - AZURE AUTHENTICATION

// import { sequence } from '@sveltejs/kit/hooks';
// import { redirect } from '@sveltejs/kit';
// import { PUBLIC_DIRECTUS_URL } from '$env/static/public';

// async function handleDirectusAuth({ event, resolve }) {
//     let session = event.cookies.get('session');

//     if (!session) {
//         let session_refresh = event.cookies.get('session_refresh');
//         if (session_refresh) {
//             try {

//             const refresh_body =   {
//                     "refresh_token": session_refresh,
//                     "mode": "json"
//                 }
                
// // refresh http request using a cookie
//             const response =  await fetch(PUBLIC_DIRECTUS_URL+'/auth/refresh', {
//                 method: 'POST',
//                 headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json'
//                   },
//                   body: JSON.stringify(refresh_body)
//                 });

//             const result = await response.json();
//             console.log("Qui2",result)

//             if(result.data){

//                 event.cookies.set('session', result.data.access_token, {
//                     path: '/',
//                     sameSite: 'lax',
//                     httpOnly: true,
//                     secure: process.env.NODE_ENV === 'production',
//                     maxAge: 900
//                 });

//                 event.cookies.set('session_refresh', result.data.refresh_token, {
//                     path: '/',
//                     sameSite: 'lax',
//                     httpOnly: true,
//                     secure: process.env.NODE_ENV === 'production'
//                 });
//             }

//             } catch (err) {
//                 console.log(err)
//                 throw redirect(303, '/auth/login')

//             }
//         }
//     }

//     return await resolve(event);
// }




// async function isAuthenticatedUser({ event, resolve }) {

//     if(event.url.searchParams.get('magicLink')){
//         /*let magicLink = event.url.searchParams.get('magicLink');
//         let result = await loginShareUser(magicLink);
//         if(result.status === 200){
//             console.log(result.message);
//         }*/
//         return await resolve(event);

//     }
//     // Check for pages under the /protected directory.
//     if (event.url.pathname.startsWith('/dashboard')  )  {

//         const session = event.cookies.get('session');
        
//         if (!session) {

//             const session_refresh = event.cookies.get('session_refresh');
//             if (session_refresh) {
//                 try {

//                 const refresh_body =   {
//                         "refresh_token": session_refresh,
//                         "mode": "json"
//                     }
//                 const response =  await fetch(PUBLIC_DIRECTUS_URL+'/auth/refresh', {
//                     method: 'POST',
//                     headers: {
//                         'Accept': 'application/json',
//                         'Content-Type': 'application/json'
//                       },
//                       body: JSON.stringify(refresh_body)
//                     });
//                 const result = await response.json();
//                 console.log("Qui", result)

//                 if(result.data){

//                     event.cookies.set('session', result.data.access_token, {
//                         path: '/',
//                         sameSite: 'lax',
//                         httpOnly: true,
//                         secure: process.env.NODE_ENV === 'production',
//                         maxAge: 900
//                     });

//                     event.cookies.set('session_refresh', result.data.refresh_token, {
//                         path: '/',
//                         sameSite: 'lax',
//                         httpOnly: true,
//                         secure: process.env.NODE_ENV === 'production'
//                     });
//                 }
//                 else{
//                     throw redirect(303, '/auth/login');
//                 }

//                 } catch (err) {
//                 console.log("Refreshing error..", err)
//                 throw redirect(303, '/auth/login')
//                 }

//             }
//             else{
//                 throw redirect(303, '/auth/login');
//             }

//     }
//     }

//     return await resolve(event);
// }


// export const handle = sequence(handleDirectusAuth, isAuthenticatedUser);
