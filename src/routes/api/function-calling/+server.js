import { json } from '@sveltejs/kit'

export const POST = async ({ request }) => {
	const { promptValue } = await request.json()
	console.log('Promt value:', promptValue)

	return json({ success: true }, { status: 200 })
}
