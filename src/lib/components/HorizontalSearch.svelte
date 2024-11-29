<script>
	import { liteClient as algoliasearch } from 'algoliasearch/lite'
	import instantsearch from 'instantsearch.js'
	import { afterUpdate, onDestroy } from 'svelte'
	import {
		hits,
		configure,
		hitsPerPage,
		stats,
		currentRefinements
	} from 'instantsearch.js/es/widgets'
	import { setConfigs } from '$lib/utils/algolia/indexesConfig'
	import { customPagination } from '$lib/utils/algolia/customPagination'
	import { customSearch } from '$lib/utils/algolia/customSearch'
	import { customVoiceSearch } from '$lib/utils/algolia/customVoiceSearch'
	import {
		eui_refinementList,
		eui_menuSelect,
		eui_toggleRefinement
	} from '$lib/utils/algolia/widgets'
	import { PUBLIC_ALGOLIA_ID, PUBLIC_ALGOLIA_KEY, PUBLIC_PREVIEW_PARAM } from '$env/static/public'
	import { getThumbnail, truncateString } from '$lib/utils/utils'
	import { page } from '$app/stores'

	export let item

	// Get preview state from the page store
	$: isPreview = $page.data.preview?.active || false

	// Function to get the correct index name based on preview mode
	function getIndexName(baseIndex) {
		return isPreview ? `${baseIndex}_preview` : baseIndex
	}

	// Function to get URL with preview state preserved
	function getPreviewUrl(slug) {
		// Create a proper URL object
		const targetUrl = new URL(slug.startsWith('/') ? slug : `/${slug}`, $page.url.origin)

		// If in preview mode, add the preview parameter
		if (isPreview) {
			targetUrl.searchParams.set(PUBLIC_PREVIEW_PARAM, 'true')
		}

		// Return the pathname and search params, keeping the URL clean
		return `${targetUrl.pathname}${targetUrl.search}`
	}

	$: activeFilter = null
	$: option_hitsPerPage = item.customHitsPerPage || 12
	$: quickFilters = item.quickFilter || []
	$: hideSearchBar = item.hideSearchBar || false
	$: hidePagination = item.hidePagination || false
	$: filters = activeFilter
		? `${item.additionalFilters ? `${item.additionalFilters} AND ` : ''}${activeFilter}`
		: item.additionalFilters || ''

	let search

	const initializeSearch = () => {
		const searchClient = algoliasearch(PUBLIC_ALGOLIA_ID, PUBLIC_ALGOLIA_KEY)
		// Get the base index name
		let indexName = item.index
		if (item.indexName && item.indexName !== '') {
			indexName = item.indexName
		}

		// Apply preview suffix if in preview mode
		indexName = getIndexName(indexName)
		console.log('Using index:', indexName)

		const config = setConfigs(indexName)
		const { transformItems, select_form_classes, root_classes, list_classes, item_classes } = config

		let not_found_classes = 'my-14 text-center'

		const search = instantsearch({
			indexName,
			searchClient,
			routing: true
		})

		// Configure widget for additional filters
		search.addWidgets([
			configure({
				filters: filters
			})
		])
		search.addWidgets([
			hits({
				container: '#hits',
				templates: {
					item: (hit, { html }) => html`
						<article
							class="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg"
						>
							<figure class="bg-gray-200 relative flex h-56 w-full items-center justify-center">
								${hit.cleanEntryData.entryThumbnail
									? html`
											<img
												class="h-full w-full object-contain"
												src="${getThumbnail(
													hit.cleanEntryData.entryThumbnail,
													'https://www.eui.eu/Images/Web2021/card-placeholder.svg'
												)}"
												alt="${hit.cleanEntryData.entryThumbnail.altText || 'Thumbnail'}"
											/>
										`
									: html`
											<span class="text-gray-500 text-sm">No Image</span>
										`}
							</figure>
							<div class="flex h-full flex-col justify-between bg-white p-4">
								<header>
									<h2 class="text-gray-900 mb-2 line-clamp-2 text-base font-semibold">
										${hit.title}
									</h2>
								</header>
								<p class="text-gray-700 line-clamp-3 text-sm">
									${truncateString(hit.cleanEntryData.entryDescription, 200)}
								</p>
								<footer class="mt-4">
									<a
										href="${getPreviewUrl(hit.cleanEntryData.websiteSlug)}"
										title="${hit.title} website"
										aria-label="${hit.title} website"
										class="text-eui-dark-blue-500 inline-block text-sm hover:underline"
									>
										Visit the Personal Website
									</a>
								</footer>
							</div>
						</article>
					`,
					empty(results, { html }) {
						return html`
							<div class="text-gray-700 flex flex-col items-center justify-center p-6 text-center">
								<p
									class="bg-gray-200 text-gray-400 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full p-4 text-3xl"
								>
									<span class="fa-sharp fa-solid fa-magnifying-glass"></span>
								</p>
								<h3 class="text-lg font-semibold">
									No results found for "
									<strong>${results.query}</strong>
									"
								</h3>
								<p class="mt-2 text-sm">
									No results match your criteria. Try removing filters or adjusting your search
									terms.
								</p>
							</div>
						`
					}
				},
				transformItems(items, { results }) {
					console.log('Hits retrieved:', items)
					return transformItems(items, { results })
				},
				cssClasses: {
					root: root_classes,
					list: list_classes,
					item: item_classes
				}
			})
		])

		// Instantiate the custom widget
		if (hidePagination === false) {
			search.addWidgets([
				customPagination(
					{
						container: '#pagination'
					},
					option_hitsPerPage
				),
				hitsPerPage({
					container: '#hits-per-page',
					items: [
						{
							label: `${option_hitsPerPage} hits per page`,
							value: option_hitsPerPage,
							default: true
						},
						{ label: `${option_hitsPerPage * 2} hits per page`, value: option_hitsPerPage * 2 },
						{ label: `${option_hitsPerPage * 3} hits per page`, value: option_hitsPerPage * 3 }
					],
					cssClasses: {
						select:
							'block w-full bg-white border border-gray-300 text-sm rounded-lg focus:ring-intranet-blue-500',
						option: 'bg-white'
					}
				})
			])
		}
		if (hideSearchBar === false) {
			search.addWidgets([
				customSearch({
					container: '#searchbox',
					placeholder: item.placeholderText || 'Search...'
				}),
				customVoiceSearch({
					container: '#voicesearch'
				})
			])
		}
		search.addWidgets([
			stats({
				container: '#stats',
				cssClasses: {
					text: ['text-sm']
				}
			}),
			currentRefinements({
				container: '#current-refinements',
				cssClasses: {
					root: '',
					list: 'mt-6 flex flex-wrap items-center',
					item: 'text-sm me-5',
					label: 'sr-only',
					category:
						'inline-flex items-center flex-wrap gap-x-3 bg-intranet-blue-700 px-2 py-1 mb-3 me-2 rounded-sm text-xs font-medium text-white',
					categoryLabel: '',
					delete: 'group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-intranet-blue-700'
				},
				transformItems(items) {
					return items
				},
				excludedAttributes: ['ModifiedDateTimestamp' /*'timestamp'*/]
			})
		])

		// Dynamically add refinement widgets based on the JSON
		item.filterForHorizontalSearch.forEach((filter) => {
			const widgetType = mapFilterTypeToWidget(filter.type)
			if (widgetType) {
				widgetType(
					search,
					`#${filter.divIdValue}`,
					filter.attribute,
					filter.title,
					select_form_classes,
					filter.limit,
					filter.sortBy,
					filter.count_value,
					filter.showSearchBar,
					filter.show_more
				)
			}
		})
		search.start()
	}

	afterUpdate(() => {
		if (search) {
			search.dispose()
			activeFilter = null
		}
		initializeSearch()
	})

	onDestroy(() => {
		if (search) {
			search.dispose()
			activeFilter = null
		}
	})

	// Map the JSON type to the corresponding InstantSearch.js widget
	function mapFilterTypeToWidget(type) {
		const typeMap = {
			'Dropdown select': eui_menuSelect,
			'Checkbox select': eui_refinementList,
			'Switch toggle': eui_toggleRefinement
			// Add other mappings here if needed
		}

		return typeMap[type]
	}
	// Function to toggle filter
	function toggleFilter(algoliaFilter) {
		search.dispose()

		//console.log('Clicked filter: ' + algoliaFilter);
		if (activeFilter === algoliaFilter) {
			//console.log('Filter is active, removing it');
			activeFilter = null // Remove filter if it's already active
		} else {
			//console.log('Applying new filter');
			activeFilter = algoliaFilter // Apply new filter
		}
		//console.log('Current activeFilter: ' + (activeFilter || 'none'));
		initializeSearch() // Reinitialize search with new filter
	}
</script>

<div class="bg-intranet-blue-50 pt-5">
	<form class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mb-5 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-12">
			{#if hideSearchBar !== true}
				<div class="flex items-center sm:col-span-12 2xl:col-span-8">
					<div class="flex w-full items-center">
						<label for="search" class="sr-only">Search</label>
						<div class="relative w-full">
							<div id="searchbox" class="w-full"></div>
							<div id="voicesearch" class="h-full"></div>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Quick search filters -->
		{#if quickFilters.length > 0}
			<div class="mx-auto">
				<p class="sr-only text-sm">Quick search:</p>
				<ul role="list" class="flex">
					{#each quickFilters as filter}
						<li class="mr-1">
							<button
								class="rounded px-2 py-1 text-xs font-semibold {activeFilter ===
								`${filter.algoliaFilter}`
									? 'bg-intranet-blue-700 text-white'
									: 'bg-intranet-blue-100 text-intranet-blue-700'} hover:bg-intranet-blue-700 hover:text-white"
								on:click={() => toggleFilter(filter.algoliaFilter)}
							>
								{@html filter.label}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</form>
	<div id="current-refinements" class="mx-auto max-w-7xl px-8 lg:px-8"></div>
</div>

<div class="mx-auto max-w-7xl">
	<div class="my-6 flex items-center justify-between px-8">
		<div id="stats"></div>
		<div id="hits-per-page"></div>
	</div>
	<div id="hits"></div>
	<div id="pagination" class="px-8"></div>
</div>
