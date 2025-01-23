<script>
	import { getCanvasHTML, savePageContent } from '$lib/utils/contensis/client.js'
	import { PUBLIC_CONTENSIS_PAGES_ASSETS_FOLDER } from '$env/static/public'
	import { smallUserBanner } from '$lib/stores/hero-banner-store'
	import EditableContent from '$lib/components/EditableContent.svelte'

	let { data } = $props()

	let isAuthUserWebsite = $derived(data.personalWebsite.people.email === data.authUser?.email)
	let isAdmin = $derived(data.authUser?.role?.includes('admin'))

	smallUserBanner.set(true)
</script>

<h1 class="mb-4 text-3xl">{data.page.title}</h1>

<EditableContent
	htmlContent={data.page?.canvas ? getCanvasHTML(data.page.canvas) : ''}
	enabled={isAuthUserWebsite || isAdmin}
	onSave={async (canvas) => await savePageContent(data.page, canvas, PUBLIC_CONTENSIS_PAGES_ASSETS_FOLDER)}
/>
