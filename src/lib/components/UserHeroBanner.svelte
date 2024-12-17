<script>
	import { getCanvasHTML, getCorrectEntryPhoto } from '$lib/utils/contensis/client'
	import { ofetch } from 'ofetch'
	import clsx from 'clsx'
	import UserHeroBannerSocials from '$lib/components/UserHeroBannerSocials.svelte'
	import HeroBannerGraphic from '$lib/components/graphics/HeroBannerGraphic.svelte'
	import EditableContent from '$lib/components/EditableContent.svelte'

	let { personalWebsite, isSmall, authUser } = $props()

	let isAuthUserWebsite = $derived(personalWebsite.people.email === authUser?.email)
	let isAdmin = $derived(authUser?.role?.includes('admin'))

	async function updateDescription(canvas) {
		try {
			const html = getCanvasHTML(canvas)
			const personalWebsiteEntry = { ...personalWebsite }

			personalWebsiteEntry.description = html

			await ofetch('/api/contensis/entries/update', {
				method: 'PUT',
				body: {
					entry: personalWebsiteEntry,
					updatedFields: ['description']
				}
			})
		} catch (e) {
			console.error('Error updating description', e)
		}
	}
</script>

<div class={clsx('relative overflow-hidden bg-eui-dark-blue-500 pt-0 md:bg-[transparent]', { 'md:py-8': isSmall, 'md:py-12': !isSmall })}>
	{#if !isSmall}
		<HeroBannerGraphic class="absolute bottom-0 left-0 top-0 z-10 m-auto ml-5 hidden w-fit text-white opacity-10 xl:block" />
	{/if}
	<div
		class={clsx('container relative z-10 grid grid-cols-12 pt-8', {
			'pb-[calc(62.5px_+_2rem)] md:py-0': isSmall,
			'pb-[calc(100px_+_2rem)] md:py-16': !isSmall
		})}
	>
		<div
			class={clsx('col-span-12 text-center text-white md:text-start', {
				'md:col-span-8 md:pr-[62.5px]': isSmall,
				'md:col-span-8 md:pr-[150px] lg:pr-[200px] xl:pr-[300px]': !isSmall
			})}
		>
			<h1>{personalWebsite.title} <span class="sr-only">personal website</span></h1>
			<EditableContent
				class="[&_a]:text-white"
				editorId="description-editor"
				htmlContent={personalWebsite.description ?? ''}
				enabled={isAuthUserWebsite || isAdmin}
				toolbar={['bold', 'italic', 'link']}
				onSave={updateDescription}
			/>
		</div>
	</div>
	<div class="bottom-0 left-0 right-0 top-0 grid grid-cols-12 md:absolute">
		<div class="col-span-12 hidden bg-eui-dark-blue-500 md:col-span-8 md:block"></div>
		<div
			class="col-span-12 flex flex-col items-center justify-center bg-intranet-gray-100 pb-12 md:col-span-4 md:flex-row md:justify-start md:pb-0"
		>
			<div
				class={clsx('overflow-hidden rounded-full bg-white ring-white md:mr-6 md:mt-0', {
					'-mt-[62.5px] size-[125px] min-w-[125px] border-4 md:-ml-[62.5px]': isSmall,
					'-mt-[100px] size-[200px] min-w-[200px] ring-8 md:-ml-[125px] xl:-ml-[150px] xl:size-[300px] xl:min-w-[300px] ': !isSmall
				})}
			>
				<img alt="user" class="size-full object-cover" src={getCorrectEntryPhoto(personalWebsite, personalWebsite.people)} />
			</div>
			{#if personalWebsite.socialMedia.length}
				<UserHeroBannerSocials
					socials={personalWebsite.socialMedia}
					class={clsx('z-20 mt-4 flex max-h-[300px] gap-4 border-t border-slate-400 pt-4 md:mt-0 md:flex-wrap md:border-t-0 md:pt-0', {
						'': isSmall,
						'md:flex-col md:border-s md:ps-3': !isSmall
					})}
				/>
			{/if}
		</div>
	</div>
</div>
