import { PUBLIC_EUI_WEB } from '$env/static/public';
import { formatDate, formatTime, affiliationsGroupsAndCategory} from '$lib/utils/utils.js';

export const announcementsConfig = {
    templateFunction: templateFunction,
    root_classes: 'my-6',
    list_classes: 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3',
    item_classes: 'col-span-1 flex flex-col rounded-md bg-white',
    select_form_classes: 'mt-3',
    search_placeholder: 'Search',
};

function templateFunction(hit, html, components) {
  const { groups, affiliations, userTypes, filterByAffiliation } = affiliationsGroupsAndCategory(hit.item.affiliationsGroupsAndCategory);
  let dep = hit.item.euiUnit;

	return `
    <article class="flex flex-1 flex-col items-start relative hover:shadow-xl">
      <div class="w-full">
				<img class="aspect-[2/1] w-full rounded-t-md bg-gray-100 object-cover" src="${PUBLIC_EUI_WEB + hit.item.image.asset.sys.uri}" alt="${hit.item.image.altText}">
      </div>
			<div class="w-full px-6 mb-6">
        <div class="mt-6 flex flex-wrap justify-between gap-x-4 font-bold">
          <p class="text-sm text-slate-500"><span class="fa-regular fa-calendar me-1"></span><time datetime="${hit.item.date}">${formatDate(hit.item.date)}</time></p>
          ${dep ?`<p class="text-sm text-cyan-700">${dep.entryTitle}</p>` : ''}
        </div>
        <div class="group">
          <h1 class="mt-3 text-base font-semibold leading-5 line-clamp-3">
            <a href="?id=${hit.item.sys.slug}" title="Read: ${hit.item.entryTitle}">
              <span class="absolute inset-0"></span>
              ${hit.item.entryTitle}
            </a>
          </h1> 
				  <p class="mt-3 line-clamp-3 text-sm leading-5">${hit.item.summary}</p>
			  </div>
      </div>
      <div class="w-full px-6 my-6 border-t mt-auto">
        <div class="flex flex-wrap items-center gap-x-2 gap-y-2 mt-4 text-xs">
          <p class="font-bold text-xs">Relevant for:</p>
          ${groups.map(
            (group) =>
              `<span class="inline-flex items-center rounded-sm bg-cyan-700 px-1.5 py-0.5 text-xs text-white">${group}</span>`
          ).join('')}
          ${affiliations.map(
            (affiliation) =>
              `<span class="inline-flex items-center rounded-sm bg-cyan-700 px-1.5 py-0.5 text-xs text-white">${affiliation.entryTitle}</span>`
          ).join('')}
          ${userTypes.map(
            (userType) => 
              `<span class="inline-flex items-center rounded-sm bg-cyan-700 px-1.5 py-0.5 text-xs text-white">${userType}</span>`
            ).join('')}                   
        </div>
      </div>    
    </article>
  `;
}