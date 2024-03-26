import { PUBLIC_EUI_WEB } from '$env/static/public';
import { formatDate, formatTime, getTimeFromDate, affiliationsGroupsAndCategory} from '$lib/utils/utils.js';

export const happeningsConfig = {
    templateFunction: templateFunction,
    root_classes: 'my-6',
    list_classes: 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3',
    item_classes: 'col-span-1 flex flex-col rounded-md bg-white shadow',
    select_form_classes: '',
    search_placeholder: 'Search',
};

function templateFunction(hit, html, components) {
    const { groups, affiliations, userTypes, filterByAffiliation } = affiliationsGroupsAndCategory(hit.item.affiliationsGroupsAndCategory);
    const locations = hit.item.location;
    //strip all html tags from the content
    const text_content = hit.item.content.replace(/<[^>]*>?/gm, '');
    //console.log(hit.item.content);
    
    let date;
    if (formatDate(hit.item.datetime.to) != formatDate(hit.item.datetime.from)){
        date = ` - <span class="sr-only">End date:</span><time datetime="${hit.item.datetime.to}">${formatDate(hit.item.datetime.to, true)}</time>`;
    }
    else if(formatDate(hit.item.datetime.to) == formatDate(hit.item.datetime.from)){
        date = ` - <span class="sr-only">End date:</span><time datetime="${hit.item.datetime.to}">${getTimeFromDate(hit.item.datetime.to)}</time>`;
    }

    let location;
    if(hit.item.location.length > 0){
        location = `<p class="mt-2 text-sm leading-4 font-bold text-slate-500"><span class="fa-solid fa-location-dot me-1"></span><span class="sr-only">Venue:</span>`;
        if(hit.item.location.length == 1){
            location += `<span>${hit.item.location[0].entryTitle}</span>`;
        }
        else if(hit.item.location.length > 1){
            location += `<span>Multiple venues</span>`;
        }
    }

    //now use the raw data to build the template
	return `
        <article class="flex flex-1 flex-col items-start">
            <div class="relative w-full">
                <img class="aspect-[16/9] w-full rounded-t-md bg-gray-100 object-cover sm:aspect-[2/1]" src="${PUBLIC_EUI_WEB + hit.item.image.asset.sys.uri}" alt="${hit.item.image.altText}">
            </div>
            <div class="w-full px-6 mb-6">
                <div class="mt-6 font-bold">
                    <p class="text-sm leading-4 font-bold text-slate-500">
                        <span class="fa-regular fa-calendar me-1"></span>    
                        <time datetime="${hit.item.datetime.from}">${formatDate(hit.item.datetime.from, true)}</time>
                        ${date}
                    </p>
                    ${location}
                    ${hit.item.euiUnit ? `<p class="text-sm text-cyan-700">${hit.item.euiUnit.entryTitle}</p>` : '' }    
                </div>
                <div class="group relative">
                    <h1 class="mt-3 text-base font-semibold leading-5 line-clamp-3">
                        <a href="?id=${hit.item.sys.slug}" title="Read: ${hit.item.entryTitle}">
                            <span class="absolute inset-0"></span>
                            ${hit.item.entryTitle}
                        </a>
                    </h1>
                    <div class="mt-3 line-clamp-3 text-sm leading-5 text-gray-600">
                        ${text_content}
                    </div>
                </div>
            </div>    
            <div class="relative w-full px-6 my-6 border-t mt-auto">
                <div class="flex flex-wrap items-center gap-x-2 gap-y-2 mt-4 text-xs">
                    <p class="font-bold text-xs ">Relevant for:</p>
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