<script>
    /////CODE EXTRACTED FROM DIFFERENT PROJECT, NEEDS ADJUSTMENTS - AZURE AUTHENTICATION

import { goto } from '$app/navigation';
import { PUBLIC_DIRECTUS_API_URL } from '$env/static/public';
import {onMount} from 'svelte';
import { createDirectus, authentication } from '@directus/sdk';



onMount(async () => {
    try{

        console.log("Login callback")
        const client = createDirectus(PUBLIC_DIRECTUS_API_URL).with(authentication('cookie', { credentials: 'include' }));

        // const refresh_body =   {
        //     "mode": "cookie",
        // }

        // const response =  await fetch(PUBLIC_DIRECTUS_API_URL+'/auth/refresh', {
        //     method: 'POST',
        //     credentials: 'include', 
        //     headers: {
        //                 'Accept': 'application/json',
        //                 'Content-Type': 'application/json'
        //             },
        //    // body: JSON.stringify(refresh_body)

        // });
        

        const result = await client.refresh();
        console.log("login callback", result);

        document.cookie = `session=${result.data.access_token}; path=/; max-age=900; samesite=lax; ${import.meta.env.PROD ? 'secure;' : ''}`;
        if (result.data.refresh_token) {
            document.cookie = `session_refresh=${result.data.refresh_token}; path=/; samesite=lax; ${import.meta.env.PROD ? 'secure;' : ''}`;
        }
            console.log("Login successfull")
                goto("/dashboard", { replaceState: true, invalidateAll: true })
    }
    catch(error){
        console.log(error)
    }

})
</script>

<h1>Logging in...</h1>