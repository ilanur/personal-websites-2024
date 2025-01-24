<script>
	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import { PUBLIC_EUI_PERSONAL_WEBSITE_URL } from '$env/static/public'
	import InputField from '$lib/components/form-elements/InputField.svelte'
	import SelectField from '$lib/components/form-elements/SelectField.svelte'
	import Button from '$lib/components/Button.svelte'
	import CheckboxField from '$lib/components/form-elements/CheckboxField.svelte'
	import LocationSelect from '$lib/components/personal-website-form/LocationSelect.svelte'
	import PwFormPhotoUpload from './PwFormPhotoUpload.svelte'

	let { user, personalWebsite, nationalities = [] } = $props()

	console.log('PersonalWebsite', personalWebsite)

	let formLoading = $state(false)
	let formErrors = $state()
	let cv = $state(personalWebsite?.cv)
	let cvChanged = $state(false)
	let publishedState = $state(personalWebsite?.sys.versionStatus ? true : false)
	let pagesToPublish = $state({
		publications: checkIfPagePublished('publications'),
		'publications-in-cadmus': personalWebsite?.enableCadmusPublications,
		research: checkIfPagePublished('research'),
		'work-in-progress': checkIfPagePublished('work-in-progress'),
		teaching: checkIfPagePublished('teaching')
	})

	function checkIfPagePublished(slug) {
		const page = personalWebsite?.pages.find((el) => el.pageSlug === slug)
		return page ? (page.sys.versionStatus === 'published' ? true : false) : false
	}

	function getSocialMedia(social) {
		return personalWebsite?.socialMedia.find((el) => el.type === social)
	}

	function onCvChange() {
		cvChanged = true
		cv = null
	}
</script>

<form
	method="POST"
	enctype="multipart/form-data"
	use:enhance={() => {
		formLoading = true
		formErrors = null

		return async ({ update, result }) => {
			await update({ reset: false })
			formLoading = false
			const fErrors = result.data?.formErrors ?? null

			if (result.type === 'failure' && fErrors) {
				formErrors = fErrors
			}

			if (result.status === 200 && result.data.createdPersonalWebsite) {
				goto(`/${result.data.createdPersonalWebsite.websiteSlug}`)
			}
		}
	}}
>
	<div class="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
		<!-- General settings -->
		<div class="flex flex-col">
			<p class="mb-4 font-bold">General settings</p>

			<div class="flex flex-col">
				<InputField
					class="col-span-2 sm:col-span-1"
					name="title"
					label="Title of your personal website"
					value={user.nameAndSurnameForTheWeb}
					readonly
					error={formErrors?.title}
				/>

				<div class="grid grid-cols-1 items-end gap-4 md:grid-cols-2 md:gap-2">
					<InputField name="websiteURL" label="Your personal website URL" value={`${PUBLIC_EUI_PERSONAL_WEBSITE_URL}/`} readonly />
					<InputField name="slug" label="Slug" value={user.sys.slug} placeholder="website slug" error={formErrors?.slug} readonly />
				</div>

				<InputField name="email" type="email" label="E-mail" value={user.euiEmail} readonly />

				<!-- NATIONALITY SELECT -->
				<SelectField
					name="nationality"
					options={nationalities}
					label="Nationality"
					placeholder="Select your nationality"
					valuePropertyName="en-GB"
					textPropertyName="en-GB"
					value={personalWebsite?.nationality.nationality[0]}
					error={formErrors?.nationality}
				/>

				<!-- SELECT LOCATION -->
				<LocationSelect {personalWebsite} error={formErrors?.city} />
			</div>

			<hr class="mb-6 mt-2" />

			<!-- CV -->
			<div>
				<input type="hidden" name="cvChanged" bind:value={cvChanged} />
				<p class="mb-4 font-bold">Curriculum vitae</p>

				{#if cv}
					<div class="flex items-center gap-x-2">
						<i class="fa-solid fa-file"></i>
						{cv.title}
						<Button class="ml-4 !text-tiny" type="button" onclick={onCvChange}>Change CV</Button>
					</div>
				{:else}
					<input title="Choose CV" type="file" name="cvUpload" accept="application/pdf" />
				{/if}
			</div>

			<hr class="my-6" />

			<div class="grid gap-x-2 md:grid-cols-2">
				<div>
					<p class="mb-4 font-bold">Personal website photo</p>
					<PwFormPhotoUpload {personalWebsite} {user} />
				</div>
			</div>
		</div>

		<!-- Socials -->
		<div>
			<div>
				<p class="mb-4 font-bold">Socials</p>
				<div class="grid grid-cols-1 gap-x-2 xl:grid-cols-2">
					<InputField name="Linkedin" type="text" label="LinkedIn" value={getSocialMedia('Linkedin')?.url} />
					<InputField name="Facebook" type="text" label="Facebook" value={getSocialMedia('Facebook')?.url} />
					<InputField name="Twitter" type="text" label="Twitter" value={getSocialMedia('Twitter')?.url} />
					<InputField name="Instagram" type="text" label="Instagram" value={getSocialMedia('Instagram')?.url} />
					<InputField name="Youtube" type="text" label="Youtube" value={getSocialMedia('Youtube')?.url} />
					<InputField name="Blog" type="text" label="Blog" value={getSocialMedia('Blog')?.url} />
					<InputField name="Flickr" type="text" label="Flickr" value={getSocialMedia('Flickr')?.url} />
					<InputField name="ResearchGate" type="text" label="ResearchGate" value={getSocialMedia('ResearchGate')?.url} />
					<InputField name="Academia.edu" type="text" label="Academia.edu" value={getSocialMedia('Academia.edu')?.url} />
					<InputField name="Bluesky" type="text" label="Bluesky" value={getSocialMedia('Bluesky')?.url} />
				</div>
			</div>

			<hr class="my-6" />

			<!-- PUBLISH/UNPUBLISH PAGES -->
			<div>
				<p class="mb-4 font-bold">Publish/unpublish optional pages</p>

				<div class="space-y-1">
					<input type="hidden" name="pagesToPublish" value={JSON.stringify(pagesToPublish)} />
					<CheckboxField bind:value={pagesToPublish.publications} name="publications" label="List of publications" />
					<CheckboxField bind:value={pagesToPublish['publications-in-cadmus']} name="publicationsInCadmus" label="Publications in cadmus" />
					<CheckboxField bind:value={pagesToPublish.research} name="research" label="Research" />
					<CheckboxField bind:value={pagesToPublish['work-in-progress']} name="workInProgress" label="Work in progress" />
					<CheckboxField bind:value={pagesToPublish.teaching} name="teaching" label="Teaching" />
				</div>
			</div>

			<hr class="my-6" />

			<div>
				<p class="mb-4 font-bold">Publish/unpublish your personal website</p>
				<p class="text-tiny [&_a]:text-eui-light-blue-600/85">
					While the website is unpublished, it can only be seen by you. Once published, your website will be live and visible by everybody,
					including search engines. Your website will be listed on <a href={PUBLIC_EUI_PERSONAL_WEBSITE_URL}>me.eui.eu</a> after a manual check.
				</p>

				<CheckboxField bind:value={publishedState} class="mt-4" name="pwPublishState" label="Publish/unpublish personal website" />
			</div>
		</div>
	</div>

	<Button class="mt-10" type="submit" loading={formLoading}>Submit</Button>
</form>
