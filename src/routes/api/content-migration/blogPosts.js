import { DeliveryClient, ManagementClient } from '$lib/utils/contensis/_clients'
import { parseHtml } from '@contensis/html-canvas'
import { importAsset } from './importAsset'
import slugify from 'slugify'

function truncateContent(content, wordLimit) {
	const plainText = content.replace(/<\/?[^>]+(>|$)/g, '')
	const words = plainText.split(/\s+/)
	const truncated = words.slice(0, wordLimit).join(' ')
	return words.length > wordLimit ? `${truncated}...` : truncated
}

function resolveDuplicateIds(data) {
	const seen = new Set()

	function traverseAndModify(item) {
		if (Array.isArray(item)) {
			for (const element of item) {
				traverseAndModify(element)
			}
		} else if (item && typeof item === 'object') {
			if (item.id) {
				if (seen.has(item.id)) {
					// Modify the ID to make it unique
					item.id = `${item.id}-${Math.random().toString(36).substr(2, 9)}`
				}
				seen.add(item.id)
			}
			for (const key in item) {
				if (item.hasOwnProperty(key)) {
					traverseAndModify(item[key])
				}
			}
		}
	}

	traverseAndModify(data)
}

export async function createOrUpdateBlogPosts(personalWebsite, contensisPeopleEntry, personalData) {
	const wpBlogPosts = personalData.posts

	// Get existing blog posts
	const existingPwBlogPosts = personalWebsite.blogPosts

	let newBlogPosts = []

	for (let i = 0, ilen = wpBlogPosts.length; i < ilen; i++) {
		// ================================================
		// Get blog post data
		// ================================================
		const wpBlogPost = wpBlogPosts[i]
		const canvas = await parseHtml(wpBlogPost.post_content)

		// ================================================
		// Check if we need to update the image
		// ================================================
		let existingBlogPost = existingPwBlogPosts.find((post) => post.wpId === wpBlogPost.ID)

		// ================================================
		// Prepare default payload
		// ================================================
		const payload = {
			wpId: wpBlogPost.ID,
			title: wpBlogPost.post_title.replace(/&amp;/g, '&'),
			description: truncateContent(wpBlogPost.post_content, 30),
			canvas: resolveDuplicateIds(canvas),
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

		// Check if blogpost exists in Contensis but isn't linked to the personal website.
		if (!existingBlogPost) {
			try {
				const blogPostsSearch = await DeliveryClient.entries.search({
					where: [
						{ field: 'sys.contentTypeId', equalTo: 'personalWebsitesBlogPost' },
						{ field: 'sys.versionStatus', equalTo: 'published' },
						{ field: 'wpId', equalTo: wpBlogPost.ID },
						{ field: 'personalWebsite.sys.id', equalTo: personalWebsite.sys.id }
					]
				})

				if (blogPostsSearch.items.length) {
					const searchedBlogPost = blogPostsSearch.items[0]
					const isInList = existingPwBlogPosts.find((post) => post.sys.id === searchedBlogPost.sys.id)

					// If blogpost isn't linked to the personal website, link it.
					if (!isInList) {
						// console.log("Blog post isn't linked to the personal website, linking...", wpBlogPost.post_title)
						existingBlogPost = searchedBlogPost
					}
				}
			} catch (error) {
				console.error('Failed to search for existing blog post:', error.data ?? error)
			}
		}

		// ================================================
		// Blogpost image
		// ================================================
		if (existingBlogPost && existingBlogPost.mainImage) {
			console.log(`Deleting blogpost image "${existingBlogPost.mainImage.asset.sys.id}"`)
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

		// ================================================
		// Update existing blog post
		// ================================================
		if (existingBlogPost) {
			try {
				existingBlogPost = await ManagementClient.entries.patch(existingBlogPost.sys.id, payload)
				await ManagementClient.entries.publish(existingBlogPost)
				console.log(`Updated blog post "${wpBlogPost.post_title}"`)
			} catch (e) {
				console.error('Failed to update blog post', e.data ?? e)
			}
		}

		// ================================================
		// Create new blog post
		// ================================================
		else {
			payload.sys = {
				contentTypeId: 'personalWebsitesBlogPost',
				language: 'en-GB',
				dataFormat: 'entry'
			}

			const slugified = slugify(wpBlogPost.post_title, { lower: true, strict: true })

			if (slugified !== wpBlogPost.post_name) {
				console.log('Invalid slug. Changed slug from', wpBlogPost.post_name, 'to', slugified)
				payload.sys.slug = slugified
			} else {
				payload.sys.slug = wpBlogPost.post_name
			}

			async function createBlogPost() {
				existingBlogPost = await ManagementClient.entries.create(payload)
				await ManagementClient.entries.publish(existingBlogPost)
			}

			try {
				await createBlogPost()
				console.log(`Created new blog post "${wpBlogPost.post_title}"`)
			} catch (e) {
				console.error('Failed to create blog post', e.data ?? e)

				if (e.data?.data[0].message.includes('already exists')) {
					console.log('Blog post already exists', payload.sys.slug)
					payload.sys.slug = `${payload.sys.slug}-${wpBlogPost.ID}`

					try {
						await createBlogPost()
						console.log(`Created new blog post "${wpBlogPost.post_title}" with modified slug: ${payload.sys.slug}`)
					} catch (e) {
						console.error('Failed to create blog post with modified slug', e.data ?? e)
					}
				}
			}
		}

		newBlogPosts.push(existingBlogPost)
	}

	return newBlogPosts.filter((post) => post)
}
