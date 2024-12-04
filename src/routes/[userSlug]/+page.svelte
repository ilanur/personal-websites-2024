<script>
	import { getContext } from 'svelte'
	import { getCanvasHTML } from '$lib/utils/contensis/client'
	import UserContactInfo from '$lib/components/UserContactInfo.svelte'

	let { data } = $props()

	console.log('data', data)

	const smallHeroBanner = getContext('smallHeroBanner')

	$smallHeroBanner = false
</script>

{#if data.page}
	<div class="container grid grid-cols-3 gap-x-16 py-12 md:py-16 xl:gap-x-36">
		<div class="col-span-3 max-w-prose leading-relaxed lg:col-span-2">
			<h1 class="mb-4 text-4xl">{data.page.title}</h1>
			<div class="canvas-content">{@html data.page.canvas ? getCanvasHTML(data.page.canvas) : 'This page is empty'}</div>
		</div>
		<div class="border-eui-gray-70 col-span-3 mt-14 border-t pt-14 lg:col-span-1 lg:m-0 lg:border-t-0 lg:p-0">
			<UserContactInfo personalWebsite={data.page.personalWebsite} people={data.personalWebsite.people} />
		</div>
	</div>
{/if}
