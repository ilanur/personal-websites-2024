import { generateLinkData, affiliationsGroupsAndCategory} from '$lib/utils/utils.js';

export const servicesProceduresConfig = {
    templateFunction: templateFunction,
    root_classes: 'my-6',
    list_classes: 'grid grid-cols-1 gap-6 sm:grid-cols-1 2xl:grid-cols-2',
    item_classes: 'col-span-1 flex flex-col rounded-lg bg-white shadow mb-6',
    select_form_classes: '',
    search_placeholder: 'Search',
};

function templateFunction(hit, html, components) {
  console.log(hit);
  const { groups, affiliations, userTypes, filterByAffiliation } = affiliationsGroupsAndCategory(hit.item.usefulFor);
  const unit = hit.item.unit ? hit.item.unit : null;
  
  const linkData = generateLinkData(hit.item.link);

  // Map over the linkData to generate HTML markup
  const linksHTML = linkData.map(({ href, title, description }) => `
    <li class="relative flex justify-between gap-x-6 py-3 text-sm">
        <a class="underline" href="${href}" title="${title}">${description}</a>
        <div class="flex shrink-0 items-center gap-x-4">
            <svg class="h-5 w-5 flex-none text-gray-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
        </div>        
    </li>
  `).join('');

	return `
        <article class="">
            <div class="py-6">
                <div class="mb-6 px-6">
                <div class="flex justify-between mb-4">    
                        <div class="flex flex-wrap items-center gap-x-2 gap-y-2 text-xs">
                            <p class="text-xs "><span class="fa-sharp fa-regular fa-folder"></span><span class="sr-only">Category: </span></p>
                            ${hit.item.category.map(category => `
                                <span class="text-xs font-bold">${category || 'N/A'}</span>
                            `).join('')}
                        </div>
                        <div class="flex flex-wrap items-center gap-x-2 gap-y-2 font-bold text-xs ">
                            <span class="sr-only">Visibility: </span>
                            ${hit.item.intranet ? 
                                `<span class="inline-flex items-center"><div class="flex-none rounded-full bg-orange-500/20 p-1 me-1"><div class="h-1.5 w-1.5 rounded-full bg-orange-500"></div></div> Intranet</span>` 
                                : 
                                `<span class="inline-flex items-center"><div class="flex-none rounded-full bg-emerald-500/20 p-1 me-1"><div class="h-1.5 w-1.5 rounded-full bg-emerald-500"></div></div> Public</span>`
                            }
                        </div>
                    </div>    
                    <h1 class="text-lg font-semibold  line-clamp-3 group-hover:text-gray-600">${hit.item.entryTitle}</h1>             
                    ${unit ? `<p class="mt-3 text-sm font-bold text-cyan-700">${unit}</p>` : ''}
                    <div class="mt-3 text-sm leading-5 text-gray-600">
                        <p class="line-clamp-3">${hit.item.description || 'No description available.'}</p>
                    </div>
                    <ul role="list" class="mt-4 px-3 divide-y divide-gray-100 border bg-white rounded-md">
                        ${linksHTML}
                    </ul>                    
                </div>
                <div class="relative w-full pt-3 border-t px-6">                
                    <div class="flex flex-wrap items-center gap-x-2 gap-y-2 mt-4 text-xs">
                        <p class="font-bold text-xs ">Relevant for:</p>
                        ${groups.map(
                        (group) =>
                            `<span class="inline-flex items-center rounded-sm bg-cyan-700 px-1.5 py-0.5 text-xs text-white">${group}</span>`
                        ).join('')}
                        ${hit.item.affiliations.map(
                            (affiliation) => `
                            <span class="inline-flex items-center rounded-sm bg-cyan-700 px-1.5 py-0.5 text-xs text-white">${affiliation.entryTitle}</span>    
                        `).join('')}
                        ${userTypes.map(
                            (userType) =>
                                `<span class="inline-flex items-center rounded-sm bg-cyan-700 px-1.5 py-0.5 text-xs text-white">${userType}</span>`
                        ).join('')}                    
                    </div>
                </div>
            </div>
        </article>
    `;
}

