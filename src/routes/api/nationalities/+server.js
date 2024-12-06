import { getNationalities } from '$lib/utils/contensis/server.js'

export async function GET() {
	try {
		const nationalities = await getNationalities()
		return new Response(JSON.stringify({ nationalities }), {
			headers: { 'Content-Type': 'application/json' },
			status: 200
		})
	} catch (e) {
		console.error('Error fetching nationalities:', e)
		return new Response(JSON.stringify({ error: 'Failed to fetch nationalities' }), { status: 500 })
	}
}
