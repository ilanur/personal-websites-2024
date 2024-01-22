<script>
    export let projectStructure;
    export let selectedFiles = [];

    function toggleFile(file) {
        const index = selectedFiles.indexOf(file);
        if (index !== -1) {
            selectedFiles.splice(index, 1);
        } else {
            selectedFiles.push(file);
        }
        selectedFiles = selectedFiles.slice(); // This is important to make Svelte aware of the change
    }
</script>

{#each projectStructure as file}
    <div
        class="file"
        class:selected={selectedFiles.includes(file)}
        on:keydown
        on:click={() => toggleFile(file)}
    >
        {file}
    </div>
{/each}

<style>
    .file {
        cursor: pointer;
    }
    .selected {
        background-color: #e5e7eb;
    }
</style>
