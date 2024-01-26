
<script>
  import {
    InstantSearch,
    SearchBox,
    Hits,
    Pagination,
    HitsPerPage,
  } from "svelte-algolia-instantsearch";
  import algoliasearch from "algoliasearch/lite";
  import { PUBLIC_ALGOLIA_ID, PUBLIC_ALGOLIA_KEY } from '$env/static/public';

  const searchClient = algoliasearch(PUBLIC_ALGOLIA_ID, PUBLIC_ALGOLIA_KEY);

</script>

<InstantSearch indexName="people" routing {searchClient}>
  <SearchBox />

  <Hits let:hit>
    {hit.cms.entryTitle}
  </Hits>

  <div style="display:flex;">
    <Pagination />
    <HitsPerPage
      items={[
        { value: 5, label: "Show 5 hits", default: true },
        { value: 10, label: "Show 10 hits" },
      ]}
    />
  </div>
</InstantSearch>
