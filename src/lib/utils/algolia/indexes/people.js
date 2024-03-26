export const peopleConfig = {
    templateFunction: templateFunction,
    root_classes: 'my-6',
    list_classes: 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4',
    item_classes: 'col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow-md',
    select_form_classes: '',
    search_placeholder: 'Search by name, areas of expertise or language',
};


function templateFunction(hit, html, components) {
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
		htmlAffs += `<dt class="sr-only">EUI affiliation</dt><dd class="text-sm font-bold text-cyan-700">${name}</dd>`;
		// Iterate over each role in the array for this name.
		affiliationsMap[name].forEach((role) => {
			// Add the role to the HTML string.
			htmlAffs += `<dt class="sr-only">Role</dt><dd class="mb-2 lh-1 text-sm">${role}</dd>`;
		});
	}

	return `
	<div class="flex flex-1 flex-col p-8">
      <img class="mx-auto w-32 flex-shrink-0 rounded-full" src="${photo}" alt="Portrait picture of ${hit.ict.Firstnames + ' ' + hit.ict.Lastnames}">
      <h3 class="mt-4 mb-2 text-sm font-bold ">${hit.ict.Firstnames + ' ' + hit.ict.Lastnames}</h3>
      <dl class="mt-1 flex flex-grow flex-col">
		${htmlAffs}
      </dl>
    </div>
    <div>
    	<div class="-mt-px flex divide-x divide-gray-200">
        	<div class="flex w-0 flex-1">
          		<a href="mailto:${hit.ict.EuiEmail}" class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-md border border-transparent py-4 text-sm font-semibold  hover:bg-cyan-700 hover:text-white">
            		<span class="fa-sharp fa-regular fa-envelope"></span>
            		Email
          		</a>
        	</div>
			<div class="-ml-px flex w-0 flex-1">
				<a href="?id=${hit.cms.sys.slug}" class="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-md border border-transparent py-4 text-sm font-semibold  hover:bg-cyan-700 hover:text-white">
					<span class="fa-sharp fa-regular fa-address-card"></span>   
					View profile
				</a>
			</div>
      	</div>
    </div>
    `;
}