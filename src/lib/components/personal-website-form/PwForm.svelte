<script>
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import { PUBLIC_EUI_PERSONAL_WEBSITE_URL, PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public'
	import * as GoogleMapsApiLoader from '@googlemaps/js-api-loader'
	import InputField from '$lib/components/form-elements/InputField.svelte'
	import SelectField from '$lib/components/form-elements/SelectField.svelte'
	import Button from '$lib/components/Button.svelte'
	import CheckboxField from '$lib/components/form-elements/CheckboxField.svelte'
	import PwFormPhotoUpload from '$lib/components/personal-website-form/PwFormPhotoUpload.svelte'

	let { user, personalWebsite } = $props()

	let formLoading = $state(false)
	let formErrors = $state()
	let city = $state(personalWebsite?.city)
	let lat = $state(personalWebsite?.lat)
	let lng = $state(personalWebsite?.lng)
	let nationalities = $state()
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

	onMount(async () => {
		try {
			const res = await fetch('/api/nationalities')
			const data = await res.json()

			if (data.nationalities) {
				nationalities = data.nationalities
			}
		} catch (err) {
			console.error('Error fetching nationalities:', err)
		}

		try {
			const loader = new GoogleMapsApiLoader.Loader({
				apiKey: PUBLIC_GOOGLE_MAPS_API_KEY,
				version: 'weekly',
				libraries: ['places']
			})

			const library = await loader.importLibrary('places')
			const autoComplete = new library.Autocomplete(document.getElementById('autocomplete'), {
				fields: ['geometry', 'name', 'formatted_address', 'address_components']
			})

			autoComplete.addListener('place_changed', (e) => {
				const place = autoComplete.getPlace()

				if (place.address_components) {
					const address = place.address_components

					city = address.filter((f) => JSON.stringify(f.types) === JSON.stringify(['locality', 'political']))[0].short_name
					lat = place.geometry.location.lat()
					lng = place.geometry.location.lng()
				}
			})
		} catch (e) {
			console.log(`Error loading map: ${e}`)
		}
	})

	function checkIfPagePublished(slug) {
		const page = personalWebsite?.pages.find((el) => el.pageSlug === slug)
		return page ? (page.sys.versionStatus === 'published' ? true : false) : false
	}

	function disableKeyPress(e) {
		if (e.keyCode == '13') {
			e.preventDefault()
		}
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
		<div class="flex flex-col gap-4">
			<p class="font-bold">General settings</p>

			<InputField
				class="col-span-2 sm:col-span-1"
				name="title"
				label="Title of your personal website"
				value={user.nameAndSurnameForTheWeb}
				readonly
			/>

			<div class="grid grid-cols-1 items-end gap-4 md:grid-cols-2 md:gap-2">
				<InputField name="websiteURL" label="Your personal website URL" value={`${PUBLIC_EUI_PERSONAL_WEBSITE_URL}/`} readonly />
				<InputField name="slug" label="Slug" value={user.sys.slug} placeholder="website slug" error={formErrors?.slug} />
			</div>

			<InputField name="email" type="email" label="E-mail" value={user.euiEmail} readonly />

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

			<div>
				<input type="hidden" name="city" bind:value={city} />
				<InputField value={city} name="autocomplete" label="Address" onkeypress={disableKeyPress} />

				<div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-2">
					<InputField name="lat" label="Latitude" value={lat} readonly />
					<InputField name="lng" label="Longitude" value={lng} readonly />
				</div>
			</div>

			<!-- CV -->
			<div>
				<input type="hidden" name="cvChanged" bind:value={cvChanged} />
				<p class="my-4 font-bold">Curriculum vitae</p>

				{#if cv}
					<div class="flex items-center gap-x-2">
						<i class="fa-solid fa-file"></i>
						{cv.title}
						<Button class="ml-4 !text-tiny" type="button" onclick={onCvChange}>Change CV</Button>
					</div>
				{:else}
					<input title="Choose CV" type="file" name="cvUpload" accept="application/pdf" required />
				{/if}
			</div>

			<div class="mt-4 grid gap-x-2 md:grid-cols-2">
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
				<div class="grid grid-cols-1 gap-x-2 gap-y-4 xl:grid-cols-2">
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
