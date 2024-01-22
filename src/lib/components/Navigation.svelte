<script>
	export let isLoggedIn;
</script>

<nav>
	<div>
		<a href="/">EUI Intranet</a>

		<div>
			<a href="/protected/dashboard">Dashboard</a>

			{#if isLoggedIn}
				<a class="btn" href="/auth/signout">logout</a>
			{:else}
				<a class="btn" href="/auth/signin">Login</a>
			{/if}
		</div>
	</div>
</nav>

<style scoped>
	nav {
		padding: 0.5rem;
	}

	nav > div {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		background-color: var(--eui-light-blue);
		padding: 1rem;
		border-radius: 0.5rem;
	}

	nav div > a + a {
		margin-left: 1rem;
	}
</style>
