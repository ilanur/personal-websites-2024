<script>
	import { getContext } from 'svelte'
	import { getThumbnail, truncateString } from '$lib/utils/utils'
	import { imageProcessing } from '$lib/directives/image-directives'
	import AppLink from '$lib/components/AppLink.svelte'
	import Button from '$lib/components/Button.svelte'

	let { data } = $props()

	const smallHeroBanner = getContext('smallHeroBanner')

	$smallHeroBanner = true
</script>

{#if data.blogPosts.length > 0}
	<h1>Blog</h1>

	<div class="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3">
		{#each data.blogPosts as post}
			<article
				class="group relative flex h-full flex-col overflow-hidden rounded-lg border bg-white transition-all hover:scale-[1.02] hover:shadow-lg"
			>
				<figure class="aspect-16-9 w-full shrink-0 overflow-hidden">
					{#if post.mainImage}
						<img class="size-full object-cover" src={getThumbnail(post.mainImage)} alt={post.mainImage.altText} use:imageProcessing />
					{:else}
						<div class="flex size-full items-center justify-center bg-intranet-gray-100">
							<i class="fa-solid fa-image fa-xl text-eui-dark-blue-600"></i>
						</div>
					{/if}
				</figure>

				<div class="h-full p-4 sm:flex sm:flex-col sm:justify-between">
					<div>
						<h1 class="text-lg">{post.entryTitle}</h1>
						{#if post.description}
							<p class="text-tiny text-gray-700">{truncateString(post.description, 200)}</p>
						{/if}
					</div>

					<div>
						<AppLink
							href={`blog/${post.sys.slug}`}
							class="mt-4 text-tiny font-medium text-eui-light-blue-600/85"
							showArrow
							title={post.entryTitle}
						>
							Read more
							<span class="sr-only"> about {post.entryTitle}</span>
							<span class="absolute inset-x-0 -top-px bottom-0"></span>
						</AppLink>
					</div>
				</div>
			</article>
		{/each}
	</div>
{:else}
	<div class="text-center text-intranet-black-800">
		<h3>You currently don't have any blogposts</h3>
	</div>
{/if}

{#if data.personalWebsiteBelongsToAuthUser}
	<div class="mt-8 flex justify-center">
		<a href="blog/create">
			<Button>Create new blogpost</Button>
		</a>
	</div>
{/if}
