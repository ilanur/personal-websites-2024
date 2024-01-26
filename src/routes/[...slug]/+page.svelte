<script>
    //import SectionFigures from './SectionFigures.svelte';
    //import SectionOverlapPillars from './SectionOverlapPillars.svelte';
    //import CardWithTitleImageDescriptionAndURL from './CardWithTitleImageDescriptionAndURL.svelte';
    // ... 

    export let data;
    let entry = data.entry;
    console.log(entry)

    function getComponent(type) {
        switch (type) {
            case 'sectionFigures':
                return SectionFigures;
            case 'sectionOverlapPillars':
                return SectionOverlapPillars;
            case 'cardWithTitleImageDescriptionAndURL':
                return CardWithTitleImageDescriptionAndURL;
            // ...
            default:
                return null;
        }
    }
</script>

<h1>{entry.entryTitle}</h1>
<div>{@html entry.entryDescription}</div>

{#each entry.composer as item}
    {#if getComponent(item.type)}
        <svelte:component this={getComponent(item.type)} {item} />
    {/if}
{/each}
