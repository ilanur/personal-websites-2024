<script>
	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form;

	let groups = data.groups;
	let members = data.groupMembers;
	let searchQuery = data.searchQuery;

	$: if (form?.groups && form.groups !== groups) {
		groups = form.groups;
		searchQuery = form.searchQuery;
	}
	$: if (form?.groupMembers) {
		members = form.groupMembers;
	}

	let selectedGroups = [];
</script>

<form method="POST">
	<input
		name="searchQuery"
		type="text"
		bind:value={searchQuery}
		placeholder="Search groups by name"
	/>
	<button formaction="?/searchGroups">Search</button>

	<ul>
		{#each groups as group (group.id)}
			<!-- Use a key for each loop for better performance -->
			<li>
				<input
					type="checkbox"
					bind:checked={selectedGroups[group.id]}
					value={group.id}
					name="selectedGroups"
				/>
				{group.displayName}
			</li>
		{/each}
	</ul>

	<button formaction="?/fetchUsers">Get Users from Selected Groups</button>

	<!-- Display group members (existing code) -->

	{#if members.length > 0}
		<ul>
			{#each members as member}
				<li>{member.displayName} - {member.mail}</li>
			{/each}
		</ul>
	{/if}
</form>
