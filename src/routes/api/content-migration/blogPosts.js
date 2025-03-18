import { DeliveryClient, ManagementClient } from '$lib/utils/contensis/_clients'
import { parseHtml } from '@contensis/html-canvas'
import { importAsset } from './importAsset'

function truncateContent(content, wordLimit) {
	const plainText = content.replace(/<\/?[^>]+(>|$)/g, '')
	const words = plainText.split(/\s+/)
	const truncated = words.slice(0, wordLimit).join(' ')
	return words.length > wordLimit ? `${truncated}...` : truncated
}

export async function createOrUpdateBlogPosts(personalWebsite, contensisPeopleEntry, personalData) {
	const wpBlogPosts = personalData.posts

	// Get existing blog posts
	const existingPwBlogPosts = personalWebsite.blogPosts

	let newBlogPosts = []

	for (let i = 0, ilen = wpBlogPosts.length; i < ilen; i++) {
		// Skip first 3 blog posts for testing purposes
		if (i > 4) continue

		// ================================================
		// Get blog post data
		// ================================================
		const wpBlogPost = wpBlogPosts[i]
		const canvas = await parseHtml(wpBlogPost.post_content)

		// ================================================
		// Check if we need to update the image
		// ================================================
		const existingBlogPost = existingPwBlogPosts.find((post) => post.wpId === wpBlogPost.ID)

		// ================================================
		// Prepare default payload
		// ================================================
		const payload = {
			wpId: wpBlogPost.ID,
			title: wpBlogPost.post_title.replace(/&amp;/g, '&'),
			description: truncateContent(wpBlogPost.post_content, 30),
			canvas,
			publishingDate: wpBlogPost.post_date,
			personalWebsite: {
				sys: {
					id: personalWebsite.sys.id,
					contentTypeId: 'personalWebsites'
				}
			},
			authors: [
				{
					sys: {
						id: contensisPeopleEntry.sys.id,
						contentTypeId: 'people'
					}
				}
			]
		}

		// ================================================
		// Blogpost image
		// ================================================
		if (existingBlogPost.mainImage) {
			console.log('Deleting blogpost image', existingBlogPost.mainImage.asset.sys.id)
			try {
				await ManagementClient.entries.delete(existingBlogPost.mainImage.asset.sys.id, ['en-GB'], true)
			} catch (e) {
				console.error('Failed to delete blog post image:', e.data ?? e)
			}
		}

		let newImage
		try {
			newImage = await importAsset(
				wpBlogPost.thumbnail_url,
				wpBlogPost.post_title,
				`Image for ${wpBlogPost.post_title}`,
				'/Content-Types-Assets/PersonalWebsites/Blogs'
			)
		} catch (e) {
			console.error('Failed to import blog post image:', e.data ?? e)
		}

		if (newImage) {
			payload['mainImage'] = {
				altText: wpBlogPost.post_title,
				asset: {
					sys: {
						id: newImage.sys.id,
						language: 'en-GB',
						dataFormat: 'asset'
					}
				}
			}
		}

		let newBlogPost

		// ================================================
		// Update existing blog post
		// ================================================
		if (existingBlogPost) {
			try {
				newBlogPost = await ManagementClient.entries.patch(existingBlogPost.sys.id, payload)
				await ManagementClient.entries.publish(newBlogPost)
				console.log(`Updated blog post ${wpBlogPost.post_title}`)
			} catch (e) {
				console.error('Failed to update blog post', e.data ?? e)
			}
		}

		// ================================================
		// Create new blog post
		// ================================================
		else {
			try {
				payload.sys = {
					contentTypeId: 'personalWebsitesBlogPost',
					slug: wpBlogPost.post_name,
					language: 'en-GB',
					dataFormat: 'entry'
				}

				newBlogPost = await ManagementClient.entries.create(payload)
				await ManagementClient.entries.publish(newBlogPost)
				console.log(`Created new blog post ${wpBlogPost.post_title}`)
			} catch (e) {
				console.error('Failed to create blog post', e.data ?? e)

				// Blogpost already exists, but not linked to the personal website.
				const data = e.data?.data
				if (data && data.length && data[0].field === 'slug' && data[0].message.includes('already exists')) {
					console.log('Blog post already exists, but not linked to the personal website, linking...', wpBlogPost.post_title)

					const blogPostsSearch = await DeliveryClient.entries.search({
						where: [
							{ field: 'sys.contentTypeId', equalTo: 'personalWebsitesBlogPost' },
							{ field: 'sys.versionStatus', equalTo: 'published' },
							{ field: 'wpId', equalTo: wpBlogPost.ID }
						]
					})

					if (blogPostsSearch.items.length) {
						newBlogPost = blogPostsSearch.items[0]
					}
				}

				continue
			}
		}

		newBlogPosts.push(newBlogPost)
	}

	return newBlogPosts
}
