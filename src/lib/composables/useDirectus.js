import { writable, get } from 'svelte/store';
import { createDirectus, rest, withToken, readItems, readUsers, createUser } from '@directus/sdk';
import { PUBLIC_DIRECTUS_API_URL, PUBLIC_PAGES_COLLECTION } from '$env/static/public';
import { DIRECTUS_API_KEY } from '$env/static/private';

const directusInstance = writable(null);

function initializeDirectus(fetch) {
	const options = fetch ? { globals: { fetch } } : {};
	directusInstance.set(createDirectus(PUBLIC_DIRECTUS_API_URL, options).with(rest()));
}

function tokenRequest(callback) {
	return get(directusInstance).request(withToken(DIRECTUS_API_KEY, callback()));
}

export default function useDirectus() {
	if (!get(directusInstance)) initializeDirectus();

	function readUsersByEmail(email) {
		return tokenRequest(() =>
			readUsers({
				filter: {
					email: {
						_eq: email
					}
				}
			})
		);
	}

	function createUserWithMicrosoft(authSession) {
		return tokenRequest(() =>
			createUser({
				email: authSession.user.email,
				provider: 'microsoft',
				external_identifier: authSession.user.email,
				title: authSession.user.name,
				role: '1e82e92d-0799-41df-abbf-075300cf255f'
			})
		);
	}

	function getPageContent(userId, pageSlug) {
		return get(directusInstance).request(
			readItems(PUBLIC_PAGES_COLLECTION, {
				filter: {
					related_personal_info: {
						_eq: userId
					},
					slug: {
						_eq: pageSlug
					}
				}
			})
		);
	}

	function createPersonalInfo(personalInformation) {}

	function createPage(pageSlug, content) {}

	return {
		readUsersByEmail,
		createUserWithMicrosoft,
		getPageContent
	};
}
