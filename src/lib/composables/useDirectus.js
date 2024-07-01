import { writable, get } from 'svelte/store'
import {
	createDirectus,
	rest,
	withToken,
	readItems,
	readUsers as DReadUsers,
	createUser as DCreateUser,
	createItem as DCreateItem,
	createItems as DCreateItems,
	readSingleton
} from '@directus/sdk'
import {
	PUBLIC_DIRECTUS_API_URL,
	PUBLIC_PAGES_COLLECTION,
	PUBLIC_PERSONAL_INFORMATION_COLLECTION
} from '$env/static/public'
import { DIRECTUS_API_KEY } from '$env/static/private'

const directusInstance = writable(null)

function initializeDirectus(fetch) {
	const options = fetch ? { globals: { fetch } } : {}
	directusInstance.set(createDirectus(PUBLIC_DIRECTUS_API_URL, options).with(rest()))
}

function request(callback) {
	return get(directusInstance).request(callback())
}

function tokenRequest(callback) {
	return get(directusInstance).request(withToken(DIRECTUS_API_KEY, callback()))
}

export default function useDirectus() {
	if (!get(directusInstance)) initializeDirectus()

	function readUsers() {
		return tokenRequest(() => DReadUsers())
	}

	function readUsersByEmail(email) {
		console.log('email', email)
		return tokenRequest(() =>
			DReadUsers({
				filter: {
					email: {
						_eq: email
					}
				}
			})
		)
	}

	function createUser(userObject) {
		return tokenRequest(() => DCreateUser(userObject))
	}

	function createUserWithMicrosoft(authSession) {
		return tokenRequest(() =>
			DCreateUser({
				email: authSession.user.email,
				provider: 'microsoft',
				external_identifier: authSession.user.email,
				title: authSession.user.name,
				role: '1e82e92d-0799-41df-abbf-075300cf255f'
			})
		)
	}

	function getPersonalInformationBySlug(slug) {
		console.log('slug', slug)
		return tokenRequest(() =>
			readSingleton(PUBLIC_PERSONAL_INFORMATION_COLLECTION, {
				fields: ['*', 'nationality.*'],
				filter: {
					slug: {
						_eq: slug
					}
				}
			})
		)
	}

	function createPersonalInformationItem(personalInformation) {
		return tokenRequest(() =>
			DCreateItem(PUBLIC_PERSONAL_INFORMATION_COLLECTION, personalInformation)
		)
	}

	function createPages(pages) {
		return tokenRequest(() => DCreateItems(PUBLIC_PAGES_COLLECTION, pages))
	}

	function getPageContent(userId, pageSlug) {
		return request(() =>
			readItems(PUBLIC_PAGES_COLLECTION, {
				filter: {
					personal_information_id: {
						_eq: userId
					},
					slug: {
						_eq: pageSlug
					}
				}
			})
		)
	}

	function getUserPages(userId) {
		return request(() =>
			readItems(PUBLIC_PAGES_COLLECTION, {
				filter: {
					personal_information_id: {
						_eq: userId
					}
				}
			})
		)
	}

	return {
		readUsers,
		readUsersByEmail,
		createUser,
		createUserWithMicrosoft,
		getPersonalInformationBySlug,
		createPersonalInformationItem,
		createPages,
		getPageContent,
		getUserPages
	}
}
