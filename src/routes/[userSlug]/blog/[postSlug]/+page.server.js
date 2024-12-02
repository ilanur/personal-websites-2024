// src/routes/[slug]/+page.server.js
import { error } from '@sveltejs/kit'
import { DeliveryClient } from '$lib/utils/contensis/_clients'
import { createRenderer } from '@contensis/canvas-html'

import { PUBLIC_PREVIEW_COOKIE_NAME, PUBLIC_PREVIEW_PARAM } from '$env/static/public'

export async function load({ params, cookies, url }) {
	try {
		// Get preview state using constants

		console.log('params', params)
		const isPreviewCookie = cookies.get(PUBLIC_PREVIEW_COOKIE_NAME) === 'true'
		const isPreviewParam = url.searchParams.get(PUBLIC_PREVIEW_PARAM) === 'true'

		const isPreview = isPreviewCookie || isPreviewParam
		const optionsPost = {
			versionStatus: isPreview ? 'latest' : 'published',
			id: params.postSlug,
			linkDepth: 0
		}

		async function getPost() {
			const post = await DeliveryClient.entries.get(optionsPost)

			if (!post) {
				throw error(404, {
					message: 'Post not found'
				})
			}

			// Only try to render canvas if it exists
			if (post.canvas) {
				const renderer = createRenderer()
				const getCanvasHtml = (data) => renderer({ data })
				post['canvasHtml'] = getCanvasHtml(post.canvas)
			}

			// if (post.authors && post.authors.length > 0) {
			// 	for (let i = 0; i < post.authors.length; i++) {
			// 		const author = post.authors[i]
			// 		const { url } = clean_and_organiseEntry(author)
			// 		post.authors[i].url = url
			// 	}
			// }

			// if (post.themesTopicGenerator?.added && post.themesTopicGenerator.added.length > 0) {
			// 	post.themesTopicGenerator.added = post.themesTopicGenerator.added.map((theme) => {
			// 		const { url } = clean_and_organiseEntry(theme)
			// 		return {
			// 			...theme,
			// 			url
			// 		}
			// 	})
			// }

			return post
		}

		const post = await getPost()

		return {
			post,
			preview: {
				active: isPreviewCookie || isPreviewParam
			}
		}
	} catch (err) {
		if (err.status) throw err

		console.error('Error fetching post:', err)
		throw error(500, {
			message: 'Error fetching post'
		})
	}
}
