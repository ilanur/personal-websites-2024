<script>
	import generatePdf from '$lib/utils/generatePdf';

	const form = {
		title: '',
		subtitle: '',
		body: '',
		logo: null
	};

	function onFileSelect(e) {
		const file = e.target.files[0];
		const reader = new FileReader();

		reader.onload = (e) => {
			const result = e.target.result;
			const img = new Image();

			img.src = result;

			img.onload = () => {
				form.logo = {
					src: result,
					fileType: file.type.split('/')[1].toUpperCase(),
					aspectRatio: img.height / img.width
				};
			};
		};

		reader.readAsDataURL(file);
	}
</script>

<form on:submit|preventDefault={() => generatePdf(form)}>
	<div class="form-control">
		<label for="title">Title</label>
		<input bind:value={form.title} id="title" name="title" type="text" />
	</div>

	<div class="form-control">
		<label for="subtitle">Subtitle</label>
		<input bind:value={form.subtitle} id="subtitle" name="subtitle" type="text" />
	</div>

	<div class="form-control">
		<label for="body">Body</label>
		<textarea bind:value={form.body} id="body" name="body" type="text" />
	</div>

	<input on:change={onFileSelect} type="file" accept="image/jpeg,image/png" />

	<button class="btn">Generate PDF</button>
</form>

<style scoped>
	form {
		background-color: var(--eui-light-blue);
		padding: 2rem;
		border-radius: 1rem;
		min-width: 500px;
	}

	form button,
	form input[type='file'] {
		margin-top: 1rem;
	}
</style>
