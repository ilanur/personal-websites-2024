import { fail } from '@sveltejs/kit';

export async function load(event) {
	// Replace hardcoded values with Azure information once authentication is done.
	return {
		user: {
			name: 'Emanuele Strano',
			email: 'emanuele.strano@eui.eu',
			slug: 'emanuele-strano',
			profile_image:
				'https://eui-personal-websites.directus.app/assets/dbf0c027-bbe8-4020-a5be-d5e6764bbce3?cache-buster=2024-03-15T13:43:59.773Z&key=system-large-contain',
			nationality_name: 'Italy'
		}
	};
}

export const actions = {
	default: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());
		const { fileToUpload } = formData;

		if (fileToUpload) {
			// Check if a new image is uploaded.
			if (!fileToUpload.name || !fileToUpload.name === 'undefined') {
				return fail(500, {
					error: true,
					message: 'You must provide a file to upload'
				});
			}
		}

		// TODO: Add data to directus once authentication works.
	}
};
