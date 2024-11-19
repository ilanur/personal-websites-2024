export function setConfigs(indexName) {
	console.log('indexName', indexName)
	let config

	return {
		...getDefaultConfig(),
		...config
	}
}

function getDefaultConfig() {
	//X SIMO, qui puoi mettere i valori di default per ogni attributo
	return {
		templateFunction: baseTemplateFunction,
		transformItems: baseTransformItems,
		root_classes: 'p-8',
		list_classes: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6 mx-auto',
		item_classes: '',
		select_form_classes: '',
		search_placeholder: 'Search'
	}
}

function baseTemplateFunction(hit, html) {
	console.log('Hit', hit)
	return html`
		<p>${hit.item.entryTitle}</p>
	`
}
function baseTransformItems(items) {
	return items
}
