<script>
import { browser } from '$app/environment';
import algoliasearch from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js';
import { searchBox, hits } from 'instantsearch.js/es/widgets';
import {setConfigs } from '$lib/utils/algolia/indexesConfig';

if (browser) {
  
let appId = 'E2MU8FKW2W';
let apiKey = '6bc5cd451c16fa8b817e006c63ef660c';

const searchClient = algoliasearch(appId, apiKey);
let indexName = 'people';
const {currentTemplateFunction, currentTransformItems, root_classes, list_classes, item_classes } = setConfigs(indexName); 

console.log(list_classes);
let not_found_classes = 'text-center text-2xl text-gray-500';

const search = instantsearch({
  indexName: indexName,
  searchClient,
});

search.addWidgets([
  searchBox({
    container: "#searchbox"
  })
]);

search.addWidgets([
    hits({
      container: '#hits',
      templates: {
        item(hit, { html, components }) {
            return currentTemplateFunction(hit, html, components);
          },
          empty(results, { html }) {
            return html`<div class="${not_found_classes}">No results for <q><strong>${results.query}</strong></q></div>`;
          },      
      },
      transformItems(items, {results}) {
        return currentTransformItems(items, {results});
      },
      cssClasses: {
        root: root_classes,
        list: list_classes,
        item : item_classes,
      },
   
    })
    ]);

search.start();
}
</script>

<div id="searchbox"></div>
<div id="hits"></div>
