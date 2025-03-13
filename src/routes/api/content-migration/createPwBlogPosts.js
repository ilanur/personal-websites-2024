import { DeliveryClient, ManagementClient } from '$lib/utils/contensis/_clients'
import { parseHtml } from '@contensis/html-canvas'
import { importAsset } from './importAsset'

function truncateContent(content, wordLimit) {
	const plainText = content.replace(/<\/?[^>]+(>|$)/g, '')
	const words = plainText.split(/\s+/)
	const truncated = words.slice(0, wordLimit).join(' ')
	return words.length > wordLimit ? `${truncated}...` : truncated
}

// Create or update personal website blog posts
export async function createPwBlogPosts(personalWebsite, contensisPeopleEntry, personalData) {
	const wpBlogPosts = personalData.posts

	// Get existing blog posts
	const existingBlogPosts = personalWebsite.blogPosts

	console.log('existingBlogPosts', existingBlogPosts)

	for (let i = 0, ilen = wpBlogPosts.length; i < ilen; i++) {
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
			],
			sys: {
				contentTypeId: 'personalWebsitesBlogPost',
				slug: wpBlogPost.post_name,
				language: 'en-GB',
				dataFormat: 'entry'
			}
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

		try {
			let newBlogPost

			if (existingBlogPost) {
				// Update existing blog post
				// payload.sys.id = existingBlogPost.sys.id
				// newBlogPost = await ManagementClient.entries.update(payload)
				newBlogPost = await ManagementClient.entries.patch(existingBlogPost.sys.id, payload)
				console.log(`Updated blog post ${wpBlogPost.post_title}`)
			} else {
				// Create new blog post
				newBlogPost = await ManagementClient.entries.create(payload)
				console.log(`Created new blog post ${wpBlogPost.post_title}`)
			}

			await ManagementClient.entries.publish(newBlogPost)

			// await ManagementClient.entries.invokeWorkflow(newBlogPost, 'draft.publish')
		} catch (e) {
			console.error(`Error updating/creating blog post (${wpBlogPost.post_name}): ${JSON.stringify(e.data)}`)
			continue
		}
	}
}
