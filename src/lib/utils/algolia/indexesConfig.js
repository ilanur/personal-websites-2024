export function setConfigs(indexName) {
	let currentTemplateFunction = baseTemplateFunction;
	let currentTransformItems = baseTransformItems;
	let root_classes = 'm-6';
	let list_classes = 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3';
	let item_classes = 'col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow';
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
		htmlAffs += `<dt class="sr-only">EUI affiliation</dt><dd class="text-sm text-gray-500">${name}</dd>`;
		// Iterate over each role in the array for this name.
		affiliationsMap[name].forEach((role) => {
			// Add the role to the HTML string.
			htmlAffs += `<dt class="sr-only">Role</dt><dd class="mb-2 lh-1 fw-semi-bold text-sm text-grey">${role}</dd>`;
		});
	}

	return `
	<div class="flex flex-1 flex-col p-8">
      <img class="mx-auto w-32 flex-shrink-0 rounded-full" src="${photo}" alt="Portrait picture of ${hit.ict.Firstnames + ' ' + hit.ict.Lastnames}">
      <h3 class="mt-6 mb-2 text-sm font-bold text-gray-900">${hit.ict.Firstnames + ' ' + hit.ict.Lastnames}</h3>
      <dl class="mt-1 flex flex-grow flex-col">
		${htmlAffs}
      </dl>
    </div>
    <div>
      <div class="-mt-px flex divide-x divide-gray-200">
        <div class="flex w-0 flex-1">
          <a href="mailto:janecooper@example.com" class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
            <span class="fa-sharp fa-regular fa-envelope"></span>
            Email
          </a>
        </div>
        <div class="-ml-px flex w-0 flex-1">
          <a href="/" class="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
		  <span class="fa-sharp fa-regular fa-address-card"></span>   
		  View profile
          </a>
        </div>
      </div>
    </div>
    `;
}