<script>
	import clsx from 'clsx'
	import UserHeroBannerSocials from '$lib/components/UserHeroBannerSocials.svelte'
	import HeroBannerGraphic from '$lib/components/graphics/HeroBannerGraphic.svelte'
	import HeroBannerGraphicSmall from '$lib/components/graphics/HeroBannerGraphicSmall.svelte'
	import IconUser from '$lib/components/icons/IconUser.svelte'
	import { getThumbnail } from '$lib/utils/utils'

	let { personalWebsite, isSmall } = $props()
</script>

<div class={clsx('relative overflow-hidden bg-eui-dark-blue-500 pt-0 md:bg-[transparent]', { 'md:py-8': isSmall, 'md:py-12': !isSmall })}>
	{#if !isSmall}
		<HeroBannerGraphic class="absolute bottom-0 left-0 top-0 z-10 m-auto ml-5 hidden w-fit text-white opacity-10 xl:block" />
	{/if}
	<div class={clsx('container relative z-10 grid grid-cols-12 pt-8', { 'pb-[calc(62.5px_+_2rem)] md:py-0': isSmall, 'pb-[calc(125px_+_2rem)] md:py-16': !isSmall })}>
		<div class={clsx('col-span-12 text-center text-white md:text-start', { 'md:col-span-8 md:pr-[62.5px]': isSmall, 'md:col-span-8 md:pr-[150px] lg:pr-[200px] xl:pr-[300px]': !isSmall })}>
			<h1 class="mt-0 text-3xl">{personalWebsite.title}</h1>
			<div class="mt-4">
				{@html personalWebsite.description}
			</div>
		</div>
	</div>
	<div class="bottom-0 left-0 right-0 top-0 grid grid-cols-12 md:absolute">
		<div class="col-span-12 hidden bg-eui-dark-blue-500 md:col-span-8 md:block"></div>
		<div class="col-span-12 flex flex-col items-center justify-center bg-intranet-gray-100 pb-12 md:col-span-4 md:flex-row md:justify-start md:pb-0">
			<div class={clsx('overflow-hidden rounded-full border-white bg-intranet-gray-100 text-eui-dark-blue-600 md:mr-6 md:mt-0', { '-mt-[62.5px] size-[125px] min-w-[125px] border-4 md:-ml-[62.5px]': isSmall, '-mt-[125px] size-[250px] min-w-[250px] border-8 md:-ml-[150px] md:size-[300px] md:min-w-[300px]': !isSmall })}>
				<img alt="user" class="size-full object-cover" src={getThumbnail(personalWebsite.image)} />
			</div>
			{#if personalWebsite.socialMedia.length}
				<UserHeroBannerSocials socials={personalWebsite.socialMedia} class={clsx('z-20 mt-4 flex max-h-[300px] gap-4 border-t border-slate-400 pt-4 md:mt-0 md:flex-wrap md:border-t-0 md:ps-6 md:pt-0', { '': isSmall, 'md:flex-col md:border-s': !isSmall })} />
			{/if}
		</div>
	</div>
</div>

<!--
<div>
	<div
		class={clsx('relative bg-eui-dark-blue-500 pt-0 md:bg-[transparent]', {
			'md:py-8': isSmall,
			'md:py-20': !isSmall
		})}
	>
		{#if !isSmall}
			<HeroBannerGraphic class="absolute bottom-0 left-0 top-0 z-10 m-auto ml-5 hidden w-fit text-white opacity-10 xl:block" />
		{:else}
			<HeroBannerGraphicSmall class="absolute bottom-0 left-0 top-0 z-10 m-auto ml-5 hidden text-white opacity-10 xl:block" />
			<HeroBannerGraphicSmall class="absolute bottom-0 right-0 top-0 z-10 m-auto mr-5 hidden text-eui-dark-blue-600 xl:block" />
		{/if}

		<div class="bottom-0 left-0 right-0 top-0 grid grid-cols-12 md:absolute">
			<div class="col-span-12 hidden bg-eui-dark-blue-500 md:col-span-8 md:block"></div>
			<div class="col-span-12 flex items-center justify-center bg-intranet-gray-100 pt-12 md:col-span-4 md:justify-start md:pt-0">
				<div
					class={clsx('overflow-hidden rounded-full border-8 border-white bg-intranet-gray-100 text-eui-dark-blue-600 md:mb-0 md:mr-9', {
						'-mb-[84px] size-[168px] min-w-[168px] md:-ml-[84px]': isSmall,
						'-mb-[125px] size-[250px] min-w-[250px] md:-ml-[150px] md:size-[300px] md:min-w-[300px]': !isSmall
					})}
				>
					{#if personalWebsite.image}
						<img src={getThumbnail(personalWebsite.image)} alt="user" class="size-full object-cover" />
					{:else}
						<div
							class={clsx({
								'p-8': isSmall,
								'p-16': !isSmall
							})}
						>
							<IconUser />
						</div>
					{/if}
				</div>

				{#if !isSmall}
					<UserHeroBannerSocials socials={personalWebsite.socialMedia} class="z-20 hidden max-h-[300px] flex-col flex-wrap gap-4 md:flex" />
				{/if}
			</div>
		</div>

		<div
			class={clsx('container relative z-10 grid grid-cols-12 pb-16', {
				'flex min-h-[180px] items-center pt-[calc(84px_+_2rem)] md:py-2': isSmall,
				'pt-[calc(125px_+_2rem)] md:py-16': !isSmall
			})}
		>
			<div class="col-span-12 text-white md:col-span-8 md:pr-[150px] lg:pr-[200px] xl:pr-[300px]">
				<h1 class={clsx('mt-0', { 'text-3xl': isSmall })}>
					{personalWebsite.title}
				</h1>

				<div class={clsx({ 'mt-6': isSmall, 'mt-7': !isSmall })}>
					{@html personalWebsite.description}
				</div>

				{#if personalWebsite.socialMedia.length}
					<UserHeroBannerSocials
						socials={personalWebsite.socialMedia}
						class={clsx(
							'mt-10 grid grid-cols-4 justify-between gap-12 border-t pt-10 sm:grid-cols-6 md:w-fit md:gap-x-6 md:gap-y-0 md:pt-6',
							{
								'md:flex': isSmall,
								'md:hidden': !isSmall
							}
						)}
					/>
				{/if}
			</div>
		</div>
	</div>
</div>
-->
