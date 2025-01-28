import { redirect } from '@sveltejs/kit'
import { DeliveryClient } from '$lib/utils/contensis/_clients'
import { PUBLIC_EUI_WEB } from '$env/static/public'

export async function load({ params, locals, cookies }) {
	if (!params.userSlug) throw redirect(302, '/')

	const session = await locals.auth()

	const results = await DeliveryClient.entries.search(
		{
			where: [
				{ field: 'sys.contentTypeId', equalTo: 'personalWebsites' },
				{ field: 'sys.versionStatus', equalTo: 'published' },
				{ field: 'websiteSlug', equalTo: params.userSlug }
			]
		},
		1
	)

	const personalWebsiteId = results.items.length ? results.items[0].sys.id : null
	const personalWebsitePages = await DeliveryClient.entries.search(
		{
			where: [
				{ field: 'sys.contentTypeId', equalTo: 'personalWebsitePage' },
				{ field: 'sys.versionStatus', equalTo: 'published' },
				{ field: 'personalWebsite.sys.id', equalTo: personalWebsiteId }
			]
		},
		1
	)

	// Get blog posts from the user
	const query = {
		where: [
			{ field: 'sys.contentTypeId', equalTo: 'personalWebsitesBlogPost' },
			{ field: 'sys.versionStatus', equalTo: 'published' },
			{ field: 'personalWebsite.sys.id', equalTo: personalWebsiteId }
		]
	}

	const personalWebsite = results.items.length ? results.items[0] : null
	const blogPosts = await DeliveryClient.entries.search(query)
	const hasBlog = blogPosts.items.length > 0

	if (personalWebsite.image && cookies.get('newImageUploaded') && personalWebsite.image?.asset?.sys?.uri !== cookies.get('newImageUploaded')) {
		await fetch(
			`https://live-eui.cloud.contensis.com/NewGenerationSite/system/purge-cache-manually.aspx?url=${PUBLIC_EUI_WEB}${personalWebsite.image.asset.sys.uri}`
		)

		await fetch(
			`https://preview-eui.cloud.contensis.com/NewGenerationSite/system/purge-cache-manually.aspx?url=${PUBLIC_EUI_WEB}${personalWebsite.image.asset.sys.uri}`
		)

		cookies.delete('newImageUploaded', { path: '/' })
	}

	return {
		personalWebsite,
		personalWebsitePages: personalWebsitePages.items,
		personalWebsiteBelongsToAuthUser: session?.user.email.toLowerCase() === personalWebsite?.people.euiEmail.toLowerCase(),
		hasBlog: hasBlog
	}
}
