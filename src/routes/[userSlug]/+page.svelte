<script>
	import { getContext } from 'svelte'
	import { getCanvasHTML } from '$lib/utils/contensis/client'
	import ContentEditor from '$lib/components/ContentEditor.svelte'

	let { data } = $props()

	console.log('data', data)

	const smallHeroBanner = getContext('smallHeroBanner')

	let isAuthUserWebsite = $derived(data.personalWebsite.people.email === data.authUser?.email)

	let isAdmin = $derived(data.authUser?.role?.includes('admin'))

	$smallHeroBanner = false
</script>

{#if data.page}
	<h1>{data.page.title}</h1>

	{#if isAuthUserWebsite || isAdmin}
		<ContentEditor
			editorId="canvas-editor"
			htmlContent={getCanvasHTML(data.page.canvas)}
			page={data.page}
			enabled={isAuthUserWebsite || isAdmin}
			assetUploadFolder="/Content-Types-Assets/PersonalWebsites/Pages"
		/>
	{:else}
		<div class="canvas-content">{@html data.page.canvas ? getCanvasHTML(data.page.canvas) : 'This page is empty'}</div>
	{/if}
{/if}
