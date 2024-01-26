<script>
    export let entry;

    function getComponentDetail(type) {
        switch (type) {
            case 'automaticListings':
                return AutomaticListings;
            case 'headerImageLinks':
                return HeaderImageLinks;
            case 'quickLinks':
                return QuickLinks;
            default:
                return null;
        }

    }

</script>


<h1>{entry.entryTitle}</h1>
<div>{@html entry.entryDescription}</div>

{#each entry.composer as item}
    {#if getComponentDetail(item.type)}
        <svelte:component this={getComponentDetail(item.type)} {item} />
    {/if}
{/each} 