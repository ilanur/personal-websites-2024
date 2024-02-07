<script>
	import algoliasearch from 'algoliasearch';

	const client = algoliasearch('E2MU8FKW2W', '9339618f748f6a3d7547b4f15cb4aa53');
	const index = client.initIndex('mwp_fellows');

	// Function that fetch data from me.eui.eu
	async function fetchData() {
		try {
			const response = await fetch('https://me.eui.eu/wp-json/eui_multisite/v1/eui_network_users?role=mwp_fellows_map&1234', {
				headers: {}
			});

			const json = await response.json();
			await pushObjectsToAlgoliaIndex(json);

			return json;
		} catch (error) {
			console.error(error);
		}
	}

	async function pushObjectsToAlgoliaIndex(objects) {
		try {
			const response = await index.saveObjects(objects);
			console.log('Objects added to Algolia index:', response);
		} catch (error) {
			console.error('Error adding objects to Algolia index:', error);
		}
	}
</script>

{#await fetchData()}
	<p>Loading...</p>
{:then users}
	<ul>
		{#each users as user}
			<li>{user.first_name} {user.last_name}</li>
		{/each}
	</ul>
{/await}
