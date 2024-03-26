import { PUBLIC_EUI_WEB } from '$env/static/public';
import { formatDate, formatTime, affiliationsGroupsAndCategory} from '$lib/utils/utils.js';

export const unitsConfig = {
    templateFunction: templateFunction,
    root_classes: 'my-6',
    list_classes: 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3',
    item_classes: 'col-span-1 flex flex-col rounded-lg bg-white shadow',
    select_form_classes: '',
    search_placeholder: 'Search',
    transformItems: (items) => {
      //if intra uri is not found do not show the item
      return items.filter(item => item.item.sys.allUris.filter(uri => uri.includes('eui-intranet')).length);
  }
}

function templateFunction(hit, html, components) {

  let intranet_uri = hit.item.sys.allUris.filter(uri => uri.includes('eui-intranet'));
  //remove en/eui-intranet/ from the uri
  intranet_uri = intranet_uri[0].replace('/en/eui-intranet/', '');
  intranet_uri = intranet_uri.replace('/en/intranet/', '');

  return `
    <article>
      <div class="flex flex-1 flex-col items-start">
        ${hit.item.workplace.entry ? `
          <div class="relative w-full">
            <img class="aspect-[16/9] w-full rounded-t-lg bg-gray-100 object-cover sm:aspect-[2/1]" src="${PUBLIC_EUI_WEB + hit.item.workplace.entry.image.asset.sys.uri}" alt="${hit.item.workplace.entry.image.altText}">
          </div>
        ` : '' }
        <div class="max-w-xl px-6">
          <div class="group relative">
            <h1 class="mt-3 text-base font-semibold  line-clamp-3 group-hover:text-gray-600">
              <a href="${intranet_uri}" title="Read: ${hit.item.entryTitle}">
                <span class="absolute inset-0"></span>
                ${hit.item.entryTitle}
              </a>
            </h1>
          </div>
          ${ hit.item.workplace.entry ? `
            <div class="relative my-3 text-sm">
              <p class="mb-6">
                <span class="fa-solid fa-location-dot me-1"></span>
                <span class="sr-only">Venue:</span>
                <a class="underline" href="https://www.google.com/maps/search/?api=1&query=${hit.item.workplace.entry.location.lat},${hit.item.workplace.entry.location.lon}" title="Go to: ${hit.item.workplace.entry.name}">${hit.item.workplace.entry.name}</a>
              </p>
              <!--${hit.item.workplace.entry.textualAddress}-->
            </div>
          ` : '' }
        </div>
      </div>
    </article>
  `;
}


/* RAW DATA
{
    "AlgoliaID": "web-unit",
    "ID": "5c6b5c52-1794-4101-bf5f-36e9d9743e8a",
    "item": {
        "isAcademicUnit": null,
        "peopleSection": [],
        "entryDescription": null,
        "sys": {
            "owner": "akostaki",
            "metadata": {},
            "workflow": {
                "id": "contensisEntryBasic",
                "state": "draft"
            },
            "dataFormat": "entry",
            "isPublished": true,
            "availableLanguages": [
                "en-GB"
            ],
            "contentTypeId": "departmentsServices",
            "allUris": [],
            "language": "en-GB",
            "uri": null,
            "version": {
                "publishedBy": "estrano",
                "createdBy": "akostaki",
                "created": "2018-02-27T16:51:05.7548599Z",
                "versionNo": "2.0",
                "modified": "2019-05-16T09:27:47.4451979Z",
                "modifiedBy": "estrano",
                "published": "2019-05-16T09:27:47.8142384Z"
            },
            "versionStatus": "published",
            "id": "5c6b5c52-1794-4101-bf5f-36e9d9743e8a",
            "projectId": "euiWebsite",
            "slug": "web-unit",
            "properties": {}
        },
        "newsSection": [],
        "preFooter": null,
        "educationalProgrammesSection": [],
        "researchSection": [],
        "codename": "webunit",
        "name": "Web Unit",
        "eventSection": [],
        "pageContent": null,
        "filteredname": null,
        "workplace": {
            "entry": {
                "image": {
                    "altText": "Badia Fiesolana",
                    "transformations": null,
                    "caption": "",
                    "asset": {
                        "entryDescription": null,
                        "sys": {
                            "dataFormat": "asset",
                            "contentTypeId": "image",
                            "id": "4c4f44aa-00bd-489f-916c-b9c5bebe4d6c",
                            "uri": "/Workarea/Training-Web-Unit-10-10-2019/images/Badia.xc492621c.jpg"
                        },
                        "entryTitle": "Badia"
                    }
                },
                "textualAddress": "<p>Via dei Roccettini 950014</p>\n<p>San Domenico di Fiesole (FI)</p>",
                "entryDescription": null,
                "servicesAndFacilities": [],
                "video": [],
                "sys": {
                    "owner": "akostaki",
                    "metadata": {},
                    "workflow": {
                        "id": "contensisEntryBasic",
                        "state": "versionComplete"
                    },
                    "dataFormat": "entry",
                    "isPublished": true,
                    "availableLanguages": [
                        "en-GB"
                    ],
                    "contentTypeId": "buildings",
                    "allUris": [],
                    "language": "en-GB",
                    "uri": null,
                    "version": {
                        "publishedBy": "eteagno",
                        "createdBy": "akostaki",
                        "created": "2018-02-27T12:55:38.5030028Z",
                        "versionNo": "8.0",
                        "modified": "2021-01-21T10:35:15.2854079Z",
                        "modifiedBy": "eteagno",
                        "published": "2021-01-21T10:42:07.0361211Z"
                    },
                    "versionStatus": "published",
                    "id": "70bd0517-dfc1-4713-a889-c64e51c39531",
                    "projectId": "euiWebsite",
                    "slug": "badia-fiesolana",
                    "properties": {}
                },
                "accessibilityDescription": null,
                "accessibilityStatus": [],
                "briefHistory": "The Badia Fiesolana is the EUI’s hub. Opened in 1976, it houses the office of the President, the office of the Secretary General, the Institute’s library, the Department of Political and Social Sciences, the Academic Service, the Real Estate and Facilities Service, part of the Budget and Financial Affairs Service, the Communications Service and the School of Transnational Governance (STG).\nBehind the row of member state flags stands a building of vibrant history which has played host to everyone from incurables to an army. Ph.D. researchers now walk where pagan cults once wandered, on a site which was also claimed by Christians for the first cathedral of Fiesole.\nThe latter group claimed that Christian martyrs were thrown into the well; an account that the founder of the present buildings tested by dipping his glove into the well and recovered it dripping with blood.",
                "bibliography": [],
                "name": "Badia Fiesolana",
                "location": {
                    "lon": 11.28289193,
                    "lat": 43.80277613
                },
                "wikipedia": null,
                "entryTitle": "Badia Fiesolana"
            },
            "office": null
        },
        "entryTitle": "Web Unit",
        "folderIDInTheCMSTree": null,
        "socialChannels": []
    },
    "objectID": "web-unit",
    "_highlightResult": {
        "ID": {
            "value": "5c6b5c52-1794-4101-bf5f-36e9d9743e8a",
            "matchLevel": "none",
            "matchedWords": []
        },
        "item": {
            "entryTitle": {
                "value": "Web Unit",
                "matchLevel": "none",
                "matchedWords": []
            }
        }
    },
    "__position": 1,
    "__hitIndex": 0
}
*/