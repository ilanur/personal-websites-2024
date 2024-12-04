<script>
	import { getContext } from 'svelte'
	import { getThumbnail, truncateString } from '$lib/utils/utils'
	import Button from '$lib/components/Button.svelte'

	let { data } = $props()

	const smallHeroBanner = getContext('smallHeroBanner')

	$smallHeroBanner = true
</script>

<div class="container py-12">
	<h1 class="mb-4 text-3xl">Blog</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each data.blogPosts as post}
			<a
				href={`${post.url}`}
				class="flex flex-col overflow-hidden rounded-lg bg-white no-underline shadow-md transition duration-200 ease-in-out hover:-translate-y-1.5 hover:shadow-xl"
			>
				<figure>
					<img class="aspect-16-9 w-full object-cover object-center" src={getThumbnail(post.entryThumbnail)} alt={post.entryTitle} />
				</figure>
				<div class="flex h-full flex-col items-start justify-between p-4">
					<div>
						<h3 class="mb-2 mt-0 text-lg font-semibold">{post.entryTitle}</h3>

						{#if post.description}
							<p class="text-sm text-gray-700">{truncateString(post.description, 200)}</p>
						{/if}
					</div>

					<Button class="mt-4 inline-block text-white">Read More</Button>
				</div>
			</a>
		{/each}
	</div>
</div>
