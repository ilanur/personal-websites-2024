import { PUBLIC_DIRECTUS_API_URL } from '$env/static/public';

export const peopleConfig = {
	templateFunction: templateFunction,
	root_classes: 'my-6',
	list_classes: 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
	item_classes:
		'col-span-1 flex flex-col divide-y divide-eui-gray-30 rounded-lg bg-white text-center shadow-md border border-eui-gray-10',
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
      <h3 class="mt-6 text-sm font-medium">
				${hit.name}
			</h3>

			<dl class="mt-1 flex flex-grow flex-col justify-between">
				<dt class="sr-only">PhD Researcher</dt>
        <dd class="text-sm text-gray-500">PhD Researcher</dd>
      </dl>
    </div>

    <div>
    	<div class="-mt-px flex divide-x divide-eui-gray-30">
        <div class="flex w-0 flex-1">
        	<a
						href="mailto:${hit.email}"
						class="group text-eui-gray-70 relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-md py-4 text-sm font-semibold hover:bg-cyan-700 no-underline"
					>
          	<span class="fa-sharp fa-solid fa-envelope text-eui-gray-30 group-hover:text-eui-blue fa-lg duration-200 transition ease-out"></span>
						<span class="text-eui-gray-90 group-hover:text-eui-blue mt-0.5 duration-200 transition ease-out">Email</span>
          </a>
        </div>
				<div class="-ml-px flex w-0 flex-1">
					<a
						href="/${hit.slug}"
						class="group text-eui-gray-70 relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-md py-4 text-sm font-semibold hover:bg-cyan-700 hover:text-white no-underline"
					>
						<span class="fa-sharp fa-solid fa-address-card text-eui-gray-30 group-hover:text-eui-blue fa-lg duration-200 transition ease-out"></span>   
						<span class="text-eui-gray-90 group-hover:text-eui-blue mt-0.5 duration-200 transition ease-out">View profile</span>
					</a>
				</div>
      </div>
    </div>
  `;
}
