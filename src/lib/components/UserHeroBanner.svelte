<script>
	import clsx from 'clsx'
	import UserHeroBannerSocials from '$lib/components/UserHeroBannerSocials.svelte'
	import HeroBannerGraphic from '$lib/components/graphics/HeroBannerGraphic.svelte'
	import HeroBannerGraphicSmall from '$lib/components/graphics/HeroBannerGraphicSmall.svelte'
	import IconUser from '$lib/components/icons/IconUser.svelte'

	let { personalWebsite, isSmall } = $props()
</script>

<div>
	<div
		class={clsx('relative bg-eui-blue pt-0 md:bg-[transparent]', {
			'md:py-8': isSmall,
			'md:py-20': !isSmall
		})}
	>
		{#if !isSmall}
			<HeroBannerGraphic
				class="absolute bottom-0 left-0 top-0 z-10 m-auto ml-5 hidden w-fit text-white opacity-10 xl:block"
			/>
		{:else}
			<HeroBannerGraphicSmall
				class="absolute bottom-0 left-0 top-0 z-10 m-auto ml-5 hidden text-white opacity-10 xl:block"
			/>
			<HeroBannerGraphicSmall
				class="absolute bottom-0 right-0 top-0 z-10 m-auto mr-5 hidden text-eui-blue xl:block"
			/>
		{/if}

		<div class="bottom-0 left-0 right-0 top-0 grid grid-cols-12 md:absolute">
			<div class="col-span-12 hidden bg-eui-blue md:col-span-8 md:block"></div>
			<div
				class="col-span-12 flex items-center justify-center bg-eui-gray pt-12 md:col-span-4 md:justify-start md:pt-0"
			>
				<div
					class={clsx(
						'overflow-hidden rounded-full border-8 border-white bg-eui-gray text-eui-blue md:mb-0 md:mr-9',
						{
							'-mb-[84px] size-[168px] min-w-[168px] md:-ml-[84px]': isSmall,
							'-mb-[125px] size-[250px] min-w-[250px] md:-ml-[150px] md:size-[300px] md:min-w-[300px]':
								!isSmall
						}
					)}
				>
					{#if personalWebsite.profileImage}
						<img src={personalWebsite.profileImage} alt="user" class="size-full object-cover" />
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
					<UserHeroBannerSocials
						socials={personalWebsite.socials}
						class="z-20 hidden flex-col space-y-4 border-l border-eui-gray-70 pl-4 text-eui-gray-70 md:flex"
					/>
				{/if}
			</div>
		</div>

		<div
			class={clsx('container relative z-10 grid grid-cols-12 pb-16', {
				'pt-[calc(84px_+_2rem)] md:py-2': isSmall,
				'pt-[calc(125px_+_2rem)] md:py-16': !isSmall
			})}
		>
			<div class="col-span-12 text-white md:col-span-8 md:pr-[150px] lg:pr-[200px] xl:pr-[300px]">
				<h1
					class={clsx({
						'text-3xl': isSmall
					})}
				>
					{personalWebsite.title}
				</h1>

				<div class={clsx({ 'mt-6': isSmall, 'mt-7': !isSmall })}>
					{@html personalWebsite.description}
				</div>

				<UserHeroBannerSocials
					socials={personalWebsite.socials}
					class={clsx(
						'mt-10 grid grid-cols-4 justify-between gap-12 border-t pt-10 md:w-fit md:gap-x-6 md:gap-y-0 md:pt-6',
						{
							'md:flex': isSmall,
							'md:hidden': !isSmall
						}
					)}
				/>
			</div>
		</div>
	</div>
</div>
