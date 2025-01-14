import { error } from '@sveltejs/kit'
import { DeliveryClient } from '$lib/utils/contensis/_clients'
import { PUBLIC_PREVIEW_COOKIE_NAME, PUBLIC_PREVIEW_PARAM } from '$env/static/public'
import { getCanvasHTML } from '$lib/utils/contensis/client.js'

export async function load({ params, parent }) {
	const parentData = await parent()

	try {
		async function getPost() {
			const post = parentData.personalWebsite.blogPosts.find((post) => post.sys.slug === params.postSlug)

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
			post: await getPost()
		}
	} catch (err) {
		console.error('Error fetching post:', err)
		error(err.status ?? 500, {
			message: 'Error fetching post'
		})
	}
}
