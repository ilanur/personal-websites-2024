<script>
    import Landing from '$lib/components/Landing.svelte';
    import Detail from '$lib/components/Detail.svelte';
    export let data;
    let entry = data.entry;
    console.log(entry.sys.contentTypeId)
    
    if(entry.sys.contentTypeId =="departmentsServices"){
          entry = entry.intranetPageContent;  
      }


</script>

{#if entry.sys.contentTypeId === 'euiIntranetLanding'}
    <Landing {entry} />
{:else if entry.sys.contentTypeId === 'euiIntranetDetail'}
    <Detail {entry} />
{:else}
    <h1>{entry.entryTitle}</h1>
{/if}
