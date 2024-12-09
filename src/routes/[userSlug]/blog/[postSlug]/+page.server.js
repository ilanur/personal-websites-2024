import { error } from '@sveltejs/kit'
import { DeliveryClient } from '$lib/utils/contensis/_clients'
import { PUBLIC_PREVIEW_COOKIE_NAME, PUBLIC_PREVIEW_PARAM } from '$env/static/public'
import { getCanvasHTML } from '$lib/utils/contensis/client.js'

export async function load({ params, cookies, url }) {
	try {
		// Get preview state using constants
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
				error(404, {
					message: 'Post not found'
				})
			}

			// Only try to render canvas if it exists
			if (post.canvas) {
				post['canvasHtml'] = getCanvasHTML(post.canvas)
			}

			return post
		}

		return {
			post: await getPost(),
			preview: {
				active: isPreviewCookie || isPreviewParam
			}
		}
	} catch (err) {
		console.error('Error fetching post:', err)
		error(err.status ?? 500, {
			message: 'Error fetching post'
		})
	}
}
