export function setConfigs(indexName) {
	let currentTemplateFunction = baseTemplateFunction;
	let currentTransformItems = baseTransformItems;
	let root_classes = 'mt-3';
	let list_classes = 'list-unstyled px-4 border-start border-2 border-primary people-markup';
	let item_classes = 'border-bottom pb-3 mb-3 mb-lg-4 pb-lg-4 single-item';
	let select_form_classes = 'mt-3';
	let search_placeholder = 'Search by name, areas of expertise or language';

	if (indexName === 'people') {
		currentTemplateFunction = peopleTemplateFunction;
	}

	return {
		currentTemplateFunction,
		currentTransformItems,
		root_classes,
		list_classes,
		item_classes,
		select_form_classes,
		search_placeholder
	};
}

function baseTemplateFunction(hit) {
	return html` <p>${hit.item.entryTitle}</p> `;
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
		htmlAffs += `<p class="mb-2 lh-1 fw-semi-bold text-red">${name}</p>`;

		// Iterate over each role in the array for this name.
		affiliationsMap[name].forEach((role) => {
			// Add the role to the HTML string.
			htmlAffs += `<p class="mb-2 lh-1 fw-semi-bold text-grey">${role}</p>`;
		});
	}

	return `
        <div class="flex items-start relative bg-white">
    <figure class="hidden sm:block aspect-square overflow-hidden mb-0" style="max-width: 125px;">
        <img class="h-auto" src="${photo}" alt="Portrait picture of ${hit.ict.Firstnames + ' ' + hit.ict.Lastnames}">
    </figure>
    <div class="flex flex-col flex-grow px-4 lg:px-5">
        <p class="text-lg font-bold">${hit.ict.Firstnames + ' ' + hit.ict.Lastnames}</p>
        ${htmlAffs}
    </div>
    <div class="self-center">
        <a class="flex justify-center items-center no-underline font-bold stretched-link text-4xl leading-tight" href="https://www.eui.eu${parent_slug}?id=${hit.objectID}" title="View ${hit.ict.Firstnames + ' ' + hit.ict.Lastnames} profile">
            <span class="sr-only">View ${hit.ict.Firstnames + ' ' + hit.ict.Lastnames} profile</span>
            <span class="flex items-center relative ml-3">
                <!-- The arrow styles need to be handled with custom CSS or inline styles -->
                <span class="flex items-center">
                    <span class="the-arrow arrow-dark thick">
                        <span class="shaft"></span>
                    </span>
                </span>
            </span>
        </a>
    </div>
</div>

      `;
}
