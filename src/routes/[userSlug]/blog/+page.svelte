<script>
	import { getContext } from 'svelte'
	import { getThumbnail, truncateString } from '$lib/utils/utils'

	let { data } = $props()

	const smallHeroBanner = getContext('smallHeroBanner')
	$smallHeroBanner = true

	const blogPosts = data.blogPosts
	console.log(blogPosts)
</script>

<div class="container py-12">
	<h2 class="mb-5 font-normal">Blog</h2>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each blogPosts as post}
			<a href={`${post.url}`} class="card block overflow-hidden rounded-lg bg-white shadow-md">
				<img
					class="h-64 w-full object-cover object-center"
					src={getThumbnail(post.entryThumbnail)}
					alt={post.entryTitle}
				/>

				<div class="p-4">
					<h3 class="mb-2 text-lg font-semibold">{post.entryTitle}</h3>
					{#if post.description}
						<p class="text-gray-700 text-sm">{truncateString(post.description, 200)}</p>
					{/if}

					<span
						class="read-more bg-blue-500 hover:bg-blue-700 mt-4 inline-block rounded px-4 py-2 font-semibold text-white"
					>
						Read More
					</span>
				</div>
			</a>
		{/each}
	</div>
</div>

<style>
	.card {
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		text-decoration: none;
		color: inherit;
	}

	.card:hover {
		transform: translateY(-5px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.card:hover .read-more {
		background-color: #0056b3; /* Darker blue */
	}

	.read-more {
		text-decoration: none;
	}
</style>
