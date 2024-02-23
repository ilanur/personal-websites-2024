export function setConfigs(indexName) {
	let currentTemplateFunction = baseTemplateFunction;
	let currentTransformItems = baseTransformItems;
	let root_classes = 'm-6';
	let list_classes = 'flex flex-wrap';
	let item_classes = 'my-1 px-1 w-full sm:px-3 sm:w-1/2 md:px-6 lg:my-4 lg:px-4 xl:w-1/3 2xl:w-1/4';
	let select_form_classes = 'mt-3';
	let search_placeholder = 'Search by name, areas of expertise or language';

	if (indexName === 'people' || indexName === 'peopleIntranet') {
		currentTemplateFunction = peopleTemplateFunction;
	}

	return {
		currentTemplateFunction,
		currentTransformItems,
		root_classes,
		list_classes,
		item_classes,
		select_form_classes,
		search_placeholder,
	};
}

function baseTemplateFunction(hit, html) {
	console.log("Hit",hit)
	return html`
		<p>${hit.item.entryTitle}</p>
	`;
}
function baseTransformItems(items) {
	return items;
}

function peopleTemplateFunction(hit, html, components) {
	let parent_slug = 'people/';
	let photo = 'https://www.eui.eu/web-production/code/assets/img/default-user-dark.jpg';
	if (/*hit.cms.photoConsent.consentGiven &&*/ hit.cms.photo) {
		photo = 'https://www.eui.eu' + hit.cms.photo.asset.sys.uri;
	}

	let affiliationsMap = {};
	// Iterate over each affiliation.
	hit.ict.Affiliations.forEach((aff) => {
		// If the affiliation name is not already a key in the map, add it and
		// set its value to an empty array.
		if (!affiliationsMap.hasOwnProperty(aff.Name)) {
			affiliationsMap[aff.Name] = [];
		}

		// If the role is not already in the array for this affiliation name, add it.
		if (!affiliationsMap[aff.Name].includes(aff.Role)) {
			affiliationsMap[aff.Name].push(aff.Role);
		}
	});

	// Generate the HTML string.
	let htmlAffs = '';

	// Iterate over each key (name) in the map.
	for (let name in affiliationsMap) {
		// Add the name to the HTML string.
		htmlAffs += `<p class="text-base leading-7 text-gray-300">${name}</p>`;

		// Iterate over each role in the array for this name.
		affiliationsMap[name].forEach((role) => {
			// Add the role to the HTML string.
			htmlAffs += `<p class="mb-2 lh-1 fw-semi-bold text-grey">${role}</p>`;
		});
	}

	return `
		<article class="overflow-hidden bg-white shadow-lg">
			<a href="/">
				<img class="block h-auto w-full" src="${photo}" alt="Portrait picture of ${hit.ict.Firstnames + ' ' + hit.ict.Lastnames}" />
			</a>
			<header class="flex items-center justify-between leading-tight p-2 md:p-4">
				<h1 class="text-lg">
					<a class="no-underline hover:underline text-black" href="/">${hit.ict.Firstnames + ' ' + hit.ict.Lastnames}</a>
				</h1>
			</header>
			${htmlAffs}
			<footer><a href="/" title="Go to ${hit.ict.Firstnames + ' ' + hit.ict.Lastnames} profile">View profile</a></footer>		
		</article>	
    `;
}