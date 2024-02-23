<script>
    import { browser } from '$app/environment';
    import algoliasearch from 'algoliasearch/lite';
    import instantsearch from 'instantsearch.js';
    import { searchBox, hits, configure, voiceSearch, hitsPerPage, stats, pagination, currentRefinements } from 'instantsearch.js/es/widgets';
    import { setConfigs } from '$lib/utils/algolia/indexesConfig';
    import { eui_refinementList, eui_menuSelect, eui_toggleRefinement } from '$lib/utils/algolia/widgets';
    import { PUBLIC_ALGOLIA_ID, PUBLIC_ALGOLIA_KEY } from '$env/static/public';
	import { afterUpdate } from 'svelte';

    export let item;
	//console.log("item", item);
	//const algoliaConfig = item;
	
	afterUpdate( () => {
		//window.location.reload()
		//console.log('algoliaConfig:', algoliaConfig);
		const option_hitsPerPage = item.customHitsPerPage || 12;

		if (browser) {
			const searchClient = algoliasearch(PUBLIC_ALGOLIA_ID, PUBLIC_ALGOLIA_KEY);
			let indexName = item.index; // Dynamically set the index name

			const { currentTemplateFunction, currentTransformItems, select_form_classes, root_classes, list_classes, item_classes } = setConfigs(indexName);

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
							return currentTemplateFunction(hit, html, components);
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
						return currentTransformItems(items, { results });
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
						select: 'form-select border-0 rounded-0',
						option: 'bg-white',
					}
				}),

				pagination({
					scrollTo: '#current-refinements',
					container: '#pagination',
					showLast: false,
					showFirst: false,
					cssClasses: {
					list: [
						'pagination',
						'flex-wrap',
						'justify-content-center',
						'pb-5',
						'pb-md-0',
						'mb-0',
						'lh-1'
					],
					item: 'page-item mx-2',
					link: 'd-flex align-items-center h-100 border-0 page-link rounded-0',
					previousPageItem: 'd-flex align-items-center position-absolute bottom-0 start-0 position-md-static ps-2',
					nextPageItem: 'd-flex align-items-center position-absolute bottom-0 end-0 position-md-static pe-2',
					selectedItem: 'fw-bold',
					noRefinementRoot: 'd-none'
					},
					templates: {
						first: '',
						last: '',
						previous: '<span class="the-arrow arrow-left short arrow-dark me-3"><span class="shaft"></span></span><span class="fw-bold">Previous</span>',
						next: '<span class="fw-bold">Next</span><span class="the-arrow short arrow-dark ms-3"><span class="shaft"></span></span>'
					},
				}),

				stats({
					container: '#stats',
				}),

				currentRefinements({
					container: '#current-refinements',
					cssClasses: {
						root: '',
						list: 'd-flex flex-wrap list-unstyled mb-0 mt-3',
						item: 'd-inline-flex align-items-center flex-wrap mb-0',
						label: 'd-none me-2 mb-2 fw-bold',
						category: 'd-inline-flex align-items-center badge bg-primary mb-2 me-2 rounded-0',
						categoryLabel: 'd-inline-block lh-md me-2',
						delete: 'fw-bold h6 mb-0 bg-transparent border-0 text-white',
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

<div id="searchbox"></div>
<div id="stats"></div>
<div id="voicesearch"></div>
<div id="current-refinements"></div>
<div id="hits-per-page"></div>

<!-- Dynamically created containers for refinement widgets will be here -->
{#each item.filterForHorizontalSearch as filter}
    <div id={filter.divIdValue}></div>
{/each}
<div id="hits"></div>
<div id="pagination"></div>