import { ManagementClient } from '$lib/utils/contensis/_clients.js'
import { getPersonalWebsiteByEmail } from '$lib/utils/contensis/server.js'
import { parseHtml } from '@contensis/html-canvas'

export const actions = {
	default: async ({ request, locals, fetch }) => {
		const session = await locals.auth()
		const formData = Object.fromEntries(await request.formData())
		const personalWebsite = await getPersonalWebsiteByEmail(session.user.email)

		let createdBlogPost

		try {
			createdBlogPost = await ManagementClient.entries.create({
				title: formData.title,
				description: formData.description,
				canvas: await parseHtml(formData.content),
				personalWebsite: {
					sys: {
						id: personalWebsite.sys.id,
						contentTypeId: 'personalWebsites'
					}
				},
				sys: {
					contentTypeId: 'personalWebsitesBlogPost',
					language: 'en-GB',
					dataFormat: 'entry'
				}
			})

			console.log('Created blog post:', createdBlogPost)
		} catch (e) {
			console.log('Error while creating blog post:', e.data ?? e)
		}

		if (createdBlogPost) {
			// Publish blog post
			try {
				await ManagementClient.entries.invokeWorkflow(createdBlogPost, 'draft.publish')
			} catch (e) {
				console.log('Error while publishing blog post and personal website:', e.data ?? e)
			}

			// Link blog post to personal website
			try {
				const allBlogPosts = [
					...personalWebsite.blogPosts,
					{
						sys: { id: createdBlogPost.sys.id, contentTypeId: 'personalWebsitesBlogPost' }
					}
				]

				personalWebsite.blogPosts = allBlogPosts

				await fetch('/api/contensis/entries/update', {
					method: 'PUT',
					body: JSON.stringify(personalWebsite)
				})
			} catch (e) {
				console.log('Error while linking blog post to personal website:', e.data ?? e)
			}
		}

		return {
			success: true,
			createdBlogPost
		}
	}
}
