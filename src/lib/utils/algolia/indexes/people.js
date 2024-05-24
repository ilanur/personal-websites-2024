import { PUBLIC_DIRECTUS_API_URL } from '$env/static/public';

export const peopleConfig = {
	templateFunction: templateFunction,
	root_classes: 'my-6',
	list_classes:
		'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4',
	item_classes:
		'col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow-md',
	select_form_classes: '',
	search_placeholder: 'Search by name, areas of expertise or language'
};

function templateFunction(hit) {
	let photo = hit.profile_image
		? `${PUBLIC_DIRECTUS_API_URL}/assets/${hit.profile_image}`
		: 'https://www.eui.eu/web-production/code/assets/img/default-user-dark.jpg';

	return `
		<div class="flex flex-1 flex-col p-8">
			<div class="size-32 flex-shrink-0 rounded-full overflow-hidden mx-auto">
				<img class="size-full object-cover" src="${photo}" alt="Portrait picture of ${hit.name}">
			</div>
      <h3 class="mt-4 mb-2 text-sm font-bold">
				${hit.name}
			</h3>
    </div>

    <div>
    	<div class="-mt-px flex divide-x divide-gray-200">
        <div class="flex w-0 flex-1">
        	<a
						href="mailto:${hit.email}"
						class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-md border border-transparent py-4 text-sm font-semibold hover:bg-cyan-700 hover:text-white"
					>
          	<span class="fa-sharp fa-regular fa-envelope"></span>
						Email
          </a>
        </div>
				<div class="-ml-px flex w-0 flex-1">
					<a
						href="/${hit.slug}"
						class="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-md border border-transparent py-4 text-sm font-semibold hover:bg-cyan-700 hover:text-white"
					>
						<span class="fa-sharp fa-regular fa-address-card"></span>   
						View profile
					</a>
				</div>
      </div>
    </div>
  `;
}
