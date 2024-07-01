import { peopleConfig } from '$lib/utils/algolia/indexes/people';
import { PUBLIC_ALGOLIA_PERSONAL_INFORMATION_INDEX } from '$env/static/public';

export function setConfigs(indexName) {
	let config;

	if (indexName === PUBLIC_ALGOLIA_PERSONAL_INFORMATION_INDEX) {
		config = peopleConfig;
	}

	// For each of the attributes in the config, if it's not present, use the default one
	return {
		...getDefaultConfig(),
		...config
	};
}

function getDefaultConfig() {
	// Here you can put the default values for each attribute
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
	return hit.item
		? html`
				<p>${hit.item.entryTitle}</p>
			`
		: '';
}

function baseTransformItems(items) {
	return items;
}
