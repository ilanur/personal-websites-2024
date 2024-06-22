import { fail, redirect } from '@sveltejs/kit';

export async function load(event) {
	const session = await event.locals.auth();
	if (!session) return redirect(302, '/');
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
	}
};
