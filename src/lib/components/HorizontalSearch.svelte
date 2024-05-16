<script>
	import { browser } from '$app/environment';
	import algoliasearch from 'algoliasearch/lite';
	import instantsearch from 'instantsearch.js';
	import { searchBox, hits, configure, voiceSearch, hitsPerPage, stats, currentRefinements } from 'instantsearch.js/es/widgets';
	import { setConfigs } from '$lib/utils/algolia/indexesConfig';
	import { customPagination } from '$lib/utils/algolia/customPagination';
	import { eui_refinementList, eui_menuSelect, eui_toggleRefinement } from '$lib/utils/algolia/widgets';
	import { PUBLIC_ALGOLIA_ID, PUBLIC_ALGOLIA_KEY } from '$env/static/public';
	import { afterUpdate } from 'svelte';

	//export let item;
	const item = {

		option_hitsPerPage: 12,
		index: 'people',
		placeholderText: 'Search personal websites',
		filterForHorizontalSearch: []

	}
	let option_hitsPerPage = item.option_hitsPerPage;

	afterUpdate(() => {
		//window.location.reload()
		//console.log('algoliaConfig:', algoliaConfig);

		if (browser) {
			const searchClient = algoliasearch(PUBLIC_ALGOLIA_ID, PUBLIC_ALGOLIA_KEY);
			let indexName = item.index; // Dynamically set the index name

			const config = setConfigs(indexName);

			const { templateFunction, transformItems, select_form_classes, root_classes, list_classes, item_classes } = config;

			let not_found_classes = 'my-14 text-center';

			const search = instantsearch({
				indexName,
				searchClient
			});

			// Configure widget for additional filters
			search.addWidgets([
				configure({
					filters: item.additionalFilters || ''
				}),
				searchBox({
					container: '#searchbox',
					placeholder: item.placeholderText,
					cssClasses: {
						root: '',
						form: 'flex',
						input: 'block w-full border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
						reset: '',
						resetIcon: '',
						loadingIndicator: '',
						loadingIcon: '',
						submit: 'relative -ml-px inline-flex items-center gap-x-1.5 px-3 py-2 text-sm font-semibold text-white bg-eui-blue',
						submitIcon: ''
					},
					templates: {
						submit({ cssClasses }, { html }) {
							return html`
								<span class="fa-solid fa-fw fa-magnifying-glass"></span>
							`;
						}
					}
				}),
				hits({
					container: '#hits',
					templates: {
						item(hit, { html, components }) {
							return templateFunction(hit, html, components);
						},
						empty(results, { html }) {
							return html`
								<div class="${not_found_classes}">
									<p class="flex items-center justify-center w-28 h-28 p-4 mx-auto mb-3 text-6xl rounded-full bg-gray-300">
										<span class="fa-sharp fa-solid fa-magnifying-glass"></span>
									</p>
									<h3>
										No results found for "
										<strong>${results.query}</strong>
										"
									</h3>
									<p>No results found for the criteria. Remove filters or try adjusting your search to find what you're looking for.</p>
								</div>
							`;
						}
					},
					transformItems(items, { results }) {
						return transformItems(items, { results });
					},
					cssClasses: {
						root: root_classes,
						list: list_classes,
						item: item_classes
					}
				}),
				voiceSearch({
					container: '#voicesearch',
					language: 'en-GB',
					cssClasses: {
						root: ['flex h-full'],
						status: ['hidden'],
						button: ['relative -ml-px h-full inline-flex items-center gap-x-1.5 px-3 py-2 text-sm font-semibold text-white bg-slate-800']
					},
					templates: {
						buttonText({ isListening, status, errorCode, transcript, isSpeechFinal, isBrowserSupported }, { html }) {
							return html`
								<span class="fa-regular fa-fw ${isListening ? 'fa-regular' : 'fa-solid'} fa-microphone"></span>
							`;
						}
					}
				}),
				hitsPerPage({
					container: '#hits-per-page',
					items: [
						{ label: `${option_hitsPerPage} hits per page`, value: option_hitsPerPage, default: true },
						{ label: `${option_hitsPerPage * 2} hits per page`, value: option_hitsPerPage * 2 },
						{ label: `${option_hitsPerPage * 3} hits per page`, value: option_hitsPerPage * 3 }
					],
					cssClasses: {
						select: 'block w-full border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6',
						option: 'bg-white'
					}
				}),
				// Instantiate the custom widget
				customPagination(
					{
						container: '#pagination'
					},
					option_hitsPerPage
				),
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
						list: 'mx-6 mt-6 flex flex-wrap items-center',
						item: 'text-sm me-5',
						label: 'me-2 text-sm',
						category: 'inline-flex items-center flex-wrap gap-x-3 bg-eui-blue px-2 py-1 mb-3 rounded-sm text-xs font-medium text-white',
						categoryLabel: '',
						delete: 'group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-sky-700'
					},
					transformItems(items) {
						//console.log(items);
						items.forEach(function (item) {
							if (item.refinements[0].label == 'true') {
								item.refinements[0].label = '';
							}

							//console.log('item: ' + item);

							if (item.label.includes('.type')) {
								item.label = 'Type';
							}
							if (item.label == 'item.affiliation.entryTitle' || item.label == 'item.researchProject.affiliation.entryTitle' || item.label == 'item.euiUnit.name' || item.label == 'cms.affiliation.entryTitle' || item.label == 'Departments.DeptName' || item.label == 'ict.Affiliations.Name') {
								item.label = 'Department or Unit';
								item.refinements.forEach(function (refinement, index, object) {
									//console.log(refinement);
									//refinement.label = "<a href='#'>TEST "+refinement.value+"</a>";
								});
							}
							if (item.label.includes('.affiliatedResearchProgrammes.entryTitle')) {
								item.label = 'Research programme';
							}
							if (item.label.includes('.ercProject')) {
								item.label = 'ERC project';
							}
							if (item.label.includes('.isArchivedClosed')) {
								item.label = 'Project archived or closed';
							}
							if (item.label.includes('.affiliatedResearchThemes') || item.label.includes('.researchThemes') || item.label.includes('.areasOfExpertise')) {
								item.label = 'Research themes';
							}
							if (item.label == 'item.category') {
								item.label = 'Category';
							}
							if (item.label == 'item.fullyFunded') {
								item.label = 'Fully funded';
							}
							if (item.label == 'item.feesAndCosts.hasGrant') {
								item.label = 'Has grant';
							}
							if (item.label == 'item.feesAndCosts.minimumFee') {
								item.label = 'Starting fee';
							}
							if (item.label == 'tender_year') {
								item.label = 'Year';
							}
							if (item.label == 'tender_status') {
								item.label = 'Status';
							}
							if (item.label == 'item.feesAndCosts.minimumFee') {
								item.label = 'Starting fee';
							}
							if (item.label == 'item.entry.name') {
								item.label = 'Location';
							}
							if (item.label == 'item.durationMinInMonths') {
								item.label = 'Duration in months';
							}
							if (item.label == 'cms.status') {
								item.label = 'Role';
							}
							if (item.label == 'TypeName') {
								item.label = 'Event category';
							}
							if (item.label == 'Projects.PrjName') {
								item.label = 'Project';
							}
							if (item.label == 'ict.WorkingLanguages.Description') {
								item.label = 'Working language';
							}
							if (item.label == 'ict.EuiYearJoined') {
								item.label = 'Year joined';
							}
							if (item.label == 'cms.usage.researchProjects.title') {
								item.label = 'Research project';
							}
							if (item.label == 'ict.Affiliations.Role') {
								item.label = 'Role';
							}
							if (item.label == 'item.sys.availableLanguages') {
								item.label = 'language';
							}
							if (item.label == 'timestamp') {
								item.label = 'Date interval';
								item.refinements.forEach(function (refinement, index, object) {
									refinement.label = 'From ' + timestampConverter(refinement.value);
								});
							}
							if (item.label == 'timestampEndDate') {
								item.label = 'Expired programmes/trainings';
								item.refinements.forEach(function (refinement, index, object) {
									refinement.label = 'Deadline before ' + timestampConverter(refinement.value);
								});
							}
							if (item.label == 'timestampStartDate') {
								item.label = 'Deadline';
								item.refinements.forEach(function (refinement, index, object) {
									refinement.label = 'Past programmes';
								});
							}
						});
						//console.log(items);
						//return items.filter(item => item.attribute !== 'brand');
						return items;
					},
					excludedAttributes: ['ModifiedDateTimestamp' /*'timestamp'*/]
				})
			]);

			// Dynamically add refinement widgets based on the JSON
			item.filterForHorizontalSearch.forEach((filter) => {
				const widgetType = mapFilterTypeToWidget(filter.type);
				if (widgetType) {
					widgetType(search, `#${filter.divIdValue}`, filter.attribute, filter.title, select_form_classes, filter.limit, filter.sortBy, filter.count_value, filter.has_search, filter.show_more);
				}
			});
			search.start();
		}
	});

	// Map the JSON type to the corresponding InstantSearch.js widget
	function mapFilterTypeToWidget(type) {
		const typeMap = {
			'Dropdown select': eui_menuSelect,
			'Checkbox select': eui_refinementList,
			'Switch toggle': eui_toggleRefinement
			// Add other mappings here if needed
		};
		return typeMap[type];
	}
</script>

<div class="mx-auto max-w-7xl pb-12 lg:px-8">
	<div class="grid grid-cols-1 gap-x-6 gap-y-4 my-6 sm:grid-cols-12">
		<div class="flex items-center sm:col-span-12 2xl:col-span-6">
			<label for="searchbox" class="sr-only text-sm font-medium leading-6">Search</label>
			<div id="searchbox" class="w-full"></div>
			<div id="voicesearch" class="h-full"></div>
		</div>
		<!-- Dynamically created containers for refinement widgets will be here -->
		{#each item.filterForHorizontalSearch as filter}
			{#key filter.divIdValue}
				<div id={filter.divIdValue} class="sm:col-span-6 xl:col-span-4 2xl:col-span-3"></div>
			{/key}
		{/each}
	</div>
	<div id="current-refinements"></div>

	<div class="my-6 flex justify-between items-center">
		<div id="stats"></div>
		<div id="hits-per-page"></div>
	</div>

	<div id="hits"></div>
	<div id="pagination"></div>
</div>
