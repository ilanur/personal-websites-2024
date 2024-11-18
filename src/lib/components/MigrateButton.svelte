<script>
	let promise

	async function onContentMigration() {
		promise = fetch('/api/content-migration').then(async (res) => {
			if (!res.ok) {
				const text = await res.json()
				throw new Error(text.message)
			}

			return res.json()
		})
	}
</script>

<div class="flex items-center">
	{#await promise}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...$$props}
		>
			<path
				fill="currentColor"
				d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
				opacity="0.25"
			/>
			<path
				fill="currentColor"
				d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
			>
				<animateTransform
					attributeName="transform"
					dur="0.75s"
					repeatCount="indefinite"
					type="rotate"
					values="0 12 12;360 12 12"
				/>
			</path>
		</svg>
		<span class="ml-2 mr-4 text-xs">Content migrating...</span>
	{:then value}
		{#if value}
			<span class="mr-4 text-xs text-eui-blue">Content migrated</span>
		{/if}
	{:catch error}
		<span class="mr-4 text-xs text-eui-red">{error.message}</span>
	{/await}

	<button onclick={onContentMigration}>Migrate data</button>
</div>
