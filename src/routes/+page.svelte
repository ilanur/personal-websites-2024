<script>
	import HorizontalSearch from '$lib/components/HorizontalSearch.svelte'
	import { PUBLIC_ALGOLIA_PERSONAL_INFORMATION_INDEX } from '$env/static/public'

	let item = {
		index: PUBLIC_ALGOLIA_PERSONAL_INFORMATION_INDEX,
		customHitsPerPage: 12,
		quickFilter: [],
		hideSearchBar: false,
		hidePagination: false,
		customSinglePagePath: '',
		customHits: true,
		additionalFilters: '',
		entryTitle: 'Personal Websites',
		placeholderText: 'Search personal websites...',
		filterForHorizontalSearch: []
	}
</script>

<main>
	<div class="bg-intranet-gray-100">
		<HorizontalSearch {item} />
	</div>
</main>
