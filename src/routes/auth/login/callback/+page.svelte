<script>
import { goto } from '$app/navigation';
import { PUBLIC_DIRECTUS_API_URL } from '$env/static/public';
import {onMount} from 'svelte';

onMount(async () => {
    try{

        const refresh_body =   {
            "mode": "json",
        }

        const response =  await fetch(PUBLIC_DIRECTUS_API_URL+'/auth/refresh', {
            method: 'POST',
            credentials: 'include', 
            headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
            body: JSON.stringify(refresh_body)

        });
        const result = await response.json();
        console.log(result);

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

