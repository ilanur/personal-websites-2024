import { redirect } from '@sveltejs/kit'
import { DeliveryClient } from '$lib/utils/contensis-clients'

export async function load({ parent }) {
	const parentData = await parent()

	if (!parentData.personalWebsite) redirect(302, '/')

	//get blog posts from the user
	const query = {
		where: [
			{ field: 'sys.contentTypeId', equalTo: 'personalWebsitesBlogPost' },
			{ field: 'sys.versionStatus', equalTo: 'published' },
			{ field: 'personalWebsite.sys.id', equalTo: parentData.personalWebsite.sys.id }
		]
	}
	//query.fieldLinkDepths = { personalWebsite: 2 }
	//check if personal website already exists for this email by delivery search
	const blogPosts = await DeliveryClient.entries.search(query)

	console.log(blogPosts)

	//for each blog post, generate the url based on personalWebsite slug and blog post slug
	blogPosts.items = blogPosts.items.map((blogPost) => {
		const userSlug = parentData.personalWebsite.websiteSlug
		const blogPostSlug = blogPost.sys.slug
		blogPost.url = `/${userSlug}/blog/${blogPostSlug}`
		return blogPost
	})

	return {
		blogPosts: blogPosts.items
	}
}
