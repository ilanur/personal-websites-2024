import { peopleConfig } from '$lib/utils/algolia/indexes/people';

export function setConfigs(indexName) {
	let config;

	if (indexName === 'people' || indexName === 'peopleIntranet') {
		config = peopleConfig;
	}

	//for each of the attributes in the config, if it's not present, use the default one
	return {
		...getDefaultConfig(),
		...config
	};
}

function getDefaultConfig() {
	//X SIMO, qui puoi mettere i valori di default per ogni attributo
	return {
		templateFunction: baseTemplateFunction,
		transformItems: baseTransformItems,
		root_classes: '',
		list_classes: '',
		item_classes: '',
		select_form_classes: '',
		search_placeholder: 'Search'
	};
}

function baseTemplateFunction(hit, html) {
	// console.log("Hit",hit)
	return html`
		<p>${hit.item.entryTitle}</p>
	`;
}
function baseTransformItems(items) {
	return items;
}
