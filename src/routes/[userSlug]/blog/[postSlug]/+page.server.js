import { error } from '@sveltejs/kit'

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

			return post
		}

		return {
			post: await getPost(),
			editAllowed: parentData.authUser?.email === parentData.personalWebsite.people.email
		}
	} catch (err) {
		console.error('Error fetching post:', err)
		error(err.status ?? 500, {
			message: 'Error fetching post'
		})
	}
}
