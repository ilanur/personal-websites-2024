import { z } from 'zod'

export const PersonalWebsiteForm = z.object({
	slug: z.string().min(1).trim()
})
