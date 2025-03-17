import { ManagementClient } from '$lib/utils/contensis/_clients'
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
	const existingBlogPosts = personalWebsite.blogPosts

	for (let i = 0, ilen = wpBlogPosts.length; i < ilen; i++) {
		// Skip first 3 blog posts for testing purposes
		if (i > 3) continue

		const wpBlogPost = wpBlogPosts[i]
		const canvas = await parseHtml(wpBlogPost.post_content)
		let blogpostImg

		// Check if we need to update the image
		const existingBlogPost = existingBlogPosts.find((post) => post.wpId === wpBlogPost.ID)
		const shouldUpdateImage =
			wpBlogPost.thumbnail_url && (!existingBlogPost?.mainImage || existingBlogPost.mainImage.asset.sys.uri !== wpBlogPost.thumbnail_url)

		if (shouldUpdateImage) {
			blogpostImg = await importAsset(
				wpBlogPost.thumbnail_url,
				wpBlogPost.post_title,
				`Image for ${wpBlogPost.post_title}`,
				'/Content-Types-Assets/PersonalWebsites/Blogs'
			)
		}

		// Prepare default payload
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

		if (blogpostImg) {
			payload['mainImage'] = {
				altText: wpBlogPost.post_title,
				asset: {
					sys: {
						id: blogpostImg.sys.id,
						language: 'en-GB',
						dataFormat: 'asset'
					}
				}
			}
		} else if (existingBlogPost?.mainImage) {
			payload['mainImage'] = existingBlogPost.mainImage
		}

		let newBlogPost

		// Update existing blog post
		if (existingBlogPost) {
			try {
				newBlogPost = await ManagementClient.entries.patch(existingBlogPost.sys.id, payload)
				console.log(`Updated blog post ${wpBlogPost.post_title}`)
			} catch (e) {
				console.error('Failed to update blog post', e.data ?? e)
			}
		}
		// Create new blog post
		else {
			try {
				payload.sys = {
					contentTypeId: 'personalWebsitesBlogPost',
					slug: wpBlogPost.post_name,
					language: 'en-GB',
					dataFormat: 'entry'
				}

				newBlogPost = await ManagementClient.entries.create(payload)
				console.log(`Created new blog post ${wpBlogPost.post_title}`)
			} catch (e) {
				console.error('Failed to create blog post', e.data ?? e)
				continue
			}
		}

		await ManagementClient.entries.publish(newBlogPost)
	}
}
