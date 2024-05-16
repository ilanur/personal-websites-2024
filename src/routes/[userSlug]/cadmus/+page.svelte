<script>
	export let publications;

</script>
<div class="publications-container">
	{#each publications as pub}
	  <div class="publication">
		<h3>{pub.title}</h3>
		<p>{pub.author}</p>
		<a href="{pub.url}" target="_blank">Read More</a>
		<p>Published: {pub.date}</p>
	  </div>
	{/each}
  </div>
  