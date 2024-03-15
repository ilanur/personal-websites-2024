export async function handle({ event, resolve }) {
	console.log('HOOK');
	return await resolve(event, {
		filterSerializedResponseHeaders: (key, value) => {
			return key.toLowerCase() === 'content-type';
		}
	});
}
