import { ManagementClient } from '$lib/utils/contensis/_clients.js'
import { FileToFileBuffer, getPersonalWebsiteByEmail, uploadAsset } from '$lib/utils/contensis/server.js'
import { parseHtml } from '@contensis/html-canvas'
import dayjs from 'dayjs'

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
				publishingDate: dayjs().format(),
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
			// Upload image (only if blogpost has created successfully)
			if (formData.mainImage.size) {
				const { fileBuffer, filename } = await FileToFileBuffer(formData.mainImage)

				try {
					const uploadedImage = await uploadAsset(fileBuffer, filename, {
						title: filename,
						description: formData.description,
						folderId: '/Content-Types-Assets/PersonalWebsites/Blogs',
						contentType: formData.mainImage.type
					})

					createdBlogPost.mainImage = {
						altText: `Uploader blog cover for ${formData.title}`,
						asset: {
							sys: {
								id: uploadedImage.sys.id,
								language: 'en-GB',
								dataFormat: 'asset'
							}
						}
					}
				} catch (e) {
					console.log('Error while uploading image:', e.data ?? e)
				}
			}

			// Add people entry as author to blogpost
			createdBlogPost.authors = [
				{
					sys: {
						id: personalWebsite.people.sys.id,
						contentTypeId: 'people'
					}
				}
			]

			// Update & publish blog post
			try {
				await fetch('/api/contensis/entries/update', {
					method: 'PUT',
					body: JSON.stringify(createdBlogPost)
				})
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
