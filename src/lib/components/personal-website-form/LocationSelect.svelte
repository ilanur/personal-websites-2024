<script>
	import { onMount } from 'svelte'
	import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public'
	import InputField from '$lib/components/form-elements/InputField.svelte'
	import * as GoogleMapsApiLoader from '@googlemaps/js-api-loader'

	let { personalWebsite = {} } = $props()

	let city = $state(personalWebsite?.city)
	let lat = $state(personalWebsite?.lat)
	let lng = $state(personalWebsite?.lng)

	onMount(async () => {
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

	function disableKeyPress(e) {
		if (e.keyCode == '13') {
			e.preventDefault()
		}
	}
</script>

<div>
	<input type="hidden" name="city" bind:value={city} />
	<InputField value={city} name="autocomplete" label="Address" onkeypress={disableKeyPress} />

	<div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-2">
		<InputField name="lat" label="Latitude" value={lat} readonly />
		<InputField name="lng" label="Longitude" value={lng} readonly />
	</div>
</div>
