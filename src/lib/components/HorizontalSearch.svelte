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

	
    export let item;
	const option_hitsPerPage = item.customHitsPerPage || 12;

	afterUpdate( () => {
		//window.location.reload()
		//console.log('algoliaConfig:', algoliaConfig);

		if (browser) {
			const searchClient = algoliasearch(PUBLIC_ALGOLIA_ID, PUBLIC_ALGOLIA_KEY);
			let indexName = item.index; // Dynamically set the index name

			const config = setConfigs(indexName);

			const { templateFunction, transformItems, select_form_classes, root_classes, list_classes, item_classes } = config;

			let not_found_classes = 'text-center text-2xl text-eui-red';

			const search = instantsearch({
				indexName,
				searchClient
			});

			// Configure widget for additional filters
			search.addWidgets([
				configure({
					filters: (item.additionalFilters || '')
				}),
				searchBox({
					container: '#searchbox',
					placeholder: item.placeholderText
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
									No results found for "<strong>${results.query}</strong>"
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
						root: [
							'd-flex',
						],
						status: [
							'd-none',
						],
						button: [
							'btn',
							'btn-lg',
							'rounded-0',
						],
					},
				}),
				hitsPerPage({
					container: '#hits-per-page',
					items: [
						{ label: `${option_hitsPerPage} hits per page`, value: option_hitsPerPage, default: true },
						{ label: `${option_hitsPerPage*2} hits per page`, value: option_hitsPerPage*2 },
						{ label: `${option_hitsPerPage*3} hits per page`, value: option_hitsPerPage*3 },
					],
					cssClasses: {
						select: 'block w-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6',
						option: 'bg-white',
					}
				}),
				// Instantiate the custom widget
				customPagination({
					container: '#pagination',
				},option_hitsPerPage),
				stats({
					container: '#stats',
				}),
				currentRefinements({
					container: '#current-refinements',
					cssClasses: {
						root: '',
						list: 'm-6 flex items-center',
						item: 'text-sm me-5',
						label: 'd-none me-2 mb-2 fw-bold',
						category: 'py-1 px-2 bg-eui-blue text-sm text-white',
						categoryLabel: '',
						delete: 'ms-3 text-sm text-white font-bold',
					},
					transformItems(items){
						//console.log(items);
						items.forEach( function(item){
						if(item.refinements[0].label == "true"){item.refinements[0].label = ""; }
						
						//console.log('item: ' + item);
						
						if(item.label.includes(".type")){ item.label= "Type"; }
						if(item.label == "item.affiliation.entryTitle" || item.label == "item.researchProject.affiliation.entryTitle" || item.label == "item.euiUnit.name" || item.label == "cms.affiliation.entryTitle" || item.label == "Departments.DeptName"|| item.label == "ict.Affiliations.Name"){ 
							item.label= "Department or Unit"; 
							item.refinements.forEach(function(refinement, index, object){
							//console.log(refinement);
							//refinement.label = "<a href='#'>TEST "+refinement.value+"</a>";
							});
						}
						if(item.label.includes(".affiliatedResearchProgrammes.entryTitle")){ item.label= "Research programme"; }
						if(item.label.includes(".ercProject") ){ item.label= "ERC project"; }
						if(item.label.includes(".isArchivedClosed")){ item.label= "Project archived or closed"; }
						if(item.label.includes(".affiliatedResearchThemes") || item.label.includes(".researchThemes") || item.label.includes(".areasOfExpertise")) { item.label= "Research themes"; }
						if(item.label == "item.category"){ item.label= "Category"; }
						if(item.label == "item.fullyFunded"){ item.label= "Fully funded"; }
						if(item.label == "item.feesAndCosts.hasGrant"){ item.label= "Has grant"; }
						if(item.label == "item.feesAndCosts.minimumFee"){ item.label= "Starting fee"; }
						if(item.label == "tender_year"){ item.label= "Year"; }
						if(item.label == "tender_status"){ item.label= "Status"; }
						if(item.label == "item.feesAndCosts.minimumFee"){ item.label= "Starting fee"; }
						if(item.label == "item.entry.name"){ item.label= "Location"; }
						if(item.label == "item.durationMinInMonths"){ item.label= "Duration in months"; }
						if(item.label == "cms.status"){ item.label= "Role"; }
						if(item.label == "TypeName"){ item.label= "Event category"; }
						if(item.label == "Projects.PrjName"){ item.label= "Project"; }
						if(item.label == "ict.WorkingLanguages.Description"){ item.label= "Working language"; }
						if(item.label == "ict.EuiYearJoined"){ item.label= "Year joined"; }
						if(item.label == "cms.usage.researchProjects.title"){ item.label= "Research project"; }
						if(item.label == "ict.Affiliations.Role"){ item.label= "Role"; }
						if(item.label =="item.sys.availableLanguages"){item.label="language";}
						if(item.label == "timestamp"){
							item.label= "Date interval"; 
							item.refinements.forEach(function(refinement, index, object){
								refinement.label = "From "+timestampConverter(refinement.value);
							});
						}
						if(item.label == "timestampEndDate"){ 
							item.label= "Expired programmes/trainings"; 
							item.refinements.forEach(function(refinement, index, object){
								refinement.label = "Deadline before "+timestampConverter(refinement.value);
							});
						}
						if(item.label == "timestampStartDate"){ 
							item.label= "Deadline"; 
							item.refinements.forEach(function(refinement, index, object){
								refinement.label = "Past programmes";
							});
						}
						});
						//console.log(items);
						//return items.filter(item => item.attribute !== 'brand');
						return items;
					},
					excludedAttributes: ['ModifiedDateTimestamp', /*'timestamp'*/],
				}),
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
            'Switch toggle': eui_toggleRefinement, 
            // Add other mappings here if needed
        };
        return typeMap[type];
    }
</script>

<div class="m-6 flex justify-between items-center">
	<div class="s">
		<label for="searchbox" class="block text-sm font-medium leading-6 text-gray-900">Search</label>
		<div id="searchbox"></div>
	</div>
	<div class="">
		<div id="voicesearch"></div>
	</div>
</div>

<div id="current-refinements"></div>
	
<!-- Dynamically created containers for refinement widgets will be here -->
{#each item.filterForHorizontalSearch as filter}
    <div id={filter.divIdValue}></div>
{/each}

<div class="m-6 flex justify-between items-center">
	<div class="">
		<div id="stats"></div>
	</div>
	<div class="">
		<div id="hits-per-page"></div>
	</div>
</div>
<div id="hits"></div>
<div id="pagination"></div>