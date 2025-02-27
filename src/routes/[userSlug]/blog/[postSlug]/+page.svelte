<script>
	import dayjs from 'dayjs'
	import EditableContent from '$lib/components/EditableContent.svelte'
	import { PUBLIC_CONTENSIS_URL } from '$env/static/public'
	import { page } from '$app/stores'
	import { fileToBase64, getThumbnail } from '$lib/utils/utils'
	import { getCanvasHTML, updateEntryByField } from '$lib/utils/contensis/client'
	import PhotoUploader from '$lib/components/PhotoUploader.svelte'

	let { data } = $props()

	console.log('data', data)

	let audioUrl = $state(null)

	const user = $derived.by(() => $page.data.session?.user)
	const currentUrl = $derived.by(() => $page.url.href)

	// Add SEO data
	const seo = {
		title: data.post.entryTitle,
		description: data.post.entryDescription || 'Default description if none is provided'
	}

	const editUrl = `${PUBLIC_CONTENSIS_URL}/app/projects/euiWebsite/entries/${data.post.sys.id}`

	const generateSpeechMailBody = 'Please generate the speech for the following page:' + data.post.entryTitle
	const generateSpeechMailToWebunit = 'mailto:webunit@eui.eu?subject=EUIdeas%20-%20Generate%20Speech&body=' + generateSpeechMailBody

	const generateTopicsMailBody = 'Please generate topics for the following page:' + data.post.entryTitle
	const generateTopicsMailToWebunit = 'mailto:webunit@eui.eu?subject=EUIdeas%20-%20Generate%20Topics&body=' + generateTopicsMailBody

	if (data.post.audioTranscription && data.post.audioTranscription.file?.sys.uri) {
		audioUrl = `${PUBLIC_EUI_BASE_URL}/${data.post.audioTranscription.file.sys.uri}`
	}

	async function onPhotoSelect(photo) {
		const folderId = 'Content-Types-Assets/PersonalWebsites/Blogs'
		const altText = `Cover for blogpost "${data.post.title}"`
		const base64 = await fileToBase64(photo)
		const metadata = {
			folderId,
			altText,
			filename: photo.name
		}

		const updatedPhoto = {
			base64,
			metadata
		}

		await updateEntryByField(data.post, 'mainImage', JSON.stringify(updatedPhoto))
	}
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
</svelte:head>

<article>
	<header>
		<div class="max-w-2xl 2xl:mx-auto">
			<p class="mb-6 text-sm">
				{#if data.post.categories.length > 0}
					<span class="item-center inline-flex leading-none">
						<span class="fa-sharp fa-solid fa-folders me-2 text-eui-light-blue-500"></span>
						{#each data.post.categories as category, i}
							<span>
								{category.entryTitle}
								{#if i < data.post.categories.length - 1},{/if}
							</span>
						{/each}
					</span>
				{/if}

				{#if data.post.categories.length > 0 && data.post.tags.length > 0}
					<span class="mx-4">|</span>
				{/if}

				{#if data.post.tags.length > 0}
					<span class="item-center inline-flex leading-none">
						<span class="fa-sharp fa-solid fa-tag me-2 text-eui-light-blue-500"></span>

						{#each data.post.tags as tag, i}
							<span>
								{tag.entryTitle}{#if i < data.post.tags.length - 1},{/if}
							</span>
						{/each}
					</span>
				{/if}
			</p>

			<EditableContent
				editorId="title"
				class={data.editAllowed ? 'mb-10' : 'mb-4'}
				htmlContent={data.post ? `<h1 class="text-3xl">${data.post.title}</h1>` : ''}
				enabled={data.editAllowed}
				returnType="text"
				onSave={(value) => updateEntryByField(data.post, 'title', value)}
			/>

			{#if audioUrl}
				<audio controls class="mb-4">
					<source src={audioUrl} type="audio/mpeg" />
					Your browser does not support the audio element.
				</audio>
			{/if}

			<EditableContent
				editorId="description"
				htmlContent={data.post?.description ?? ''}
				enabled={data.editAllowed}
				returnType="html"
				onSave={(value) => updateEntryByField(data.post, 'description', value)}
			/>

			<div class="relative mb-6 border-b border-slate-200 text-right">
				<div class="flex justify-end">
					<div class="flex translate-y-1/2 items-center gap-x-4 bg-white ps-4">
						<p>
							<a
								href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`}
								title="Share on X"
								target="_blank"
								rel="noopener"
							>
								<span class="sr-only">Share on X</span>
								<span class="fa-brands fa-x-twitter" aria-hidden="true"></span>
							</a>
						</p>
						<p>
							<a
								href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
								title="Share on Facebook"
								target="_blank"
								rel="noopener"
							>
								<span class="sr-only">Share on Facebook</span>
								<span class="fa-brands fa-facebook" aria-hidden="true"></span>
							</a>
						</p>
						<p>
							<a
								href={`http://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}`}
								title="Share on LinkedIn"
								target="_blank"
								rel="noopener"
							>
								<span class="sr-only">Share on LinkedIn</span>
								<span class="fa-brands fa-linkedin" aria-hidden="true"></span>
							</a>
						</p>
					</div>
				</div>
			</div>

			{#if user}
				<div class="mt-4">
					<a href={editUrl} target="_blank" class="px-4 text-eui-light-blue-500 hover:underline"> Edit this page </a>
					<a href={generateSpeechMailToWebunit} class="px-4 text-eui-light-blue-500 hover:underline"> Generate speech </a>
					<a href={generateTopicsMailToWebunit} class="px-4 text-eui-light-blue-500 hover:underline"> Generate topics </a>
				</div>
			{/if}
		</div>
	</header>

	<div class="max-w-2xl 2xl:mx-auto">
		<figure>
			{#if data.editAllowed}
				<PhotoUploader imgContainerClass="w-full" photo={getThumbnail(data.post.entryThumbnail)} {onPhotoSelect} />
			{:else if data.post.entryThumbnail}
				<img class="h-auto w-full" src={getThumbnail(data.post.entryThumbnail)} alt={data.post.entryThumbnail.altText} />
			{:else}
				<div class="flex size-full min-h-60 items-center justify-center bg-intranet-gray-100 object-cover">
					<i class="fa-solid fa-image fa-xl text-eui-dark-blue-600"></i>
				</div>
			{/if}
			<figcaption></figcaption>
		</figure>

		<p class="my-6 text-sm">
			Published on: {dayjs(data.post.publishingDate).format('DD/MM/YYYY')}
		</p>

		{#if data.post.themesTopicGenerator?.added?.length > 0}
			<div class="mb-4 flex items-center">
				<p class="me-2 text-sm">Topics:</p>
				<div class="flex flex-wrap gap-2">
					{#each data.post.themesTopicGenerator.added as topic}
						<a href={topic.url} class="group inline-block rounded-full bg-eui-light-blue-500 px-2 py-1 text-xs text-white">
							{topic.entryTitle}
						</a>
					{/each}
				</div>
			</div>
		{/if}

		<div class="canvas-content mt-6">
			<EditableContent
				editorId="canvas"
				htmlContent={data.post?.canvas ? getCanvasHTML(data.post.canvas) : ''}
				enabled={data.editAllowed}
				onSave={(value) => updateEntryByField(data.post, 'canvas', value)}
			/>
		</div>
	</div>
</article>
