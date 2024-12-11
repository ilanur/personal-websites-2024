<script>
	import { getContext } from 'svelte'
	import { getCanvasHTML } from '$lib/utils/contensis/client'
	import ContentEditor from '$lib/components/ContentEditor.svelte'

	let { data } = $props()

	console.log('data', data)

	const smallHeroBanner = getContext('smallHeroBanner')

	let isAuthUserWebsite = $derived(data.personalWebsite.people.email === data.authUser.email)

	$smallHeroBanner = false
</script>

{#if data.page}
	<h1>{data.page.title}</h1>
	<ContentEditor editorId="canvas-editor" htmlContent={getCanvasHTML(data.page.canvas)} page={data.page} enabled={isAuthUserWebsite} />
{/if}
