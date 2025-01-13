<script>
	import { getContext } from 'svelte'
	import { getCanvasHTML, savePageContent } from '$lib/utils/contensis/client.js'
	import { PUBLIC_CONTENSIS_PAGES_ASSETS_FOLDER } from '$env/static/public'
	import EditableContent from '$lib/components/EditableContent.svelte'

	let { data } = $props()

	const smallHeroBanner = getContext('smallHeroBanner')

	let isAuthUserWebsite = $derived(data.personalWebsite.people.email === data.authUser?.email)
	let isAdmin = $derived(data.authUser?.role?.includes('admin'))

	$smallHeroBanner = true
</script>

<h1 class="mb-4 text-3xl">{data.page.title}</h1>

<EditableContent
	htmlContent={data.page?.canvas ? getCanvasHTML(data.page.canvas) : ''}
	enabled={isAuthUserWebsite || isAdmin}
	onSave={async (canvas) => await savePageContent(data.page, canvas, PUBLIC_CONTENSIS_PAGES_ASSETS_FOLDER)}
/>
