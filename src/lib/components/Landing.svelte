<script>
    //intranet landings
    import AutomaticListings from '$lib/components/euiIntranetLanding/automaticListings.svelte';
    import HeaderImageLinks from '$lib/components/euiIntranetLanding/headerImageLinks.svelte';
    import QuickLinks from '$lib/components/euiIntranetLanding/quickLinks.svelte';

    export let entry;
    
    function getComponentLanding(type) {
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
    {#if getComponentLanding(item.type)}
        <svelte:component this={getComponentLanding(item.type)} {item} />
    {/if}
{/each} 